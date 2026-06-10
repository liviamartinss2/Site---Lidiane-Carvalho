"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login } from "./actions";

const estadoInicial = { erro: "" };

function BotaoEntrar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary btn-full mt-2">
      {pending ? "Entrando…" : "Entrar"}
    </button>
  );
}

export default function LoginPage() {
  const [estado, formAction] = useFormState(login as never, estadoInicial);

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[conic-gradient(from_160deg,#8E0038,#C9184A)] font-serif text-xl font-bold text-white shadow-glow">
            LC
          </span>
          <h1 className="h-serif mt-3 text-2xl">Painel da Lidiane</h1>
          <p className="text-sm text-ink-muted">Acesso exclusivo</p>
        </div>

        <form action={formAction} className="card-solid space-y-3">
          <div>
            <label className="label">E-mail</label>
            <input name="email" type="email" className="input" placeholder="voce@email.com" required />
          </div>
          <div>
            <label className="label">Senha</label>
            <input name="senha" type="password" className="input" placeholder="••••••••" required />
          </div>
          {estado?.erro && (
            <p className="rounded-xl bg-rose/10 px-4 py-2 text-sm text-rose-wine">
              {estado.erro}
            </p>
          )}
          <BotaoEntrar />
        </form>

        <p className="mt-4 text-center text-xs text-ink-muted">
          Sem banco configurado? O painel abre em modo demonstração.
        </p>
      </div>
    </div>
  );
}
