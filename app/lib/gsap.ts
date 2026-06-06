"use client";

/**
 * Ponto central de registro do GSAP e plugins (versão Club instalada em node_modules).
 * Importado apenas por Client Components — o registro é protegido para o browser.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, ScrambleTextPlugin);
}

/** Usuário prefere movimento reduzido? (SSR-safe) */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, ScrambleTextPlugin };
