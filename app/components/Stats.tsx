"use client";

import { gsap } from "../lib/gsap";
import { useGsap } from "../lib/useGsap";
import { STATS } from "../lib/site";

export default function Stats() {
  const ref = useGsap<HTMLDivElement>((el) => {
    const items = el.querySelectorAll(".stat-item");

    gsap.from(items, {
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });

    // Count-up
    el.querySelectorAll<HTMLElement>(".stat-value").forEach((node) => {
      const end = Number(node.dataset.value || 0);
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
        onUpdate: () => {
          node.textContent = Math.round(obj.v).toString();
        },
      });
    });
  });

  return (
    <section className="border-y border-border bg-surface/40">
      <div
        ref={ref}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-6 lg:grid-cols-4"
      >
        {STATS.map((s) => (
          <div key={s.label} className="stat-item flex flex-col items-center px-4 py-10 text-center sm:py-14">
            <div className="flex items-baseline font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="stat-value text-gradient" data-value={s.value}>
                0
              </span>
              <span className="text-gradient">{s.suffix}</span>
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.15em] text-muted sm:text-sm">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
