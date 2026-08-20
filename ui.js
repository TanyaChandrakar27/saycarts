/**
 * SayCarts — UI Controller & Neural Voice Engine
 * Pure Vanilla JS DOM controller with responsive multi-cart support
 */

// ─── Web Audio Sci-Fi Synthesizer (Zero External Dependencies) ───────────────
const soundFX = {
  ctx: null,
  enabled: true,

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  },

  play(type) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === 'mic-on') {
        // High-tech ascending dual frequency
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'mic-off') {
        // Descending chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(740, now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'success') {
        // Futuristic double chord
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(1046.50, now + 0.16); // C6
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'check') {
        // Crisp pop
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'click') {
        // Micro mechanical click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === 'error') {
        // Low sci-fi buzz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.setValueAtTime(110, now + 0.1);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  }
};

// ─── Text-to-Speech (TTS) Voice Engine ───────────────────────────────────────
const ttsEngine = {
  enabled: true,

  speak(text) {
    if (!this.enabled || !window.speechSynthesis || !text) return;

    try {
      window.speechSynthesis.cancel(); // Stop any overlapping utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const lang = state.settings.language || 'en-IN';
      const preferredVoice = voices.find(v =>
        (lang.startsWith('hi') && v.lang.startsWith('hi')) ||
        v.lang === 'en-IN' ||
        v.lang.includes('IN') ||
        (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('India')))
      ) || voices.find(v => v.lang.startsWith('en'));

      if (preferredVoice) utterance.voice = preferredVoice;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('[TTS] Synthesis error:', e);
    }
  },

  stop() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }
};

// ─── DOM References ───────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const $q = sel => document.querySelector(sel);

const els = {
  cartTabs:         $('cart-tabs'),
  cartName:         $('cart-name'),
  cartEmoji:        $('cart-emoji'),
  progressFill:     $('progress-fill'),
  progressLabel:    $('progress-label'),
  itemsContainer:   $('items-container'),
  statusPill:       $('status-pill'),
  statusText:       $('status-text'),
  transcriptDisplay: $('transcript-display'),
  waveform:         $('waveform'),
  micBtn:           $('mic-btn'),
  searchInput:      $('search-input'),
  clearSearch:      $('btn-clear-search'),
  langSelect:       $('lang-select'),
  toastContainer:   $('toast-container'),
  soundToggle:      $('btn-sound-toggle'),
  btnReadCart:      $('btn-read-cart'),
  hudScanline:      $('voice-hud-scanline'),
  // Modals
  modalNewCart:     $('modal-new-cart'),
  modalSettings:    $('modal-settings'),
  modalCommands:    $('modal-commands'),
  modalTypeInput:   $('modal-type-input'),
  modalMerge:       $('modal-merge'),
  modalExport:      $('modal-export'),
  // Inputs
  newCartName:      $('new-cart-name'),
  colorPicker:      $('cart-color-picker'),
  emojiPicker:      $('cart-emoji-picker'),
  settingLang:      $('setting-lang'),
  settingGemini:    $('setting-gemini'),
  typeInputField:   $('type-input-field'),
  mergeTargetSelect: $('merge-target-select'),
  exportText:       $('export-text'),
};

// ─── Temporary new-cart state ─────────────────────────────────────────────────
let newCartState = {
  color: CART_COLORS[0],
  emoji: CART_EMOJIS[0]
};

// ─── Toast System ─────────────────────────────────────────────────────────────

