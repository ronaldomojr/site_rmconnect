"use client";

import { gsap } from "../lib/gsap";
import { useGsap } from "../lib/useGsap";

/** Cabeçalho numerado no estilo editorial (01 — Título). */
export default function SectionHeading({
  index,
  kicker,
  title,
  align = "left",
}: {
  index: string;
  kicker?: string;
  title: React.ReactNode;
  align?: "left" | "center";
}) {
  const ref = useGsap<HTMLDivElement>((el) => {
    gsap.from(el.querySelectorAll(".sh-anim"), {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });

  return (
    <div
      ref={ref}
      className={`mb-12 flex flex-col gap-3 sm:mb-16 ${align === "center" ? "items-center text-center" : "items-start"}`}
    >
      <div className="sh-anim flex items-center gap-3 font-mono text-sm text-brand-light">
        <span>{index}</span>
        <span className="h-px w-10 bg-gradient-to-r from-brand to-transparent" />
        {kicker && <span className="uppercase tracking-[0.2em] text-muted">{kicker}</span>}
      </div>
      <h2 className="sh-anim max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
        {title}
      </h2>
    </div>
  );
}
