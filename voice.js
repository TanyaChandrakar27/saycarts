/**
 * SayCarts — Voice Recognition & NLP Engine
 * Wraps Web Speech API with a comprehensive natural language parser
 * Supports 20+ intent patterns across 6 languages
 */

// ─── Constants ───────────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: 'en-US', label: 'English', flag: '🇺🇸' },
  { code: 'es-ES', label: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', label: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'hi-IN', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'zh-CN', label: '中文', flag: '🇨🇳' },
  { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
  { code: 'ar-SA', label: 'العربية', flag: '🇸🇦' }
];

// Number words → numeric values
const NUMBER_WORDS = {
  'a': 1, 'an': 1, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
  'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
  'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
  'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20,
  'a dozen': 12, 'dozen': 12, 'half dozen': 6, 'a couple': 2, 'couple': 2,
  'a few': 3, 'few': 3, 'several': 4, 'some': 2, 'many': 5, 'lots': 6,
  'a pack': 1, 'pack': 1, 'a box': 1, 'box': 1, 'a bag': 1, 'bag': 1
};

// Unit synonyms → canonical form
const UNIT_NORMALIZATIONS = {
  'bottle': 'bottle', 'bottles': 'bottle', 'btl': 'bottle',
  'can': 'can', 'cans': 'can',
  'bag': 'bag', 'bags': 'bag',
  'box': 'box', 'boxes': 'box',
  'pack': 'pack', 'packs': 'pack', 'package': 'pack', 'packages': 'pack',
  'liter': 'liter', 'liters': 'liter', 'litre': 'liter', 'litres': 'liter',
  'gallon': 'gallon', 'gallons': 'gallon',
  'dozen': 'dozen', 'doz': 'dozen',
  'pound': 'pound', 'pounds': 'pound', 'lb': 'pound', 'lbs': 'pound',
  'ounce': 'oz', 'ounces': 'oz', 'oz': 'oz',
  'gram': 'gram', 'grams': 'gram', 'g': 'gram', 'kg': 'kg', 'kilogram': 'kg',
  'piece': 'piece', 'pieces': 'piece', 'pc': 'piece',
  'bunch': 'bunch', 'bunches': 'bunch',
  'jar': 'jar', 'jars': 'jar',
  'tube': 'tube', 'tubes': 'tube',
  'roll': 'roll', 'rolls': 'roll',
  'carton': 'carton', 'cartons': 'carton',
  'loaf': 'loaf', 'loaves': 'loaf',
  'bar': 'bar', 'bars': 'bar',
  'head': 'head', 'heads': 'head', 'clove': 'clove', 'cloves': 'clove',
  'stalk': 'stalk', 'stalks': 'stalk', 'sprig': 'sprig', 'sprigs': 'sprig',
  'slice': 'slice', 'slices': 'slice', 'strip': 'strip', 'strips': 'strip',
  'cup': 'cup', 'cups': 'cup', 'tbsp': 'tbsp', 'tsp': 'tsp'
};

// ─── NLP Parser ──────────────────────────────────────────────────────────────

class NLPParser {
  constructor() {
    // Compiled intent patterns ordered by priority (most specific first)
    this.patterns = [
      // ── UNDO ──
      { intent: 'UNDO', patterns: [
        /^(undo|undo that|cancel that|go back|never mind|nevermind|take that back|revert)$/i
      ]},

      // ── LIST CARTS ──
      { intent: 'LIST_CARTS', patterns: [
        /^(show all carts?|list (my |all |)?carts?|what carts? do i have|my carts?|show carts?)$/i
      ]},

      // ── READ CART (TTS Voice Readback) ──
      { intent: 'READ_CART', patterns: [
        /^(?:read|speak|tell me|what is|what's|check)(?: out)?(?: my| the| all)?\s*(?:cart|shopping list|items|list)?$/i,
        /^(?:what(?:'s| is) (?:left|in|on|remaining in)(?: my| the)?(?: cart| list)?)$/i,
        /^(?:what do i (?:need to |have to )?buy)$/i,
        /^(?:read|read out|speak|tell me)(?: my| the)?\s+(.+?)\s+(?:cart|list)$/i,
        /^(?:mera|meri)?\s*(?:cart|list|saman)\s*(?:padho|batao|kya hai)$/i,
        /^(?:cart|list)\s*(?:padh ke batao|padho|me kya bacha hai)$/i
      ]},

      // ── CREATE CART ──
      { intent: 'CREATE_CART', patterns: [
        /(?:create|make|add|start|open)(?: a| an| new)? cart (?:called|named|for)?\s+(.+)/i,
        /new cart\s+(.+)/i,
        /(?:create|make|start)(?: a| an)?\s+(.+?)\s+(?:cart|list)$/i,
        /(?:add|create)\s+(.+?)\s+(?:cart|list)$/i
      ]},

      // ── DELETE CART ──
      { intent: 'DELETE_CART', patterns: [
        /(?:delete|remove|erase|get rid of)(?: the)?\s+(.+?)\s+(?:cart|list)$/i,
        /(?:delete|remove)\s+cart\s+(.+)/i
      ]},

      // ── CLEAR CART ──
      { intent: 'CLEAR_CART', patterns: [
        /(?:clear|empty|reset)(?: the| my)?\s+(.+?)\s+(?:cart|list)$/i,
        /(?:clear|empty|reset)(?: the| my| all)?\s*(?:cart|list)?$/i,
        /^start over$/i
      ]},

      // ── SWITCH CART ──
      { intent: 'SWITCH_CART', patterns: [
        /(?:switch to|open|go to|change to|use|view|show)(?: my)?\s+(.+?)\s*(?:cart|list)?$/i,
        /(?:use|select)(?: the)?\s+(.+?)\s+(?:cart|list)$/i
      ]},

      // ── MERGE CARTS ──
      { intent: 'MERGE_CARTS', patterns: [
        /merge\s+(.+?)\s+(?:into|with|and)\s+(.+?)(?:\s+cart|\s+list)?$/i,
        /combine\s+(.+?)\s+(?:and|with)\s+(.+?)(?:\s+cart|\s+list)?$/i
      ]},

      // ── CHECK ITEM (mark done) ──
      { intent: 'CHECK_ITEM', patterns: [
        /(?:check off?|mark|tick)\s+(.+?)(?:\s+(?:as|off|done|complete|bought|gotten|purchased))?$/i,
        /(?:got|bought|purchased|picked up|done with)\s+(.+)/i,
        /(.+?)\s+(?:is done|is complete|is finished|is bought|is checked)$/i
      ]},

      // ── REMOVE ITEM ──
      { intent: 'REMOVE_ITEM', patterns: [
        /(?:remove|delete|take off|scratch|cross off|cancel)\s+(.+?)(?:\s+(?:from|off|the list|my list))?$/i,
        /(?:i don't need|i do not need|drop|forget)\s+(?:the\s+)?(.+)/i,
        /no\s+(?:more\s+)?(.+)/i
      ]},

      // ── SEARCH ──
      { intent: 'SEARCH', patterns: [
        /(?:find|search for?|look for|search|look up|show me)\s+(.+)/i,
        /(?:where is|where can i find|do you have)\s+(.+)/i
      ]},

      // ── ADD TO SPECIFIC CART ──
      { intent: 'ADD_TO_CART', patterns: [
        /(?:add|put)\s+(.+?)\s+(?:to|in|into)(?: my)?\s+(.+?)\s*(?:cart|list)$/i,
        /(?:add|put)\s+(.+?)\s+(?:to|in|into)\s+(.+)/i
      ]},

      // ── ADD ITEM ──
      { intent: 'ADD_ITEM', patterns: [
        /(?:add|buy|get|grab|pick up|put|include|take)\s+(.+)/i,
        /(?:i need|we need|i want|we want|i'd like|i would like)\s+(?:some\s+|more\s+|a\s+|an\s+)?(.+)/i,
        /(?:please add|please get|please buy)\s+(.+)/i,
        /(?:can you add|can you get|could you add)\s+(.+)/i,
        /(?:remember to buy|remember to get|remind me to buy)\s+(.+)/i,
        /(.+?)\s+(?:daalo|daal do|add karo|add kar do|chahiye|khareedna hai|le aao|laana hai|lena hai)$/i,
        /^(\d+(?:\.\d+)?|\b(?:one|two|three|four|five|six|seven|eight|nine|ten|a dozen|half dozen|a couple|a few|a packet of|a pack of|a bottle of|a box of|a bag of|a loaf of)\b)\s+(.+)/i
      ]}
    ];
  }

  /**
   * Check if text looks like a non-shopping sentence/question
   */
  _isNonShoppingSentence(text) {
    if (!text || text.length < 2) return true;
    const lower = text.toLowerCase().trim();

    // Check conversational / question trigger words at start of sentence
    const conversationalStarters = [
      'what', 'who', 'why', 'where', 'when', 'how', 'which',
      'is', 'are', 'am', 'was', 'were', 'do', 'does', 'did',
      'can', 'could', 'would', 'should', 'will', 'shall',
      'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
      'tell me', 'explain', 'sing', 'play', 'open', 'close',
      'google', 'youtube', 'weather', 'joke', 'news', 'time',
      'test', 'testing', 'stop', 'cancel', 'exit', 'quit',
      'thanks', 'thank you', 'ok', 'okay', 'yes', 'no'
    ];

    for (const starter of conversationalStarters) {
      if (lower === starter || lower.startsWith(starter + ' ') || lower.startsWith(starter + '?')) {
        return true;
      }
    }

    // Long sentences without shopping verbs are likely general speech
    const words = lower.split(/\s+/);
    if (words.length > 4) return true;

    return false;
  }

  /**
   * Parse a voice transcript into a structured intent object
   * @param {string} transcript - Raw voice transcript
   * @returns {{ intent: string, item?: string, qty?: number, unit?: string, cartName?: string, targetCart?: string }}
   */
  parse(transcript) {
    const text = transcript.trim();
    if (!text) return { intent: 'UNKNOWN', raw: text };

    for (const { intent, patterns } of this.patterns) {
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
          return this._buildResult(intent, match, text);
        }
      }
    }

    // Fallback: ONLY allow bare noun if it matches a known grocery category or product catalog
    const cleanText = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '').trim();
    if (!this._isNonShoppingSentence(cleanText) && (typeof isValidGroceryItem !== 'function' || isValidGroceryItem(cleanText))) {
      const cat = typeof categorizeItem === 'function' ? categorizeItem(cleanText) : null;
      const isKnownProduct = typeof PRODUCTS !== 'undefined' && PRODUCTS.some(p =>
        p.name.toLowerCase() === cleanText.toLowerCase() ||
        p.name.toLowerCase().includes(cleanText.toLowerCase()) ||
        cleanText.toLowerCase().includes(p.name.toLowerCase())
      );

      if ((cat && cat.name !== 'Other') || isKnownProduct) {
        const parsed = this._parseItemPhrase(cleanText);
        if (parsed.item && parsed.item.length >= 2) {
          return { intent: 'ADD_ITEM', ...parsed, raw: text };
        }
      }
    }

    return { intent: 'UNKNOWN', raw: text };
  }

  _buildResult(intent, match, raw) {
    const result = { intent, raw };

    switch (intent) {
      case 'ADD_ITEM': {
        const parsed = this._parseItemPhrase(match[1]);
        return { ...result, ...parsed };
      }
      case 'REMOVE_ITEM':
      case 'CHECK_ITEM':
      case 'SEARCH': {
        const parsed = this._parseItemPhrase(match[1]);
        return { ...result, item: parsed.item };
      }
      case 'READ_CART':
        return { ...result, cartName: match[1] ? this._cleanCartName(match[1]) : null };
      case 'CREATE_CART':
      case 'DELETE_CART':
      case 'SWITCH_CART':
        return { ...result, cartName: this._cleanCartName(match[1]) };
      case 'CLEAR_CART':
        return { ...result, cartName: match[1] ? this._cleanCartName(match[1]) : null };
      case 'MERGE_CARTS':
        return { ...result, sourceCart: this._cleanCartName(match[1]), targetCart: this._cleanCartName(match[2]) };
      case 'ADD_TO_CART': {
        const parsed = this._parseItemPhrase(match[1]);
        return { ...result, ...parsed, targetCart: this._cleanCartName(match[2]) };
      }
      default:
        return result;
    }
  }

  /** Extract quantity, unit, and item name from a phrase like "2 bottles of water" */
  _parseItemPhrase(phrase) {
    if (!phrase) return { item: '', qty: 1, unit: null };

    // Clean punctuation
    let remaining = phrase.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, ' ').trim();
    let qty = 1;
    let unit = null;

    // Try word numbers first (a dozen, a couple, etc.)
    for (const [word, value] of Object.entries(NUMBER_WORDS)) {
      const re = new RegExp(`^${word}\\s+`, 'i');
      if (re.test(remaining)) {
        qty = value;
        remaining = remaining.replace(re, '').trim();
        break;
      }
    }

    // Try numeric digit
    const numMatch = remaining.match(/^(\d+(?:\.\d+)?)\s+/);
    if (numMatch) {
      qty = parseFloat(numMatch[1]);
      remaining = remaining.slice(numMatch[0].length);
    }

    // Try unit extraction
    for (const [unitWord, canonical] of Object.entries(UNIT_NORMALIZATIONS)) {
      const re = new RegExp(`^${unitWord}s?\\s+(?:of\\s+)?`, 'i');
      if (re.test(remaining)) {
        unit = canonical;
        remaining = remaining.replace(re, '').trim();
        break;
      }
    }

    // Remove leading "of " or "the "
    remaining = remaining.replace(/^(of|the|some|any|more)\s+/i, '').trim();

    // Remove trailing noise
    remaining = remaining.replace(/\s+(please|thanks|thank you|now)$/i, '').trim();

    // Title-case the item
    const item = remaining.split(/\s+/)
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    return { item, qty, unit };
  }

  _cleanCartName(name) {
    if (!name) return '';
    return name
      .replace(/\s*(?:cart|list|shopping list)$/i, '')
      .replace(/^(?:the|my|a|an)\s+/i, '')
      .trim()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}

// ─── Voice Controller ─────────────────────────────────────────────────────────

class VoiceController {
  constructor() {
    this.parser = new NLPParser();
    this.recognition = null;
    this.isListening = false;
    this.currentLanguage = 'en-US';
    this.onResult = null;   // Callback: (parsedIntent, transcript) => void
    this.onStart = null;    // Callback: () => void
    this.onEnd = null;      // Callback: () => void
    this.onError = null;    // Callback: (error) => void
    this.onInterim = null;  // Callback: (transcript) => void
    this._initRecognition();
  }

  get isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  get languages() {
    return LANGUAGES;
  }

  _initRecognition() {
    if (!this.isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 3;
    this.recognition.lang = this.currentLanguage;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.onStart?.();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.onEnd?.();
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      const userFriendlyErrors = {
        'no-speech': 'No speech detected. Please try again.',
        'audio-capture': 'Microphone not found. Please check your microphone.',
        'not-allowed': 'Microphone access denied. Please allow microphone access.',
        'network': 'Network error. Please check your connection.',
        'aborted': null, // Ignore aborted (user cancelled)
        'service-not-allowed': 'Speech service not allowed. Try using HTTPS or Chrome browser.'
      };
      const msg = userFriendlyErrors[event.error];
      if (msg) this.onError?.(msg);
    };

    this.recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          // Try all alternatives for best match
          for (let alt = 0; alt < result.length; alt++) {
            final = result[alt].transcript;
            const parsed = this.parser.parse(final);
            if (parsed.intent !== 'UNKNOWN') {
              this.onResult?.(parsed, final);
              return;
            }
          }
          // Use best confidence alternative
          final = result[0].transcript;
          const parsed = this.parser.parse(final);
          this.onResult?.(parsed, final);
        } else {
          interim = result[0].transcript;
          this.onInterim?.(interim);
        }
      }
    };
  }

  /** Start listening for a voice command */
  startListening() {
    if (!this.isSupported) {
      this.onError?.('Voice recognition is not supported in this browser. Please use Chrome or Edge.');
      return false;
    }
    if (this.isListening) {
      this.stopListening();
      return false;
    }
    try {
      this.recognition.lang = this.currentLanguage;
      this.recognition.start();
      return true;
    } catch (err) {
      console.error('[Voice] Start error:', err);
      this.onError?.('Failed to start voice recognition. Please try again.');
      return false;
    }
  }

  /** Stop listening */
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  /** Change recognition language */
  setLanguage(langCode) {
    const lang = LANGUAGES.find(l => l.code === langCode);
    if (lang) {
      this.currentLanguage = langCode;
      if (this.recognition) this.recognition.lang = langCode;
    }
  }

  /** Parse text without voice (for manual text input) */
  parseText(text) {
    return this.parser.parse(text);
  }

  /** Get available languages list */
  getLanguages() {
    return LANGUAGES;
  }
}

// Export singleton
const voiceController = new VoiceController();
