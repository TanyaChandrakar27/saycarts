/**
 * SayCarts — Smart Suggestions Engine
 * Provides AI-powered (Gemini) and rule-based suggestions:
 * - Shopping history analysis
 * - Seasonal recommendations
 * - Product substitutes
 * - Frequently bought together
 */

// ─── Seasonal Suggestions by Month ───────────────────────────────────────────

const SEASONAL_SUGGESTIONS = {
  // Jan–Feb: Winter
  0:  ['Hot chocolate', 'Soup', 'Oatmeal', 'Citrus fruits', 'Root vegetables', 'Tea', 'Comfort food ingredients'],
  1:  ['Valentine\'s chocolate', 'Strawberries', 'Cream', 'Roses', 'Heart-shaped cookies'],
  // March: Spring begins
  2:  ['Spring vegetables', 'Asparagus', 'Peas', 'Artichokes', 'Radishes', 'Lamb'],
  // April: Spring
  3:  ['Easter eggs', 'Ham', 'Spring salads', 'Strawberries', 'Fresh herbs', 'Rhubarb'],
  // May: Late spring
  4:  ['Grilling meat', 'Corn', 'Tomatoes', 'Memorial Day BBQ supplies', 'Lemonade', 'Ice cream'],
  // June: Summer begins
  5:  ['Watermelon', 'Berries', 'Salad greens', 'Iced tea', 'Sunscreen', 'Ice cream'],
  // July: Summer
  6:  ['4th of July hot dogs', 'Burgers', 'Peaches', 'Zucchini', 'Corn on the cob', 'Fireworks snacks'],
  // August: Late summer
  7:  ['Back to school snacks', 'Lunch box items', 'Backpack snacks', 'Tomatoes', 'Peppers', 'Basil'],
  // September: Fall begins
  8:  ['Apple cider', 'Pumpkin spice', 'Squash', 'Sweet potatoes', 'Fall soups', 'Apples'],
  // October: Fall/Halloween
  9:  ['Halloween candy', 'Pumpkin', 'Apple cider', 'Caramel', 'Candy corn', 'Spooky snacks'],
  // November: Thanksgiving
  10: ['Turkey', 'Cranberry sauce', 'Stuffing', 'Pumpkin pie', 'Mashed potatoes', 'Green beans', 'Gravy'],
  // December: Holidays
  11: ['Holiday cookies', 'Eggnog', 'Christmas ham', 'Gingerbread', 'Mulled wine spices', 'Hot cocoa']
};

// ─── Product Substitutes ──────────────────────────────────────────────────────

const SUBSTITUTES = {
  'milk': ['Almond milk', 'Oat milk', 'Soy milk', 'Coconut milk', 'Cashew milk'],
  'butter': ['Margarine', 'Coconut oil', 'Olive oil', 'Applesauce (baking)', 'Ghee'],
  'eggs': ['Flax eggs', 'Chia eggs', 'Banana (baking)', 'Applesauce (baking)', 'Silken tofu'],
  'sugar': ['Honey', 'Maple syrup', 'Agave', 'Stevia', 'Brown sugar', 'Coconut sugar'],
  'flour': ['Almond flour', 'Oat flour', 'Coconut flour', 'Rice flour', 'Gluten-free flour'],
  'beef': ['Ground turkey', 'Lentils', 'Black beans', 'Mushroom blend', 'Beyond Meat'],
  'chicken': ['Turkey', 'Tofu', 'Tempeh', 'Chickpeas', 'Jackfruit'],
  'mayo': ['Greek yogurt', 'Avocado', 'Hummus', 'Vegan mayo'],
  'sour cream': ['Greek yogurt', 'Cashew cream', 'Coconut cream'],
  'heavy cream': ['Coconut cream', 'Evaporated milk', 'Half and half'],
  'vegetable oil': ['Coconut oil', 'Olive oil', 'Avocado oil', 'Ghee'],
  'bread crumbs': ['Crushed crackers', 'Oats', 'Almond flour', 'Crushed chips'],
  'pasta': ['Zucchini noodles', 'Spaghetti squash', 'Rice noodles', 'Lentil pasta'],
  'rice': ['Quinoa', 'Cauliflower rice', 'Barley', 'Couscous', 'Farro'],
  'coffee': ['Chicory', 'Matcha', 'Tea', 'Dandelion coffee'],
  'cheese': ['Nutritional yeast', 'Cashew cheese', 'Vegan cheese'],
  'white wine': ['Apple juice', 'Chicken broth', 'White grape juice'],
  'soy sauce': ['Tamari', 'Coconut aminos', 'Worcestershire sauce'],
  'lemon juice': ['Lime juice', 'White wine vinegar', 'Apple cider vinegar'],
  'honey': ['Maple syrup', 'Agave', 'Golden syrup', 'Brown sugar syrup'],
  'tomato sauce': ['Blended roasted red peppers', 'Alfredo sauce', 'Pesto'],
  'chocolate chips': ['Cacao nibs', 'Carob chips', 'Chopped dark chocolate bar'],
};

// ─── Frequently Bought Together ───────────────────────────────────────────────

