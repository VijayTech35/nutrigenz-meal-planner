import UserAchievement from '../models/UserAchievement.js';

export const getAchievements = async (req, res, next) => {
  try {
    const data = await UserAchievement.findByUserIdWithMeta(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const checkAchievements = async (req, res, next) => {
  try {
    const { stats } = req.body;
    const newAchievements = await UserAchievement.checkAndAward(req.user.id, stats);
    res.json({ success: true, data: { newAchievements } });
  } catch (error) {
    next(error);
  }
};
