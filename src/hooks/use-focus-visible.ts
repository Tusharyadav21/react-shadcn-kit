import { useEffect, useState } from "react";

/**
 * useFocusVisible
 *
 * Detects when the user is navigating via keyboard (focus-visible) and provides a
 * boolean flag that can be used to apply a visual focus style only for keyboard
 * users. This mirrors the behavior of the `:focus-visible` CSS pseudo‑class but
 * works in browsers that lack native support.
 *
 * Example usage:
 * ```tsx
 * const isFocusVisible = useFocusVisible();
 * return <button className={isFocusVisible ? 'focus-visible' : ''}>Click</button>;
 * ```
 */
export function useFocusVisible() {
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Tab" ||
        e.key === "Shift" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
      ) {
        setIsFocusVisible(true);
      }
    };
    const onMouseDown = () => setIsFocusVisible(false);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  return isFocusVisible;
}
