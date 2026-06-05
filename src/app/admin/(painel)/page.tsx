import Link from "next/link";
import { getMetricasDashboard } from "@/lib/admin-data";
import { formatBRL, formatHora, formatTelefone } from "@/lib/format";
import { config } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const m = await getMetricasDashboard();

  return (
    <div>
      <h1 className="h-serif text-3xl">Olá, Lidiane 👋</h1>
      <p className="text-ink-muted">Visão geral do seu dia e do seu negócio.</p>

      {/* Atendimentos */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold-dark">
          Atendimentos
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Metric titulo="Hoje" valor={m.atendHoje} />
          <Metric titulo="Esta semana" valor={m.atendSemana} />
          <Metric titulo="Este mês" valor={m.atendMes} />
        </div>
      </section>

      {/* Faturamento */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold-dark">
          Faturamento estimado
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Metric titulo="Hoje" valor={formatBRL(m.fatHoje)} destaque />
          <Metric titulo="Esta semana" valor={formatBRL(m.fatSemana)} destaque />
          <Metric titulo="Este mês" valor={formatBRL(m.fatMes)} destaque />
        </div>
      </section>

      {/* Alertas CRM */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/clientes?filtro=inativas"
          className="card-solid flex items-center gap-4 transition-shadow hover:shadow-glow"
        >
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-rose-soft text-xl">
            ⏰
          </span>
          <div>
            <p className="font-serif text-2xl text-rose-wine">{m.inativas}</p>
            <p className="text-sm text-ink-muted">
              clientes há +{config.reativacaoDias} dias sem voltar
            </p>
          </div>
        </Link>
        <Link
          href="/admin/clientes?filtro=aniversariantes"
          className="card-solid flex items-center gap-4 transition-shadow hover:shadow-glow"
        >
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold/15 text-xl">
            🎂
          </span>
          <div>
            <p className="font-serif text-2xl text-gold-dark">{m.aniversariantesMes}</p>
            <p className="text-sm text-ink-muted">aniversariantes este mês (make grátis)</p>
          </div>
        </Link>
      </section>

      {/* Proximos atendimentos */}
      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gold-dark">
            Próximos atendimentos
          </h2>
          <Link href="/admin/agenda" className="text-sm text-rose-wine hover:underline">
            Ver agenda →
          </Link>
        </div>
        <div className="card-solid divide-y divide-line p-0">
          {m.proximos.length === 0 && (
            <p className="px-5 py-6 text-center text-ink-muted">
              Nenhum atendimento agendado.
            </p>
          )}
          {m.proximos.map((a) => (
            <div key={a.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="font-medium text-ink">{a.cliente.nome}</p>
                <p className="text-sm text-ink-muted">
                  {a.servico.nome} · {formatTelefone(a.cliente.telefone)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-serif text-rose-wine">{formatHora(a.inicio)}</p>
                <p className="text-xs text-ink-muted">{formatBRL(a.valor_cobrado)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({
  titulo,
  valor,
  destaque,
}: {
  titulo: string;
  valor: string | number;
  destaque?: boolean;
}) {
  return (
    <div className="card-solid">
      <p className="text-sm text-ink-muted">{titulo}</p>
      <p
        className={`mt-1 font-serif text-3xl ${
          destaque ? "text-gold-dark" : "text-ink"
        }`}
      >
        {valor}
      </p>
    </div>
  );
}
