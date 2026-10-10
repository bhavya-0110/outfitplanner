import { INITIAL_WARDROBE, INITIAL_SAVED_OUTFITS, INITIAL_CALENDAR_PLANS } from '../data/sampleWardrobe';

const STORAGE_KEYS = {
  WARDROBE: 'aura_wardrobe_items_v1',
  OUTFITS: 'aura_wardrobe_outfits_v1',
  CALENDAR: 'aura_wardrobe_calendar_v1'
};

// Wardrobe items helper
export function getStoredWardrobe() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WARDROBE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WARDROBE, JSON.stringify(INITIAL_WARDROBE));
      return INITIAL_WARDROBE;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading wardrobe from localStorage:', err);
    return INITIAL_WARDROBE;
  }
}

export function saveStoredWardrobe(items) {
  try {
    localStorage.setItem(STORAGE_KEYS.WARDROBE, JSON.stringify(items));
  } catch (err) {
    console.error('Failed saving wardrobe to localStorage:', err);
  }
}

// Outfits helper
export function getStoredOutfits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OUTFITS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.OUTFITS, JSON.stringify(INITIAL_SAVED_OUTFITS));
      return INITIAL_SAVED_OUTFITS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading outfits from localStorage:', err);
    return INITIAL_SAVED_OUTFITS;
  }
}

export function saveStoredOutfits(outfits) {
  try {
    localStorage.setItem(STORAGE_KEYS.OUTFITS, JSON.stringify(outfits));
  } catch (err) {
    console.error('Failed saving outfits to localStorage:', err);
  }
}

// Calendar plans helper
export function getStoredCalendar() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CALENDAR);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(INITIAL_CALENDAR_PLANS));
      return INITIAL_CALENDAR_PLANS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading calendar from localStorage:', err);
    return INITIAL_CALENDAR_PLANS;
  }
}

export function saveStoredCalendar(calendarPlans) {
  try {
    localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(calendarPlans));
  } catch (err) {
    console.error('Failed saving calendar to localStorage:', err);
  }
}

// Reset everything back to pretty initial demo data
export function resetDemoData() {
  localStorage.setItem(STORAGE_KEYS.WARDROBE, JSON.stringify(INITIAL_WARDROBE));
  localStorage.setItem(STORAGE_KEYS.OUTFITS, JSON.stringify(INITIAL_SAVED_OUTFITS));
  localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(INITIAL_CALENDAR_PLANS));
}
