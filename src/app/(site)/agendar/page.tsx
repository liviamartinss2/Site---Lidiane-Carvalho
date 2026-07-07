import Link from "next/link";
import { getServicos } from "@/lib/data";
import { BookingFlow } from "@/components/BookingFlow";
import { config, whatsappLink } from "@/lib/config";
import { Brilho } from "@/components/Brilho";

export const metadata = {
  title: "Agendar horário — Lidiane Carvalho",
  description: "Agende seu horário online em menos de 1 minuto.",
};

export default async function AgendarPage({
  searchParams,
}: {
  searchParams: { servico?: string };
}) {
  // Agendamento online desligado (manutenção) — direciona para o WhatsApp.
  if (!config.agendamentoOnline) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <span className="eyebrow inline-flex items-center gap-2">
          <Brilho size={14} className="text-rose" />
          Agendamento
        </span>
        <h1 className="h-serif mt-3 text-4xl sm:text-5xl">
          Agende pelo <span className="italic font-medium text-rose">WhatsApp</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-ink-muted">
          Nosso agendamento online está em manutenção no momento. Para marcar seu
          horário é só chamar a gente no WhatsApp — rápido e direto. 💬
        </p>
        <a
          href={whatsappLink("Olá Lidiane! Gostaria de agendar um horário.")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn mt-8 inline-flex bg-[#25D366] text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M12.04 3C7.5 3 3.8 6.7 3.8 11.24c0 1.6.46 3.08 1.26 4.34L3.8 20.5l5.05-1.32a8.2 8.2 0 0 0 3.19.65c4.54 0 8.24-3.7 8.24-8.24S16.58 3 12.04 3Zm4.84 11.65c-.2.57-1.18 1.1-1.63 1.14-.43.04-.97.21-3.27-.7-2.74-1.08-4.47-3.9-4.6-4.08-.13-.18-1.1-1.47-1.1-2.8 0-1.32.7-1.97.94-2.24a.99.99 0 0 1 .72-.34c.18 0 .36 0 .52.01.17.01.4-.06.62.48.23.57.78 1.96.85 2.1.07.14.11.3.02.48-.09.18-.13.3-.27.46-.13.16-.28.36-.4.48-.13.13-.27.28-.12.54.15.27.66 1.1 1.42 1.78.98.87 1.8 1.14 2.06 1.27.26.13.4.11.55-.07.15-.18.63-.74.8-.99.16-.26.33-.21.55-.13.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.57-.14 1.14Z" />
          </svg>
          Agendar pelo WhatsApp
        </a>
        <div className="mt-6">
          <Link href="/" className="text-sm font-medium text-rose transition-colors hover:text-rose-wine">
            ← Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  const servicos = await getServicos();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <span className="eyebrow">
          Agendamento online
        </span>
        <h1 className="h-serif mt-1 text-4xl">Reserve seu horário</h1>
        <p className="mt-2 text-ink-muted">Rápido, fácil e em poucos toques.</p>
      </div>
      <BookingFlow servicos={servicos} servicoInicialId={searchParams.servico} />
    </div>
  );
}
