"use client";

import { useState } from "react";
import Link from "next/link";
import { config } from "@/lib/config";

const nav = [
  { href: "/servicos", label: "Serviços" },
  { href: "/resultados", label: "Resultados" },
  { href: "/depoimentos", label: "Depoimentos" },
  { href: "/sobre", label: "Localização" },
];

export function SiteHeader() {
  const [aberto, setAberto] = useState(false);
  const fechar = () => setAberto(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" onClick={fechar} className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/60 bg-[conic-gradient(from_160deg,#8E4B5A,#C77B8C)] font-serif text-base font-bold text-white shadow-glow sm:h-11 sm:w-11 sm:text-lg">
            LC
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-sm font-semibold text-ink sm:text-base">
              {config.studioNome}
            </span>
            <span className="hidden text-xs text-ink-muted sm:block">
              Estúdio de Beleza
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-ink-soft transition-colors hover:text-rose-wine"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/agendar"
            onClick={fechar}
            className="btn-primary px-4 py-2.5 text-sm"
          >
            <span className="hidden sm:inline">Agendar horário</span>
            <span className="sm:hidden">Agendar</span>
          </Link>

          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={aberto}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-white text-ink transition-colors hover:border-rose md:hidden"
          >
            {aberto ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {aberto && (
        <nav className="border-t border-line bg-cream/95 px-2 py-2 backdrop-blur-md md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={fechar}
              className="block rounded-xl px-3 py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-rose-soft hover:text-rose-wine"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
