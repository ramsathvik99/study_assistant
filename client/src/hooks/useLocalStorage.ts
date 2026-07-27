import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook to read and write state to localStorage reactively.
 * Handles missing keys, invalid JSON, schema mismatches, and corrupted data.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const initialValueRef = useRef(initialValue);

  const readFromStorage = (): T => {
    if (typeof window === "undefined") return initialValueRef.current;
    try {
      const item = window.localStorage.getItem(key);
      if (item === null || item === undefined || item === "undefined" || item === "null") {
        return initialValueRef.current;
      }
      const parsed = JSON.parse(item) as T;
      // If we expected an array and got something else, return the initial value
      if (Array.isArray(initialValueRef.current) && !Array.isArray(parsed)) {
        console.warn(`useLocalStorage: key "${key}" expected array but got ${typeof parsed}. Resetting.`);
        return initialValueRef.current;
      }
      return parsed;
    } catch (error) {
      console.warn(`useLocalStorage: failed to read key "${key}":`, error);
      return initialValueRef.current;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readFromStorage);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`useLocalStorage: failed to write key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  useEffect(() => {
    setStoredValue(readFromStorage());
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return [storedValue, setValue];
}
