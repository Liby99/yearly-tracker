import { useEffect } from "react";

export function useApplyTheme(theme: "auto" | "light" | "dark") {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (theme === "auto") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);
}