function showToast(message, type = 'info', duration = 3000) {
  const icons = { success: '✅', error: '❌', info: '💬' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <span class="toast-icon" aria-hidden="true">${icons[type] || '💬'}</span>
    <span>${message}</span>
  `;
  els.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ─── Status Pill ──────────────────────────────────────────────────────────────

function setStatus(text, state = 'default') {
  els.statusText.textContent = text;
  els.statusPill.className = `status-pill ${state}`;
  els.statusPill.setAttribute('aria-label', `Status: ${text}`);
}

// ─── Language Selector ────────────────────────────────────────────────────────

function renderLanguageOptions(selectEl) {
  selectEl.innerHTML = '';
  for (const lang of voiceController.getLanguages()) {
    const opt = document.createElement('option');
    opt.value = lang.code;
    opt.textContent = `${lang.flag} ${lang.label}`;
    selectEl.appendChild(opt);
  }
  selectEl.value = state.settings.language;
}

// ─── Cart Tabs ────────────────────────────────────────────────────────────────

function renderCartTabs() {
  // Remove existing tabs (keep add button)
  const addBtn = $('btn-add-cart');
  els.cartTabs.innerHTML = '';

  for (const cart of Object.values(state.carts)) {
    const isActive = cart.id === state.activeCartId;
    const stats = getCartStats(cart.id);

    const tab = document.createElement('button');
    tab.className = `cart-tab${isActive ? ' active' : ''}`;
    tab.style.setProperty('--cart-color', cart.color);
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    tab.setAttribute('aria-label', `${cart.name} cart, ${stats.total} items`);
    tab.dataset.cartId = cart.id;

    tab.innerHTML = `
      <span class="cart-tab-emoji" aria-hidden="true">${cart.emoji}</span>
      <div class="cart-tab-info">
        <span class="cart-tab-name">${escapeHtml(cart.name)}</span>
        <span class="cart-tab-count">${stats.total} item${stats.total !== 1 ? 's' : ''}</span>
      </div>
      ${Object.keys(state.carts).length > 1
        ? `<button class="cart-tab-delete" data-cart-id="${cart.id}" aria-label="Delete ${escapeHtml(cart.name)} cart" title="Delete cart">✕</button>`
        : ''}
    `;

    tab.addEventListener('click', e => {
      if (e.target.classList.contains('cart-tab-delete')) return;
      const result = switchCart(cart.id);
      if (result.success) {
        renderAll();
        tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    els.cartTabs.appendChild(tab);
  }

  els.cartTabs.appendChild(addBtn);

  // Delete cart button events
  els.cartTabs.querySelectorAll('.cart-tab-delete').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const cartId = btn.dataset.cartId;
      const cart = state.carts[cartId];
      if (!cart) return;

      if (cart.items.length > 0) {
        if (!confirm(`Delete "${cart.name}"? It has ${cart.items.length} item(s).`)) return;
      }

      const result = deleteCart(cartId);
      if (result.success) {
        showToast(result.message, 'info');
        renderAll();
      } else {
        showToast(result.message, 'error');
      }
    });
  });
}

// ─── Cart Header ──────────────────────────────────────────────────────────────

function renderCartHeader() {
  const cart = getActiveCart();
  if (!cart) return;

  const stats = getCartStats();

  els.cartName.textContent = cart.name;
  els.cartEmoji.textContent = cart.emoji;

  const pct = stats.progress;
  els.progressFill.style.width = `${pct}%`;
  els.progressFill.parentElement.setAttribute('aria-valuenow', pct);
  els.progressLabel.textContent = `${stats.checked} / ${stats.total} item${stats.total !== 1 ? 's' : ''}`;
}

// ─── Items List ───────────────────────────────────────────────────────────────

function renderItems(searchQuery = '') {
  const cart = getActiveCart();
  if (!cart) return;

  els.itemsContainer.innerHTML = '';

  const groups = getGroupedItems();

  // Filter by search
  const filtered = {};
  const lowerQuery = searchQuery.toLowerCase();
  for (const [catName, group] of Object.entries(groups)) {
    const items = lowerQuery
      ? group.items.filter(i => i.name.toLowerCase().includes(lowerQuery))
      : group.items;
    if (items.length > 0) {
      filtered[catName] = { ...group, items };
    }
  }

  if (Object.keys(filtered).length === 0) {
    els.itemsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">${searchQuery ? '🔍' : '🛒'}</div>
        <h3>${searchQuery ? `No results for "${searchQuery}"` : 'Cart is empty'}</h3>
        <p>${searchQuery ? 'Try a different search.' : 'Add items using voice or the keyboard.'}</p>
        ${!searchQuery ? `
          <button class="empty-state-hint" id="empty-hint-btn">
            🎤 Say "Add milk" to start
          </button>
        ` : ''}
      </div>
    `;

    const hintBtn = $('empty-hint-btn');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => voiceController.startListening());
    }
    return;
  }

  for (const [catName, group] of Object.entries(filtered)) {
    const groupEl = document.createElement('div');
    groupEl.className = 'category-group';
    groupEl.setAttribute('role', 'group');
    groupEl.setAttribute('aria-label', `${catName} category`);

    groupEl.innerHTML = `
      <div class="category-header">
        <div class="category-dot" style="background:${group.color}" aria-hidden="true"></div>
        <span class="category-name">${group.emoji || ''} ${catName}</span>
        <span class="category-count" aria-label="${group.items.length} items">${group.items.length}</span>
      </div>
    `;

    for (const item of group.items) {
      groupEl.appendChild(createItemCard(item, cart.id));
    }

    els.itemsContainer.appendChild(groupEl);
  }
}

