"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Servico } from "@/lib/types";
import { formatBRL, formatDuracao } from "@/lib/format";
import {
  salvarServico,
  removerServico,
  alternarAtivoServico,
  type ResultadoServico,
} from "@/app/actions/servicos";

const CATEGORIAS = ["Sobrancelhas", "Cilios", "Labios", "Maquiagem", "Geral"];

export function ServicosManager({
  servicos,
  demo,
}: {
  servicos: Servico[];
  demo: boolean;
}) {
  const router = useRouter();
  const [editando, setEditando] = useState<string | null>(null);
  const [criando, setCriando] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; texto: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function aplicar(res: ResultadoServico, sucesso: string) {
    if (res.ok) {
      setMsg({ ok: true, texto: sucesso });
      setEditando(null);
      setCriando(false);
      router.refresh();
    } else {
      setMsg({ ok: false, texto: res.erro ?? "Algo deu errado." });
    }
  }

  function salvar(form: HTMLFormElement) {
    const fd = new FormData(form);
    startTransition(async () => aplicar(await salvarServico(fd), "Serviço salvo!"));
  }

  function remover(s: Servico) {
    if (!confirm(`Remover "${s.nome}"? Essa ação não pode ser desfeita.`)) return;
    const fd = new FormData();
    fd.set("id", s.id);
    startTransition(async () => aplicar(await removerServico(fd), "Serviço removido."));
  }

  function alternar(s: Servico) {
    const fd = new FormData();
    fd.set("id", s.id);
    fd.set("ativo", String(!s.ativo));
    startTransition(async () =>
      aplicar(
        await alternarAtivoServico(fd),
        s.ativo ? "Serviço desativado." : "Serviço ativado."
      )
    );
  }

  return (
    <div>
      {demo && (
        <p className="mb-4 rounded-xl bg-gold/15 px-4 py-2 text-sm text-gold-dark">
          Modo demonstração — as alterações não são salvas. Conecte o Supabase para
          gerenciar de verdade.
        </p>
      )}

      {msg && (
        <p
          className={`mb-4 rounded-xl px-4 py-2 text-sm ${
            msg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
          }`}
        >
          {msg.texto}
        </p>
      )}

      <div className="mb-5">
        {!criando ? (
          <button
            className="btn-primary"
            onClick={() => {
              setCriando(true);
              setEditando(null);
              setMsg(null);
            }}
          >
            + Novo serviço
          </button>
        ) : (
          <div className="card-solid">
            <h2 className="mb-3 font-serif text-lg text-ink">Novo serviço</h2>
            <ServicoForm
              servico={null}
              onSalvar={salvar}
              onCancelar={() => setCriando(false)}
              pending={pending}
            />
          </div>
        )}
      </div>

      <div className="space-y-3">
        {servicos.map((s) => (
          <div key={s.id} className="card-solid">
            {editando === s.id ? (
              <>
                <h2 className="mb-3 font-serif text-lg text-ink">Editar serviço</h2>
                <ServicoForm
                  servico={s}
                  onSalvar={salvar}
                  onCancelar={() => setEditando(null)}
                  pending={pending}
                />
              </>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 font-medium text-ink">
                    {s.nome}
                    {!s.ativo && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                        inativo
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-ink-muted">
                    {s.categoria} · {formatDuracao(s.duracao_min)} ·{" "}
                    {s.mostrar_valor ? formatBRL(s.valor) : "Sob consulta"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="btn-ghost px-3 py-2 text-xs"
                    disabled={pending}
                    onClick={() => {
                      setEditando(s.id);
                      setCriando(false);
                      setMsg(null);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-ghost px-3 py-2 text-xs"
                    disabled={pending}
                    onClick={() => alternar(s)}
                  >
                    {s.ativo ? "Desativar" : "Ativar"}
                  </button>
                  <button
                    className="px-2 text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
                    disabled={pending}
                    onClick={() => remover(s)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {servicos.length === 0 && (
          <div className="card-solid text-center text-ink-muted">
            Nenhum serviço cadastrado ainda.
          </div>
        )}
      </div>
    </div>
  );
}

function ServicoForm({
  servico,
  onSalvar,
  onCancelar,
  pending,
}: {
  servico: Servico | null;
  onSalvar: (form: HTMLFormElement) => void;
  onCancelar: () => void;
  pending: boolean;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSalvar(e.currentTarget);
      }}
      className="space-y-3"
    >
      {servico && <input type="hidden" name="id" value={servico.id} />}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Nome *</label>
          <input
            name="nome"
            defaultValue={servico?.nome ?? ""}
            className="input"
            required
          />
        </div>
        <div>
          <label className="label">Categoria</label>
          <select
            name="categoria"
            defaultValue={servico?.categoria ?? "Sobrancelhas"}
            className="input"
          >
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Duração (minutos)</label>
          <input
            type="number"
            name="duracao_min"
            defaultValue={servico?.duracao_min ?? 60}
            min={5}
            step={5}
            className="input"
          />
        </div>
        <div>
          <label className="label">Valor (R$)</label>
          <input
            name="valor"
            defaultValue={servico?.valor != null ? String(servico.valor) : ""}
            placeholder="vazio = sob consulta"
            inputMode="decimal"
            className="input"
          />
        </div>
        <div>
          <label className="label">Ordem de exibição</label>
          <input
            type="number"
            name="ordem"
            defaultValue={servico?.ordem ?? 0}
            className="input"
          />
        </div>
      </div>

      <div>
        <label className="label">Descrição</label>
        <textarea
          name="descricao"
          defaultValue={servico?.descricao ?? ""}
          className="input min-h-[60px]"
        />
      </div>

      <div>
        <label className="label">Benefícios (separe por ponto e vírgula ;)</label>
        <input
          name="beneficios"
          defaultValue={servico?.beneficios ?? ""}
          placeholder="Ex.: Realça o olhar; resultado natural; duradouro"
          className="input"
        />
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            name="mostrar_valor"
            defaultChecked={servico?.mostrar_valor ?? true}
            className="h-4 w-4 accent-rose-wine"
          />
          Mostrar valor no site
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            name="ativo"
            defaultChecked={servico?.ativo ?? true}
            className="h-4 w-4 accent-rose-wine"
          />
          Ativo (aparece no site)
        </label>
      </div>

      <div className="flex gap-2 pt-1">
        <button type="submit" className="btn-primary text-sm" disabled={pending}>
          {pending ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          className="btn-ghost text-sm"
          onClick={onCancelar}
          disabled={pending}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
