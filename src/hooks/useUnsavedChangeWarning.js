import React, { useState, useEffect } from "react";
import { message } from "antd";

export const useUnsavedChangeWarning = (message = "Are you sure?") => {
  const [isDirty, setDirty] = useState(false);

  useEffect(() => {
    // Dectecting browser closing
    window.onbeforeunload = isDirty && (() => message);

    return () => {
      window.onbeforeunload = null;
    };
  }, [isDirty]);

  const routerPrompt = prompt("Are your sour close this  window tab?", "sure");

  return [routerPrompt, () => setDirty(true), () => setDirty(false)];
};
