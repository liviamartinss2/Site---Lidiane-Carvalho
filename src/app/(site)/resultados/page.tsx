import Link from "next/link";

export const metadata = {
  title: "Resultados — Lidiane Carvalho",
  description: "Galeria de resultados reais: antes e depois dos atendimentos.",
};

// Placeholders — substituir por fotos reais (tabela "galeria" no Supabase)
const exemplos = [
  { id: 1, servico: "Design de Sobrancelhas" },
  { id: 2, servico: "Brow Lamination" },
  { id: 3, servico: "Lift de Cílios" },
  { id: 4, servico: "Make Premium" },
  { id: 5, servico: "Revitalização Labial" },
  { id: 6, servico: "Design + Henna" },
];

export default function ResultadosPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <span className="eyebrow">
          Galeria
        </span>
        <h1 className="h-serif mt-1 text-4xl">Resultados reais</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-muted">
          Antes e depois de quem já viveu a experiência. (Substitua pelas fotos reais
          da clínica na área administrativa.)
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {exemplos.map((e) => (
          <div
            key={e.id}
            className="group relative aspect-[4/5] overflow-hidden rounded-xl2 border border-line bg-gradient-to-br from-rose-soft to-cream"
          >
            <div className="absolute inset-0 grid place-items-center text-rose/40">
              <span className="font-serif text-lg">Antes / Depois</span>
            </div>
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-ink/70 to-transparent p-4">
              <span className="text-sm font-medium text-white">{e.servico}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/agendar" className="btn-primary">
          Quero esse resultado
        </Link>
      </div>
    </div>
  );
}