function createItemCard(item, cartId) {
  const card = document.createElement('div');
  card.className = `item-card${item.checked ? ' checked' : ''}`;
  card.style.setProperty('--item-color', item.category?.color || 'transparent');
  card.dataset.itemId = item.id;
  card.setAttribute('role', 'listitem');

  const unitLabel = item.unit ? ` ${item.unit}` : '';

  card.innerHTML = `
    <button class="item-checkbox" aria-label="${item.checked ? 'Uncheck' : 'Check'} ${item.name}" aria-pressed="${item.checked}">
      ${item.checked ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
    </button>
    <div class="item-info">
      <div class="item-name">${escapeHtml(item.name)}</div>
      <div class="item-meta">
        <span class="item-category-badge" style="background:${item.category?.color}22;color:${item.category?.color}">
          ${item.category?.emoji || ''} ${item.category?.name || 'Other'}
        </span>
        ${item.note ? `<span>· ${escapeHtml(item.note)}</span>` : ''}
      </div>
    </div>
    <div class="item-qty-controls">
      <button class="qty-btn qty-minus" aria-label="Decrease quantity of ${item.name}">−</button>
      <span class="qty-value" aria-label="${item.quantity}${unitLabel}">${item.quantity}${unitLabel ? `<span style="font-size:10px;color:var(--text-muted)"> ${item.unit}</span>` : ''}</span>
      <button class="qty-btn qty-plus" aria-label="Increase quantity of ${item.name}">+</button>
    </div>
    <button class="item-delete-btn" aria-label="Remove ${item.name} from cart">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
      </svg>
    </button>
  `;

  // Checkbox toggle
  card.querySelector('.item-checkbox').addEventListener('click', () => {
    soundFX.play('check');
    const result = checkItem(item.id, cartId);
    if (result.success) {
      renderAll();
      showToast(result.message, 'success', 1800);
    }
  });

  // Quantity controls
  card.querySelector('.qty-minus').addEventListener('click', () => {
    soundFX.play('click');
    const result = updateItemQty(item.id, item.quantity - 1, cartId);
    if (result.success) renderAll();
  });

  card.querySelector('.qty-plus').addEventListener('click', () => {
    soundFX.play('click');
    const result = updateItemQty(item.id, item.quantity + 1, cartId);
    if (result.success) renderAll();
  });

  // Delete
  card.querySelector('.item-delete-btn').addEventListener('click', () => {
    soundFX.play('click');
    const result = removeItem(item.id, cartId);
    if (result.success) {
      showToast(result.message, 'info', 2000);
      renderAll();
      refreshSuggestions();
    }
  });

  return card;
}

// ─── Suggestions Panel ────────────────────────────────────────────────────────

async function refreshSuggestions() {
  const cart = getActiveCart();
  if (!cart) return;

  const data = await suggestionsEngine.getSuggestions(
    cart.items,
    state.carts,
    cart.name
  );

  // AI / Frequent suggestions
  renderSuggestionChips('ai-suggestions-content', data.aiSuggestions || data.history, '+ Add');
  renderSuggestionChips('seasonal-content', data.seasonal, '+ Add');
  renderSuggestionChips('frequent-content', data.frequent, '+ Add');

  // Substitutes
  const subContainer = $('substitutes-content');
  const subCard = $('substitutes-card');
  if (Object.keys(data.substitutes).length > 0) {
    subCard.classList.remove('hidden');
    subContainer.innerHTML = '';
    for (const [itemName, alts] of Object.entries(data.substitutes)) {
      const row = document.createElement('div');
      row.className = 'substitute-item';
      row.innerHTML = `
        <span class="substitute-item-name">${escapeHtml(itemName)}</span>
        <div class="substitute-item-alts">
          ${alts.map(a => `<span class="suggestion-chip" style="font-size:11px;padding:3px 8px;" tabindex="0" role="button" aria-label="Add ${a}">${a}</span>`).join('')}
        </div>
      `;
      row.querySelectorAll('.suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const result = addItem(chip.textContent.trim());
          if (result.success) {
            showToast(result.message, 'success');
            renderAll();
            refreshSuggestions();
          }
        });
      });
      subContainer.appendChild(row);
    }
  } else {
    subCard.classList.add('hidden');
  }
}

function renderSuggestionChips(containerId, items, btnLabel = '+') {
  const container = $(containerId);
  if (!container) return;
  if (!items || items.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:12px;">No suggestions yet.</p>';
    return;
  }
  container.innerHTML = '';
  const existingNames = new Set((getActiveCart()?.items || []).map(i => i.name.toLowerCase()));

  for (const item of items) {
    if (existingNames.has(item.toLowerCase())) continue;
    const chip = document.createElement('button');
    chip.className = 'suggestion-chip';
    chip.setAttribute('aria-label', `Add ${item} to cart`);
    chip.textContent = `${btnLabel} ${item}`;
    chip.addEventListener('click', () => {
      const result = addItem(item);
      if (result.success) {
        showToast(result.message, 'success', 2000);
        chip.style.opacity = '0.4';
        chip.disabled = true;
        renderAll();
        refreshSuggestions();
      }
    });
    container.appendChild(chip);
  }

  if (container.children.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:12px;">All suggestions already in cart!</p>';
  }
}

// ─── Full Render ──────────────────────────────────────────────────────────────

function renderAll(searchQuery = els.searchInput.value) {
  renderCartTabs();
  renderCartHeader();
  renderItems(searchQuery);
}

