import { useEffect, useState } from "react";

export const useCountdown = (initialCountDown) => {
  const [countDown, setCountDown] = useState(initialCountDown);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDown - 1);
    }, 1000);

    if (countDown === 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  });

  return getReturnValues(countDown);
};

const getReturnValues = (countDown) => {
  // calculate time left
  const days = Math.floor(countDown / (60 * 60 * 24));
  const hours = Math.floor((countDown % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor(countDown / 60);
  const seconds = Math.floor(countDown % 60);

  return [days, hours, minutes, seconds];
};
