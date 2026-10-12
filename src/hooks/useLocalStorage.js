import { useState, useEffect } from "react";

// Works like useState, but the value is also saved in a browser storage.
// storage can be localStorage (kept forever) or sessionStorage (cleared when the tab closes)
export default function useLocalStorage(key, initialValue, storage = window.localStorage) {
  const [value, setValue] = useState(() => {
    try {
      const saved = storage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    storage.setItem(key, JSON.stringify(value));
  }, [storage, key, value]);

  return [value, setValue];
}