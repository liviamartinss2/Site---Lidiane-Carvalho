import Link from "next/link";
import type { Servico } from "@/lib/types";
import { formatBRL, formatDuracao } from "@/lib/format";

export function ServiceCard({ servico }: { servico: Servico }) {
  return (
    <div className="card-solid group flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-lg">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="h-serif text-xl">{servico.nome}</h3>
        <span className="selo-gold whitespace-nowrap text-xs">
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

      <div className="mt-auto flex items-center justify-between border-t border-line/70 pt-5">
        <span className="font-serif text-lg tracking-tight text-rose-wine">
          {servico.mostrar_valor ? formatBRL(servico.valor) : "Sob consulta"}
        </span>
        <Link
          href={`/agendar?servico=${servico.id}`}
          className="btn-primary px-5 py-2 text-sm"
        >
          Agendar
        </Link>
      </div>
    </div>
  );
}
