import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

export function useInactivityLogout(isAuthenticated: boolean) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        try {
          await fetch(`${import.meta.env.BASE_URL}auth/logout`.replace(/\/+/g, "/").replace(":/", "://"), {
            method: "POST",
            credentials: "include",
          });
        } catch {
        }
        queryClient.clear();
        setLocation("/login");
      }, INACTIVITY_TIMEOUT_MS);
    };

    const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart", "click"];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [isAuthenticated, setLocation, queryClient]);
}
