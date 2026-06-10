import Link from "next/link";
import type { Servico } from "@/lib/types";
import { formatBRL, formatDuracao } from "@/lib/format";

export function ServiceCard({
  servico,
  indice,
}: {
  servico: Servico;
  indice?: number;
}) {
  return (
    <div className="group flex flex-col rounded-xl2 border border-line bg-white p-6 transition-all duration-300 hover:border-rose/60 hover:-translate-y-1">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-baseline gap-3">
          {indice != null && (
            <span className="num-serif">
              {String(indice).padStart(2, "0")}
            </span>
          )}
          <h3 className="h-serif text-2xl">{servico.nome}</h3>
        </div>
        <span className="selo-gold whitespace-nowrap">
          {formatDuracao(servico.duracao_min)}
        </span>
      </div>

      {servico.descricao && (
        <p className="text-sm leading-relaxed text-ink-muted">
          {servico.descricao}
        </p>
      )}

      {servico.beneficios && (
        <ul className="mt-4 space-y-1.5">
          {servico.beneficios.split(";").map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink-soft">
              <span className="mt-0.5 text-rose">✓</span>
              {b.trim()}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-line pt-5">
        <span className="font-serif text-xl tracking-tight text-rose-wine">
          {servico.mostrar_valor ? formatBRL(servico.valor) : "Sob consulta"}
        </span>
        <Link
          href={`/agendar?servico=${servico.id}`}
          className="text-sm font-medium text-ink transition-colors group-hover:text-rose"
        >
          Agendar →
        </Link>
      </div>
    </div>
  );
}
