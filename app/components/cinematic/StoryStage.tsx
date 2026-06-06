"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { useGsap } from "../../lib/useGsap";
import { SCENES } from "../../lib/site";
import WhatsAppButton from "../WhatsAppButton";
import CinematicCanvas from "./CinematicCanvas";
import type { Progress } from "./LogoParticles";

/** O dispositivo tem WebGL? (decide o fallback estático — NÃO usamos reduced-motion
 *  para desligar a experiência, pois o site É a animação que o usuário pediu.) */
function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

/* "Já montou no cliente?" sem setState-in-effect. */
const mountStore = {
  subscribe(cb: () => void) {
    const id = requestAnimationFrame(cb);
    return () => cancelAnimationFrame(id);
  },
  getSnapshot: () => true,
  getServerSnapshot: () => false,
};

function SceneText({ index }: { index: number }) {
  const scene = SCENES[index];
  const isLast = index === SCENES.length - 1;

  // Último take: encerra com o NOME da marca em texto branco (mesma fonte das
  // demais frases) + CTA. Sem kicker roxo e sem frase — reforça o nome da empresa.
  if (isLast) {
    return (
      <div
        className={`scene-overlay scene-${index} absolute inset-x-0 bottom-[14%] flex flex-col items-center px-6 text-center sm:bottom-[16%]`}
      >
        <h2 className="max-w-4xl font-display text-3xl font-bold leading-[1.1] tracking-tight text-balance sm:text-5xl lg:text-6xl">
          RmConnect
        </h2>
        <div className="pointer-events-auto mt-9">
          <WhatsAppButton className="px-7 py-3.5 text-base">Agende uma reunião</WhatsAppButton>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`scene-overlay scene-${index} absolute inset-x-0 bottom-[14%] flex flex-col items-center px-6 text-center sm:bottom-[16%]`}
    >
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.4em] text-[var(--color-neon)] sm:text-sm">
        {scene.kicker}
      </p>
      <h2 className="max-w-4xl font-display text-3xl font-bold leading-[1.1] tracking-tight text-balance sm:text-5xl lg:text-6xl">
        {scene.title}
      </h2>
      {scene.items.length > 0 && (
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-foreground/70 sm:text-base">
          {scene.items.map((it, i) => (
            <li key={it} className="flex items-center gap-3">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-[var(--color-neon)]" />}
              {it}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Fallback estático (reduced-motion / sem WebGL): cenas empilhadas e legíveis. */
function StaticFallback() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-24 px-6 py-32 text-center">
      <Image src="/logo-mark.png" alt="RM Connect" width={180} height={180} priority />
      {SCENES.map((s, i) => (
        <div key={i} className="flex flex-col items-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.4em] text-[var(--color-neon)]">
            {s.kicker}
          </p>
          <h2 className="font-display text-3xl font-bold leading-tight text-balance sm:text-4xl">
            {s.title}
          </h2>
          {s.items.length > 0 && (
            <p className="mt-4 text-muted">{s.items.join(" · ")}</p>
          )}
          {i === SCENES.length - 1 && (
            <div className="mt-8">
              <WhatsAppButton>Agende uma reunião</WhatsAppButton>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function StoryStage({
  onActiveChange,
}: {
  onActiveChange?: (active: boolean) => void;
}) {
  const mounted = useSyncExternalStore(
    mountStore.subscribe,
    mountStore.getSnapshot,
    mountStore.getServerSnapshot,
  );
  const progress = useRef<Progress>({ value: 0 });
  const [active, setActive] = useState(true);

  const webglOk = useMemo(() => (mounted ? hasWebGL() : true), [mounted]);
  const isMobile = mounted && typeof window !== "undefined" && window.innerWidth < 768;
  const count = !mounted ? 9000 : isMobile ? 4500 : window.innerWidth < 1280 ? 9000 : 14000;
  const bloom = mounted && !isMobile;

  const ref = useGsap<HTMLDivElement>(
    (el) => {
      if (!mounted || !webglOk) return;

      const overlays = SCENES.map((_, i) => el.querySelector<HTMLElement>(`.scene-${i}`));
      // Estado inicial: TUDO oculto — o primeiro quadro mostra só a logo + partículas;
      // os textos surgem conforme o usuário rola.
      overlays.forEach((o) => o && gsap.set(o, { opacity: 0, y: 30 }));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=480%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onToggle: (self) => {
            setActive(self.isActive);
            onActiveChange?.(self.isActive);
          },
          onUpdate: (self) => {
            // O morph é dirigido pelo progresso do ScrollTrigger. Normalizamos por
            // 0.96: a logo se forma ~no fim do pin (cauda morta mínima), então
            // uma rolada a mais já libera o scroll para o resto do site.
            progress.current.value = Math.min(self.progress / 0.96, 1) * 5;
          },
        },
      });

      // A stage começa ativa (no topo) → header oculto desde já.
      onActiveChange?.(true);

      // Base de tempo da timeline (alinhada ao remap 0.96 → total = 5/0.96 ≈ 5.21)
      // p/ posicionar os textos das cenas; o morph em si vem do onUpdate acima.
      tl.to({ _: 0 }, { _: 1, duration: 5.21, ease: "none" }, 0);

      // Sincroniza textos com a narrativa (tempo == índice da cena).
      // A cena 0 só entra DEPOIS de iniciar a rolagem (topo = só logo + partículas).
      // Fade-THROUGH (não crossfade): cada texto some por completo antes do
      // próximo entrar — evita dois textos sobrepostos na mesma posição.
      const FADE = 0.22;
      SCENES.forEach((_, i) => {
        const o = overlays[i];
        if (!o) return;
        // Entrada alinhada ao tempo/forma da cena; a 0 só após iniciar a rolagem.
        const inAt = i === 0 ? 0.28 : i - 0.22;
        tl.fromTo(
          o,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: FADE, ease: "power2.out" },
          inAt,
        );
        // A última cena permanece (logo se reconstrói); as demais somem antes da próxima.
        if (i < SCENES.length - 1) {
          const outAt = i === 0 ? 0.52 : i + 0.18;
          tl.to(o, { opacity: 0, y: -26, duration: FADE, ease: "power2.in" }, outAt);
        }
      });

      ScrollTrigger.refresh();
    },
    [mounted, webglOk, count, bloom],
  );

  if (mounted && !webglOk) {
    return (
      <section className="relative bg-[var(--color-deep)]">
        <StaticFallback />
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden bg-[var(--color-deep)]"
    >
      {/* brilho de fundo */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(124,109,242,0.12),transparent_60%)]" />

      {mounted && (
        <CinematicCanvas progress={progress} count={count} bloom={bloom} paused={!active} />
      )}

      {/* Base escurecida atrás do texto — garante contraste/legibilidade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-deep via-deep/80 to-transparent" />

      {/* Overlays de texto */}
      <div className="pointer-events-none absolute inset-0">
        {SCENES.map((_, i) => (
          <SceneText key={i} index={i} />
        ))}
      </div>

      {/* Indicador de scroll (some após a 1ª cena) */}
      <div className="scene-cue pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <span className="text-[11px] uppercase tracking-[0.3em] text-muted">Role para explorar</span>
      </div>
    </section>
  );
}
