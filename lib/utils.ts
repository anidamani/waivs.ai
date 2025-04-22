import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function secondsToMinutesAndSeconds(seconds: number) {
  //also calculate hours if seconds is greater than 3600
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${hours > 0 ? `${hours}:` : ""}${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}
