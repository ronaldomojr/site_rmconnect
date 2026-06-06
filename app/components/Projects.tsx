"use client";

import { gsap } from "../lib/gsap";
import { useGsap } from "../lib/useGsap";
import { PROJECTS } from "../lib/site";
import SectionHeading from "./SectionHeading";

export default function Projects() {
  const ref = useGsap<HTMLElement>(() => {
    gsap.utils.toArray<HTMLElement>(".project-row").forEach((row) => {
      gsap.from(row, {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: row, start: "top 85%" },
      });
    });
  });

  return (
    <section ref={ref} id="projetos" className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
      <SectionHeading
        index="04"
        kicker="Casos reais"
        title={
          <>
            Projetos que já estão <span className="text-gradient">rodando no automático</span>.
          </>
        }
      />

      <div className="flex flex-col divide-y divide-border border-t border-border">
        {PROJECTS.map((p, i) => (
          <article
            key={p.id}
            className="project-row group grid gap-6 py-10 transition-colors sm:grid-cols-[auto_1fr_auto] sm:items-start sm:gap-10"
          >
            <span className="font-mono text-sm text-brand-light sm:pt-1">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-2xl font-semibold transition-colors group-hover:text-brand-light sm:text-3xl">
                  {p.name}
                </h3>
                <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wider text-muted">
                  {p.tag}
                </span>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                {p.desc}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:justify-end">
              {p.stack.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-surface-2 px-2.5 py-1 font-mono text-xs text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
