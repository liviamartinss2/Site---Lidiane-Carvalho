import { getAgendaDoDia } from "@/lib/admin-data";
import { formatBRL, formatHora, formatTelefone } from "@/lib/format";
import { whatsappLink } from "@/lib/config";

export const dynamic = "force-dynamic";

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

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: { data?: string };
}) {
  const data = searchParams.data ?? hojeISO();
  const agenda = await getAgendaDoDia(data);
  const total = agenda
    .filter((a) => a.status !== "cancelado")
    .reduce((s, a) => s + (a.valor_cobrado ?? 0), 0);

  const dataLabel = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date(`${data}T12:00:00`));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="h-serif text-3xl">Agenda</h1>
          <p className="capitalize text-ink-muted">{dataLabel}</p>
        </div>
        <form className="flex items-end gap-2">
          <div>
            <label className="label">Ver outro dia</label>
            <input type="date" name="data" defaultValue={data} className="input" />
          </div>
          <button className="btn-ghost">Ver</button>
        </form>
      </div>

      <div className="mt-4 flex gap-4">
        <div className="card-solid flex-1">
          <p className="text-sm text-ink-muted">Atendimentos</p>
          <p className="font-serif text-2xl text-ink">{agenda.length}</p>
        </div>
        <div className="card-solid flex-1">
          <p className="text-sm text-ink-muted">Previsto no dia</p>
          <p className="font-serif text-2xl text-gold-dark">{formatBRL(total)}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {agenda.length === 0 && (
          <div className="card-solid text-center text-ink-muted">
            Nenhum atendimento neste dia.
          </div>
        )}
        {agenda.map((a) => (
          <div key={a.id} className="card-solid flex flex-wrap items-center gap-4">
            <div className="text-center">
              <p className="font-serif text-xl text-rose-wine">{formatHora(a.inicio)}</p>
              <p className="text-xs text-ink-muted">{a.servico.duracao_min} min</p>
            </div>
            <div className="h-10 w-px bg-line" />
            <div className="flex-1">
              <p className="font-medium text-ink">{a.cliente.nome}</p>
              <p className="text-sm text-ink-muted">
                {a.servico.nome} · {formatTelefone(a.cliente.telefone)}
              </p>
              {a.observacoes && (
                <p className="mt-1 text-xs italic text-ink-muted">“{a.observacoes}”</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="font-serif text-rose-wine">{formatBRL(a.valor_cobrado)}</span>
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
  );
}