// ─── Modal Management ─────────────────────────────────────────────────────────

function openModal(id) {
  const modal = $(id);
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.querySelector('[autofocus], input, select, textarea, button')?.focus();
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const modal = $(id);
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

// Close button handling
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.close));
});

// ESC key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(m => closeModal(m.id));
  }
});

// ─── New Cart Modal ───────────────────────────────────────────────────────────

function initColorPicker() {
  els.colorPicker.innerHTML = '';
  CART_COLORS.forEach((color, i) => {
    const swatch = document.createElement('button');
    swatch.className = `color-swatch${i === 0 ? ' selected' : ''}`;
    swatch.style.background = color;
    swatch.setAttribute('aria-label', `Cart color ${color}`);
    swatch.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    swatch.addEventListener('click', () => {
      els.colorPicker.querySelectorAll('.color-swatch').forEach(s => {
        s.classList.remove('selected');
        s.setAttribute('aria-pressed', 'false');
      });
      swatch.classList.add('selected');
      swatch.setAttribute('aria-pressed', 'true');
      newCartState.color = color;
    });
    els.colorPicker.appendChild(swatch);
  });
}

function initEmojiPicker() {
  els.emojiPicker.innerHTML = '';
  CART_EMOJIS.forEach((emoji, i) => {
    const swatch = document.createElement('button');
    swatch.className = `emoji-swatch${i === 0 ? ' selected' : ''}`;
    swatch.textContent = emoji;
    swatch.setAttribute('aria-label', `Cart emoji ${emoji}`);
    swatch.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    swatch.addEventListener('click', () => {
      els.emojiPicker.querySelectorAll('.emoji-swatch').forEach(s => {
        s.classList.remove('selected');
        s.setAttribute('aria-pressed', 'false');
      });
      swatch.classList.add('selected');
      swatch.setAttribute('aria-pressed', 'true');
      newCartState.emoji = emoji;
    });
    els.emojiPicker.appendChild(swatch);
  });
}

$('btn-add-cart').addEventListener('click', () => {
  newCartState = { color: CART_COLORS[getCartCount() % CART_COLORS.length], emoji: CART_EMOJIS[getCartCount() % CART_EMOJIS.length] };
  initColorPicker();
  initEmojiPicker();
  els.newCartName.value = '';
  openModal('modal-new-cart');
  setTimeout(() => els.newCartName.focus(), 100);
});

$('btn-create-cart-confirm').addEventListener('click', () => {
  const name = els.newCartName.value.trim();
  if (!name) { els.newCartName.focus(); return; }

  const result = createCart(name);
  // Apply custom color/emoji
  if (result.cart) {
    result.cart.color = newCartState.color;
    result.cart.emoji = newCartState.emoji;
    saveState();
  }

  closeModal('modal-new-cart');
  showToast(result.message, result.success ? 'success' : 'info');
  renderAll();
  refreshSuggestions();
});

els.newCartName.addEventListener('keydown', e => {
  if (e.key === 'Enter') $('btn-create-cart-confirm').click();
});

// ─── Settings Modal ───────────────────────────────────────────────────────────

$('btn-settings').addEventListener('click', () => {
  renderLanguageOptions(els.settingLang);
  els.settingLang.value = state.settings.language;
  els.settingGemini.value = state.settings.geminiApiKey || '';
  openModal('modal-settings');
});

$('btn-save-settings').addEventListener('click', () => {
  updateSettings({
    language: els.settingLang.value,
    geminiApiKey: els.settingGemini.value.trim()
  });
  voiceController.setLanguage(state.settings.language);
  els.langSelect.value = state.settings.language;
  closeModal('modal-settings');
  showToast('Settings saved!', 'success');
});

// ─── Commands Modal ───────────────────────────────────────────────────────────

$('btn-commands').addEventListener('click', () => openModal('modal-commands'));

// ─── Export Modal ─────────────────────────────────────────────────────────────

$('btn-export').addEventListener('click', () => {
  els.exportText.value = exportCart();
  openModal('modal-export');
});

$('btn-copy-export').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(els.exportText.value);
    showToast('Copied to clipboard!', 'success');
  } catch {
    els.exportText.select();
    document.execCommand('copy');
    showToast('Copied!', 'success');
  }
});

// ─── Merge Modal ──────────────────────────────────────────────────────────────

$('btn-merge-cart').addEventListener('click', () => {
  const active = getActiveCart();
  if (!active) return;

  $('merge-source-name').textContent = active.name;
  els.mergeTargetSelect.innerHTML = '';

  Object.values(state.carts).forEach(cart => {
    if (cart.id === active.id) return;
    const opt = document.createElement('option');
    opt.value = cart.id;
    opt.textContent = `${cart.emoji} ${cart.name}`;
    els.mergeTargetSelect.appendChild(opt);
  });

  if (els.mergeTargetSelect.options.length === 0) {
    showToast('You need at least 2 carts to merge.', 'info');
    return;
  }

  openModal('modal-merge');
});

