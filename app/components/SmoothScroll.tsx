"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { ScrollSmoother } from "../lib/gsap";

/**
 * Provider do ScrollSmoother. Cria o wrapper/content exigidos pelo plugin.
 * Em telas pequenas/touch ou com "reduzir movimento", usa scroll nativo
 * (o smoother continua disponível para parallax via data-speed quando ativo).
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Em telas touch usamos scroll nativo (pin+scrub do ScrollTrigger continua
    // funcionando). NÃO desabilitamos por reduced-motion: a animação é o produto.
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const smoother = ScrollSmoother.create({
      wrapper: wrapper.current!,
      content: content.current!,
      smooth: 1.2,
      effects: true,
      normalizeScroll: true,
    });

    return () => smoother.kill();
  }, []);

  return (
    <div id="smooth-wrapper" ref={wrapper}>
      <div id="smooth-content" ref={content}>
        {children}
      </div>
    </div>
  );
}
