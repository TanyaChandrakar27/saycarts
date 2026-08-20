/**
 * SayCarts — Core Application Logic
 * Multi-cart state management, CRUD operations, undo/redo, persistence
 */

// ─── Constants ───────────────────────────────────────────────────────────────

const CART_COLORS = [
  '#7c3aed', '#0ea5e9', '#10b981', '#f59e0b',
  '#ef4444', '#ec4899', '#6366f1', '#14b8a6',
  '#f97316', '#84cc16', '#06b6d4', '#a855f7'
];

const CART_EMOJIS = ['🛒', '🛍️', '🏪', '🏬', '🧺', '📦', '💼', '🎁', '🏋️', '🎉', '🏠', '✈️'];

const STORAGE_KEY = 'saycarts_state_v3';
const LEGACY_STORAGE_KEY = 'voicecart_state_v3';
const MAX_HISTORY = 30;

// ─── State ────────────────────────────────────────────────────────────────────

let state = {
  carts: {},           // { [id]: Cart }
  activeCartId: null,
  history: [],         // Array of undoable actions
  settings: {
    language: 'en-US',
    geminiApiKey: '',
    soundEnabled: true,
    theme: 'dark'
  }
};

// ─── Utility Helpers ──────────────────────────────────────────────────────────

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getColorForIndex(index) {
  return CART_COLORS[index % CART_COLORS.length];
}

function getEmojiForIndex(index) {
  return CART_EMOJIS[index % CART_EMOJIS.length];
}

function getCartCount() {
  return Object.keys(state.carts).length;
}

function getActiveCart() {
  return state.carts[state.activeCartId] || null;
}

function findCartByName(name) {
  if (!name) return null;
  const lower = name.toLowerCase().trim();
  return Object.values(state.carts).find(c =>
    c.name.toLowerCase().includes(lower) || lower.includes(c.name.toLowerCase())
  ) || null;
}

// ─── Persistence ──────────────────────────────────────────────────────────────

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('[App] Failed to save state:', e);
  }
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      state = { ...state, ...parsed };
      // Ensure settings has all fields
      state.settings = { ...state.settings, ...parsed.settings };
    }
  } catch (e) {
    console.warn('[App] Failed to load state:', e);
  }

  // Initialize with a default cart if none exist
  if (Object.keys(state.carts).length === 0) {
    createCart('Weekly Groceries', true);
    createCart('Costco Run', false);
  }

  // Validate active cart still exists
  if (!state.activeCartId || !state.carts[state.activeCartId]) {
    state.activeCartId = Object.keys(state.carts)[0] || null;
  }
}

// ─── History / Undo ───────────────────────────────────────────────────────────

function pushHistory(action) {
  state.history.unshift(action);
  if (state.history.length > MAX_HISTORY) {
    state.history = state.history.slice(0, MAX_HISTORY);
  }
}

function undo() {
  if (state.history.length === 0) {
    return { success: false, message: 'Nothing to undo.' };
  }

  const action = state.history.shift();

  switch (action.type) {
    case 'ADD_ITEM': {
      const cart = state.carts[action.cartId];
      if (cart) {
        cart.items = cart.items.filter(i => i.id !== action.itemId);
        saveState();
        return { success: true, message: `Removed "${action.itemName}" (undo add).` };
      }
      break;
    }
    case 'REMOVE_ITEM': {
      const cart = state.carts[action.cartId];
      if (cart) {
        cart.items.splice(action.itemIndex, 0, action.item);
        saveState();
        return { success: true, message: `Restored "${action.item.name}" (undo remove).` };
      }
      break;
    }
    case 'CHECK_ITEM': {
      const cart = state.carts[action.cartId];
      const item = cart?.items.find(i => i.id === action.itemId);
      if (item) {
        item.checked = !action.wasChecked;
        saveState();
        return { success: true, message: `Unchecked "${item.name}".` };
      }
      break;
    }
    case 'CREATE_CART': {
      delete state.carts[action.cartId];
      if (state.activeCartId === action.cartId) {
        state.activeCartId = Object.keys(state.carts)[0] || null;
      }
      saveState();
      return { success: true, message: `Deleted cart "${action.cartName}" (undo create).` };
    }
    case 'DELETE_CART': {
      state.carts[action.cartId] = action.cart;
      saveState();
      return { success: true, message: `Restored cart "${action.cartName}".` };
    }
    case 'UPDATE_QTY': {
      const cart = state.carts[action.cartId];
      const item = cart?.items.find(i => i.id === action.itemId);
      if (item) {
        item.quantity = action.oldQty;
        saveState();
        return { success: true, message: `Reset quantity (undo).` };
      }
      break;
    }
  }

  return { success: false, message: 'Could not undo that action.' };
}

