import { toast } from 'react-toastify';

/**
 * Toast notification utility
 */
class Toastify {
  constructor() {
    this.defaultOptions = {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };
  }

  /**
   * Show success toast
   * @param {string} message - Message to display
   * @param {Object} options - Toast options
   */
  success(message, options = {}) {
    toast.success(message, {
      ...this.defaultOptions,
      ...options,
    });
  }

  /**
   * Show error toast
   * @param {string} message - Message to display
   * @param {Object} options - Toast options
   */
  error(message, options = {}) {
    toast.error(message, {
      ...this.defaultOptions,
      ...options,
    });
  }

  /**
   * Show warning toast
   * @param {string} message - Message to display
   * @param {Object} options - Toast options
   */
  warning(message, options = {}) {
    toast.warning(message, {
      ...this.defaultOptions,
      ...options,
    });
  }

  /**
   * Show info toast
   * @param {string} message - Message to display
   * @param {Object} options - Toast options
   */
  info(message, options = {}) {
    toast.info(message, {
      ...this.defaultOptions,
      ...options,
    });
  }

  /**
   * Show default toast
   * @param {string} message - Message to display
   * @param {Object} options - Toast options
   */
  default(message, options = {}) {
    toast(message, {
      ...this.defaultOptions,
      ...options,
    });
  }

  /**
   * Show promise toast (for async operations)
   * @param {Promise} promise - Promise to track
   * @param {Object} messages - Messages for pending, success, and error states
   * @param {Object} options - Toast options
   */
  promise(promise, messages, options = {}) {
    return toast.promise(
      promise,
      {
        pending: messages.pending || 'Loading...',
        success: messages.success || 'Success!',
        error: messages.error || 'Something went wrong!',
      },
      {
        ...this.defaultOptions,
        ...options,
      }
    );
  }

  /**
   * Dismiss all toasts
   */
  dismiss() {
    toast.dismiss();
  }

  /**
   * Dismiss specific toast by id
   * @param {string|number} id - Toast id
   */
  dismissById(id) {
    toast.dismiss(id);
  }

  /**
   * Check if a toast is active
   * @param {string|number} id - Toast id
   * @returns {boolean} True if active
   */
  isActive(id) {
    return toast.isActive(id);
  }

  /**
   * Update existing toast
   * @param {string|number} id - Toast id
   * @param {Object} options - New options
   */
  update(id, options) {
    toast.update(id, {
      ...this.defaultOptions,
      ...options,
    });
  }

  /**
   * Show loading toast (doesn't auto close)
   * @param {string} message - Message to display
   * @param {Object} options - Toast options
   * @returns {string|number} Toast id
   */
  loading(message, options = {}) {
    return toast.loading(message, {
      ...this.defaultOptions,
      ...options,
    });
  }
}

// Create singleton instance
const toastify = new Toastify();

export default toastify;
export { toastify };