$('btn-confirm-merge').addEventListener('click', () => {
  const active = getActiveCart();
  const targetId = els.mergeTargetSelect.value;
  if (!active || !targetId) return;

  const result = mergeCarts(active.id, targetId);
  closeModal('modal-merge');
  showToast(result.message, result.success ? 'success' : 'error');
  if (result.success) renderAll();
});

// ─── Type Input Modal ─────────────────────────────────────────────────────────

$('btn-type-input').addEventListener('click', () => {
  els.typeInputField.value = '';
  openModal('modal-type-input');
  setTimeout(() => els.typeInputField.focus(), 100);
});

$('btn-submit-type-input').addEventListener('click', () => {
  const text = els.typeInputField.value.trim();
  if (!text) return;

  const parsed = voiceController.parseText(text);
  const result = handleVoiceIntent(parsed);

  closeModal('modal-type-input');
  showToast(result.message, result.success ? 'success' : 'error');
  if (result.success && ['ADD_ITEM','REMOVE_ITEM','CHECK_ITEM','ADD_TO_CART','CREATE_CART','SWITCH_CART','DELETE_CART','CLEAR_CART','MERGE_CARTS','UNDO'].includes(result.action)) {
    renderAll();
    refreshSuggestions();
  }
});

els.typeInputField.addEventListener('keydown', e => {
  if (e.key === 'Enter') $('btn-submit-type-input').click();
});

// ─── Clear Cart ───────────────────────────────────────────────────────────────

$('btn-clear-cart').addEventListener('click', () => {
  const cart = getActiveCart();
  if (!cart || cart.items.length === 0) { showToast('Cart is already empty.', 'info'); return; }
  if (confirm(`Clear all ${cart.items.length} item(s) from "${cart.name}"?`)) {
    const result = clearCart();
    showToast(result.message, 'info');
    renderAll();
    refreshSuggestions();
  }
});

// ─── Search ───────────────────────────────────────────────────────────────────

els.searchInput.addEventListener('input', e => {
  const query = e.target.value;
  els.clearSearch.classList.toggle('hidden', !query);
  renderItems(query);
});

els.clearSearch.addEventListener('click', () => {
  els.searchInput.value = '';
  els.clearSearch.classList.add('hidden');
  renderItems('');
  els.searchInput.focus();
});

// ─── Language Selector ────────────────────────────────────────────────────────

renderLanguageOptions(els.langSelect);

els.langSelect.addEventListener('change', e => {
  voiceController.setLanguage(e.target.value);
  updateSettings({ language: e.target.value });
});

// ─── Sound FX Toggle ─────────────────────────────────────────────────────────
if (els.soundToggle) {
  els.soundToggle.addEventListener('click', () => {
    soundFX.enabled = !soundFX.enabled;
    els.soundToggle.textContent = soundFX.enabled ? '🔊' : '🔇';
    els.soundToggle.setAttribute('aria-label', soundFX.enabled ? 'Sound Effects Enabled' : 'Sound Effects Muted');
    showToast(soundFX.enabled ? 'Sound FX Enabled' : 'Sound FX Muted', 'info', 1500);
    if (soundFX.enabled) soundFX.play('click');
  });
}

// ─── Voice Controller Events ──────────────────────────────────────────────────

voiceController.onStart = () => {
  ttsEngine.stop(); // Stop any pending speech so mic does not hear computer speech
  soundFX.play('mic-on');
  els.micBtn.classList.add('listening');
  els.micBtn.setAttribute('aria-pressed', 'true');
  els.micBtn.setAttribute('aria-label', 'Stop listening');
  els.waveform.classList.add('listening');
  setStatus('Listening...', 'listening');
  els.transcriptDisplay.textContent = 'Listening to your command...';
};

// ─── Read Cart Aloud Button ───────────────────────────────────────────────────
if (els.btnReadCart) {
  els.btnReadCart.addEventListener('click', () => {
    soundFX.init();
    const result = readCartAloud();
    showToast(result.message, 'info', 4000);
    ttsEngine.speak(result.speechText || result.message);
  });
}

voiceController.onInterim = (text) => {
  els.transcriptDisplay.textContent = `"${text}"`;
};

voiceController.onEnd = () => {
  soundFX.play('mic-off');
  els.micBtn.classList.remove('listening');
  els.micBtn.setAttribute('aria-pressed', 'false');
  els.micBtn.setAttribute('aria-label', 'Start voice command');
  els.waveform.classList.remove('listening');

  setTimeout(() => {
    setStatus('Ready', 'default');
    els.transcriptDisplay.textContent = 'Tap the microphone or press Space to speak...';
  }, 2000);
};

