/**
 * SayCarts — Auto-Categorization Engine
 * Maps 500+ grocery/household items to categories with color coding
 */

const CATEGORIES = {
  'Produce': {
    color: '#22c55e',
    emoji: '🥦',
    keywords: [
      'apple','apples','banana','bananas','orange','oranges','lemon','lemons',
      'lime','limes','grape','grapes','strawberry','strawberries','blueberry',
      'blueberries','raspberry','raspberries','blackberry','blackberries',
      'mango','mangoes','pineapple','watermelon','melon','cantaloupe',
      'peach','peaches','plum','plums','cherry','cherries','pear','pears',
      'kiwi','avocado','avocados','tomato','tomatoes','potato','potatoes',
      'sweet potato','sweet potatoes','yam','yams','onion','onions','garlic',
      'carrot','carrots','broccoli','cauliflower','spinach','lettuce','kale',
      'cabbage','celery','cucumber','cucumbers','zucchini','squash','pepper',
      'peppers','bell pepper','jalapeño','jalapeño','jalapeno','mushroom',
      'mushrooms','corn','asparagus','green beans','peas','edamame','beets',
      'radish','ginger','cilantro','parsley','basil','mint','rosemary',
      'thyme','herb','herbs','scallion','scallions','green onion','leek',
      'leeks','shallot','artichoke','eggplant','okra','turnip','parsnip',
      'fennel','romaine','arugula','bok choy','brussels sprouts','snap peas',
      'fruit','vegetable','vegetables','produce','salad','mixed greens',
      'papaya','guava','fig','figs','pomegranate','dragonfruit','passion fruit',
      'nectarine','apricot','dates','olives','olive','rhubarb','watercress',
      'endive','radicchio','tomatillo','serrano','habanero','poblano',
      'aloo','tamatar','pyaz','adrak','lahsun','palak','dhaniya','mirch','hari mirch',
      'nimbu','gajar','gobi','phool gobi','matar','bhindi','karela','baingan','shimla mirch'
    ]
  },
  'Dairy & Eggs': {
    color: '#fbbf24',
    emoji: '🥛',
    keywords: [
      'milk','whole milk','skim milk','2% milk','almond milk','oat milk',
      'soy milk','coconut milk','cashew milk','rice milk','pea milk',
      'cheese','cheddar','mozzarella','parmesan','swiss','brie','gouda',
      'feta','cream cheese','cottage cheese','ricotta','provolone','muenster',
      'colby','pepper jack','havarti','gruyere','camembert','blue cheese',
      'yogurt','greek yogurt','butter','margarine','ghee','cream',
      'heavy cream','whipping cream','sour cream','half and half',
      'egg','eggs','egg whites','egg yolks','dairy','kefir','whey',
      'buttermilk','creamer','coffee creamer','vegan cheese','dairy free',
      'paneer','dahi','makhan','malai','lassi','chaas','amul','anda'
    ]
  },
  'Meat & Seafood': {
    color: '#ef4444',
    emoji: '🥩',
    keywords: [
      'chicken','chicken breast','chicken thigh','chicken wings','whole chicken',
      'chicken drumstick','rotisserie chicken','beef','ground beef','steak',
      'ribeye','sirloin','chuck','brisket','flank steak','t-bone','new york strip',
      'pork','pork chop','pork loin','pork belly','bacon','ham','prosciutto',
      'salami','sausage','italian sausage','hot dogs','hot dog','turkey',
      'ground turkey','turkey breast','lamb','lamb chop','veal','duck',
      'salmon','tuna','cod','tilapia','halibut','mahi mahi','sea bass',
      'shrimp','lobster','crab','crab legs','scallops','clams','mussels',
      'oysters','squid','calamari','octopus','fish','seafood','meat',
      'deli','pepperoni','chorizo','bratwurst','filet','roast','ribs',
      'meatball','meatballs','burger patty','plant based meat','beyond meat',
      'impossible burger','tofu','tempeh','seitan'
    ]
  },
  'Bakery & Bread': {
    color: '#d97706',
    emoji: '🍞',
    keywords: [
      'bread','white bread','wheat bread','whole wheat','sourdough','rye bread',
      'multigrain','baguette','bagel','bagels','muffin','muffins','croissant',
      'croissants','roll','rolls','dinner roll','hot dog bun','hamburger bun',
      'buns','pita','tortilla','tortillas','flour tortilla','corn tortilla',
      'naan','flatbread','ciabatta','focaccia','cake','cupcake','cupcakes',
      'cookie','cookies','brownie','brownies','donut','donuts','pie','tart',
      'pastry','danish','scone','biscuit','biscuits','waffle','pancake mix',
      'bread mix','bakery','loaf','pretzel bread','brioche','challah','pumpkin bread',
      'pav','roti','paratha','kulcha','thepla','bhatura','puri'
    ]
  },
  'Beverages': {
    color: '#06b6d4',
    emoji: '🥤',
    keywords: [
      'water','sparkling water','mineral water','soda water','club soda',
      'soda','cola','pepsi','coke','coca cola','sprite','7up','ginger ale',
      'root beer','dr pepper','mountain dew','juice','orange juice','apple juice',
      'grape juice','cranberry juice','pineapple juice','mango juice','lemonade',
      'limeade','iced tea','sweet tea','tea','green tea','herbal tea','chai',
      'coffee','espresso','cold brew','kombucha','energy drink','red bull',
      'monster','sports drink','gatorade','powerade','coconut water','smoothie',
      'protein shake','hot chocolate','cider','apple cider','beer','wine',
      'red wine','white wine','rosé','champagne','prosecco','sparkling wine',
      'vodka','whiskey','rum','gin','tequila','liquor','hard seltzer','white claw',
      'bottle','bottles','drink','drinks','beverage','beverages','juice box',
      'tata tea','red label','taj mahal','nescafe','bru','filter coffee','nariyal pani'
    ]
  },
  'Snacks': {
    color: '#f97316',
    emoji: '🍿',
    keywords: [
      'chips','potato chips','tortilla chips','corn chips','veggie chips',
      'pretzels','crackers','graham crackers','ritz','wheat thins','triscuit',
      'popcorn','microwave popcorn','nuts','almonds','peanuts','cashews',
      'walnuts','pistachios','pecans','macadamia','mixed nuts','trail mix',
      'granola bar','protein bar','clif bar','kind bar','larabar','quest bar',
      'candy','chocolate','dark chocolate','milk chocolate','gummies','gummy bears',
      'sour patch','skittles','starburst','m&ms','snickers','kitkat','reese','twix',
      'oreos','pringles','cheetos','doritos','fritos','lays','sunflower seeds',
      'pumpkin seeds','rice cakes','popcorn','jerky','beef jerky','turkey jerky',
      'dried fruit','raisins','dried mango','fruit leather','fruit snacks',
      'pudding cup','jello','applesauce','fruit cup','snack','snacks','treat','treats',
      'pork rinds','hummus and pretzels','cheese crackers','animal crackers',
      'maggi','noodles','kurkure','namkeen','bhujia','sev','biscuit','parle g','good day','samosa','pakoda','badam','kaju'
    ]
  },
  'Frozen Foods': {
    color: '#818cf8',
    emoji: '🧊',
    keywords: [
      'frozen','frozen pizza','pizza rolls','frozen dinner','tv dinner',
      'frozen vegetables','frozen fruit','frozen berries','frozen broccoli',
      'frozen corn','frozen peas','frozen spinach','frozen mango','frozen strawberries',
      'ice cream','popsicle','sorbet','gelato','frozen yogurt','ice cream sandwich',
      'frozen waffles','frozen pancakes','frozen breakfast','frozen burritos',
      'frozen chicken','frozen chicken nuggets','fish sticks','frozen fish',
      'frozen fries','french fries','tater tots','onion rings','frozen edamame',
      'dumplings','frozen dumplings','potstickers','spring rolls','hot pockets',
      'lean cuisine','marie callender','stouffer','birds eye','green giant frozen',
      'frozen soup','frozen lasagna','frozen ravioli','frozen mac and cheese'
    ]
  },
  'Canned & Packaged': {
    color: '#94a3b8',
    emoji: '🥫',
    keywords: [
      'canned','can','soup','tomato soup','chicken soup','vegetable soup',
      'minestrone','french onion soup','clam chowder','canned tomatoes',
      'diced tomatoes','crushed tomatoes','tomato sauce','tomato paste',
      'canned beans','black beans','kidney beans','chickpeas','garbanzo',
      'pinto beans','cannellini','lentils','canned corn','canned peas',
      'canned tuna','canned salmon','sardines','anchovies','spam',
      'canned fruit','fruit cocktail','canned peaches','canned pears',
      'evaporated milk','condensed milk','broth','stock','chicken broth',
      'beef broth','vegetable broth','bone broth','olives','pickles',
      'pickle','dill pickles','gherkins','artichoke hearts','roasted peppers',
      'sun dried tomatoes','capers','bamboo shoots','water chestnuts',
      'canned goods','jar','jars','jarred sauce','jarred salsa'
    ]
  },
  'Pasta & Grains': {
    color: '#eab308',
    emoji: '🍝',
    keywords: [
      'pasta','spaghetti','penne','fettuccine','linguine','rigatoni',
      'fusilli','farfalle','macaroni','orzo','lasagna','lasagne','noodles',
      'ramen','udon','soba','rice noodles','glass noodles','vermicelli',
      'rice','white rice','brown rice','jasmine rice','basmati rice',
      'wild rice','arborio rice','sushi rice','quinoa','couscous','barley',
      'oats','oatmeal','rolled oats','steel cut oats','instant oatmeal',
      'granola','flour','all purpose flour','bread flour','whole wheat flour',
      'almond flour','cornmeal','cornstarch','baking soda','baking powder',
      'yeast','sugar','white sugar','brown sugar','powdered sugar',
      'honey','maple syrup','agave','molasses','grains','cereal',
      'corn flakes','cheerios','granola cereal','muesli','cream of wheat',
      'grits','polenta','farro','bulgur','millet','amaranth','buckwheat',
      'atta','chawal','dal','toor dal','arhar dal','moong dal','chana dal','urad dal','masoor dal','rajma','chole','kabuli chana','poha','suji','sooji','rava','besan','maida','sewaiya'
    ]
  },
  'Condiments & Spices': {
    color: '#ec4899',
    emoji: '🧂',
    keywords: [
      'ketchup','mustard','yellow mustard','dijon mustard','honey mustard',
      'mayonnaise','mayo','relish','hot sauce','sriracha','tabasco','cholula',
      'soy sauce','tamari','teriyaki sauce','fish sauce','worcestershire',
      'vinegar','white vinegar','balsamic vinegar','apple cider vinegar',
      'red wine vinegar','rice vinegar','olive oil','extra virgin olive oil',
      'vegetable oil','canola oil','coconut oil','sesame oil','avocado oil',
      'ranch','ranch dressing','italian dressing','caesar dressing',
      'thousand island','french dressing','balsamic dressing','vinaigrette',
      'bbq sauce','buffalo sauce','peanut butter','almond butter','cashew butter',
      'jam','jelly','strawberry jam','grape jelly','preserves','marmalade',
      'nutella','chocolate spread','hummus','guacamole','salsa','tahini',
      'miso','hoisin sauce','oyster sauce','curry paste','red curry paste',
      'green curry paste','gochujang','sambal','harissa',
      'salt','pepper','black pepper','red pepper flakes','paprika','smoked paprika',
      'cumin','turmeric','oregano','garlic powder','onion powder','cinnamon',
      'nutmeg','cloves','cardamom','coriander','cayenne','chili powder',
      'italian seasoning','herbs de provence','old bay','everything bagel seasoning',
      'condiment','sauce','dressing','oil','spice','spices','seasoning',
      'garam masala','haldi','jeera','hing','rai','sarson','mustard oil','sunflower oil','achar','pickle','namak','cheeni','kasuri methi','elaichi','laung'
    ]
  },
  'Household': {
    color: '#64748b',
    emoji: '🏠',
    keywords: [
      'paper towels','toilet paper','tissue','tissues','facial tissue','napkins',
      'trash bags','garbage bags','zip lock bags','ziploc','freezer bags',
      'sandwich bags','plastic bags','aluminum foil','tin foil','plastic wrap',
      'saran wrap','wax paper','parchment paper','coffee filters','water filter',
      'dish soap','dawn','palmolive','dishwasher pods','dishwasher detergent',
      'cascade','finish','laundry detergent','tide','gain','arm and hammer',
      'fabric softener','dryer sheets','bounce','downy','bleach','clorox',
      'cleaning spray','all purpose cleaner','409','fantastik','method',
      'windex','lysol','febreze','air freshener','candles','batteries','aa batteries',
      'aaa batteries','light bulbs','led bulbs','matches','lighter','sponge','sponges',
      'scrub daddy','steel wool','rubber gloves','cleaning gloves','scrub brush',
      'toilet cleaner','toilet bowl cleaner','bathroom cleaner','tub scrubber',
      'mop','broom','dustpan','vacuum bags','dryer balls','household','cleaning',
      'paper plates','paper cups','plastic cups','disposable plates','solo cups',
      'hand soap','hand sanitizer','disinfecting wipes','clorox wipes','lysol wipes'
    ]
  },
  'Personal Care': {
    color: '#a78bfa',
    emoji: '🧴',
    keywords: [
      'shampoo','conditioner','2 in 1 shampoo','dry shampoo','body wash',
      'shower gel','soap','bar soap','hand soap','face wash','cleanser',
      'moisturizer','face moisturizer','body lotion','lotion','sunscreen','spf',
      'deodorant','antiperspirant','old spice','dove deodorant','secret',
      'toothpaste','toothbrush','electric toothbrush','floss','dental floss',
      'mouthwash','listerine','razors','disposable razors','shaving cream',
      'shaving gel','aftershave','cologne','perfume','body spray',
      'makeup','foundation','concealer','mascara','lipstick','lip gloss',
      'blush','bronzer','eyeliner','eye shadow','nail polish','nail file',
      'nail clippers','cotton balls','cotton swabs','q-tips','facial wipes',
      'makeup remover','toner','serum','eye cream','face mask','exfoliator',
      'bandages','band-aids','first aid','vitamins','multivitamin','vitamin c',
      'vitamin d','fish oil','probiotics','melatonin','zinc','ibuprofen',
      'tylenol','acetaminophen','advil','aspirin','antacid','tums','pepto',
      'allergy medicine','claritin','zyrtec','benadryl','cough syrup','nyquil',
      'dayquil','personal care','hygiene','health','medicine'
    ]
  },
  'Baby & Kids': {
    color: '#fb7185',
    emoji: '👶',
    keywords: [
      'diapers','pampers','huggies','pull-ups','baby wipes','wet wipes',
      'baby food','baby formula','formula','similac','enfamil','baby cereal',
      'baby shampoo','baby lotion','baby wash','baby powder','baby oil',
      'diaper rash cream','desitin','aquaphor','pacifier','baby bottle',
      'sippy cup','training cup','baby monitor','baby food pouches','gerber',
      'kids snacks','fruit snacks','gogurt','lunchables','juice boxes','capri sun',
      'kids cereal','kids yogurt','string cheese','goldfish crackers'
    ]
  },
  'Pet Supplies': {
    color: '#34d399',
    emoji: '🐾',
    keywords: [
      'dog food','cat food','pet food','dry dog food','wet dog food','dry cat food',
      'wet cat food','dog treats','cat treats','pet treats','milk bones',
      'dog bones','greenies','catnip','cat litter','kitty litter','tidy cats',
      'fresh step','arm hammer litter','flea treatment','flea collar',
      'heartworm','pet vitamins','bird food','fish food','hamster food',
      'rabbit food','guinea pig','pet supplies','dog toy','cat toy','leash',
      'collar','harness','pet shampoo','dog shampoo','poop bags'
    ]
  },
  'Health & Wellness': {
    color: '#2dd4bf',
    emoji: '💊',
    keywords: [
      'protein powder','whey protein','plant protein','creatine','bcaa',
      'pre workout','workout supplement','collagen','biotin','hair vitamins',
      'sleep aid','sleep supplement','magnesium','potassium supplement',
      'iron supplement','calcium supplement','omega 3','cod liver oil',
      'apple cider vinegar gummies','protein bar','protein shake',
      'meal replacement','slim fast','ensure','boost','pedialyte',
      'electrolytes','nuun tablets','emergency kit','thermometer',
      'blood pressure monitor','glucose monitor','heating pad'
    ]
  }
};

