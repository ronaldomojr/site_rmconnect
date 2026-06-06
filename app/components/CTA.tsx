"use client";

import { gsap } from "../lib/gsap";
import { useGsap } from "../lib/useGsap";
import WhatsAppButton from "./WhatsAppButton";

export default function CTA() {
  const ref = useGsap<HTMLElement>((el) => {
    gsap.from(el.querySelectorAll(".cta-anim"), {
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 80%" },
    });
    gsap.to(el.querySelector(".cta-glow"), {
      scale: 1.15,
      opacity: 0.9,
      duration: 4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  });

  return (
    <section ref={ref} id="contato" className="relative px-6 py-28 sm:py-36">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-surface/60 px-6 py-16 text-center sm:px-12 sm:py-20">
        <div className="cta-glow glow absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/3" />

        <div className="relative">
          <p className="cta-anim mb-4 text-xs font-medium uppercase tracking-[0.3em] text-brand-light/80">
            Vamos conversar
          </p>
          <h2 className="cta-anim mx-auto max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight text-balance sm:text-5xl">
            Pronto para colocar sua operação no{" "}
            <span className="text-gradient">piloto automático?</span>
          </h2>
          <p className="cta-anim mx-auto mt-5 max-w-xl text-base text-muted text-balance">
            Conte o desafio do seu negócio. A gente desenha a automação end-to-end ideal e coloca
            para rodar.
          </p>
          <div className="cta-anim mt-9 flex justify-center">
            <WhatsAppButton className="px-7 py-3.5 text-base">Agende uma reunião</WhatsAppButton>
          </div>
        </div>
      </div>
    </section>
  );
}