voiceController.onError = (msg) => {
  soundFX.play('error');
  setStatus('Error', 'error');
  showToast(msg, 'error');
  els.micBtn.classList.remove('listening');
  els.waveform.classList.remove('listening');
};

voiceController.onResult = (parsed, transcript) => {
  setStatus('Processing...', 'processing');
  els.transcriptDisplay.textContent = `"${transcript}"`;

  // Small delay for UX - shows transcript before processing
  setTimeout(() => {
    const result = handleVoiceIntent(parsed);

    if (result.success) {
      soundFX.play('success');
      setStatus('Ready', 'success');
      showToast(result.message, 'success');
    } else {
      soundFX.play('error');
      setStatus('Error', 'error');
      showToast(result.message, 'error', 4000);
    }

    if (['ADD_ITEM','REMOVE_ITEM','CHECK_ITEM','ADD_TO_CART',
         'CREATE_CART','SWITCH_CART','DELETE_CART','CLEAR_CART',
         'MERGE_CARTS','UNDO'].includes(result.action)) {
      renderAll();
      refreshSuggestions();
    }
  }, 300);
};

// ─── Mic Button ───────────────────────────────────────────────────────────────

els.micBtn.addEventListener('click', () => {
  soundFX.init();
  if (!voiceController.isSupported) {
    showToast('Voice recognition not supported. Please use Chrome or Edge browser.', 'error', 5000);
    return;
  }
  voiceController.startListening();
});

// Keyboard shortcut: Space to toggle mic (when not in input)
document.addEventListener('keydown', e => {
  if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
    e.preventDefault();
    els.micBtn.click();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault();
    const result = undo();
    soundFX.play('click');
    showToast(result.message, result.success ? 'success' : 'info');
    renderAll();
  }
});

// ─── Utility ──────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ─── PWA Install ──────────────────────────────────────────────────────────────

let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredInstallPrompt = e;

  // Show subtle install banner after 3s if not installed
  setTimeout(() => {
    showToast('📱 Install SayCarts as an app for the best experience!', 'info', 8000);
  }, 3000);
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  showToast('SayCarts installed! 🎉', 'success');
});

// ─── Service Worker Registration ──────────────────────────────────────────────

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('[SW] Registered:', reg.scope))
      .catch(err => console.warn('[SW] Registration failed:', err));
  });
}

// ─── Browse Panel State ───────────────────────────────────────────────────────

let browseState = {
  query: '',
  category: '',
  maxPrice: null,
  sort: 'popular'
};

// ─── View Tab Switching ───────────────────────────────────────────────────────

function switchView(view) {
  const listPanel   = document.querySelector('.main-layout');
  const browsePanel = $('browse-panel');
  const tabList     = $('tab-list');
  const tabBrowse   = $('tab-browse');

  if (view === 'browse') {
    listPanel.classList.add('hidden');
    browsePanel.classList.remove('hidden');
    tabList.classList.remove('active');
    tabList.setAttribute('aria-selected', 'false');
    tabBrowse.classList.add('active');
    tabBrowse.setAttribute('aria-selected', 'true');
    renderBrowsePanel();
  } else {
    browsePanel.classList.add('hidden');
    listPanel.classList.remove('hidden');
    tabBrowse.classList.remove('active');
    tabBrowse.setAttribute('aria-selected', 'false');
    tabList.classList.add('active');
    tabList.setAttribute('aria-selected', 'true');
  }
}

$('tab-list').addEventListener('click',   () => switchView('list'));
$('tab-browse').addEventListener('click', () => switchView('browse'));

// ─── Browse Panel Rendering ───────────────────────────────────────────────────

function renderBrowsePanel() {
  renderCategoryPills();
  renderProductGrid();
}

function renderCategoryPills() {
  const wrap = document.querySelector('.browse-categories-wrap');
  wrap.innerHTML = '';

  // All pill
  const allPill = document.createElement('button');
  allPill.className = `category-pill${browseState.category === '' ? ' active' : ''}`;
  allPill.textContent = '🛒 All Products';
  allPill.dataset.cat = '';
  allPill.setAttribute('aria-pressed', browseState.category === '' ? 'true' : 'false');
  allPill.addEventListener('click', () => { browseState.category = ''; renderBrowsePanel(); });
  wrap.appendChild(allPill);

  // Category-specific pills from products data
  for (const cat of getProductCategories()) {
    const catInfo = Object.values(CATEGORIES).find(c => {
      // Match by checking if keywords array contains something in the category name
      return cat.toLowerCase().includes(c.keywords?.[0]?.split(' ')?.[0] || '');
    });

    // Get emoji from CATEGORIES or fallback
    const catEmoji = {
      'Dairy & Eggs': '🥛', 'Produce': '🥦', 'Meat & Seafood': '🥩',
      'Bakery & Bread': '🍞', 'Beverages': '🥤', 'Snacks': '🍿',
      'Frozen Foods': '🧊', 'Canned & Packaged': '🥫', 'Pasta & Grains': '🍝',
      'Condiments & Spices': '🧂', 'Household': '🏠', 'Personal Care': '🧴'
    }[cat] || '📦';

    const pill = document.createElement('button');
    pill.className = `category-pill${browseState.category === cat ? ' active' : ''}`;
    pill.textContent = `${catEmoji} ${cat}`;
    pill.dataset.cat = cat;
    pill.setAttribute('aria-pressed', browseState.category === cat ? 'true' : 'false');
    pill.addEventListener('click', () => {
      browseState.category = browseState.category === cat ? '' : cat;
      renderBrowsePanel();
    });
    wrap.appendChild(pill);
  }
}

