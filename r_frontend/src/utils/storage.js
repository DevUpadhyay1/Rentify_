/**
 * Local Storage utility with JSON support
 */
class Storage {
  /**
   * Get item from localStorage
   * @param {string} key - Storage key
   * @returns {any} Parsed value or null
   */
  get(key) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      // Try to parse JSON, return as-is if it fails
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error);
      return null;
    }
  }

  /**
   * Set item in localStorage
   * @param {string} key - Storage key
   * @param {any} value - Value to store (will be JSON stringified)
   * @returns {boolean} Success status
   */
  set(key, value) {
    try {
      const serializedValue =
        typeof value === "string" ? value : JSON.stringify(value);

      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`Error setting item in localStorage: ${key}`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error);
      return false;
    }
  }

  /**
   * Clear all items from localStorage
   * @returns {boolean} Success status
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing localStorage", error);
      return false;
    }
  }

  /**
   * Check if key exists in localStorage
   * @param {string} key - Storage key
   * @returns {boolean} True if exists
   */
  has(key) {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Get all keys from localStorage
   * @returns {Array<string>} Array of keys
   */
  keys() {
    return Object.keys(localStorage);
  }

  /**
   * Get storage size in bytes
   * @returns {number} Size in bytes
   */
  size() {
    let size = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        size += localStorage[key].length + key.length;
      }
    }
    return size;
  }

  /**
   * Set item with expiry time
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @param {number} ttl - Time to live in milliseconds
   * @returns {boolean} Success status
   */
  setWithExpiry(key, value, ttl) {
    try {
      const item = {
        value: value,
        expiry: new Date().getTime() + ttl,
      };

      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error(`Error setting item with expiry: ${key}`, error);
      return false;
    }
  }

  /**
   * Get item with expiry check
   * @param {string} key - Storage key
   * @returns {any} Value or null if expired
   */
  getWithExpiry(key) {
    try {
      const itemStr = localStorage.getItem(key);

      if (!itemStr) {
        return null;
      }

      const item = JSON.parse(itemStr);
      const now = new Date().getTime();

      // Check if expired
      if (now > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error(`Error getting item with expiry: ${key}`, error);
      return null;
    }
  }
}

// Create singleton instance
const storage = new Storage();

export default storage;
export { storage };