// ─── Cart Operations ──────────────────────────────────────────────────────────

/**
 * Create a new shopping cart
 * @param {string} name - Cart name
 * @param {boolean} [switchTo=true] - Whether to switch to the new cart
 * @returns {{ success: boolean, cart: Cart, message: string }}
 */
function createCart(name, switchTo = true) {
  if (!name?.trim()) {
    return { success: false, message: 'Cart name cannot be empty.' };
  }

  // Check for duplicate names
  const exists = Object.values(state.carts).find(
    c => c.name.toLowerCase() === name.trim().toLowerCase()
  );
  if (exists) {
    if (switchTo) {
      state.activeCartId = exists.id;
      saveState();
    }
    return { success: false, message: `Cart "${name}" already exists.`, cart: exists };
  }

  const idx = getCartCount();
  const id = generateId();
  const cart = {
    id,
    name: name.trim(),
    color: getColorForIndex(idx),
    emoji: getEmojiForIndex(idx),
    items: [],
    createdAt: Date.now()
  };

  state.carts[id] = cart;
  if (switchTo || !state.activeCartId) {
    state.activeCartId = id;
  }

  pushHistory({ type: 'CREATE_CART', cartId: id, cartName: cart.name });
  saveState();

  return { success: true, cart, message: `Created cart "${cart.name}".` };
}

/**
 * Delete a cart by ID or name
 */
function deleteCart(cartIdOrName) {
  let cart = state.carts[cartIdOrName] || findCartByName(cartIdOrName);
  if (!cart) return { success: false, message: `Cart "${cartIdOrName}" not found.` };

  if (Object.keys(state.carts).length <= 1) {
    return { success: false, message: 'You must have at least one cart.' };
  }

  pushHistory({ type: 'DELETE_CART', cartId: cart.id, cartName: cart.name, cart: { ...cart, items: [...cart.items] } });
  delete state.carts[cart.id];

  if (state.activeCartId === cart.id) {
    state.activeCartId = Object.keys(state.carts)[0];
  }

  saveState();
  return { success: true, message: `Deleted cart "${cart.name}".` };
}

/**
 * Switch active cart by ID or name
 */
function switchCart(cartIdOrName) {
  const cart = state.carts[cartIdOrName] || findCartByName(cartIdOrName);
  if (!cart) return { success: false, message: `Cart "${cartIdOrName}" not found.` };

  state.activeCartId = cart.id;
  saveState();
  return { success: true, cart, message: `Switched to "${cart.name}".` };
}

/**
 * Rename a cart
 */
function renameCart(cartIdOrName, newName) {
  const cart = state.carts[cartIdOrName] || findCartByName(cartIdOrName);
  if (!cart) return { success: false, message: `Cart not found.` };
  if (!newName?.trim()) return { success: false, message: 'Name cannot be empty.' };

  const oldName = cart.name;
  cart.name = newName.trim();
  saveState();
  return { success: true, message: `Renamed "${oldName}" to "${cart.name}".` };
}

/**
 * Merge source cart into target cart
 */
function mergeCarts(sourceNameOrId, targetNameOrId) {
  const source = state.carts[sourceNameOrId] || findCartByName(sourceNameOrId);
  const target = state.carts[targetNameOrId] || findCartByName(targetNameOrId);

  if (!source) return { success: false, message: `Source cart not found.` };
  if (!target) return { success: false, message: `Target cart not found.` };
  if (source.id === target.id) return { success: false, message: `Cannot merge a cart into itself.` };

  // Add source items to target (avoid duplicates by name)
  const targetNames = new Set(target.items.map(i => i.name.toLowerCase()));
  let merged = 0;
  for (const item of source.items) {
    if (!targetNames.has(item.name.toLowerCase())) {
      target.items.push({ ...item, id: generateId() });
      merged++;
    }
  }

  saveState();
  return { success: true, message: `Merged ${merged} items from "${source.name}" into "${target.name}".` };
}

