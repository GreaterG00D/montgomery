"use client";

import { useEffect, useRef } from "react";

export interface MousePosition {
  x: number; // -1 to 1 normalized
  y: number; // -1 to 1 normalized
  rawX: number;
  rawY: number;
}

/**
 * Returns a ref that always has the latest normalized mouse position.
 * Using a ref (not state) avoids re-renders on every mouse move.
 */
export function useMousePosition(): React.RefObject<MousePosition> {
  const pos = useRef<MousePosition>({ x: 0, y: 0, rawX: 0, rawY: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      pos.current = {
        rawX: e.clientX,
        rawY: e.clientY,
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return pos;
}