function renderProductGrid() {
  const grid = $('product-grid');
  const countEl = $('browse-count');
  grid.innerHTML = '';

  // Filter
  let results = searchProducts(browseState.query, browseState.category || null, browseState.maxPrice);

  // Sort
  switch (browseState.sort) {
    case 'price-asc':  results.sort((a, b) => a.price - b.price); break;
    case 'price-desc': results.sort((a, b) => b.price - a.price); break;
    case 'rating':     results.sort((a, b) => b.rating - a.rating); break;
    case 'name':       results.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'popular':
    default:           results.sort((a, b) => (b.rating * Math.log10(b.reviews)) - (a.rating * Math.log10(a.reviews))); break;
  }

  // Update count
  const priceStr = browseState.maxPrice ? ` under ₹${browseState.maxPrice}` : '';
  const catStr = browseState.category ? ` in ${browseState.category}` : '';
  countEl.textContent = `${results.length} product${results.length !== 1 ? 's' : ''}${catStr}${priceStr}`;

  if (results.length === 0) {
    grid.innerHTML = `
      <div class="browse-empty">
        <div style="font-size:48px">🔍</div>
        <h3 style="font-size:18px;font-weight:700">No products found</h3>
        <p style="color:var(--text-muted);font-size:14px">Try a different search or remove the price filter.</p>
      </div>`;
    return;
  }

  for (const product of results) {
    grid.appendChild(createProductCard(product));
  }
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.style.setProperty('--product-color', product.color);
  card.setAttribute('role', 'listitem');
  card.setAttribute('aria-label', `${product.name} by ${product.brand}, ₹${product.price}`);

  const priceValue = Math.round(product.price);
  const stars = getStars(product.rating);
  const reviewsLabel = product.reviews >= 1000
    ? `${(product.reviews / 1000).toFixed(1)}k`
    : product.reviews;

  card.innerHTML = `
    <div class="product-emoji-wrap" style="background:linear-gradient(135deg, ${product.color}22, ${product.color}08)">
      <span class="product-emoji" aria-hidden="true">${product.emoji}</span>
    </div>
    <div class="product-info">
      <div class="product-brand">${escapeHtml(product.brand)}</div>
      <div class="product-name">${escapeHtml(product.name)}</div>
      <div class="product-size">${escapeHtml(product.size)}</div>
      <div class="product-rating">
        <span class="product-stars" aria-hidden="true">${stars}</span>
        <span class="product-rating-num">${product.rating} (${reviewsLabel})</span>
      </div>
      <div class="product-price-row">
        <div class="product-price">
          <span class="product-price-cents">₹</span>${priceValue}
        </div>
        <button class="product-add-btn" aria-label="Add ${product.name} to cart">
          + Add
        </button>
      </div>
    </div>
  `;

  // Add to Cart logic — if one cart, add immediately; if multiple, show picker
  card.querySelector('.product-add-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const carts = Object.values(state.carts);
    if (carts.length === 1) {
      doAddProductToCart(product, carts[0].id, card);
    } else {
      showCartPicker(card, product);
    }
  });

  return card;
}

function showCartPicker(card, product) {
  // Remove any existing picker
  card.querySelector('.product-cart-pick')?.remove();

  const picker = document.createElement('div');
  picker.className = 'product-cart-pick';
  picker.innerHTML = `<p>Add "${escapeHtml(product.name)}" to:</p>`;

  for (const cart of Object.values(state.carts)) {
    const btn = document.createElement('button');
    btn.className = 'product-cart-pick-btn';
    btn.innerHTML = `<span aria-hidden="true">${cart.emoji}</span> ${escapeHtml(cart.name)}`;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      picker.remove();
      doAddProductToCart(product, cart.id, card);
    });
    picker.appendChild(btn);
  }

  const cancel = document.createElement('button');
  cancel.className = 'product-cart-pick-cancel';
  cancel.textContent = 'Cancel';
  cancel.addEventListener('click', (e) => { e.stopPropagation(); picker.remove(); });
  picker.appendChild(cancel);

  card.appendChild(picker);
}

