import { useEffect, useRef } from "react";

/**
 * useAriaLive
 *
 * Provides a simple way to announce dynamic content to screen readers using an
 * `aria-live` region. The hook returns a ref that should be attached to a hidden
 * element and a function to update the live message.
 *
 * Example usage:
 * ```tsx
 * const { liveRef, announce } = useAriaLive();
 * return (
 *   <>
 *     <div ref={liveRef} aria-live="polite" className="sr-only" />
 *     <button onClick={() => announce('Item added')}>Add</button>
 *   </>
 * );
 * ```
 */
export function useAriaLive() {
  const liveRef = useRef<HTMLDivElement>(null);

  const announce = (message: string) => {
    if (liveRef.current) {
      // Clear previous message to ensure screen readers pick up the new one
      liveRef.current.textContent = "";
      // Use a timeout to allow the DOM to register the change
      setTimeout(() => {
        if (liveRef.current) {
          liveRef.current.textContent = message;
        }
      }, 100);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    const liveElement = liveRef.current;
    return () => {
      if (liveElement) {
        liveElement.textContent = "";
      }
    };
  }, []);

  return { liveRef, announce } as const;
}
