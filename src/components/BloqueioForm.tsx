"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { criarBloqueio, type ResultadoBloqueio } from "@/app/actions/bloqueios";

const estadoInicial: ResultadoBloqueio = { ok: false };

function BotaoSalvar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary btn-full" disabled={pending}>
      {pending ? "Salvando..." : "Bloquear período"}
    </button>
  );
}

export function BloqueioForm() {
  const [state, formAction] = useFormState(criarBloqueio, estadoInicial);
  const [diaInteiro, setDiaInteiro] = useState(true);

  return (
    <form action={formAction} className="card-solid space-y-4">
      <h2 className="font-serif text-lg text-ink">Novo bloqueio</h2>

      <div>
        <label className="label">Data</label>
        <input type="date" name="data" required className="input" />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <input
          type="checkbox"
          name="dia_inteiro"
          checked={diaInteiro}
          onChange={(e) => setDiaInteiro(e.target.checked)}
          className="h-4 w-4 accent-rose-wine"
        />
        Bloquear o dia inteiro
      </label>

      {!diaInteiro && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Das</label>
            <input type="time" name="hora_inicio" className="input" />
          </div>
          <div>
            <label className="label">Até</label>
            <input type="time" name="hora_fim" className="input" />
          </div>
        </div>
      )}

      <div>
        <label className="label">Motivo (opcional)</label>
        <input
          type="text"
          name="motivo"
          placeholder="Ex.: folga, almoço, compromisso"
          className="input"
        />
      </div>

      {state.erro && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.erro}
        </p>
      )}
      {state.ok && (
        <p className="rounded-xl bg-green-50 px-3 py-2 text-sm text-green-700">
          Bloqueio adicionado! Esse período já está indisponível no site.
        </p>
      )}

      <BotaoSalvar />
    </form>
  );
}
