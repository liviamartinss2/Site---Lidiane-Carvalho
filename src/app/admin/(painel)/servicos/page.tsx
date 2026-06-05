import { getServicos } from "@/lib/data";
import { formatBRL, formatDuracao } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ServicosAdminPage() {
  const servicos = await getServicos();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="h-serif text-3xl">Serviços</h1>
          <p className="text-ink-muted">Gerencie valores e durações dos procedimentos.</p>
        </div>
        <button className="btn-primary" disabled title="Disponível com o banco configurado">
          + Novo serviço
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl2 border border-line bg-white shadow-soft">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-rose-soft text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-semibold">Serviço</th>
              <th className="px-4 py-3 font-semibold">Categoria</th>
              <th className="px-4 py-3 font-semibold">Duração</th>
              <th className="px-4 py-3 font-semibold">Valor</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {servicos.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3 font-medium text-ink">{s.nome}</td>
                <td className="px-4 py-3 text-ink-muted">{s.categoria}</td>
                <td className="px-4 py-3 text-ink-muted">{formatDuracao(s.duracao_min)}</td>
                <td className="px-4 py-3 text-rose-wine">
                  {s.mostrar_valor ? formatBRL(s.valor) : "Sob consulta"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      s.ativo
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {s.ativo ? "ativo" : "inativo"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-ink-muted">
        A edição/criação de serviços grava na tabela <code>servicos</code> assim que
        o Supabase estiver configurado.
      </p>
    </div>
  );
}
