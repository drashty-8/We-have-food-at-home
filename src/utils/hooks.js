import { useEffect, useState } from "react";

/**
 * Returns a debounced version of `value` that only updates
 * after `delay` ms of inactivity.
 */
export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  // useEffect runs code whenever its dependency array is updated.
  useEffect(() => {
    // Wait delay ms before running setDebounced(value).
    const timer = setTimeout(() => setDebounced(value), delay);

    // The return function is called before useEffect is run again.
    // For example, when the dependency array is updated, it will run
    // the return function before starting from the top again.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
