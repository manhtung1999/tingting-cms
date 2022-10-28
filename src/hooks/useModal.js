import { useState, useCallback } from "react";

export const useModal = (initialMode = false) => {
  // Initialize the state
  const [modalOpen, setModalOpen] = useState(initialMode);

  // Define and memorize toggler function in case we pass down the comopnent,
  // This function change the boolean value to it's opposite value
  const toggle = useCallback(() => setModalOpen((modalOpen) => !modalOpen), []);

  return [modalOpen, setModalOpen, toggle];
};
