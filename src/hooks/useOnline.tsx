import { useEffect, useState } from "react";

export const useOnline = () => {
  const [online, setOnline] = useState<boolean>(true);

  useEffect(function setupOnlineOfflineListeners() {
    setOnline(navigator.onLine);

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return online;
};
