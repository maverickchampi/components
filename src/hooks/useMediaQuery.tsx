import { useEffect, useState } from "react";

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const updateMatches = () => {
      setMatches(window.matchMedia(query).matches);
    };
  
    updateMatches();
    
    const matchMedia = window.matchMedia(query);
    matchMedia.addEventListener("change", updateMatches);
    
    return () => {
      matchMedia.removeEventListener("change", updateMatches);
    };
  }, [query]);

  return matches;
};