/**
 * Categorize an item by name using keyword matching
 * @param {string} itemName - The item name to categorize
 * @returns {{name: string, color: string, emoji: string}}
 */
function categorizeItem(itemName) {
  if (!itemName) return { name: 'Other', color: '#64748b', emoji: '📦' };
  const normalized = itemName.toLowerCase().trim();

  // Try exact/substring match first
  for (const [categoryName, categoryData] of Object.entries(CATEGORIES)) {
    for (const keyword of categoryData.keywords) {
      if (normalized === keyword || normalized.includes(keyword) || keyword.includes(normalized)) {
        return { name: categoryName, color: categoryData.color, emoji: categoryData.emoji };
      }
    }
  }

  // Partial word match fallback
  const words = normalized.split(/\s+/);
  for (const [categoryName, categoryData] of Object.entries(CATEGORIES)) {
    for (const keyword of categoryData.keywords) {
      const keywordWords = keyword.split(/\s+/);
      if (words.some(w => keywordWords.some(kw => kw.startsWith(w) || w.startsWith(kw)))) {
        return { name: categoryName, color: categoryData.color, emoji: categoryData.emoji };
      }
    }
  }

  return { name: 'Other', color: '#64748b', emoji: '📦' };
}

/** Get all category metadata for display */
function getAllCategories() {
  return Object.entries(CATEGORIES).map(([name, data]) => ({
    name, color: data.color, emoji: data.emoji
  }));
}

/**
 * Validate whether a string is a plausible grocery/shopping item or gibberish/nonsense
 * @param {string} name
 * @returns {boolean}
 */
function isValidGroceryItem(name) {
  if (!name || typeof name !== 'string') return false;
  const clean = name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  if (clean.length < 2 || clean.length > 50) return false;

  // 1. Reject if words of 3+ letters have no vowels
  const words = clean.split(/\s+/);
  for (const w of words) {
    if (w.length >= 3 && !/[aeiouy]/i.test(w)) return false;
  }

  // 2. Reject alphabet run mash (e.g. "abcdef", "avcdef", "qwerty", "asdfgh")
  if (/^(?:abcdef|abcde|avcdef|qwerty|asdfgh|zxcvbn|poiuy|lkjhg)/i.test(clean)) return false;

  // 3. Reject excessive consecutive consonants
  if (/[bcdfghjklmnpqrstvwxyz]{5,}/i.test(clean)) return false;

  return true;
}
