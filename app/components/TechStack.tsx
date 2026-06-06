"use client";

import { gsap, prefersReducedMotion } from "../lib/gsap";
import { useGsap } from "../lib/useGsap";
import { TECH } from "../lib/site";
import SectionHeading from "./SectionHeading";

function MarqueeRow({ items, reverse = false }: { items: readonly string[]; reverse?: boolean }) {
  // Duplicado para loop contínuo
  const loop = [...items, ...items];
  return (
    <div className="marquee-row flex w-max gap-4" data-reverse={reverse ? "1" : "0"}>
      {loop.map((t, i) => (
        <span
          key={`${t}-${i}`}
          className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface/60 px-5 py-2.5 text-sm text-muted transition-colors hover:border-brand-light/50 hover:text-foreground"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand-light" />
          {t}
        </span>
      ))}
    </div>
  );
}

export default function TechStack() {
  const ref = useGsap<HTMLElement>((el) => {
    if (prefersReducedMotion()) return;

    el.querySelectorAll<HTMLElement>(".marquee-row").forEach((row) => {
      const reverse = row.dataset.reverse === "1";
      const distance = row.scrollWidth / 2;
      gsap.fromTo(
        row,
        { x: reverse ? -distance : 0 },
        {
          x: reverse ? 0 : -distance,
          duration: 26,
          ease: "none",
          repeat: -1,
        },
      );
    });

    // Scramble na frase ao entrar
    const scramble = el.querySelector(".tech-scramble");
    if (scramble) {
      gsap.to(scramble, {
        scrollTrigger: { trigger: el, start: "top 75%" },
        duration: 2,
        scrambleText: {
          text: "Uma stack que conversa com tudo.",
          chars: "upperCase",
          speed: 0.4,
        },
      });
    }
  });

  return (
    <section ref={ref} id="stack" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          index="03"
          kicker="Tecnologia"
          title={<span className="tech-scramble">Uma stack que conversa com tudo.</span>}
        />
      </div>

      <div className="flex flex-col gap-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <MarqueeRow items={TECH} />
        <MarqueeRow items={[...TECH].reverse()} reverse />
      </div>
    </section>
  );
}
