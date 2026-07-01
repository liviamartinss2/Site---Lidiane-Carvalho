import { getDepoimentos } from "@/lib/data";
import { Stars } from "@/components/Stars";

// ISR: cache regenerado a cada 5 min em vez de consultar o banco a cada acesso.
export const revalidate = 300;

export const metadata = {
  title: "Depoimentos — Lidiane Carvalho",
  description: "Avaliações reais de clientes da clínica Lidiane Carvalho em Aquiraz.",
};

export default async function DepoimentosPage() {
  const depoimentos = await getDepoimentos();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <span className="eyebrow">
          Depoimentos
        </span>
        <h1 className="h-serif mt-1 text-4xl">Clientes que confiam</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-muted">
          A satisfação de quem passa pela clínica é o nosso maior orgulho.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {depoimentos.map((d) => (
          <div key={d.id} className="card-solid">
            <Stars nota={d.nota} />
            <p className="mt-3 text-ink-soft">“{d.texto}”</p>
            <p className="mt-4 text-sm font-semibold text-rose-wine">{d.cliente_nome}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