function doAddProductToCart(product, cartId, card) {
  const result = addItem(product.name, 1, null, cartId);
  if (result.success) {
    const btn = card.querySelector('.product-add-btn');
    if (btn) {
      btn.textContent = '✓ Added';
      btn.classList.add('added');
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = '+ Add';
        btn.classList.remove('added');
        btn.disabled = false;
      }, 2000);
    }
    // Update tab counter
    renderCartTabs();
    showToast(result.message, 'success', 2500);
    ttsEngine.speak(result.speechText || result.message);
  } else {
    showToast(result.message, 'error');
    ttsEngine.speak(result.speechText || result.message);
  }
}

function getStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

// ─── Browse Search & Filters ──────────────────────────────────────────────────

const browseSearchInput = $('browse-search-input');
const clearBrowseSearch = $('btn-clear-browse-search');
const priceBadge        = $('browse-price-badge');
const priceLabel        = $('browse-price-label');
const clearPrice        = $('btn-clear-price');
const browseSort        = $('browse-sort');

browseSearchInput.addEventListener('input', e => {
  browseState.query = e.target.value;
  clearBrowseSearch.classList.toggle('hidden', !e.target.value);
  renderProductGrid();
});

clearBrowseSearch.addEventListener('click', () => {
  browseSearchInput.value = '';
  browseState.query = '';
  clearBrowseSearch.classList.add('hidden');
  renderProductGrid();
  browseSearchInput.focus();
});

clearPrice.addEventListener('click', () => {
  browseState.maxPrice = null;
  priceBadge.classList.add('hidden');
  renderProductGrid();
});

browseSort.addEventListener('change', e => {
  browseState.sort = e.target.value;
  renderProductGrid();
});

/**
 * Trigger browse panel search from voice command
 * @param {string} query - Search query
 * @param {number|null} maxPrice - Optional price ceiling
 */
function voiceTriggerBrowse(query, maxPrice = null) {
  browseState.query = query;
  browseState.maxPrice = maxPrice;
  browseState.category = '';

  if (maxPrice !== null) {
    priceBadge.classList.remove('hidden');
    priceLabel.textContent = `Under ₹${maxPrice}`;
  } else {
    priceBadge.classList.add('hidden');
  }

  browseSearchInput.value = query;
  clearBrowseSearch.classList.toggle('hidden', !query);
  switchView('browse');
}

// ─── Patch voice result handler to route SEARCH to Browse panel ───────────────

const _origOnResult = voiceController.onResult;
voiceController.onResult = (parsed, transcript) => {
  setStatus('Processing…', 'processing');
  els.transcriptDisplay.textContent = `"${transcript}"`;

  setTimeout(() => {
    if (parsed.intent === 'SEARCH') {
      // Extract price from transcript: "under 100 rupees", "below ₹200", "less than 50"
      const priceMatch = transcript.match(/(?:under|below|less than|cheaper than|max|no more than)\s*(?:₹|rs\.?|rupees?)?\s*(\d+(?:\.\d+)?)/i);
      const maxPrice = priceMatch ? parseFloat(priceMatch[1]) : null;
      const query = parsed.item || '';

      voiceTriggerBrowse(query, maxPrice);
      setStatus('Showing results', 'success');
      const msg = maxPrice
        ? `Showing "${query}" under ₹${maxPrice}`
        : `Searching for "${query}"`;
      showToast(msg, 'info', 3000);
      return;
    }

    const result = handleVoiceIntent(parsed);

    if (result.success) {
      soundFX.play('success');
      setStatus('Done', 'success');
      showToast(result.message, 'success');
      ttsEngine.speak(result.speechText || result.message);
    } else {
      soundFX.play('error');
      setStatus('Hmm…', 'error');
      showToast(result.message, 'error', 4000);
      ttsEngine.speak(result.speechText || result.message);
    }

    if (['ADD_ITEM','REMOVE_ITEM','CHECK_ITEM','ADD_TO_CART',
         'CREATE_CART','SWITCH_CART','DELETE_CART','CLEAR_CART',
         'MERGE_CARTS','UNDO','READ_CART'].includes(result.action)) {
      renderAll();
      refreshSuggestions();
    }
  }, 300);
};

// ─── Boot ─────────────────────────────────────────────────────────────────────

(function boot() {
  initApp();
  renderAll();
  refreshSuggestions();

  // Show welcome toast if first visit
  if (!localStorage.getItem('saycarts_visited') && !localStorage.getItem('voicecart_visited')) {
    localStorage.setItem('saycarts_visited', '1');
    setTimeout(() => {
      showToast('🎤 Welcome to SayCarts! Tap 💡 to see voice commands.', 'info', 5000);
    }, 1000);
  }

  console.log('%c🛒 SayCarts loaded successfully', 'color:#7c3aed;font-weight:bold;font-size:14px');
  console.log('%cTip: Press Space to toggle the mic! Browse tab = product catalog.', 'color:#06b6d4;font-size:12px');
})();
