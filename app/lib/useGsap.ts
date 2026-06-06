"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { gsap } from "./gsap";

/**
 * Executa animações GSAP com escopo (gsap.context) preso a um elemento,
 * com cleanup automático (ctx.revert()) — evita vazamento de ScrollTriggers
 * entre re-renders e em hot-reload.
 *
 * @param setup  callback que cria as animações; recebe o elemento de escopo.
 * @param deps   dependências para reexecutar o efeito.
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  setup: (self: T, ctx: gsap.Context) => void,
  deps: React.DependencyList = [],
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context((self) => setup(el, self), el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
