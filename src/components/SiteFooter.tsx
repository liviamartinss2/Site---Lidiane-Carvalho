import Link from "next/link";
import { config } from "@/lib/config";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-ink text-cream/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <h3 className="font-serif text-lg text-white">{config.studioNome}</h3>
          <p className="mt-2 text-sm text-cream/60">
            Estúdio de Beleza · {config.anosExperiencia} anos de experiência
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gold-light">
            Onde estamos
          </h4>
          <p className="mt-2 text-sm text-cream/70">{config.endereco}</p>
          <a
            href={config.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-gold-light hover:underline"
          >
            Abrir no Google Maps →
          </a>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gold-light">
            Contato
          </h4>
          <div className="mt-2 flex flex-col gap-1 text-sm">
            <a
              href={config.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/70 hover:text-white"
            >
              Instagram
            </a>
            <a
              href={config.googleAvaliar}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/70 hover:text-white"
            >
              Avaliar no Google
            </a>
            <Link href="/agendar" className="text-cream/70 hover:text-white">
              Agendar horário
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} {config.studioNome}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
