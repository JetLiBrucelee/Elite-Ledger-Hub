import { useEffect, useRef, useCallback } from "react";

const INTERACTIVE_SELECTOR = "a, button, input, select, textarea, [role='button']";

export function useCursor() {
  const posRef = useRef({ x: 0, y: 0 });
  const hiddenRef = useRef(false);
  const clickedRef = useRef(false);
  const linkHoveredRef = useRef(false);
  const rafId = useRef(0);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  const update = useCallback(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const { x, y } = posRef.current;
    const hidden = hiddenRef.current;
    const hovered = linkHoveredRef.current;
    const clicked = clickedRef.current;

    dot.style.transform = `translate(${x - 8}px, ${y - 8}px) scale(${hovered ? 0 : clicked ? 0.75 : 1})`;
    dot.style.opacity = hidden || hovered ? "0" : "1";

    ring.style.transform = `translate(${x - 20}px, ${y - 20}px) scale(${hovered ? 1.5 : 1})`;
    ring.style.opacity = hidden ? "0" : "1";
    ring.style.borderColor = hovered ? "hsl(43 96% 56%)" : "hsla(43 96% 56% / 0.5)";
    ring.style.backgroundColor = hovered ? "hsla(43 96% 56% / 0.2)" : "transparent";
  }, []);

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    document.documentElement.style.cursor = "none";

    const dot = document.createElement("div");
    dot.style.cssText =
      "position:fixed;top:0;left:0;width:16px;height:16px;background:hsl(43 96% 56%);border-radius:50%;pointer-events:none;z-index:9999;will-change:transform;transition:opacity 0.15s";
    document.body.appendChild(dot);
    dotRef.current = dot;

    const ring = document.createElement("div");
    ring.style.cssText =
      "position:fixed;top:0;left:0;width:40px;height:40px;border:1px solid hsla(43 96% 56% / 0.5);border-radius:50%;pointer-events:none;z-index:9998;will-change:transform;transition:transform 0.2s ease-out,border-color 0.2s,background-color 0.2s,opacity 0.15s";
    document.body.appendChild(ring);
    ringRef.current = ring;

    const onMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(update);
    };

    const onMouseDown = () => {
      clickedRef.current = true;
      update();
    };
    const onMouseUp = () => {
      clickedRef.current = false;
      update();
    };
    const onMouseLeave = () => {
      hiddenRef.current = true;
      update();
    };
    const onMouseEnter = () => {
      hiddenRef.current = false;
      update();
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest(INTERACTIVE_SELECTOR)) {
        linkHoveredRef.current = true;
        update();
      }
    };
    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest(INTERACTIVE_SELECTOR)) {
        linkHoveredRef.current = false;
        update();
      }
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });

    return () => {
      document.documentElement.style.cursor = "";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(rafId.current);
      dot.remove();
      ring.remove();
    };
  }, [update]);
}
