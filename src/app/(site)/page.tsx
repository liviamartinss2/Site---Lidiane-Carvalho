import Link from "next/link";
import { config, whatsappLink } from "@/lib/config";
import { getServicos, getDepoimentos } from "@/lib/data";
import { ServiceCard } from "@/components/ServiceCard";
import { Stars } from "@/components/Stars";
import { Brilho } from "@/components/Brilho";
import { FotoLidiane } from "@/components/FotoLidiane";

// ISR: pagina servida de cache e regenerada a cada 5 min (servicos/depoimentos
// mudam pouco). Evita consultar o Supabase a cada acesso.
export const revalidate = 300;

export default async function HomePage() {
  const servicos = await getServicos();
  const depoimentos = await getDepoimentos();
  const destaque = servicos.slice(0, 3);

  return (
    <>
      {/* HERO — editorial, assimetrico */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-12 md:gap-8 md:pb-28 md:pt-20">
        <div className="md:col-span-7">
          <span className="selo-gold">★ {config.anosExperiencia} anos de experiência</span>
          <h1 className="relative mt-7 font-serif text-[3.25rem] font-semibold leading-[0.98] tracking-tightest text-ink sm:text-6xl md:text-[5.5rem]">
            <Brilho className="absolute -left-6 -top-6 hidden text-rose/40 md:block" size={26} />
            Sobrancelhas
            <br />
            impecáveis,
            <br />
            <span className="italic font-medium text-rose">com elegância.</span>
          </h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-ink-muted">
            Estúdio de beleza em Aquiraz especializado em design de sobrancelhas,
            brow lamination, cílios e maquiagem. Agende online em menos de 1 minuto.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
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
          <div className="mt-12 flex items-center gap-10">
            <div>
              <div className="flex items-center gap-2">
                <Stars nota={5} />
                <span className="text-sm font-semibold text-ink">5,0</span>
              </div>
              <p className="mt-1.5 text-xs uppercase tracking-wider text-ink-muted">
                Avaliação das clientes
              </p>
            </div>
            <div className="h-12 w-px bg-line" />
            <div>
              <p className="font-serif text-3xl tracking-tight text-rose-wine">
                +{config.anosExperiencia}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-ink-muted">
                anos de beleza
              </p>
            </div>
          </div>
        </div>

        {/* imagem */}
        <div className="md:col-span-5">
          <div className="relative">
            <Brilho
              className="absolute -left-4 top-8 z-10 text-rose"
              size={30}
            />
            <Brilho
              className="absolute -right-3 -top-4 z-10 text-beige"
              size={20}
            />
            <Brilho
              className="absolute -bottom-4 left-10 z-10 text-rose/70"
              size={18}
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl3 bg-rose-soft ring-1 ring-ink/5">
              <FotoLidiane
                alt="Lidiane Carvalho — especialista em design de sobrancelhas"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/15 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICOS EM DESTAQUE */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="mb-12 flex items-end justify-between border-t border-line pt-8">
          <div>
            <span className="eyebrow">Nossos serviços</span>
            <h2 className="h-serif mt-3 text-4xl sm:text-5xl">
              Cuidados que valorizam você
            </h2>
          </div>
          <Link
            href="/servicos"
            className="hidden whitespace-nowrap text-sm font-medium text-rose transition-colors hover:text-rose-wine md:block"
          >
            Ver todos →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {destaque.map((s, i) => (
            <ServiceCard key={s.id} servico={s} indice={i + 1} />
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link href="/servicos" className="btn-ghost">
            Ver todos os serviços
          </Link>
        </div>
      </section>

      {/* DEPOIMENTOS — minimalista, com aspas decorativas */}
      {depoimentos.length > 0 && (
        <section className="border-y border-line bg-rose-soft/40 py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-14 text-center">
              <span className="inline-flex items-center gap-2 eyebrow">
                <Brilho size={14} className="text-rose" />
                Depoimentos
              </span>
              <h2 className="h-serif mt-3 text-4xl sm:text-5xl">
                O que dizem nossas clientes
              </h2>
            </div>
            <div className="grid gap-x-10 gap-y-12 md:grid-cols-3">
              {depoimentos.slice(0, 3).map((d) => (
                <figure key={d.id} className="flex flex-col">
                  <span
                    aria-hidden="true"
                    className="font-serif text-6xl leading-none text-rose/40"
                  >
                    &ldquo;
                  </span>
                  <blockquote className="-mt-4 font-serif text-xl leading-relaxed text-ink">
                    {d.texto}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="h-px w-6 bg-rose" />
                    <span className="text-sm font-semibold uppercase tracking-wider text-rose-wine">
                      {d.cliente_nome}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL — preto editorial com detalhe rosa */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="relative overflow-hidden rounded-xl3 bg-ink px-6 py-20 text-center text-white md:px-8 md:py-28">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 80% at 50% 0%, rgba(201,24,74,.45) 0%, transparent 65%)",
            }}
          />
          <Brilho className="absolute left-1/2 top-10 -translate-x-1/2 text-rose/60" size={28} />
          <span className="eyebrow relative text-rose">Vamos começar</span>
          <h2 className="relative mt-5 font-serif text-4xl font-semibold leading-[1.05] tracking-tightest sm:text-6xl">
            Pronta para realçar
            <br />
            <span className="italic font-medium text-rose">a sua beleza?</span>
          </h2>
          <p className="relative mx-auto mt-6 max-w-md text-lg text-cream/70">
            Escolha o serviço, o melhor horário e confirme. Simples, rápido e
            elegante.
          </p>
          <Link href="/agendar" className="btn-primary relative mt-9 inline-flex px-8">
            Agendar meu horário
          </Link>
        </div>
      </section>
    </>
  );
}
