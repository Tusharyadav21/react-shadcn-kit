import { useEffect } from "react";

/**
 * useScreenReaderOnly
 *
 * Provides a utility hook that returns a className string for visually hidden
 * elements that are still accessible to screen readers. It mirrors the common
 * `sr-only` utility from Tailwind but can be used without Tailwind.
 *
 * Example usage:
 * ```tsx
 * const srOnly = useScreenReaderOnly();
 * return <span className={srOnly}>Only for screen readers</span>;
 * ```
 */
export function useScreenReaderOnly() {
  // The className mirrors Tailwind's `sr-only` implementation.
  const className =
    "absolute w-px h-px overflow-hidden whitespace-nowrap border-0 p-0 -m-px clip[rect(0,0,0,0)]";

  // Ensure the element is removed from the visual flow on mount (no side‑effects needed).
  useEffect(() => {}, []);

  return className;
}
