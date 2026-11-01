import { useEffect, useState } from "react";

const getInitialMatches = (query: string): boolean => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia(query).matches;
};

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => getInitialMatches(query));

  useEffect(() => {
    const matchMedia = window.matchMedia(query);
    const updateMatches = () => setMatches(matchMedia.matches);

    updateMatches();

    matchMedia.addEventListener("change", updateMatches);

    return () => {
      matchMedia.removeEventListener("change", updateMatches);
    };
  }, [query]);

  return matches;
};
