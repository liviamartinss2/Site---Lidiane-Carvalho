import type { Metadata } from "next";
import Link from "next/link";
import { config, whatsappLink } from "@/lib/config";
import { Stars } from "@/components/Stars";
import { Brilho } from "@/components/Brilho";
import { FotoLidiane } from "@/components/FotoLidiane";

export const metadata: Metadata = {
  title: `${config.studioNome} — Links | Clínica de Sobrancelhas em Aquiraz`,
  description:
    "Todos os links da clínica Lidiane Carvalho em um só lugar: agende seu horário, fale no WhatsApp, veja serviços, resultados e nos siga no Instagram.",
};

// ---------------------------------------------------------------------
//  Ícones (inline, sem dependências externas)
// ---------------------------------------------------------------------
const Icon = {
  calendar: (
    <path d="M8 2v3M16 2v3M3.5 9.5h17M5 4.5h14a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2Z" />
  ),
  whatsapp: (
    <path d="M12.04 3C7.5 3 3.8 6.7 3.8 11.24c0 1.6.46 3.08 1.26 4.34L3.8 20.5l5.05-1.32a8.2 8.2 0 0 0 3.19.65c4.54 0 8.24-3.7 8.24-8.24S16.58 3 12.04 3Zm4.84 11.65c-.2.57-1.18 1.1-1.63 1.14-.43.04-.97.21-3.27-.7-2.74-1.08-4.47-3.9-4.6-4.08-.13-.18-1.1-1.47-1.1-2.8 0-1.32.7-1.97.94-2.24a.99.99 0 0 1 .72-.34c.18 0 .36 0 .52.01.17.01.4-.06.62.48.23.57.78 1.96.85 2.1.07.14.11.3.02.48-.09.18-.13.3-.27.46-.13.16-.28.36-.4.48-.13.13-.27.28-.12.54.15.27.66 1.1 1.42 1.78.98.87 1.8 1.14 2.06 1.27.26.13.4.11.55-.07.15-.18.63-.74.8-.99.16-.26.33-.21.55-.13.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.57-.14 1.14Z" />
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.3" cy="6.7" r="0.4" fill="currentColor" stroke="none" />
    </>
  ),
  sparkles: (
    <path d="M12 3l1.6 4.2L18 9l-4.4 1.8L12 15l-1.6-4.2L6 9l4.4-1.8L12 3ZM18 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" />
  ),
  gallery: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <circle cx="8.5" cy="9.5" r="1.6" />
      <path d="M3.8 17l4.5-4 3.5 3 3.2-2.7 5 4.2" />
    </>
  ),
  heart: (
    <path d="M12 20s-7-4.3-9.2-8.3C1.2 8.6 2.6 5.5 5.6 5.1c1.9-.25 3.4.8 4.4 2.1 1-1.3 2.5-2.35 4.4-2.1 3 .4 4.4 3.5 2.8 6.6C19 15.7 12 20 12 20Z" />
  ),
  pin: (
    <>
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  star: (
    <path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 16.77l-5.2 2.74.99-5.79-4.21-4.1 5.82-.85L12 3.5Z" />
  ),
  chevron: <path d="M9 6l6 6-6 6" />,
};

type LinkItem = {
  href: string;
  external?: boolean;
  label: string;
  sub: string;
  icon: keyof typeof Icon;
  /** classes da bolha do ícone */
  bubble: string;
};

const links: LinkItem[] = [
  {
    href: whatsappLink("Olá Lidiane! Vim pelos links e gostaria de mais informações."),
    external: true,
    label: "Chamar no WhatsApp",
    sub: "Resposta rápida e atendimento direto",
    icon: "whatsapp",
    bubble: "bg-[#25D366] text-white",
  },
  {
    href: config.instagram,
    external: true,
    label: "Instagram",
    sub: "Bastidores, novidades e inspirações",
    icon: "instagram",
    bubble: "bg-[image:linear-gradient(135deg,#FEDA77,#DD2A7B,#8134AF)] text-white",
  },
  {
    href: "/servicos",
    label: "Serviços & valores",
    sub: "Sobrancelhas, cílios, lábios e maquiagem",
    icon: "sparkles",
    bubble: "bg-beige text-rose-wine",
  },
  {
    href: "/resultados",
    label: "Resultados",
    sub: "Antes e depois das nossas clientes",
    icon: "gallery",
    bubble: "bg-rose-soft text-rose",
  },
  {
    href: "/depoimentos",
    label: "Depoimentos",
    sub: "O que dizem quem já passou por aqui",
    icon: "heart",
    bubble: "bg-rose-soft text-rose",
  },
  {
    href: config.googleAvaliar,
    external: true,
    label: "Avalie no Google",
    sub: "Deixe sua avaliação no nosso perfil",
    icon: "star",
    bubble: "bg-beige text-gold-dark",
  },
  {
    href: config.mapsUrl,
    external: true,
    label: "Como chegar",
    sub: config.endereco,
    icon: "pin",
    bubble: "bg-ink text-cream",
  },
];