/**
 * Clear all items from a cart
 */
function clearCart(cartIdOrName) {
  const cart = cartIdOrName
    ? (state.carts[cartIdOrName] || findCartByName(cartIdOrName))
    : getActiveCart();
  if (!cart) return { success: false, message: 'Cart not found.' };

  cart.items = [];
  saveState();
  return { success: true, message: `Cleared "${cart.name}".` };
}

// ─── Cart Summary & Text-to-Speech Helpers ────────────────────────────────────

/**
 * Calculate cart summary including item count and estimated total price in ₹
 */
function getCartSummary(cart) {
  if (!cart) return null;
  const totalItems = cart.items.length;
  const checkedItems = cart.items.filter(i => i.checked);
  const remainingItems = cart.items.filter(i => !i.checked);

  let totalPrice = 0;
  let hasPrices = false;
  if (typeof PRODUCTS !== 'undefined') {
    for (const item of cart.items) {
      const ilow = item.name.toLowerCase();
      const matched = PRODUCTS.find(p => {
        const plow = p.name.toLowerCase();
        return plow === ilow || plow.includes(ilow) || ilow.includes(plow) || (p.tags && p.tags.some(t => ilow.includes(t) || t.includes(ilow)));
      });
      if (matched) {
        totalPrice += (matched.price || 0) * (item.quantity || 1);
        hasPrices = true;
      }
    }
  }

  return {
    totalItems,
    checkedCount: checkedItems.length,
    remainingCount: remainingItems.length,
    remainingItems,
    totalPrice: Math.round(totalPrice),
    hasPrices
  };
}

/**
 * Read out the cart items aloud (TTS Voice Readback)
 */
function readCartAloud(cartIdOrName = null) {
  const cart = cartIdOrName
    ? (state.carts[cartIdOrName] || findCartByName(cartIdOrName))
    : getActiveCart();

  if (!cart) {
    return { success: false, message: 'No active cart found.', speechText: 'No active cart found.' };
  }

  if (cart.items.length === 0) {
    return {
      success: true,
      message: `Your "${cart.name}" cart is currently empty.`,
      speechText: `Your ${cart.name} cart is currently empty. Say "Add" followed by any item to add it.`,
      action: 'READ_CART'
    };
  }

  const remaining = cart.items.filter(i => !i.checked);
  const summary = getCartSummary(cart);

  if (remaining.length === 0) {
    return {
      success: true,
      message: `All ${cart.items.length} items in "${cart.name}" are checked off! 🎉`,
      speechText: `All ${cart.items.length} items in your ${cart.name} cart are checked off! Great job.`,
      action: 'READ_CART'
    };
  }

  const itemsList = remaining.map(i => {
    const qtyStr = i.quantity > 1 ? `${i.quantity} ` : '';
    const unitStr = i.unit ? `${i.unit} of ` : '';
    return `${qtyStr}${unitStr}${i.name}`;
  });

  let spokenList = '';
  if (itemsList.length === 1) {
    spokenList = itemsList[0];
  } else if (itemsList.length === 2) {
    spokenList = `${itemsList[0]} and ${itemsList[1]}`;
  } else {
    spokenList = `${itemsList.slice(0, -1).join(', ')}, and ${itemsList[itemsList.length - 1]}`;
  }

  const priceSuffix = summary && summary.hasPrices ? ` Cart total is ₹${summary.totalPrice}.` : '';
  const speechText = `You have ${remaining.length} ${remaining.length === 1 ? 'item' : 'items'} left in ${cart.name}: ${spokenList}.${priceSuffix}`;

  return {
    success: true,
    message: `📋 Remaining in ${cart.name} (${remaining.length}): ${spokenList}${priceSuffix}`,
    speechText,
    action: 'READ_CART'
  };
}

