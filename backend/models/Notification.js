import db from '../config/db.js';

export default {
  async findByUserId(userId) {
    const result = await db.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [userId]
    );
    return result.rows;
  },

  async getUnreadCount(userId) {
    const result = await db.query(
      'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false',
      [userId]
    );
    return parseInt(result.rows[0].count);
  },

  async create(userId, { title, message, type, link }) {
    const result = await db.query(
      `INSERT INTO notifications (user_id, title, message, type, link)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, title, message, type || 'info', link || null]
    );
    return result.rows[0];
  },

  async markAsRead(id, userId) {
    const result = await db.query(
      'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    return result.rows[0];
  },

  async markAllAsRead(userId) {
    await db.query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false',
      [userId]
    );
  },

  async delete(id, userId) {
    await db.query('DELETE FROM notifications WHERE id = $1 AND user_id = $2', [id, userId]);
  },

  async clearAll(userId) {
    await db.query('DELETE FROM notifications WHERE user_id = $1', [userId]);
  },

  async notifyExpiringItems(userId, items) {
    for (const item of items) {
      await this.create(userId, {
        title: 'Item Expiring Soon',
        message: `"${item.name}" expires ${item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'soon'}`,
        type: 'warning',
        link: '/pantry'
      });
    }
  }
};
