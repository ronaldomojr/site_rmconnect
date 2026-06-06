"use client";

import { useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { useGsap } from "../lib/useGsap";
import { NAV_LINKS } from "../lib/site";
import WhatsAppButton from "./WhatsAppButton";

export default function Header({ hidden = false }: { hidden?: boolean }) {
  const [open, setOpen] = useState(false);

  const ref = useGsap<HTMLElement>((el) => {
    const bar = el.querySelector(".header-bar");
    // Condensa ao rolar
    ScrollTrigger.create({
      start: "top -80",
      end: 99999,
      onUpdate: (self) => {
        gsap.to(bar, {
          backgroundColor:
            self.scroll() > 80 ? "rgba(14,12,22,0.72)" : "rgba(14,12,22,0)",
          backdropFilter: self.scroll() > 80 ? "blur(12px)" : "blur(0px)",
          borderColor:
            self.scroll() > 80 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0)",
          duration: 0.3,
        });
      },
    });
  });

  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out ${
        hidden ? "pointer-events-none translate-y-[-140%] opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="header-bar mx-auto mt-3 flex max-w-7xl items-center justify-between gap-4 rounded-full border border-transparent px-4 py-2.5 sm:px-6">
        <a href="#topo" className="flex items-center gap-2" aria-label="RM Connect — início">
          <Image
            src="/logo-mark.png"
            alt="RM Connect"
            width={80}
            height={80}
            priority
            className="h-10 w-auto object-contain"
          />
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <WhatsAppButton>Fale conosco</WhatsAppButton>
        </div>

        <button
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-full border border-border md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-0.5 w-4 bg-foreground transition-transform ${open ? "translate-y-1 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-4 bg-foreground transition-transform ${open ? "-translate-y-1 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="mx-3 mt-2 flex flex-col gap-1 rounded-2xl border border-border bg-surface/95 p-3 backdrop-blur-xl md:hidden">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm text-muted transition-colors hover:bg-white/5 hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <div className="px-2 pt-2">
            <WhatsAppButton className="w-full justify-center">Fale conosco</WhatsAppButton>
          </div>
        </div>
      )}
    </header>
  );
}
