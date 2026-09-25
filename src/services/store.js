import { INITIAL_PROFILES, INITIAL_BOOKS, INITIAL_REQUESTS, INITIAL_NOTIFICATIONS, INITIAL_ACTIVITY_LOGS } from '../utils/mockData';

const STORAGE_KEYS = {
  PROFILES: 'bds_profiles',
  BOOKS: 'bds_books',
  REQUESTS: 'bds_requests',
  NOTIFICATIONS: 'bds_notifications',
  LOGS: 'bds_logs',
  SESSION: 'bds_session',
};

// Initialize default storage data if missing
function initStore() {
  if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(INITIAL_PROFILES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LOGS)) {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_ACTIVITY_LOGS));
  }
}

initStore();

export const localStore = {
  getProfiles: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]'),
  saveProfiles: (data) => localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(data)),

  getBooks: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKS) || '[]'),
  saveBooks: (data) => localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(data)),

  getRequests: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]'),
  saveRequests: (data) => localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(data)),

  getNotifications: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]'),
  saveNotifications: (data) => localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(data)),

  getLogs: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]'),
  saveLogs: (data) => localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(data)),

  addLog: (action, entity_type, description, user_name = 'Student', type = 'green') => {
    const logs = localStore.getLogs();
    const newLog = {
      id: 'log-' + Date.now(),
      user_name,
      action,
      entity_type,
      description,
      time_ago: 'Just now',
      type,
      created_at: new Date().toISOString(),
    };
    logs.unshift(newLog);
    localStore.saveLogs(logs.slice(0, 50));
  },

  getSession: () => {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    return raw ? JSON.parse(raw) : null;
  },
  saveSession: (user) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  },

  resetToDefault: () => {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(INITIAL_PROFILES));
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_ACTIVITY_LOGS));
  }
};
