// usePrompt.js
import { useContext, useEffect } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

export function usePrompt(message, when) {
  const navigator = useContext(NavigationContext).navigator;

  useEffect(() => {
    if (!when) return;

    const originalPush = navigator.push;

    navigator.push = (...args) => {
      const confirmLeave = window.confirm(message);
      if (confirmLeave) {
        navigator.push = originalPush;
        navigator.push(...args);
      }
    };

    return () => {
      navigator.push = originalPush;
    };
  }, [when, message, navigator]);
}
