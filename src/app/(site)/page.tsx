import Link from "next/link";
import { config, whatsappLink } from "@/lib/config";
import { getServicos, getDepoimentos } from "@/lib/data";
import { ServiceCard } from "@/components/ServiceCard";
import { Stars } from "@/components/Stars";

export default async function HomePage() {
  const servicos = await getServicos();
  const depoimentos = await getDepoimentos();
  const destaque = servicos.slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-28">
        <div>
          <span className="selo-gold">★ {config.anosExperiencia} anos de experiência</span>
          <h1 className="mt-6 font-serif text-[2.75rem] font-semibold leading-[1.04] tracking-tight text-ink sm:text-5xl md:text-6xl">
            Sobrancelhas
            <br />
            impecáveis.
            <br />
            <span className="bg-rose-gradient bg-clip-text text-transparent">
              Com elegância.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
            Estúdio de beleza em Aquiraz especializado em design de sobrancelhas,
            brow lamination, cílios e maquiagem. Agende online em menos de 1 minuto.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/agendar" className="btn-primary px-8">
              Agendar horário
            </Link>
            <a
              href={whatsappLink("Olá Lidiane! Gostaria de mais informações.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Chamar no WhatsApp
            </a>
          </div>

          {/* prova social */}
          <div className="mt-12 flex items-center gap-8">
            <div>
              <div className="flex items-center gap-2">
                <Stars nota={5} />
                <span className="text-sm font-semibold text-ink">5,0</span>
              </div>
              <p className="mt-1 text-xs text-ink-muted">Avaliação das clientes</p>
            </div>
            <div className="h-10 w-px bg-line" />
            <div>
              <p className="font-serif text-2xl tracking-tight text-rose-wine">
                +{config.anosExperiencia} anos
              </p>
              <p className="mt-1 text-xs text-ink-muted">cuidando da sua beleza</p>
            </div>
          </div>
        </div>

        {/* imagem */}
        <div className="relative min-h-[360px] overflow-hidden rounded-xl3 shadow-soft ring-1 ring-ink/5 md:min-h-[480px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1620336655052-d780c3e53b2b?q=80&w=1400&auto=format&fit=crop"
            alt="Design de sobrancelhas no estúdio Lidiane Carvalho"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/10 to-transparent" />
        </div>
      </section>

      {/* SERVICOS EM DESTAQUE */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <span className="eyebrow">Nossos serviços</span>
            <h2 className="h-serif mt-3 text-3xl sm:text-4xl">
              Cuidados que valorizam você
            </h2>
          </div>
          <Link
            href="/servicos"
            className="hidden text-sm font-medium text-rose-wine transition-colors hover:text-rose md:block"
          >
            Ver todos →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {destaque.map((s) => (
            <ServiceCard key={s.id} servico={s} />
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link href="/servicos" className="btn-ghost">
            Ver todos os serviços
          </Link>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      {depoimentos.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <span className="eyebrow">Depoimentos</span>
              <h2 className="h-serif mt-3 text-3xl sm:text-4xl">
                O que dizem nossas clientes
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {depoimentos.slice(0, 3).map((d) => (
                <div
                  key={d.id}
                  className="card-solid hover:shadow-glow-lg"
                >
                  <Stars nota={d.nota} />
                  <p className="mt-4 leading-relaxed text-ink-soft">“{d.texto}”</p>
                  <p className="mt-5 text-sm font-semibold text-rose-wine">
                    {d.cliente_nome}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-xl3 bg-ink px-8 py-16 text-center text-white shadow-soft md:py-20">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(50% 60% at 50% 0%, rgba(199,123,140,.35) 0%, transparent 70%)",
            }}
          />
          <h2 className="relative font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Pronta para realçar sua beleza?
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-lg text-cream/70">
            Escolha o serviço, o melhor horário e confirme. Simples, rápido e
            elegante.
          </p>
          <Link href="/agendar" className="btn-gold relative mt-8 inline-flex px-8">
            Agendar meu horário
          </Link>
        </div>
      </section>
    </>
  );
}