// ─── Item Operations ──────────────────────────────────────────────────────────

/**
 * Add an item to a cart
 * @param {string} name - Item name
 * @param {number} [qty=1] - Quantity
 * @param {string|null} [unit=null] - Unit of measure
 * @param {string|null} [cartIdOrName=null] - Target cart (defaults to active)
 */
function addItem(name, qty = 1, unit = null, cartIdOrName = null) {
  if (!name?.trim()) return { success: false, message: 'Item name is required.' };

  const cleanName = name.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, ' ').trim();
  if (cleanName.length < 2) return { success: false, message: 'Item name is too short.' };

  // Validate if it is a plausible grocery item or gibberish
  if (typeof isValidGroceryItem === 'function' && !isValidGroceryItem(cleanName)) {
    return {
      success: false,
      message: `"${cleanName}" is not recognized as a grocery item.`,
      speechText: `I didn't recognize ${cleanName} as a grocery item. Please try saying "Add milk" or "Add bread".`,
      action: 'UNKNOWN'
    };
  }

  const cart = cartIdOrName
    ? (state.carts[cartIdOrName] || findCartByName(cartIdOrName))
    : getActiveCart();

  if (!cart) return { success: false, message: 'No cart available.' };

  const itemName = cleanName.split(/\s+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  // Check if item already exists in cart (merge quantities)
  const existing = cart.items.find(
    i => i.name.toLowerCase() === itemName.toLowerCase()
  );

  if (existing) {
    const oldQty = existing.quantity;
    existing.quantity += qty;
    pushHistory({ type: 'UPDATE_QTY', cartId: cart.id, itemId: existing.id, oldQty });
    saveState();
    const summary = getCartSummary(cart);
    const priceSuffix = summary && summary.hasPrices ? ` Cart total is ₹${summary.totalPrice}.` : '';
    return {
      success: true,
      item: existing,
      message: `Updated ${itemName} to ${existing.quantity}${unit ? ' ' + unit : ''}.`,
      speechText: `Updated ${itemName} to ${existing.quantity} in ${cart.name}.${priceSuffix}`,
      merged: true
    };
  }

  const category = categorizeItem(itemName);
  const item = {
    id: generateId(),
    name: itemName,
    quantity: qty,
    unit: unit,
    category,
    checked: false,
    note: '',
    addedAt: Date.now()
  };

  cart.items.push(item);
  pushHistory({ type: 'ADD_ITEM', cartId: cart.id, itemId: item.id, itemName: item.name });
  saveState();

  const summary = getCartSummary(cart);
  const priceSuffix = summary && summary.hasPrices ? ` Cart total is ₹${summary.totalPrice}.` : '';
  const speechText = `Added ${qty > 1 ? qty + ' ' : ''}${unit ? unit + ' of ' : ''}${itemName} to ${cart.name}.${priceSuffix}`;

  return {
    success: true,
    item,
    message: `Added ${qty > 1 ? qty + ' ' : ''}${unit ? unit + ' of ' : ''}${itemName} to ${cart.name}.`,
    speechText
  };
}

/**
 * Remove item from a cart by name (fuzzy match)
 */
function removeItem(nameOrId, cartIdOrName = null) {
  const cart = cartIdOrName
    ? (state.carts[cartIdOrName] || findCartByName(cartIdOrName))
    : getActiveCart();
  if (!cart) return { success: false, message: 'Cart not found.' };

  const lower = nameOrId.toLowerCase();
  const idx = cart.items.findIndex(
    i => i.id === nameOrId ||
         i.name.toLowerCase() === lower ||
         i.name.toLowerCase().includes(lower) ||
         lower.includes(i.name.toLowerCase())
  );

  if (idx === -1) return { success: false, message: `"${nameOrId}" not found in cart.` };

  const [removed] = cart.items.splice(idx, 1);
  pushHistory({ type: 'REMOVE_ITEM', cartId: cart.id, itemId: removed.id, item: removed, itemIndex: idx });
  saveState();

  return { success: true, item: removed, message: `Removed "${removed.name}" from ${cart.name}.` };
}

