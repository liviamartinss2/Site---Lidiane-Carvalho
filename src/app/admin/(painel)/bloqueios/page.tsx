import { getBloqueios } from "@/lib/admin-data";
import { removerBloqueio } from "@/app/actions/bloqueios";
import { BloqueioForm } from "@/components/BloqueioForm";
import { formatData, formatHora } from "@/lib/format";

export const dynamic = "force-dynamic";

/** Detecta se o bloqueio cobre o dia inteiro (00:00 → 23:59) */
function ehDiaInteiro(inicio: string, fim: string): boolean {
  return formatHora(inicio) === "00:00" && formatHora(fim) >= "23:59";
}

export default async function BloqueiosPage() {
  const bloqueios = await getBloqueios();

  return (
    <div>
      <h1 className="h-serif text-3xl">Bloqueios de agenda</h1>
      <p className="text-ink-muted">
        Reserve folgas, almoço, compromissos ou feriados. Esses períodos ficam
        automaticamente indisponíveis para agendamento no site.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <BloqueioForm />

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold-dark">
            Próximos bloqueios
          </h2>
          <div className="card-solid divide-y divide-line p-0">
            {bloqueios.length === 0 && (
              <p className="px-5 py-6 text-center text-ink-muted">
                Nenhum bloqueio cadastrado.
              </p>
            )}
            {bloqueios.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between gap-3 px-5 py-3"
              >
                <div>
                  <p className="font-medium capitalize text-ink">
                    {formatData(b.inicio)}
                  </p>
                  <p className="text-sm text-ink-muted">
                    {ehDiaInteiro(b.inicio, b.fim)
                      ? "Dia inteiro"
                      : `${formatHora(b.inicio)} – ${formatHora(b.fim)}`}
                    {b.motivo ? ` · ${b.motivo}` : ""}
                  </p>
                </div>
                <form action={removerBloqueio}>
                  <input type="hidden" name="id" value={b.id} />
                  <button
                    type="submit"
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remover
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
