import Link from "next/link";
import type { Servico } from "@/lib/types";
import { formatBRL, formatDuracao } from "@/lib/format";

export function ServiceCard({ servico }: { servico: Servico }) {
  return (
    <div className="card-solid flex flex-col transition-shadow hover:shadow-glow">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="h-serif text-xl">{servico.nome}</h3>
        <span className="selo-gold whitespace-nowrap text-xs">
          {formatDuracao(servico.duracao_min)}
        </span>
      </div>

      {servico.descricao && (
        <p className="text-sm text-ink-muted">{servico.descricao}</p>
      )}

      {servico.beneficios && (
        <ul className="mt-3 space-y-1">
          {servico.beneficios.split(";").map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink-soft">
              <span className="mt-0.5 text-rose">✓</span>
              {b.trim()}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
        <span className="font-serif text-lg text-rose-wine">
          {servico.mostrar_valor ? formatBRL(servico.valor) : "Sob consulta"}
        </span>
        <Link
          href={`/agendar?servico=${servico.id}`}
          className="btn-primary text-sm"
        >
          Agendar
        </Link>
      </div>
    </div>
  );
}
