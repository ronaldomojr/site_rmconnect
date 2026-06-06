"use client";

import { useRef } from "react";
import { gsap } from "../lib/gsap";
import { useGsap } from "../lib/useGsap";
import { SERVICES } from "../lib/site";
import SectionHeading from "./SectionHeading";

/** Efeito de tilt 3D no hover (desktop/ponteiro fino). */
function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, {
      rotateY: px * 10,
      rotateX: -py * 10,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 800,
    });
  };
  const onLeave = () => {
    if (ref.current) gsap.to(ref.current, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "power3.out" });
  };
  return { ref, onMove, onLeave };
}

function ServiceCard({ index, title, desc }: { index: number; title: string; desc: string }) {
  const { ref, onMove, onLeave } = useTilt();
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="service-card group relative overflow-hidden rounded-2xl border border-border bg-surface/50 p-6 [transform-style:preserve-3d] sm:p-7"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      <span className="font-mono text-sm text-brand-light">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{desc}</p>
    </div>
  );
}

export default function Services() {
  const ref = useGsap<HTMLElement>((el) => {
    gsap.from(el.querySelectorAll(".service-card"), {
      y: 50,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: { trigger: ".services-grid", start: "top 80%" },
    });
  });

  return (
    <section ref={ref} id="servicos" className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
      <SectionHeading
        index="02"
        kicker="O que fazemos"
        title={
          <>
            A RM Connect <span className="text-gradient">trabalha com tudo</span> — do front-end à
            automação end-to-end.
          </>
        }
      />

      <div className="services-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.title} index={i} title={s.title} desc={s.desc} />
        ))}
      </div>
    </section>
  );
}
