"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Servico } from "@/lib/types";
import { formatBRL, formatDuracao } from "@/lib/format";
import { criarAgendamento } from "@/app/actions/agendamento";

interface Slot {
  inicio: string;
  label: string;
}

const CATEGORIAS_LABEL: Record<string, string> = {
  Sobrancelhas: "Sobrancelhas",
  Cilios: "Cílios",
  Labios: "Lábios",
  Maquiagem: "Maquiagem",
  Geral: "Outros",
};

function hoje(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dia}`;
}

export function BookingFlow({
  servicos,
  servicoInicialId,
}: {
  servicos: Servico[];
  servicoInicialId?: string;
}) {
  const router = useRouter();
  const [passo, setPasso] = useState(servicoInicialId ? 2 : 1);
  const [servicoId, setServicoId] = useState(servicoInicialId ?? "");
  const [data, setData] = useState(hoje());
  const [slot, setSlot] = useState<Slot | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [carregandoSlots, setCarregandoSlots] = useState(false);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [aniversario, setAniversario] = useState("");
  const [obs, setObs] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  const servico = useMemo(
    () => servicos.find((s) => s.id === servicoId) ?? null,
    [servicos, servicoId]
  );

  // pre-preenche nome salvo
  useEffect(() => {
    const n = localStorage.getItem("cli_nome");
    const t = localStorage.getItem("cli_tel");
    if (n) setNome(n);
    if (t) setTelefone(t);
  }, []);

  // busca slots quando entra no passo 3
  useEffect(() => {
    if (passo !== 3 || !servico) return;
    setCarregandoSlots(true);
    setSlot(null);
    fetch(`/api/disponibilidade?data=${data}&servico=${servico.id}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots ?? []))
      .catch(() => setSlots([]))
      .finally(() => setCarregandoSlots(false));
  }, [passo, data, servico]);

  async function confirmar() {
    if (!servico || !slot) return;
    setErro("");
    if (!nome.trim() || telefone.replace(/\D/g, "").length < 10) {
      setErro("Preencha seu nome e um telefone válido (com DDD).");
      return;
    }
    setEnviando(true);
    localStorage.setItem("cli_nome", nome.trim());
    localStorage.setItem("cli_tel", telefone);

    const res = await criarAgendamento({
      servicoId: servico.id,
      inicioISO: slot.inicio,
      nome,
      telefone,
      aniversario,
      observacoes: obs,
    });
    setEnviando(false);

    if (!res.ok) {
      setErro(res.erro ?? "Não foi possível concluir. Tente novamente.");
      if (res.erro?.includes("reservado")) setPasso(3); // volta para escolher outro horario
      return;
    }

    const params = new URLSearchParams({
      servico: servico.nome,
      inicio: res.inicioISO!,
      nome: nome.trim(),
    });
    router.push(`/agendar/sucesso?${params.toString()}`);
  }

  const porCategoria = useMemo(() => {
    const map: Record<string, Servico[]> = {};
    for (const s of servicos) (map[s.categoria] ??= []).push(s);
    return map;
  }, [servicos]);

  return (
    <div className="mx-auto max-w-2xl">
      <Stepper passo={passo} />

      <div className="card-solid mt-6">
        {/* PASSO 1 — SERVICO */}
        {passo === 1 && (
          <div>
            <h2 className="h-serif text-2xl">Escolha o serviço</h2>
            <div className="mt-4 space-y-5">
              {Object.entries(porCategoria).map(([cat, itens]) => (
                <div key={cat}>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gold-dark">
                    {CATEGORIAS_LABEL[cat] ?? cat}
                  </p>
                  <div className="grid gap-2">
                    {itens.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setServicoId(s.id);
                          setPasso(2);
                        }}
                        className="flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3 text-left transition-all hover:border-rose hover:shadow-glow"
                      >
                        <span>
                          <span className="block font-medium text-ink">{s.nome}</span>
                          <span className="text-xs text-ink-muted">
                            {formatDuracao(s.duracao_min)}
                            {s.mostrar_valor ? ` · ${formatBRL(s.valor)}` : ""}
                          </span>
                        </span>
                        <span className="text-rose">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PASSO 2 — DATA */}
        {passo === 2 && servico && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="h-serif text-2xl">Escolha a data</h2>
              <button onClick={() => setPasso(1)} className="text-sm text-rose-wine hover:underline">
                ← trocar serviço
              </button>
            </div>
            <p className="mb-4 rounded-xl bg-rose-soft px-4 py-2 text-sm text-rose-wine">
              {servico.nome} · {formatDuracao(servico.duracao_min)}
            </p>
            <label className="label">Data desejada</label>
            <input
              type="date"
              className="input"
              value={data}
              min={hoje()}
              onChange={(e) => setData(e.target.value)}
            />
            <button onClick={() => setPasso(3)} className="btn-primary btn-full mt-5">
              Ver horários disponíveis
            </button>
          </div>
        )}

        {/* PASSO 3 — HORARIO */}
        {passo === 3 && servico && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="h-serif text-2xl">Escolha o horário</h2>
              <button onClick={() => setPasso(2)} className="text-sm text-rose-wine hover:underline">
                ← trocar data
              </button>
            </div>

            {carregandoSlots && <p className="text-ink-muted">Buscando horários…</p>}

            {!carregandoSlots && slots.length === 0 && (
              <div className="rounded-xl bg-rose-soft px-4 py-6 text-center text-ink-muted">
                Nenhum horário livre nesse dia. Tente outra data. 💕
              </div>
            )}

            {!carregandoSlots && slots.length > 0 && (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {slots.map((s) => (
                  <button
                    key={s.inicio}
                    onClick={() => setSlot(s)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                      slot?.inicio === s.inicio
                        ? "border-rose bg-rose text-white shadow-glow"
                        : "border-line bg-white text-ink-soft hover:border-rose"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setPasso(4)}
              disabled={!slot}
              className="btn-primary btn-full mt-5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continuar
            </button>
          </div>
        )}

        {/* PASSO 4 — DADOS */}
        {passo === 4 && servico && slot && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="h-serif text-2xl">Seus dados</h2>
              <button onClick={() => setPasso(3)} className="text-sm text-rose-wine hover:underline">
                ← trocar horário
              </button>
            </div>

            <div className="mb-4 rounded-xl bg-rose-soft px-4 py-3 text-sm text-rose-wine">
              <strong>{servico.nome}</strong>
              <br />
              {new Intl.DateTimeFormat("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
              }).format(new Date(slot.inicio))}{" "}
              às {slot.label}
            </div>

            <div className="space-y-3">
              <div>
                <label className="label">Seu nome *</label>
                <input
                  className="input"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex.: Ana Souza"
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="label">WhatsApp / Telefone *</label>
                <input
                  className="input"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(85) 98193-3902"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </div>
              <div>
                <label className="label">
                  Seu aniversário 🎁{" "}
                  <span className="text-xs text-gold-dark">
                    (ganhe uma make grátis no seu mês!)
                  </span>
                </label>
                <input
                  type="date"
                  className="input"
                  value={aniversario}
                  onChange={(e) => setAniversario(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Observações (opcional)</label>
                <textarea
                  className="input min-h-[80px]"
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  placeholder="Ex.: pele sensível, primeira vez, etc."
                />
              </div>
            </div>

            {erro && (
              <p className="mt-3 rounded-xl bg-rose/10 px-4 py-2 text-sm text-rose-wine">
                {erro}
              </p>
            )}

            <button
              onClick={confirmar}
              disabled={enviando}
              className="btn-primary btn-full mt-5 disabled:opacity-60"
            >
              {enviando ? "Confirmando…" : "Confirmar agendamento"}
            </button>
            <p className="mt-2 text-center text-xs text-ink-muted">
              Ao confirmar, seu horário é reservado e você poderá avisar a Lidiane no WhatsApp.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Stepper({ passo }: { passo: number }) {
  const etapas = ["Serviço", "Data", "Horário", "Confirmar"];
  return (
    <div className="flex items-center justify-between gap-1">
      {etapas.map((nome, i) => {
        const n = i + 1;
        const ativo = passo >= n;
        return (
          <div key={nome} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`grid h-9 w-9 place-items-center rounded-full border font-serif text-sm transition-all duration-300 ${
                  ativo
                    ? "border-rose bg-rose text-white"
                    : "border-line bg-white text-ink-muted"
                }`}
              >
                {n}
              </div>
              <span
                className={`text-[10px] uppercase tracking-[0.14em] transition-colors sm:text-[11px] ${
                  ativo ? "text-ink" : "text-ink-muted"
                }`}
              >
                {nome}
              </span>
            </div>
            {i < etapas.length - 1 && (
              <div
                className={`mx-2 h-px flex-1 transition-colors duration-300 ${
                  passo > n ? "bg-rose" : "bg-line"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
