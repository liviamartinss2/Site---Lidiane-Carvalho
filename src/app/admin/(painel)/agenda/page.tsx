import Link from "next/link";
import { getAgendaIntervalo } from "@/lib/admin-data";
import { formatBRL, formatData, formatHora, formatTelefone } from "@/lib/format";
import { whatsappLink } from "@/lib/config";
import type { AgendamentoDetalhado } from "@/lib/types";

export const dynamic = "force-dynamic";

type Visao = "dia" | "semana" | "mes";

const STATUS_COR: Record<string, string> = {
  agendado: "bg-rose-soft text-rose-wine",
  remarcado: "bg-gold/15 text-gold-dark",
  concluido: "bg-green-100 text-green-700",
  cancelado: "bg-gray-100 text-gray-500",
  no_show: "bg-red-100 text-red-600",
};

function hojeISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dia}`;
}

/** Calcula o intervalo [de, ate] conforme a visão escolhida */
function intervalo(visao: Visao, baseISO: string): { de: Date; ate: Date } {
  const [y, m, d] = baseISO.split("-").map(Number);

  if (visao === "semana") {
    const base = new Date(y, m - 1, d);
    const de = new Date(base);
    de.setDate(base.getDate() - base.getDay()); // domingo
    de.setHours(0, 0, 0, 0);
    const ate = new Date(de);
    ate.setDate(de.getDate() + 6);
    ate.setHours(23, 59, 59, 999);
    return { de, ate };
  }

  if (visao === "mes") {
    return {
      de: new Date(y, m - 1, 1, 0, 0, 0),
      ate: new Date(y, m, 0, 23, 59, 59),
    };
  }

  // dia
  return {
    de: new Date(y, m - 1, d, 0, 0, 0),
    ate: new Date(y, m - 1, d, 23, 59, 59),
  };
}

/** Rótulo amigável do período */
function rotuloPeriodo(visao: Visao, de: Date, ate: Date): string {
  if (visao === "dia") {
    return new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    }).format(de);
  }
  if (visao === "mes") {
    return new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
    }).format(de);
  }
  return `${formatData(de)} a ${formatData(ate)}`;
}

/** Agrupa os atendimentos por dia (chave YYYY-MM-DD) */
function agruparPorDia(
  lista: AgendamentoDetalhado[]
): { chave: string; itens: AgendamentoDetalhado[] }[] {
  const mapa = new Map<string, AgendamentoDetalhado[]>();
  for (const a of lista) {
    const chave = a.inicio.slice(0, 10);
    (mapa.get(chave) ?? mapa.set(chave, []).get(chave)!).push(a);
  }
  return [...mapa.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([chave, itens]) => ({ chave, itens }));
}

function labelDia(chave: string): string {
  const [y, m, d] = chave.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date(y, m - 1, d, 12, 0, 0));
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: { data?: string; visao?: string };
}) {
  const visao: Visao =
    searchParams.visao === "semana"
      ? "semana"
      : searchParams.visao === "mes"
      ? "mes"
      : "dia";
  const base = searchParams.data ?? hojeISO();

  const { de, ate } = intervalo(visao, base);
  const agenda = await getAgendaIntervalo(de.toISOString(), ate.toISOString());

  const ativos = agenda.filter((a) => a.status !== "cancelado");
  const total = ativos.reduce((s, a) => s + (a.valor_cobrado ?? 0), 0);
  const grupos = agruparPorDia(agenda);

  const tabs: { id: Visao; label: string }[] = [
    { id: "dia", label: "Dia" },
    { id: "semana", label: "Semana" },
    { id: "mes", label: "Mês" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="h-serif text-3xl">Agenda</h1>
          <p className="capitalize text-ink-muted">
            {rotuloPeriodo(visao, de, ate)}
          </p>
        </div>
        <form className="flex items-end gap-2">
          <input type="hidden" name="visao" value={visao} />
          <div>
            <label className="label">Ir para a data</label>
            <input type="date" name="data" defaultValue={base} className="input" />
          </div>
          <button className="btn-ghost">Ver</button>
        </form>
      </div>

      {/* Seletor de visão */}
      <div className="mt-4 inline-flex rounded-xl border border-line bg-white p-1">
        {tabs.map((t) => {
          const ativo = t.id === visao;
          return (
            <Link
              key={t.id}
              href={`/admin/agenda?visao=${t.id}&data=${base}`}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                ativo
                  ? "bg-rose-gradient text-white"
                  : "text-ink-muted hover:text-rose-wine"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-4 flex gap-4">
        <div className="card-solid flex-1">
          <p className="text-sm text-ink-muted">Atendimentos no período</p>
          <p className="font-serif text-2xl text-ink">{ativos.length}</p>
        </div>
        <div className="card-solid flex-1">
          <p className="text-sm text-ink-muted">Previsto no período</p>
          <p className="font-serif text-2xl text-gold-dark">{formatBRL(total)}</p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {grupos.length === 0 && (
          <div className="card-solid text-center text-ink-muted">
            Nenhum atendimento neste período.
          </div>
        )}

        {grupos.map((g) => (
          <div key={g.chave}>
            {visao !== "dia" && (
              <h2 className="mb-2 text-sm font-semibold capitalize text-gold-dark">
                {labelDia(g.chave)}
              </h2>
            )}
            <div className="space-y-3">
              {g.itens.map((a) => (
                <div
                  key={a.id}
                  className="card-solid flex flex-wrap items-center gap-4"
                >
                  <div className="text-center">
                    <p className="font-serif text-xl text-rose-wine">
                      {formatHora(a.inicio)}
                    </p>
                    <p className="text-xs text-ink-muted">
                      {a.servico.duracao_min} min
                    </p>
                  </div>
                  <div className="h-10 w-px bg-line" />
                  <div className="flex-1">
                    <p className="font-medium text-ink">{a.cliente.nome}</p>
                    <p className="text-sm text-ink-muted">
                      {a.servico.nome} · {formatTelefone(a.cliente.telefone)}
                    </p>
                    {a.observacoes && (
                      <p className="mt-1 text-xs italic text-ink-muted">
                        “{a.observacoes}”
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-rose-wine">
                      {formatBRL(a.valor_cobrado)}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        STATUS_COR[a.status] ?? "bg-gray-100"
                      }`}
                    >
                      {a.status}
                    </span>
                    <a
                      href={whatsappLink(
                        `Olá ${a.cliente.nome}! Tudo bem? Passando para confirmar seu horário.`,
                        a.cliente.telefone
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-rose-wine hover:underline"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
