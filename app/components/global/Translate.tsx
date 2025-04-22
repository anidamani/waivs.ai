"use client";
import { useTranslation } from "@/app/contexts/TranslationContext";

export const Translate = ({ children }: { children: string }) => {
  const { getTranslation } = useTranslation();
  const key = children;
  const value = getTranslation(key);
  return <span>{value}</span>;
};
