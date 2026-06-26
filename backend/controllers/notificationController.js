import Notification from '../models/Notification.js';
import PantryItem from '../models/PantryItem.js';

export const getNotifications = async (req, res, next) => {
  try {
    const [notifications, unreadCount] = await Promise.all([
      Notification.findByUserId(req.user.id),
      Notification.getUnreadCount(req.user.id)
    ]);
    res.json({ success: true, data: { notifications, unreadCount } });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.markAsRead(req.params.id, req.user.id);
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, data: { notification } });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.markAllAsRead(req.user.id);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    await Notification.delete(req.params.id, req.user.id);
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};

export const clearAll = async (req, res, next) => {
  try {
    await Notification.clearAll(req.user.id);
    res.json({ success: true, message: 'All notifications cleared' });
  } catch (error) {
    next(error);
  }
};

export const checkExpiringItems = async (req, res, next) => {
  try {
    const expiringItems = await PantryItem.getExpiringSoon(req.user.id, 3);
    if (expiringItems.length > 0) {
      await Notification.notifyExpiringItems(req.user.id, expiringItems);
    }
    res.json({ success: true, data: { alerted: expiringItems.length } });
  } catch (error) {
    next(error);
  }
};
