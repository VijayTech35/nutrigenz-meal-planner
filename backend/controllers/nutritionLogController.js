import NutritionLog from '../models/NutritionLog.js';

export const getTodayLog = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const [entries, totals] = await Promise.all([
      NutritionLog.findByUserIdAndDate(req.user.id, today),
      NutritionLog.getTodayTotals(req.user.id)
    ]);
    res.json({ success: true, data: { entries, totals } });
  } catch (error) {
    next(error);
  }
};

export const getLogByDate = async (req, res, next) => {
  try {
    const entries = await NutritionLog.findByUserIdAndDate(req.user.id, req.params.date);
    res.json({ success: true, data: { entries } });
  } catch (error) {
    next(error);
  }
};

export const getWeekTotals = async (req, res, next) => {
  try {
    const weekData = await NutritionLog.getWeekTotals(req.user.id);
    res.json({ success: true, data: { weekData } });
  } catch (error) {
    next(error);
  }
};

export const addLogEntry = async (req, res, next) => {
  try {
    const entry = await NutritionLog.create(req.user.id, req.body);
    res.status(201).json({ success: true, message: 'Nutrition logged', data: { entry } });
  } catch (error) {
    next(error);
  }
};

export const deleteLogEntry = async (req, res, next) => {
  try {
    await NutritionLog.delete(req.params.id, req.user.id);
    res.json({ success: true, message: 'Entry deleted' });
  } catch (error) {
    next(error);
  }
};

export const clearDate = async (req, res, next) => {
  try {
    await NutritionLog.clearDate(req.user.id, req.params.date);
    res.json({ success: true, message: 'Entries cleared' });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const stats = await NutritionLog.getStats(req.user.id);
    res.json({ success: true, data: { stats } });
  } catch (error) {
    next(error);
  }
};