const FREQUENTLY_TOGETHER = {
  'pasta': ['Tomato sauce', 'Parmesan cheese', 'Olive oil', 'Garlic', 'Basil'],
  'spaghetti': ['Tomato sauce', 'Ground beef', 'Parmesan cheese', 'Garlic bread'],
  'eggs': ['Bacon', 'Butter', 'Bread', 'Orange juice', 'Coffee'],
  'milk': ['Cereal', 'Coffee', 'Butter', 'Cheese', 'Yogurt'],
  'chicken': ['Garlic', 'Olive oil', 'Lemon', 'Rosemary', 'Potatoes'],
  'salmon': ['Lemon', 'Asparagus', 'Dill', 'Capers', 'Butter'],
  'bread': ['Butter', 'Jam', 'Peanut butter', 'Cream cheese', 'Eggs'],
  'coffee': ['Creamer', 'Sugar', 'Milk', 'Filters', 'Tea'],
  'rice': ['Soy sauce', 'Sesame oil', 'Broccoli', 'Chicken', 'Eggs'],
  'avocado': ['Lime', 'Salt', 'Tortilla chips', 'Tomato', 'Cilantro'],
  'tacos': ['Tortillas', 'Salsa', 'Sour cream', 'Cheese', 'Jalapeños', 'Cilantro'],
  'pizza': ['Mozzarella', 'Tomato sauce', 'Pepperoni', 'Bell pepper', 'Olives'],
  'salad': ['Dressing', 'Croutons', 'Parmesan', 'Cherry tomatoes', 'Cucumber'],
  'oatmeal': ['Honey', 'Banana', 'Berries', 'Cinnamon', 'Milk'],
  'pancakes': ['Maple syrup', 'Butter', 'Blueberries', 'Whipped cream', 'Bacon'],
};

// ─── Suggestions Engine ───────────────────────────────────────────────────────

class SuggestionsEngine {
  constructor() {
    this.geminiApiKey = null;
    this.geminiModel = 'gemini-1.5-flash-latest';
  }

  setApiKey(key) {
    this.geminiApiKey = key?.trim() || null;
  }

  /**
   * Get all suggestions for the current shopping context
   * @param {Array} currentItems - Items in active cart
   * @param {Array} allCarts - All cart data for history analysis
   * @param {string} activeCartName - Name of the active cart
   * @returns {Promise<{seasonal: string[], suggestions: string[], substitutes: Object, frequent: string[]}>}
   */
  async getSuggestions(currentItems, allCarts, activeCartName = '') {
    const seasonal = this._getSeasonalSuggestions();
    const frequent = this._getFrequentSuggestions(currentItems);
    const substitutes = this._getSubstitutes(currentItems);
    const history = this._getHistorySuggestions(allCarts, currentItems);

    const base = { seasonal, frequent, substitutes, history };

    // Try Gemini AI if API key is set
    if (this.geminiApiKey) {
      try {
        const ai = await this._getGeminiSuggestions(currentItems, activeCartName);
        return { ...base, aiSuggestions: ai };
      } catch (err) {
        console.warn('[Suggestions] Gemini API error, using rule-based fallback:', err.message);
      }
    }

    return base;
  }

  _getSeasonalSuggestions() {
    const month = new Date().getMonth();
    return SEASONAL_SUGGESTIONS[month] || [];
  }

  _getFrequentSuggestions(currentItems) {
    const results = new Set();
    const itemNames = currentItems.map(i => i.name.toLowerCase());

    for (const item of currentItems) {
      const itemLower = item.name.toLowerCase();
      for (const [key, companions] of Object.entries(FREQUENTLY_TOGETHER)) {
        if (itemLower.includes(key) || key.includes(itemLower)) {
          companions.forEach(c => {
            if (!itemNames.some(n => n.includes(c.toLowerCase()))) {
              results.add(c);
            }
          });
        }
      }
    }

    return [...results].slice(0, 6);
  }

  _getSubstitutes(currentItems) {
    const subs = {};
    for (const item of currentItems) {
      const itemLower = item.name.toLowerCase();
      for (const [key, alternatives] of Object.entries(SUBSTITUTES)) {
        if (itemLower.includes(key) || key.includes(itemLower)) {
          subs[item.name] = alternatives.slice(0, 3);
          break;
        }
      }
    }
    return subs;
  }

  _getHistorySuggestions(allCarts, currentItems) {
    // Analyze items across all carts that aren't in the current cart
    const currentItemNames = new Set(currentItems.map(i => i.name.toLowerCase()));
    const itemFrequency = {};

    for (const cart of Object.values(allCarts)) {
      for (const item of (cart.items || [])) {
        const name = item.name;
        const nameLower = name.toLowerCase();
        if (!currentItemNames.has(nameLower)) {
          itemFrequency[name] = (itemFrequency[name] || 0) + 1;
        }
      }
    }

    // Sort by frequency and return top 5
    return Object.entries(itemFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);
  }

  async _getGeminiSuggestions(currentItems, cartName) {
    const itemList = currentItems.map(i => `${i.quantity}x ${i.name}`).join(', ');
    const month = new Date().toLocaleString('default', { month: 'long' });

    const prompt = `You are a helpful shopping assistant. The user is building a "${cartName}" shopping list.
Current items: ${itemList || 'None yet'}.
Current month: ${month}.

Suggest 5 specific grocery items they might be forgetting, based on:
1. What commonly goes with their current items
2. What's seasonal in ${month}
3. Common household essentials

Return ONLY a JSON array of 5 item name strings. Example: ["Olive oil", "Garlic", "Basil", "Parmesan", "Cherry tomatoes"]
No explanation, just the JSON array.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.geminiModel}:generateContent?key=${this.geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 200 }
        })
      }
    );

    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';

    // Extract JSON array from response
    const match = text.match(/\[[\s\S]*?\]/);
    return match ? JSON.parse(match[0]) : [];
  }

  /** Get substitute suggestion for a specific item */
  getSubstituteFor(itemName) {
    const lower = itemName.toLowerCase();
    for (const [key, subs] of Object.entries(SUBSTITUTES)) {
      if (lower.includes(key) || key.includes(lower)) {
        return subs;
      }
    }
    return [];
  }
}

// Export singleton
const suggestionsEngine = new SuggestionsEngine();
