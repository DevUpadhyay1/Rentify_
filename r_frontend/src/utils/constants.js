// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// App Info
export const APP_NAME = 'Rentify';
export const APP_VERSION = '1.0.0';

// Pagination
export const ITEMS_PER_PAGE = 12;
export const MAX_PAGES_SHOWN = 5;

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_IMAGES = 5;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

// Item Categories
export const ITEM_CATEGORIES = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'vehicles', label: 'Vehicles' },
  { value: 'tools', label: 'Tools & Equipment' },
  { value: 'sports', label: 'Sports & Outdoors' },
  { value: 'party', label: 'Party & Events' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'photography', label: 'Photography' },
  { value: 'other', label: 'Other' },
];

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Order Status Labels
export const ORDER_STATUS_LABELS = {
  pending: 'Pending',
  approved: 'Approved',
  in_transit: 'In Transit',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

// Review Rating
export const MIN_RATING = 1;
export const MAX_RATING = 5;

// Date Formats
export const DATE_FORMAT = 'MMM DD, YYYY';
export const DATETIME_FORMAT = 'MMM DD, YYYY HH:mm';
export const TIME_FORMAT = 'HH:mm';

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  ITEMS: '/items',
  ITEM_DETAIL: '/items/:id',
  ADD_ITEM: '/items/add',
  EDIT_ITEM: '/items/:id/edit',
  ORDERS: '/orders',
  REVIEWS: '/reviews',
  FAVORITES: '/favorites',
  ABOUT: '/about',
  CONTACT: '/contact',
};

// Toast Duration
export const TOAST_DURATION = 3000;

// Debounce Delay
export const DEBOUNCE_DELAY = 300;

// Theme
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
};

export default {
  API_BASE_URL,
  APP_NAME,
  APP_VERSION,
  ITEMS_PER_PAGE,
  MAX_PAGES_SHOWN,
  MAX_FILE_SIZE,
  MAX_IMAGES,
  ALLOWED_IMAGE_TYPES,
  ITEM_CATEGORIES,
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  MIN_RATING,
  MAX_RATING,
  DATE_FORMAT,
  DATETIME_FORMAT,
  TIME_FORMAT,
  STORAGE_KEYS,
  ROUTES,
  TOAST_DURATION,
  DEBOUNCE_DELAY,
  THEME,
};