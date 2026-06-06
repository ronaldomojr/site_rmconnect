"use client";

import { gsap, SplitText, prefersReducedMotion } from "../lib/gsap";
import { useGsap } from "../lib/useGsap";
import SectionHeading from "./SectionHeading";

export default function About() {
  const ref = useGsap<HTMLElement>((el) => {
    const big = el.querySelector(".about-statement") as HTMLElement;
    if (big && !prefersReducedMotion()) {
      const split = new SplitText(big, { type: "words" });
      gsap.from(split.words, {
        opacity: 0.12,
        duration: 0.6,
        stagger: 0.06,
        ease: "none",
        scrollTrigger: { trigger: big, start: "top 80%", end: "bottom 60%", scrub: true },
      });
    }

    gsap.from(el.querySelectorAll(".about-card"), {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: { trigger: ".about-cards", start: "top 85%" },
    });
  });

  return (
    <section ref={ref} id="sobre" className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
      <SectionHeading
        index="01"
        kicker="Quem somos"
        title={
          <>
            Uma startup de tecnologia que transforma{" "}
            <span className="text-gradient">processos manuais em sistemas autônomos</span>.
          </>
        }
      />

      <p className="about-statement max-w-4xl font-display text-2xl font-medium leading-snug text-balance sm:text-3xl lg:text-4xl">
        Construímos infraestruturas digitais escaláveis, rápidas e eficientes que eliminam a
        sobrecarga operacional das empresas parceiras por meio da automação.
      </p>

      <div className="about-cards mt-16 grid gap-5 sm:grid-cols-3">
        {[
          {
            t: "Engenharia de ponta",
            d: "Código fortemente tipado em TypeScript/Node.js, arquitetura limpa e foco em performance.",
          },
          {
            t: "Automação inteligente",
            d: "RPA + IA orquestrando CRMs, planilhas e APIs para trabalharem em sinergia, sem intervenção humana.",
          },
          {
            t: "Design sofisticado",
            d: "Interfaces dark, clean e responsivas, com excelente espaçamento e foco total na experiência.",
          },
        ].map((c) => (
          <div key={c.t} className="about-card glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold">{c.t}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{c.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
