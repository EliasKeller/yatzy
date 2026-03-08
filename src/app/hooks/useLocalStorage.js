import { useState, useEffect } from "react";

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      setValue(JSON.parse(stored));
    }
  }, [key]);

  const setStoredValue = (valueOrFn) => {
    setValue((prev) => {
      const newValue =
        typeof valueOrFn === "function" ? valueOrFn(prev) : valueOrFn;

      localStorage.setItem(key, JSON.stringify(newValue));
      return newValue;
    });
  };

  return [value, setStoredValue];
}