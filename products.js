/**
 * SayCarts — Product Catalog (Indian Market Edition)
 * 100+ realistic grocery/household products with brand, size, price (INR ₹), rating.
 * Used for the Browse panel and voice-activated product search.
 */

const PRODUCTS = [

  // ── Dairy & Eggs ──────────────────────────────────────────────────────
  { id:'d001', name:'Amul Taaza Toned Milk',       brand:'Amul',            size:'1 Litre pouch', price:54,  category:'Dairy & Eggs', emoji:'🥛', color:'#fbbf24', rating:4.9, reviews:5420, tags:['milk','toned milk','amul','dairy'] },
  { id:'d002', name:'Amul Gold Full Cream Milk',   brand:'Amul',            size:'1 Litre pouch', price:66,  category:'Dairy & Eggs', emoji:'🥛', color:'#fbbf24', rating:4.9, reviews:4880, tags:['milk','full cream','dairy'] },
  { id:'d003', name:'Amul Pasteurised Butter',     brand:'Amul',            size:'500g block',    price:275, category:'Dairy & Eggs', emoji:'🧈', color:'#fde68a', rating:4.9, reviews:8920, tags:['butter','makhan','dairy','baking'] },
  { id:'d004', name:'Amul Malai Paneer',           brand:'Amul',            size:'200g pack',     price:115, category:'Dairy & Eggs', emoji:'🧀', color:'#fef9c3', rating:4.8, reviews:6340, tags:['paneer','cottage cheese','protein'] },
  { id:'d005', name:'Amul Masti Dahi (Curd)',      brand:'Amul',            size:'400g tub',      price:40,  category:'Dairy & Eggs', emoji:'🥣', color:'#fbbf24', rating:4.8, reviews:4100, tags:['curd','dahi','yogurt','probiotic'] },
  { id:'d006', name:'Mother Dairy Cow Milk',       brand:'Mother Dairy',    size:'1 Litre pouch', price:56,  category:'Dairy & Eggs', emoji:'🥛', color:'#fbbf24', rating:4.7, reviews:3210, tags:['milk','cow milk','dairy'] },
  { id:'d007', name:'Farm White Eggs (Pack of 6)', brand:'Eggoz',           size:'6 count',       price:65,  category:'Dairy & Eggs', emoji:'🥚', color:'#fef3c7', rating:4.8, reviews:2876, tags:['eggs','protein','breakfast','anda'] },
  { id:'d008', name:'Farm Brown Eggs (Pack of 10)',brand:'Eggoz Nutrition', size:'10 count',      price:135, category:'Dairy & Eggs', emoji:'🥚', color:'#f59e0b', rating:4.9, reviews:3201, tags:['brown eggs','organic','protein'] },
  { id:'d009', name:'Britannia Cheese Slices',     brand:'Britannia',       size:'200g (10 slices)',price:145,category:'Dairy & Eggs',emoji:'🧀', color:'#f59e0b', rating:4.7, reviews:2410, tags:['cheese','slices','sandwich'] },
  { id:'d010', name:'Amul Pure Cow Ghee',          brand:'Amul',            size:'1 Litre tin',   price:650, category:'Dairy & Eggs', emoji:'🫙', color:'#f59e0b', rating:4.9, reviews:9800, tags:['ghee','pure ghee','cow ghee','cooking'] },
  { id:'d011', name:'Amul Fresh Cream',            brand:'Amul',            size:'250ml tetra',   price:65,  category:'Dairy & Eggs', emoji:'🥛', color:'#fef3c7', rating:4.7, reviews:1830, tags:['cream','fresh cream','cooking'] },
  { id:'d012', name:'Epigamia Greek Yogurt Berry', brand:'Epigamia',        size:'90g cup',       price:60,  category:'Dairy & Eggs', emoji:'🍓', color:'#fb7185', rating:4.6, reviews:1540, tags:['yogurt','greek yogurt','protein'] },

  // ── Produce (Sabzi & Fal) ─────────────────────────────────────────────
  { id:'p001', name:'Shimla Red Apples',           brand:'Fresh Farm',      size:'1 kg',          price:180, category:'Produce',      emoji:'🍎', color:'#ef4444', rating:4.8, reviews:3100, tags:['apples','seb','fruit'] },
  { id:'p002', name:'Robusta Bananas',             brand:'Fresh Farm',      size:'1 Dozen (12 pcs)',price:60, category:'Produce',     emoji:'🍌', color:'#fbbf24', rating:4.7, reviews:4500, tags:['banana','kela','fruit'] },
  { id:'p003', name:'Hybrid Red Tomatoes',         brand:'Fresh Mandi',     size:'1 kg',          price:40,  category:'Produce',      emoji:'🍅', color:'#ef4444', rating:4.7, reviews:5200, tags:['tomato','tamatar','vegetables'] },
  { id:'p004', name:'Nashik Red Onions',           brand:'Fresh Mandi',     size:'1 kg',          price:35,  category:'Produce',      emoji:'🧅', color:'#f59e0b', rating:4.8, reviews:6800, tags:['onion','pyaz','vegetables'] },
  { id:'p005', name:'Pahadi Jyoti Potatoes',       brand:'Fresh Mandi',     size:'1 kg',          price:30,  category:'Produce',      emoji:'🥔', color:'#d97706', rating:4.7, reviews:5900, tags:['potato','aloo','vegetables'] },
  { id:'p006', name:'Fresh Palak (Spinach)',       brand:'Fresh Farm',      size:'250g bunch',    price:25,  category:'Produce',      emoji:'🥬', color:'#22c55e', rating:4.8, reviews:2100, tags:['spinach','palak','green vegetables'] },
  { id:'p007', name:'Fresh Coriander (Dhaniya)',   brand:'Fresh Farm',      size:'100g bunch',    price:15,  category:'Produce',      emoji:'🌿', color:'#22c55e', rating:4.9, reviews:7400, tags:['coriander','dhaniya','herbs'] },
  { id:'p008', name:'Spicy Green Chillies',        brand:'Fresh Farm',      size:'100g pack',     price:15,  category:'Produce',      emoji:'🌶️', color:'#22c55e', rating:4.7, reviews:3800, tags:['chilli','hari mirch','spicy'] },
  { id:'p009', name:'Fresh Ginger (Adrak)',        brand:'Fresh Mandi',     size:'250g',          price:40,  category:'Produce',      emoji:'🫚', color:'#d97706', rating:4.8, reviews:2900, tags:['ginger','adrak','chai'] },
  { id:'p010', name:'Garlic Bulbs (Lahsun)',       brand:'Fresh Mandi',     size:'250g',          price:65,  category:'Produce',      emoji:'🧄', color:'#fef9c3', rating:4.6, reviews:2100, tags:['garlic','lahsun','cooking'] },
  { id:'p011', name:'Fresh Green Peas (Matar)',    brand:'Fresh Farm',      size:'500g',          price:50,  category:'Produce',      emoji:'🫛', color:'#22c55e', rating:4.8, reviews:1890, tags:['peas','matar','vegetables'] },
  { id:'p012', name:'Yellow Lemons (Nimbu)',       brand:'Fresh Farm',      size:'4 count',       price:20,  category:'Produce',      emoji:'🍋', color:'#fbbf24', rating:4.7, reviews:3400, tags:['lemon','nimbu','citrus'] },
  { id:'p013', name:'Green Capsicum (Shimla Mirch)',brand:'Fresh Mandi',   size:'500g',          price:45,  category:'Produce',      emoji:'🫑', color:'#22c55e', rating:4.6, reviews:1600, tags:['capsicum','shimla mirch'] },
  { id:'p014', name:'Fresh Red Carrots (Gajar)',   brand:'Fresh Farm',      size:'500g',          price:35,  category:'Produce',      emoji:'🥕', color:'#f97316', rating:4.8, reviews:2700, tags:['carrot','gajar','salad'] },
  { id:'p015', name:'Alphonso / Badami Mangoes',   brand:'Ratnagiri Fresh', size:'1 kg (4-5 pcs)',price:350, category:'Produce',      emoji:'🥭', color:'#f59e0b', rating:4.9, reviews:4800, tags:['mango','aam','alphonso','fruit'] },

  // ── Staples, Atta, Rice & Dals ────────────────────────────────────────
  { id:'st01', name:'Aashirvaad Shudh Chakki Atta',brand:'Aashirvaad',     size:'5 kg bag',      price:245, category:'Pasta & Grains', emoji:'🌾', color:'#f59e0b', rating:4.9, reviews:14200, tags:['atta','wheat flour','roti','aashirvaad'] },
  { id:'st02', name:'India Gate Basmati Rice Feast',brand:'India Gate',     size:'5 kg bag',      price:480, category:'Pasta & Grains', emoji:'🍚', color:'#fef9c3', rating:4.8, reviews:9100,  tags:['rice','basmati rice','biryani','chawal'] },
  { id:'st03', name:'Tata Sampann Unpolished Toor Dal',brand:'Tata Sampann',size:'1 kg pack',     price:165, category:'Pasta & Grains', emoji:'🍲', color:'#eab308', rating:4.9, reviews:8400,  tags:['toor dal','arhar dal','dal','protein'] },
  { id:'st04', name:'Tata Sampann Moong Dal Dhuli',brand:'Tata Sampann',  size:'1 kg pack',     price:145, category:'Pasta & Grains', emoji:'🍲', color:'#fde047', rating:4.8, reviews:5200,  tags:['moong dal','yellow dal','protein'] },
  { id:'st05', name:'Tata Sampann Chana Dal',      brand:'Tata Sampann',    size:'1 kg pack',     price:115, category:'Pasta & Grains', emoji:'🍲', color:'#ca8a04', rating:4.7, reviews:4100,  tags:['chana dal','bengal gram','dal'] },
  { id:'st06', name:'Tata Salt Vacuum Evaporated', brand:'Tata Salt',       size:'1 kg pack',     price:28,  category:'Condiments & Spices', emoji:'🧂', color:'#94a3b8', rating:4.9, reviews:18900, tags:['salt','namak','tata salt'] },
  { id:'st07', name:'Fortune Sunlite Sunflower Oil',brand:'Fortune',        size:'1 Litre pouch', price:145, category:'Condiments & Spices', emoji:'🌻', color:'#facc15', rating:4.8, reviews:8600,  tags:['oil','cooking oil','sunflower oil'] },
  { id:'st08', name:'Fortune Kachi Ghani Mustard Oil',brand:'Fortune',      size:'1 Litre bottle',price:160, category:'Condiments & Spices', emoji:'🫒', color:'#ca8a04', rating:4.9, reviews:7300,  tags:['mustard oil','sarson tel','oil'] },
  { id:'st09', name:'Madhur Pure & Hygienic Sugar',brand:'Madhur',          size:'1 kg pack',     price:52,  category:'Condiments & Spices', emoji:'🍬', color:'#f8fafc', rating:4.8, reviews:6400,  tags:['sugar','cheeni','sweetener'] },
  { id:'st10', name:'Tata Sampann Besan (Gram Flour)',brand:'Tata Sampann', size:'500g pack',     price:65,  category:'Pasta & Grains', emoji:'🌾', color:'#facc15', rating:4.8, reviews:3900,  tags:['besan','gram flour','pakoda'] },
  { id:'st11', name:'Tata Sampann Thick Poha',     brand:'Tata Sampann',    size:'500g pack',     price:48,  category:'Pasta & Grains', emoji:'🥣', color:'#fde047', rating:4.7, reviews:3100,  tags:['poha','flattened rice','breakfast'] },
  { id:'st12', name:'Rajdhani Sooji / Rawa',       brand:'Rajdhani',        size:'500g pack',     price:38,  category:'Pasta & Grains', emoji:'🌾', color:'#fef08a', rating:4.7, reviews:2800,  tags:['sooji','suji','rava','semolina'] },

  // ── Spices & Condiments (Masalas) ─────────────────────────────────────
  { id:'sp01', name:'Everest Garam Masala',        brand:'Everest',         size:'100g pack',     price:88,  category:'Condiments & Spices', emoji:'🥘', color:'#b45309', rating:4.9, reviews:9200,  tags:['garam masala','masala','spice'] },
  { id:'sp02', name:'MDH Deggi Mirch Powder',      brand:'MDH',             size:'100g pack',     price:95,  category:'Condiments & Spices', emoji:'🌶️', color:'#dc2626', rating:4.9, reviews:8400,  tags:['mirch','red chilli','chilli powder'] },
  { id:'sp03', name:'Catch Turmeric Powder (Haldi)',brand:'Catch',          size:'200g pack',     price:55,  category:'Condiments & Spices', emoji:'🟡', color:'#eab308', rating:4.8, reviews:6200,  tags:['haldi','turmeric','curcumin'] },
  { id:'sp04', name:'Catch Coriander Powder (Dhaniya)',brand:'Catch',       size:'200g pack',     price:62,  category:'Condiments & Spices', emoji:'🌿', color:'#65a30d', rating:4.8, reviews:4800,  tags:['dhaniya powder','coriander powder'] },
  { id:'sp05', name:'Catch Whole Cumin Seeds (Jeera)',brand:'Catch',        size:'100g pack',     price:75,  category:'Condiments & Spices', emoji:'🟤', color:'#78350f', rating:4.8, reviews:4100,  tags:['jeera','cumin','tadka'] },
  { id:'sp06', name:'Dabur 100% Pure Honey',       brand:'Dabur',           size:'500g squeeze',  price:230, category:'Condiments & Spices', emoji:'🍯', color:'#f59e0b', rating:4.8, reviews:7600,  tags:['honey','shahad','dabur honey'] },
  { id:'sp07', name:'Maggi Hot & Sweet Tomato Sauce',brand:'Maggi',         size:'500g bottle',   price:135, category:'Condiments & Spices', emoji:'🍅', color:'#ef4444', rating:4.8, reviews:8200,  tags:['ketchup','tomato sauce','maggi sauce'] },
  { id:'sp08', name:'Kissan Fresh Tomato Ketchup', brand:'Kissan',          size:'950g pouch',    price:120, category:'Condiments & Spices', emoji:'🍅', color:'#ef4444', rating:4.7, reviews:5400,  tags:['ketchup','kissan','sauce'] },
  { id:'sp09', name:'Veeba Eggless Mayonnaise',    brand:'Veeba',           size:'250g bottle',   price:89,  category:'Condiments & Spices', emoji:'🫙', color:'#fef9c3', rating:4.7, reviews:3900,  tags:['mayo','mayonnaise','eggless'] },
  { id:'sp10', name:'Mother\'s Recipe Mixed Pickle',brand:'Mother\'s Recipe',size:'400g jar',     price:110, category:'Condiments & Spices', emoji:'🫙', color:'#ea580c', rating:4.7, reviews:3100,  tags:['pickle','achar','mango pickle'] },

  // ── Bakery & Breakfast ────────────────────────────────────────────────
  { id:'b001', name:'Harvest Gold 100% Atta Bread',brand:'Harvest Gold',    size:'400g pack',     price:50,  category:'Bakery & Bread', emoji:'🍞', color:'#d97706', rating:4.8, reviews:6700, tags:['bread','atta bread','brown bread'] },
  { id:'b002', name:'Britannia Daily Fresh White Bread',brand:'Britannia',  size:'400g pack',     price:40,  category:'Bakery & Bread', emoji:'🍞', color:'#fde68a', rating:4.7, reviews:4800, tags:['white bread','bread','toast'] },
  { id:'b003', name:'Harvest Gold Mumbai Pav',     brand:'Harvest Gold',    size:'6 pcs pack',    price:35,  category:'Bakery & Bread', emoji:'🥯', color:'#fbbf24', rating:4.8, reviews:3900, tags:['pav','bun','bhaji pav'] },
  { id:'b004', name:'English Oven Burger Buns',    brand:'English Oven',    size:'4 count pack',  price:45,  category:'Bakery & Bread', emoji:'🍔', color:'#f59e0b', rating:4.7, reviews:2100, tags:['buns','burger buns','burger'] },
  { id:'b005', name:'Kellogg\'s Corn Flakes Original',brand:'Kellogg\'s',   size:'475g box',      price:215, category:'Bakery & Bread', emoji:'🥣', color:'#facc15', rating:4.8, reviews:5600, tags:['corn flakes','cereal','breakfast'] },
  { id:'b006', name:'Quaker Rolled Oats',          brand:'Quaker',          size:'1 kg bag',      price:190, category:'Bakery & Bread', emoji:'🌾', color:'#d97706', rating:4.8, reviews:7200, tags:['oats','oatmeal','quaker'] },
  { id:'b007', name:'Kellogg\'s Muesli Fruit & Nut',brand:'Kellogg\'s',     size:'750g pouch',    price:380, category:'Bakery & Bread', emoji:'🥣', color:'#ca8a04', rating:4.8, reviews:3400, tags:['muesli','cereal','dry fruits'] },

  // ── Beverages (Chai, Coffee & Drinks) ─────────────────────────────────
  { id:'bv01', name:'Tata Tea Gold Premium',       brand:'Tata Tea',        size:'500g pack',     price:290, category:'Beverages',      emoji:'☕', color:'#78350f', rating:4.9, reviews:11200,tags:['tea','chai','tata tea','black tea'] },
  { id:'bv02', name:'Brooke Bond Red Label Tea',   brand:'Red Label',       size:'500g pack',     price:260, category:'Beverages',      emoji:'☕', color:'#b91c1c', rating:4.8, reviews:8900, tags:['tea','chai','red label'] },
  { id:'bv03', name:'Nescafé Classic Instant Coffee',brand:'Nescafé',       size:'100g glass jar',price:245, category:'Beverages',      emoji:'☕', color:'#451a03', rating:4.9, reviews:9800, tags:['coffee','nescafe','instant coffee'] },
  { id:'bv04', name:'Bru Instant Coffee Pouch',    brand:'Bru',             size:'100g pouch',    price:195, category:'Beverages',      emoji:'☕', color:'#713f12', rating:4.7, reviews:5400, tags:['coffee','bru','filter coffee'] },
  { id:'bv05', name:'Tetley Pure Green Tea',       brand:'Tetley',          size:'25 tea bags',   price:165, category:'Beverages',      emoji:'🍵', color:'#22c55e', rating:4.7, reviews:4100, tags:['green tea','antioxidant','diet'] },
  { id:'bv06', name:'Real Fruit Power Mixed Juice',brand:'Real',            size:'1 Litre tetra', price:120, category:'Beverages',      emoji:'🧃', color:'#ea580c', rating:4.8, reviews:6800, tags:['juice','fruit juice','real juice'] },
  { id:'bv07', name:'Raw Pressery Coconut Water',  brand:'Raw Pressery',    size:'200ml bottle',  price:50,  category:'Beverages',      emoji:'🥥', color:'#22c55e', rating:4.8, reviews:3200, tags:['nariyal pani','coconut water','hydration'] },
  { id:'bv08', name:'Thums Up Charged Carbonated', brand:'Thums Up',        size:'750ml pet bottle',price:40,category:'Beverages',      emoji:'🥤', color:'#1e293b', rating:4.7, reviews:4900, tags:['cold drink','thums up','soda'] },
  { id:'bv09', name:'Bisleri Packaged Mineral Water',brand:'Bisleri',       size:'5 Litre jar',   price:75,  category:'Beverages',      emoji:'💧', color:'#0284c7', rating:4.9, reviews:8100, tags:['water','bisleri','mineral water'] },

  // ── Snacks, Biscuits & Namkeen ────────────────────────────────────────
  { id:'s001', name:'Maggi 2-Minute Noodles Masala',brand:'Maggi',          size:'4-pack (280g)', price:56,  category:'Snacks',         emoji:'🍜', color:'#eab308', rating:4.9, reviews:18400,tags:['maggi','noodles','instant noodles'] },
  { id:'s002', name:'Lay\'s India\'s Magic Masala Chips',brand:'Lay\'s',    size:'90g pouch',     price:40,  category:'Snacks',         emoji:'🥔', color:'#3b82f6', rating:4.8, reviews:9200, tags:['chips','lays','magic masala'] },
  { id:'s003', name:'Kurkure Masala Munch',        brand:'Kurkure',         size:'90g pouch',     price:30,  category:'Snacks',         emoji:'🥨', color:'#f97316', rating:4.8, reviews:8400, tags:['kurkure','namkeen','crispy'] },
  { id:'s004', name:'Haldiram\'s Nagpur Bhujia Sev',brand:'Haldiram\'s',    size:'400g pouch',    price:130, category:'Snacks',         emoji:'🥨', color:'#eab308', rating:4.9, reviews:11300,tags:['bhujia','sev','haldiram','namkeen'] },
  { id:'s005', name:'Parle-G Gold Glucose Biscuits',brand:'Parle',          size:'1 kg mega pack',price:90,  category:'Snacks',         emoji:'🍪', color:'#f59e0b', rating:4.9, reviews:14100,tags:['parle g','biscuits','chai biscuit'] },
  { id:'s006', name:'Britannia Good Day Cashew Cookies',brand:'Britannia',  size:'600g combo pack',price:120,category:'Snacks',        emoji:'🍪', color:'#facc15', rating:4.8, reviews:8900, tags:['good day','cookies','cashew'] },
  { id:'s007', name:'Cadbury Dairy Milk Silk Bar', brand:'Cadbury',         size:'150g bar',      price:175, category:'Snacks',         emoji:'🍫', color:'#581c87', rating:4.9, reviews:12400,tags:['chocolate','dairy milk','silk'] },
  { id:'s008', name:'California Roasted Almonds (Badam)',brand:'Nutraj',    size:'250g pouch',    price:290, category:'Snacks',         emoji:'🥜', color:'#b45309', rating:4.8, reviews:3900, tags:['badam','almonds','dry fruits'] },
  { id:'s009', name:'W240 Whole Cashews (Kaju)',   brand:'Nutraj',          size:'250g pouch',    price:320, category:'Snacks',         emoji:'🥜', color:'#fef08a', rating:4.8, reviews:3400, tags:['kaju','cashew','dry fruits'] },
  { id:'s010', name:'Act II Butter Golden Popcorn',brand:'Act II',          size:'150g instant pack',price:40,category:'Snacks',        emoji:'🍿', color:'#facc15', rating:4.7, reviews:5100, tags:['popcorn','act 2','butter popcorn'] },

  // ── Meat & Seafood ────────────────────────────────────────────────────
  { id:'m001', name:'Fresh Chicken Breast Boneless',brand:'Licious',        size:'500g fresh pack',price:249,category:'Meat & Seafood', emoji:'🍗', color:'#fbbf24', rating:4.9, reviews:6800, tags:['chicken','chicken breast','boneless','protein'] },
  { id:'m002', name:'Fresh Chicken Curry Cut',     brand:'Licious',        size:'1 kg fresh pack',price:319,category:'Meat & Seafood', emoji:'🍗', color:'#f59e0b', rating:4.8, reviews:8400, tags:['chicken','curry cut','meat'] },
  { id:'m003', name:'Fresh Water Raw Prawns Cleaned',brand:'FreshToHome',  size:'500g pack',     price:399, category:'Meat & Seafood', emoji:'🍤', color:'#fb7185', rating:4.8, reviews:3200, tags:['prawns','shrimp','seafood','fish'] },
  { id:'m004', name:'Fresh Rohu Fish Bengali Cut', brand:'FreshToHome',    size:'500g pack',     price:199, category:'Meat & Seafood', emoji:'🐟', color:'#0284c7', rating:4.7, reviews:2900, tags:['fish','rohu','seafood','machli'] },
  { id:'m005', name:'Fresh Rich Mutton Curry Cut', brand:'Licious',        size:'500g pack',     price:499, category:'Meat & Seafood', emoji:'🥩', color:'#991b1b', rating:4.8, reviews:4100, tags:['mutton','goat meat','gosht'] },

  // ── Household & Cleaning ──────────────────────────────────────────────
  { id:'h001', name:'Surf Excel Matic Top Load Liquid',brand:'Surf Excel',  size:'1 Litre bottle',price:225, category:'Household',      emoji:'🧺', color:'#2563eb', rating:4.9, reviews:12600,tags:['surf excel','detergent','laundry','washing'] },
  { id:'h002', name:'Ariel Matic Detergent Powder',brand:'Ariel',           size:'1 kg pouch',    price:165, category:'Household',      emoji:'🧺', color:'#16a34a', rating:4.8, reviews:8900, tags:['ariel','detergent','powder'] },
  { id:'h003', name:'Vim Dishwash Gel Lemon Refill',brand:'Vim',            size:'750ml pouch',   price:155, category:'Household',      emoji:'🧴', color:'#eab308', rating:4.9, reviews:14200,tags:['vim','dishwash','utensil cleaner'] },
  { id:'h004', name:'Harpic Power Plus Toilet Cleaner',brand:'Harpic',     size:'1 Litre bottle',price:195, category:'Household',      emoji:'🚽', color:'#1d4ed8', rating:4.9, reviews:11800,tags:['harpic','toilet cleaner','cleaning'] },
  { id:'h005', name:'Colin Glass & Surface Cleaner Spray',brand:'Colin',    size:'500ml spray',   price:105, category:'Household',      emoji:'🪟', color:'#0284c7', rating:4.8, reviews:7400, tags:['colin','glass cleaner','cleaning'] },
  { id:'h006', name:'Dettol Antiseptic Liquid',    brand:'Dettol',          size:'550ml bottle',  price:210, category:'Household',      emoji:'🩹', color:'#15803d', rating:4.9, reviews:16500,tags:['dettol','antiseptic','disinfectant'] },
  { id:'h007', name:'Scotch-Brite Scrub Sponge (Pack of 3)',brand:'Scotch-Brite',size:'3 count pack',price:60,category:'Household',   emoji:'🧽', color:'#22c55e', rating:4.8, reviews:9200, tags:['scrub pad','sponge','cleaning'] },
  { id:'h008', name:'Medium Black Garbage Bags',   brand:'Origami',         size:'30 bags roll',  price:110, category:'Household',      emoji:'🗑️', color:'#334155', rating:4.7, reviews:4800, tags:['trash bags','dustbin bags'] },
  { id:'h009', name:'Origami Kitchen Towel Paper Roll',brand:'Origami',     size:'2 rolls pack',  price:120, category:'Household',      emoji:'🧻', color:'#94a3b8', rating:4.8, reviews:5100, tags:['tissue paper','kitchen towel','paper'] },

  // ── Personal Care ─────────────────────────────────────────────────────
  { id:'pc01', name:'Colgate MaxFresh Spicy Fresh Toothpaste',brand:'Colgate',size:'150g pack',    price:115, category:'Personal Care',  emoji:'🪥', color:'#dc2626', rating:4.9, reviews:13200,tags:['colgate','toothpaste','brush','teeth'] },
  { id:'pc02', name:'Dettol Original Liquid Handwash Refill',brand:'Dettol',size:'675ml refill pouch',price:119,category:'Personal Care',emoji:'🧼', color:'#15803d', rating:4.9, reviews:15400,tags:['handwash','soap','dettol soap'] },
  { id:'pc03', name:'Head & Shoulders Cool Menthol Shampoo',brand:'Head & Shoulders',size:'340ml bottle',price:320,category:'Personal Care',emoji:'🚿',color:'#1d4ed8',rating:4.8, reviews:9400, tags:['shampoo','hair wash','anti dandruff'] },
  { id:'pc04', name:'Dove Deeply Nourishing Body Wash',brand:'Dove',        size:'400ml bottle',  price:275, category:'Personal Care',  emoji:'🧴', color:'#0284c7', rating:4.9, reviews:8100, tags:['body wash','dove','soap'] },
  { id:'pc05', name:'Nivea Soft Light Moisturizing Cream',brand:'Nivea',    size:'200ml tub',     price:240, category:'Personal Care',  emoji:'🧴', color:'#1e3a8a', rating:4.9, reviews:10200,tags:['nivea','cream','moisturizer'] },
  { id:'pc06', name:'Parachute 100% Pure Coconut Hair Oil',brand:'Parachute',size:'500ml bottle', price:195, category:'Personal Care',  emoji:'🥥', color:'#0369a1', rating:4.9, reviews:18200,tags:['coconut oil','hair oil','parachute'] },
  { id:'pc07', name:'Savlon Moisture Shield Soap (Buy 4 Get 1)',brand:'Savlon',size:'5 x 100g pack',price:145,category:'Personal Care', emoji:'🧼', color:'#059669', rating:4.8, reviews:6700, tags:['soap','savlon','bathing soap'] },

  // ── Frozen & Ready to Cook ────────────────────────────────────────────
  { id:'f001', name:'Amul Butter Garlic Naan (Pack of 4)',brand:'Amul',     size:'400g pack',     price:130, category:'Frozen Foods',   emoji:'🫓', color:'#f59e0b', rating:4.8, reviews:4200, tags:['naan','roti','frozen naan'] },
  { id:'f002', name:'McCain French Fries Crispy',  brand:'McCain',          size:'420g pack',     price:115, category:'Frozen Foods',   emoji:'🍟', color:'#eab308', rating:4.8, reviews:6300, tags:['french fries','mccain','frozen snack'] },
  { id:'f003', name:'McCain Smiles Crispy Mashed Potato',brand:'McCain',    size:'375g pack',     price:135, category:'Frozen Foods',   emoji:'🥔', color:'#f59e0b', rating:4.8, reviews:5100, tags:['smiles','potato smiles','kids snack'] },
  { id:'f004', name:'Sumeru Frozen Green Peas',    brand:'Sumeru',          size:'1 kg bag',      price:175, category:'Frozen Foods',   emoji:'🫛', color:'#22c55e', rating:4.9, reviews:4800, tags:['matar','frozen peas'] },
  { id:'f005', name:'Amul Real Ice Cream Belgian Chocolate',brand:'Amul',  size:'1 Litre tub',   price:240, category:'Frozen Foods',   emoji:'🍨', color:'#581c87', rating:4.9, reviews:9200, tags:['ice cream','chocolate','dessert'] },
  { id:'f006', name:'Haldiram\'s Frozen Punjabi Samosa (Pack of 8)',brand:'Haldiram\'s',size:'360g pack',price:150,category:'Frozen Foods',emoji:'🥟',color:'#d97706',rating:4.8, reviews:3800, tags:['samosa','punjabi samosa','snack'] },
];

/**
 * Search products by query, category, and optional max price
 * @param {string} query - Search text
 * @param {string|null} category - Category filter
 * @param {number|null} maxPrice - Max price filter
 * @returns {Array} Filtered products
 */
function searchProducts(query = '', category = null, maxPrice = null) {
  const lq = query.toLowerCase().trim();

  return PRODUCTS.filter(p => {
    // Category filter
    if (category && p.category !== category) return false;
    // Price filter
    if (maxPrice !== null && p.price > maxPrice) return false;
    // Text search
    if (!lq) return true;
    return (
      p.name.toLowerCase().includes(lq) ||
      p.brand.toLowerCase().includes(lq) ||
      p.category.toLowerCase().includes(lq) ||
      p.tags.some(t => t.includes(lq) || lq.includes(t))
    );
  });
}

/**
 * Get all distinct categories in the catalog
 */
function getProductCategories() {
  return [...new Set(PRODUCTS.map(p => p.category))];
}

/**
 * Get featured/popular products (top rated)
 */
function getFeaturedProducts(limit = 12) {
  return [...PRODUCTS]
    .sort((a, b) => (b.rating * Math.log10(b.reviews)) - (a.rating * Math.log10(a.reviews)))
    .slice(0, limit);
}