/**
 * Toggle check state on an item
 */
function checkItem(nameOrId, cartIdOrName = null) {
  const cart = cartIdOrName
    ? (state.carts[cartIdOrName] || findCartByName(cartIdOrName))
    : getActiveCart();
  if (!cart) return { success: false, message: 'Cart not found.' };

  const lower = nameOrId.toLowerCase();
  const item = cart.items.find(
    i => i.id === nameOrId ||
         i.name.toLowerCase() === lower ||
         i.name.toLowerCase().includes(lower) ||
         lower.includes(i.name.toLowerCase())
  );

  if (!item) return { success: false, message: `"${nameOrId}" not found.` };

  const wasChecked = item.checked;
  item.checked = !wasChecked;
  pushHistory({ type: 'CHECK_ITEM', cartId: cart.id, itemId: item.id, wasChecked });
  saveState();

  const verb = item.checked ? 'Checked off' : 'Unchecked';
  return { success: true, item, message: `${verb} "${item.name}".` };
}

/**
 * Update item quantity
 */
function updateItemQty(itemId, newQty, cartId = null) {
  const cart = cartId ? state.carts[cartId] : getActiveCart();
  if (!cart) return { success: false };

  const item = cart.items.find(i => i.id === itemId);
  if (!item) return { success: false };

  const oldQty = item.quantity;
  if (newQty <= 0) return removeItem(itemId, cartId);

  item.quantity = newQty;
  pushHistory({ type: 'UPDATE_QTY', cartId: cart.id, itemId, oldQty });
  saveState();

  return { success: true, item, message: `Updated ${item.name} to ${newQty}.` };
}

/**
 * Update item note
 */
function updateItemNote(itemId, note, cartId = null) {
  const cart = cartId ? state.carts[cartId] : getActiveCart();
  const item = cart?.items.find(i => i.id === itemId);
  if (!item) return { success: false };
  item.note = note;
  saveState();
  return { success: true };
}

/**
 * Search items across all carts
 */
function searchItems(query) {
  if (!query) return [];
  const lower = query.toLowerCase();
  const results = [];

  for (const cart of Object.values(state.carts)) {
    for (const item of cart.items) {
      if (item.name.toLowerCase().includes(lower)) {
        results.push({ ...item, cartId: cart.id, cartName: cart.name });
      }
    }
  }

  return results;
}

/**
 * Get items in active cart grouped by category
 */
function getGroupedItems(cartId = null) {
  const cart = cartId ? state.carts[cartId] : getActiveCart();
  if (!cart) return {};

  const groups = {};
  for (const item of cart.items) {
    const cat = item.category?.name || 'Other';
    if (!groups[cat]) {
      groups[cat] = {
        ...item.category,
        name: cat,
        items: []
      };
    }
    groups[cat].items.push(item);
  }

  // Sort groups alphabetically, put 'Other' last
  return Object.fromEntries(
    Object.entries(groups).sort(([a], [b]) => {
      if (a === 'Other') return 1;
      if (b === 'Other') return -1;
      return a.localeCompare(b);
    })
  );
}

/**
 * Export cart as plain text
 */
function exportCart(cartId = null) {
  const cart = cartId ? state.carts[cartId] : getActiveCart();
  if (!cart) return '';

  const lines = [`🛒 ${cart.name} — ${new Date().toLocaleDateString()}\n`];
  const groups = getGroupedItems(cartId);

  for (const [catName, group] of Object.entries(groups)) {
    lines.push(`\n${group.emoji} ${catName}`);
    for (const item of group.items) {
      const checked = item.checked ? '✓' : '○';
      const qty = item.quantity > 1 ? `${item.quantity}x ` : '';
      const unit = item.unit ? ` (${item.unit})` : '';
      const note = item.note ? ` — ${item.note}` : '';
      lines.push(`  ${checked} ${qty}${item.name}${unit}${note}`);
    }
  }

  lines.push(`\nTotal: ${cart.items.length} items, ${cart.items.filter(i => i.checked).length} checked`);
  return lines.join('\n');
}

/**
 * Get stats for a cart
 */
