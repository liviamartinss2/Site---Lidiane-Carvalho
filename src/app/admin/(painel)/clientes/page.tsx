import Link from "next/link";
import { getClientesCRM } from "@/lib/admin-data";
import { formatBRL, formatTelefone, formatData } from "@/lib/format";
import { config, whatsappLink } from "@/lib/config";

export const dynamic = "force-dynamic";

const MESES = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: { filtro?: string };
}) {
  const filtro = searchParams.filtro ?? "todas";
  let clientes = await getClientesCRM();

  if (filtro === "inativas") {
    clientes = clientes.filter(
      (c) => c.diasSemVir != null && c.diasSemVir >= config.reativacaoDias
    );
  } else if (filtro === "aniversariantes") {
    clientes = clientes.filter((c) => c.aniversarianteMes);
  }

  const filtros = [
    { id: "todas", label: "Todas" },
    { id: "inativas", label: `Inativas (+${config.reativacaoDias}d)` },
    { id: "aniversariantes", label: "Aniversariantes 🎂" },
  ];

  return (
    <div>
      <h1 className="h-serif text-3xl">Clientes & CRM</h1>
      <p className="text-ink-muted">
        Controle de frequência, reativação e aniversários.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {filtros.map((f) => (
          <Link
            key={f.id}
            href={`/admin/clientes?filtro=${f.id}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filtro === f.id
                ? "bg-rose-gradient text-white"
                : "border border-line bg-white text-ink-soft hover:border-rose"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {clientes.length === 0 && (
          <div className="card-solid text-center text-ink-muted">
            Nenhuma cliente neste filtro.
          </div>
        )}
        {clientes.map((c) => {
          const inativa =
            c.diasSemVir != null && c.diasSemVir >= config.reativacaoDias;
          const mensagemReativacao = `Oi ${c.nome}! Sentimos sua falta 💕 Que tal renovar seu visual? Tenho horários abertos essa semana. Quer agendar?`;
          const mensagemAniversario = `Feliz mês de aniversário, ${c.nome}! 🎂 Você ganhou uma Make Express de presente. Vamos agendar para você aproveitar?`;

          return (
            <div key={c.id} className="card-solid">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 font-medium text-ink">
                    {c.nome}
                    {c.aniversarianteMes && (
                      <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs text-gold-dark">
                        🎂 aniversariante
                      </span>
                    )}
                    {inativa && (
                      <span className="rounded-full bg-rose-soft px-2 py-0.5 text-xs text-rose-wine">
                        ⏰ {c.diasSemVir} dias sem vir
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-ink-muted">
                    {formatTelefone(c.telefone)}
                    {c.data_nascimento && (
                      <>
                        {" · 🎁 "}
                        {Number(c.data_nascimento.split("-")[2])} de{" "}
                        {MESES[Number(c.data_nascimento.split("-")[1]) - 1]}
                      </>
                    )}
                  </p>
                  {c.observacoes && (
                    <p className="mt-1 text-xs italic text-ink-muted">“{c.observacoes}”</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-serif text-rose-wine">{formatBRL(c.total_gasto)}</p>
                  <p className="text-xs text-ink-muted">
                    {c.qtd_atendimentos} atendimentos
                  </p>
                  {c.ultimo_atendimento && (
                    <p className="text-xs text-ink-muted">
                      último: {formatData(c.ultimo_atendimento)}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
                {inativa && (
                  <a
                    href={whatsappLink(mensagemReativacao, c.telefone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-xs"
                  >
                    Enviar reativação
                  </a>
                )}
                {c.aniversarianteMes && (
                  <a
                    href={whatsappLink(mensagemAniversario, c.telefone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold text-xs"
                  >
                    Enviar make grátis 🎁
                  </a>
                )}
                <a
                  href={whatsappLink(`Olá ${c.nome}!`, c.telefone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-xs"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
