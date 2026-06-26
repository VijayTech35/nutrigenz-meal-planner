import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

if (!process.env.GEMINI_API_KEY) {
  console.error('WARNING: GEMINI_API_KEY is not set. AI features will not work.');
}

const fallbackRecipe = (ingredients, cuisineType, servings) => ({
  name: `${cuisineType === 'any' ? 'Gourmet' : cuisineType} Delight with ${ingredients.slice(0, 3).join(', ')}`,
  description: `A delicious ${cuisineType === 'any' ? '' : cuisineType} dish made with fresh ${ingredients.slice(0, 2).join(' and ')}. Perfect for a healthy meal!`,
  cuisineType: cuisineType === 'any' ? 'Fusion' : cuisineType,
  difficulty: 'medium',
  prepTime: 15,
  cookTime: 25,
  servings,
  ingredients: ingredients.map(name => ({ name, quantity: 1, unit: 'cup' })),
  instructions: [
    'Prepare all ingredients by washing and chopping as needed.',
    'Heat oil in a large pan over medium heat. Add aromatics and sauté until fragrant.',
    `Add the main ingredients (${ingredients.slice(0, 3).join(', ')}) and cook for 5-7 minutes.`,
    'Season with salt, pepper, and herbs to taste. Stir well to combine.',
    'Reduce heat, cover, and let simmer for 10-15 minutes until fully cooked.',
    'Garnish with fresh herbs and serve hot. Enjoy your homemade creation!'
  ],
  dietaryTags: ['vegetarian'],
  nutrition: { calories: 350, protein: 20, carbs: 45, fats: 12, fiber: 8 },
  cookingTips: ['For extra flavor, add a squeeze of lemon before serving.', 'This dish pairs well with a side salad or steamed rice.']
});

export const generateRecipeAI = async ({ ingredients, dietaryRestrictions = [], cuisineType = 'any', servings = 4, cookingTime = 'medium' }) => {
  const dietaryInfo = dietaryRestrictions.length > 0 ? `Dietary restrictions: ${dietaryRestrictions.join(', ')}` : 'No dietary restrictions';
  const timeGuide = { quick: 'under 30 minutes', medium: '30–60 minutes', long: 'over 60 minutes' };

  const prompt = `
Generate a detailed recipe with the following requirements:

Ingredients available: ${ingredients.join(', ')}
${dietaryInfo}
Cuisine type: ${cuisineType}
Servings: ${servings}
Cooking time: ${timeGuide[cookingTime] || 'any'}

Return ONLY valid JSON (no markdown, no explanation) in this exact format:

{
  "name": "Recipe name",
  "description": "Brief description",
  "cuisineType": "${cuisineType}",
  "difficulty": "easy | medium | hard",
  "prepTime": number,
  "cookTime": number,
  "servings": ${servings},
  "ingredients": [{ "name": "ingredient name", "quantity": number, "unit": "unit" }],
  "instructions": ["Step 1", "Step 2"],
  "dietaryTags": ["vegetarian", "gluten-free"],
  "nutrition": { "calories": number, "protein": number, "carbs": number, "fats": number, "fiber": number },
  "cookingTips": ["Tip 1", "Tip 2"]
}
`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text().trim();

    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/g, '').replace(/```/g, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```/g, '');
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini API error:', error.message);
    console.log('Falling back to template recipe...');
    return fallbackRecipe(ingredients, cuisineType, servings);
  }
};

export const generatePantrySuggestionsAI = async (pantryItems, expiringItems = []) => {
  const ingredients = pantryItems.map((item) => item.name).join(', ');
  const expiringText = expiringItems.length > 0 ? `\nPriority ingredients (expiring soon): ${expiringItems.join(', ')}` : '';

  const prompt = `
Based on these available ingredients: ${ingredients}
${expiringText}

Suggest 3 creative recipe ideas.

Return ONLY a JSON array of strings (no markdown):

[
  "Recipe idea 1",
  "Recipe idea 2",
  "Recipe idea 3"
]
`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text().trim();

    if (text.startsWith('```')) {
      text = text.replace(/```json\n?|```/g, '');
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return [
      `${ingredients.slice(0, 2).join(' and ')} Stir Fry`,
      `Creamy ${ingredients[0] || 'Vegetable'} Soup`,
      `Herb-Roasted ${ingredients[0] || 'Mixed Vegetables'}`
    ];
  }
};
