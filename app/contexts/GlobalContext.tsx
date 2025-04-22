"use client";
import { createContext, useContext, useRef, useState } from "react";

interface GlobalContextType {
  state: Record<string, any>;
  updateValue: (key: string, value: any) => void;
  getValue: (key: string) => any;
  setRef: (key: string, ref: any) => void;
  getRef: (key: string) => any;
}
export const GlobalContext = createContext<GlobalContextType>({
  state: {},
  updateValue: () => {},
  getValue: () => {},
  setRef: () => {},
  getRef: () => {},
});

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<Record<string, any>>({});
  const refs = useRef<Record<string, any>>({});

  console.log("Global Context Refs", refs.current);

  const updateValue = (key: string, value: any) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const getValue = (key: string) => {
    return state[key];
  };

  const setRef = (key: string, ref: any) => {
    console.log("Setting ref", key, ref);
    refs.current[key] = ref;
  };

  const getRef = (key: string) => {
    return refs.current[key];
  };

  return (
    <GlobalContext.Provider
      value={{ state, updateValue, getValue, setRef, getRef }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobals = () => {
  return useContext(GlobalContext);
};

export default useGlobals;
