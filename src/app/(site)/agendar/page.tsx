import { getServicos } from "@/lib/data";
import { BookingFlow } from "@/components/BookingFlow";

export const metadata = {
  title: "Agendar horário — Lidiane Carvalho",
  description: "Agende seu horário online em menos de 1 minuto.",
};

export default async function AgendarPage({
  searchParams,
}: {
  searchParams: { servico?: string };
}) {
  const servicos = await getServicos();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 text-center">
        <span className="text-sm font-semibold uppercase tracking-wide text-gold-dark">
          Agendamento online
        </span>
        <h1 className="h-serif mt-1 text-4xl">Reserve seu horário</h1>
        <p className="mt-2 text-ink-muted">Rápido, fácil e em poucos toques.</p>
      </div>
      <BookingFlow servicos={servicos} servicoInicialId={searchParams.servico} />
    </div>
  );
}
