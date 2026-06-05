import { getMetricasDashboard } from "@/lib/admin-data";
import { formatBRL } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function FinanceiroPage() {
  const m = await getMetricasDashboard();

  const cards = [
    { titulo: "Previsto hoje", valor: m.fatHoje, atend: m.atendHoje },
    { titulo: "Previsto na semana", valor: m.fatSemana, atend: m.atendSemana },
    { titulo: "Previsto no mês", valor: m.fatMes, atend: m.atendMes },
  ];

  const ticketMedio = m.atendMes > 0 ? m.fatMes / m.atendMes : 0;

  return (
    <div>
      <h1 className="h-serif text-3xl">Financeiro</h1>
      <p className="text-ink-muted">Visão clara do faturamento esperado.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.titulo} className="card-solid">
            <p className="text-sm text-ink-muted">{c.titulo}</p>
            <p className="mt-1 font-serif text-3xl text-gold-dark">
              {formatBRL(c.valor)}
            </p>
            <p className="mt-1 text-xs text-ink-muted">{c.atend} atendimentos</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="card-solid">
          <p className="text-sm text-ink-muted">Ticket médio (mês)</p>
          <p className="mt-1 font-serif text-2xl text-rose-wine">
            {formatBRL(ticketMedio)}
          </p>
        </div>
        <div className="card-solid">
          <p className="text-sm text-ink-muted">Atendimentos no mês</p>
          <p className="mt-1 font-serif text-2xl text-ink">{m.atendMes}</p>
        </div>
      </div>

      <p className="mt-6 text-xs text-ink-muted">
        * Valores estimados com base nos serviços agendados. O faturamento real é
        consolidado quando cada atendimento é marcado como “concluído”.
      </p>
    </div>
  );
}
