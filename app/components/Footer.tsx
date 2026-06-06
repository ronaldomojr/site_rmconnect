import Image from "next/image";
import { NAV_LINKS, WHATSAPP_URL } from "../lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-14 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <Image
            src="/logo-wordmark.png"
            alt="RM Connect"
            width={170}
            height={36}
            className="h-8 w-auto object-contain"
          />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Software sob demanda e automação inteligente com IA. Infraestruturas digitais
            escaláveis que eliminam a sobrecarga operacional.
          </p>
        </div>

        <nav className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-[0.2em] text-muted/70">Navegação</span>
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

        <div className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-[0.2em] text-muted/70">Contato</span>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted transition-colors hover:text-brand-light"
          >
            WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted/70 sm:flex-row">
          <span>© {new Date().getFullYear()} RM Connect. Todos os direitos reservados.</span>
          <span>Feito com engenharia de ponta · TypeScript · Next.js</span>
        </div>
      </div>
    </footer>
  );
}
