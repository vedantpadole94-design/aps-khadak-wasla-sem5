let toastListeners = [];
let toastId = 0;

export const subscribeToToasts = (listener) => {
  toastListeners.push(listener);
  return () => {
    toastListeners = toastListeners.filter((registeredListener) => registeredListener !== listener);
  };
};

export const toast = {
  success: (message) => addToast(message, 'success'),
  error: (message) => addToast(message, 'error'),
  info: (message) => addToast(message, 'info'),
  show: (message) => addToast(message, 'info')
};

function addToast(message, type = 'info') {
  const id = ++toastId;
  const newToast = { id, message, type };
  toastListeners.forEach((fn) => fn(newToast));
  return id;
}

export default toast;