function getCartStats(cartId = null) {
  const cart = cartId ? state.carts[cartId] : getActiveCart();
  if (!cart) return null;

  const total = cart.items.length;
  const checked = cart.items.filter(i => i.checked).length;
  const categories = new Set(cart.items.map(i => i.category?.name)).size;

  return { total, checked, unchecked: total - checked, categories, progress: total > 0 ? Math.round((checked / total) * 100) : 0 };
}

// ─── Settings ─────────────────────────────────────────────────────────────────

function updateSettings(updates) {
  state.settings = { ...state.settings, ...updates };
  if (updates.geminiApiKey !== undefined) {
    suggestionsEngine.setApiKey(updates.geminiApiKey);
  }
  saveState();
}

function getSettings() {
  return { ...state.settings };
}

// ─── Voice Command Handler ────────────────────────────────────────────────────

/**
 * Process a parsed voice intent and execute the corresponding action
 * @param {{ intent: string, item?: string, qty?: number, unit?: string, cartName?: string, targetCart?: string }} parsed
 * @returns {{ success: boolean, message: string, action: string, data?: any }}
 */
function handleVoiceIntent(parsed) {
  const { intent } = parsed;

  switch (intent) {
    case 'ADD_ITEM':
      return { ...addItem(parsed.item, parsed.qty || 1, parsed.unit), action: 'ADD_ITEM' };

    case 'ADD_TO_CART': {
      const targetCart = findCartByName(parsed.targetCart);
      if (!targetCart) {
        // Create the cart and add to it
        const created = createCart(parsed.targetCart, false);
        return { ...addItem(parsed.item, parsed.qty || 1, parsed.unit, created.cart.id), action: 'ADD_TO_CART' };
      }
      return { ...addItem(parsed.item, parsed.qty || 1, parsed.unit, targetCart.id), action: 'ADD_TO_CART' };
    }

    case 'READ_CART':
      return readCartAloud(parsed.cartName);

    case 'REMOVE_ITEM':
      return { ...removeItem(parsed.item), action: 'REMOVE_ITEM' };

    case 'CHECK_ITEM':
      return { ...checkItem(parsed.item), action: 'CHECK_ITEM' };

    case 'CREATE_CART': {
      const result = createCart(parsed.cartName);
      return { ...result, action: 'CREATE_CART' };
    }

    case 'SWITCH_CART': {
      const result = switchCart(parsed.cartName);
      return { ...result, action: 'SWITCH_CART' };
    }

    case 'DELETE_CART': {
      const result = deleteCart(parsed.cartName);
      return { ...result, action: 'DELETE_CART' };
    }

    case 'CLEAR_CART': {
      const result = clearCart(parsed.cartName);
      return { ...result, action: 'CLEAR_CART' };
    }

    case 'MERGE_CARTS': {
      const result = mergeCarts(parsed.sourceCart, parsed.targetCart);
      return { ...result, action: 'MERGE_CARTS' };
    }

    case 'UNDO': {
      const result = undo();
      return { ...result, action: 'UNDO' };
    }

    case 'LIST_CARTS': {
      const cartNames = Object.values(state.carts).map(c => c.name).join(', ');
      return { success: true, message: `Your carts: ${cartNames}`, action: 'LIST_CARTS', data: Object.values(state.carts) };
    }

    case 'SEARCH': {
      const results = searchItems(parsed.item);
      return {
        success: true,
        message: results.length > 0
          ? `Found "${parsed.item}" in ${results.length} cart(s).`
          : `"${parsed.item}" not found in any cart.`,
        action: 'SEARCH',
        data: results
      };
    }

    default:
      return {
        success: false,
        message: `I didn't recognize that command. Try "Add 2 bottles of milk" or "Read my cart".`,
        speechText: `I didn't recognize that command. Try saying "Add milk" or "Read my cart".`,
        action: 'UNKNOWN'
      };
  }
}

// ─── Initialize ───────────────────────────────────────────────────────────────

function initApp() {
  loadState();
  suggestionsEngine.setApiKey(state.settings.geminiApiKey);
  voiceController.setLanguage(state.settings.language);
}
