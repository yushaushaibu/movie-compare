const debounce = (func, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};
