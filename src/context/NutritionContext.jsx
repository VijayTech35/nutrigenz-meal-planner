import { createContext, useContext, useState, useEffect } from 'react';

const NutritionContext = createContext();

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within NutritionProvider');
  }
  return context;
};

export const NutritionProvider = ({ children }) => {
  const [dailyLog, setDailyLog] = useState(() => {
    const saved = localStorage.getItem('dailyNutritionLog');
    return saved ? JSON.parse(saved) : {};
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('nutritionGoals');
    return saved ? JSON.parse(saved) : {
      calories: 2000,
      protein: 50,
      carbs: 250,
      fats: 65
    };
  });

  useEffect(() => {
    localStorage.setItem('dailyNutritionLog', JSON.stringify(dailyLog));
  }, [dailyLog]);

  useEffect(() => {
    localStorage.setItem('nutritionGoals', JSON.stringify(goals));
  }, [goals]);

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const addToLog = (recipe, servings = 1) => {
    const date = getTodayDate();
    const nutrition = recipe.nutrition || {};
    
    setDailyLog(prev => {
      const dayLog = prev[date] || [];
      return {
        ...prev,
        [date]: [
          ...dayLog,
          {
            recipeId: recipe.id,
            recipeName: recipe.name,
            servings,
            calories: (nutrition.calories || 0) * servings,
            protein: (nutrition.protein || 0) * servings,
            carbs: (nutrition.carbs || 0) * servings,
            fats: (nutrition.fats || 0) * servings,
            timestamp: new Date().toISOString()
          }
        ]
      };
    });
  };

  const getTodayTotals = () => {
    const date = getTodayDate();
    const dayLog = dailyLog[date] || [];
    
    return dayLog.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  const getWeekTotals = () => {
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayLog = dailyLog[dateStr] || [];
      
      const totals = dayLog.reduce((acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fats: acc.fats + meal.fats
      }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
      
      weekData.push({
        date: dateStr,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        ...totals
      });
    }
    
    return weekData;
  };

  const updateGoals = (newGoals) => {
    setGoals(newGoals);
  };

  const clearTodayLog = () => {
    const date = getTodayDate();
    setDailyLog(prev => ({
      ...prev,
      [date]: []
    }));
  };

  return (
    <NutritionContext.Provider value={{
      dailyLog,
      goals,
      addToLog,
      getTodayTotals,
      getWeekTotals,
      updateGoals,
      clearTodayLog
    }}>
      {children}
    </NutritionContext.Provider>
  );
};
