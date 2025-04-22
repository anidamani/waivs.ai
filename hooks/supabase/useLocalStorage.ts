"use client";

import { useLocalStorage as useLocalStorageHook } from "@uidotdev/usehooks";

const useLocalStorage = (key: string, initialValue: string) => {
  const [value, setValue] = useLocalStorageHook(key, initialValue);
  if (typeof window === "undefined") {
    return [initialValue, (value: string) => {}] as const;
  }
  return [value, setValue] as const;
};

export default useLocalStorage;
