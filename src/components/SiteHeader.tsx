import Link from "next/link";
import { config } from "@/lib/config";

const nav = [
  { href: "/servicos", label: "Serviços" },
  { href: "/resultados", label: "Resultados" },
  { href: "/depoimentos", label: "Depoimentos" },
  { href: "/sobre", label: "Localização" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/60 bg-[conic-gradient(from_160deg,#8E4B5A,#C77B8C)] font-serif text-lg font-bold text-white shadow-glow">
            LC
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-base font-semibold text-ink">
              {config.studioNome}
            </span>
            <span className="block text-xs text-ink-muted">Estúdio de Beleza</span>
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

        <Link href="/agendar" className="btn-primary text-sm">
          Agendar horário
        </Link>
      </div>
    </header>
  );
}
