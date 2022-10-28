import { useEffect, useRef, useState } from "react";
export const useCountSessionExpired = (sessionTime) => {
  const total = 1000 * 60; // 10 phút
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  // Store the created interval
  const intervalId = useRef();

  useEffect(() => {
    intervalId.current = setInterval(() => {
      if (Math.floor(new Date().getTime() / 1000.0) - sessionTime >= total) {
        clearInterval(intervalId.current);
        setIsSessionExpired(true);
      }
    }, 1000); // 1s

    return () => {
      setIsSessionExpired(false);
      clearInterval(intervalId.current);
    };
  }, [sessionTime]);

  return isSessionExpired;
};
