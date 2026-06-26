import HealthGoal from '../models/HealthGoal.js';

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9
};

const GOAL_MULTIPLIERS = {
  lose: -500,
  maintain: 0,
  gain: 500,
  build: 300
};

export const getHealthGoals = async (req, res, next) => {
  try {
    const goals = await HealthGoal.findByUserId(req.user.id);
    res.json({ success: true, data: { goals } });
  } catch (error) {
    next(error);
  }
};

export const saveHealthGoals = async (req, res, next) => {
  try {
    const goals = await HealthGoal.upsert(req.user.id, req.body);
    res.json({ success: true, message: 'Health goals saved', data: { goals } });
  } catch (error) {
    next(error);
  }
};

export const calculateTDEE = async (req, res, next) => {
  try {
    const { age, gender, weight, height, activityLevel, goalType } = req.body;

    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const activityMultiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.55;
    const tdee = Math.round(bmr * activityMultiplier);
    const goalAdjustment = GOAL_MULTIPLIERS[goalType] || 0;
    const targetCalories = Math.max(1200, tdee + goalAdjustment);

    const targetProtein = Math.round((targetCalories * 0.3) / 4);
    const targetCarbs = Math.round((targetCalories * 0.4) / 4);
    const targetFats = Math.round((targetCalories * 0.3) / 9);

    res.json({
      success: true,
      data: {
        bmr: Math.round(bmr),
        tdee,
        targetCalories,
        targetProtein,
        targetCarbs,
        targetFats
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHealthGoals = async (req, res, next) => {
  try {
    await HealthGoal.delete(req.user.id);
    res.json({ success: true, message: 'Health goals deleted' });
  } catch (error) {
    next(error);
  }
};