export default function LinksPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cream">
      {/* brilho de fundo editorial */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-page-glow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-12%] -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-rose/15 blur-[130px]"
      />

      <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col items-center px-5 py-14">
        {/* CABEÇALHO / PERFIL */}
        <header className="flex flex-col items-center text-center">
          <div className="relative">
            <Brilho className="absolute -left-3 top-1 z-10 text-rose" size={24} />
            <Brilho className="absolute -right-2 -top-3 z-10 text-beige" size={18} />
            <Brilho className="absolute -bottom-2 right-5 z-10 text-rose/70" size={16} />
            <span className="relative grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-rose-soft shadow-glow-lg ring-4 ring-white">
              <FotoLidiane
                alt="Lidiane Carvalho"
                className="absolute inset-0 h-full w-full object-cover object-[50%_28%]"
              />
            </span>
          </div>

          <h1 className="mt-6 font-serif text-3xl font-semibold tracking-tightest text-ink">
            {config.studioNome}
          </h1>
          <span className="eyebrow mt-2">Clínica de Sobrancelhas · Aquiraz — CE</span>

          <span className="selo-gold mt-5">★ {config.anosExperiencia} anos de experiência</span>

          <div className="mt-4 flex items-center gap-2">
            <Stars nota={5} />
            <span className="text-sm font-semibold text-ink">5,0</span>
            <span className="text-xs text-ink-muted">· avaliação das clientes</span>
          </div>
        </header>

        {/* BOTÃO PRINCIPAL — AGENDAR */}
        <Link
          href="/agendar"
          className="group relative mt-9 w-full overflow-hidden rounded-full bg-rose px-6 py-4 text-center shadow-glow transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-rose-vibrant hover:shadow-glow-lg active:translate-y-0 active:scale-[0.99]"
        >
          {/* brilho que passa no hover */}
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative flex items-center justify-center gap-2.5 font-serif text-lg font-semibold text-white">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {Icon.calendar}
            </svg>
            Agendar horário
          </span>
        </Link>
        <p className="mt-2.5 flex items-center gap-1.5 text-xs text-ink-muted">
          <Brilho size={11} className="text-rose" />
          Online, em menos de 1 minuto
        </p>

        {/* DEMAIS LINKS */}
        <nav className="mt-6 flex w-full flex-col gap-3">
          {links.map((item) => {
            const inner = (
              <>
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${item.bubble}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {Icon[item.icon]}
                  </svg>
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block font-medium text-ink">{item.label}</span>
                  <span className="block truncate text-xs text-ink-muted">
                    {item.sub}
                  </span>
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 shrink-0 text-ink-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-rose"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {Icon.chevron}
                </svg>
              </>
            );

            const className =
              "group flex items-center gap-3.5 rounded-2xl border border-line bg-white px-4 py-3.5 shadow-soft transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-rose";

            return item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {inner}
              </a>
            ) : (
              <Link key={item.label} href={item.href} className={className}>
                {inner}
              </Link>
            );
          })}
        </nav>

        {/* RODAPÉ */}
        <footer className="mt-12 flex flex-col items-center gap-3 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-rose transition-colors hover:text-rose-wine"
          >
            ← Visitar o site completo
          </Link>
          <p className="text-xs text-ink-muted">
            © {new Date().getFullYear()} {config.studioNome}
          </p>
        </footer>
      </div>
    </main>
  );
}
