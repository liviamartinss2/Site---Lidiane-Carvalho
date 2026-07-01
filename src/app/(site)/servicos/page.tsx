import { getServicos } from "@/lib/data";
import { ServiceCard } from "@/components/ServiceCard";
import type { Categoria } from "@/lib/types";

// ISR: cache regenerado a cada 5 min em vez de consultar o banco a cada acesso.
export const revalidate = 300;

export const metadata = {
  title: "Serviços — Lidiane Carvalho Clínica de Sobrancelhas",
  description:
    "Conheça os serviços: design de sobrancelhas, brow lamination, lift de cílios, revitalização labial e maquiagem em Aquiraz.",
};

const ORDEM_CATEGORIAS: Categoria[] = [
  "Sobrancelhas",
  "Remocao",
  "Cilios",
  "Labios",
  "Maquiagem",
  "Geral",
];

const ROTULO: Record<Categoria, string> = {
  Sobrancelhas: "Sobrancelhas",
  Remocao: "Remoção",
  Cilios: "Cílios",
  Labios: "Lábios",
  Maquiagem: "Maquiagem",
  Geral: "Outros",
};

export default async function ServicosPage() {
  const servicos = await getServicos();

  const porCategoria = ORDEM_CATEGORIAS.map((cat) => ({
    categoria: cat,
    itens: servicos.filter((s) => s.categoria === cat),
  })).filter((g) => g.itens.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <span className="eyebrow">
          Nossos serviços
        </span>
        <h1 className="h-serif mt-1 text-4xl">Beleza com técnica e cuidado</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-muted">
          Cada procedimento é pensado para valorizar a sua beleza natural. Escolha
          o seu e agende em poucos toques.
        </p>
      </div>

      {porCategoria.map((grupo) => (
        <section key={grupo.categoria} className="mb-12">
          <h2 className="h-serif mb-5 text-2xl text-rose-wine">
            {ROTULO[grupo.categoria]}
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {grupo.itens.map((s) => (
              <ServiceCard key={s.id} servico={s} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
