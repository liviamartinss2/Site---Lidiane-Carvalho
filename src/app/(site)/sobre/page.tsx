import Link from "next/link";
import { config } from "@/lib/config";

export const metadata = {
  title: "Sobre & Localização — Lidiane Carvalho",
  description: "Conheça a história da Lidiane Carvalho e onde fica o estúdio em Aquiraz - CE.",
};

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* SOBRE */}
      <section className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <span className="selo-gold">★ {config.anosExperiencia} anos de experiência</span>
          <h1 className="h-serif mt-4 text-4xl">Sobre a Lidiane</h1>
          <p className="mt-4 text-ink-muted">
            Há {config.anosExperiencia} anos transformando olhares e elevando a
            autoestima de mulheres em Aquiraz e região. A Lidiane Carvalho uniu
            técnica, sensibilidade e paixão pela beleza para criar um espaço onde
            cada cliente é cuidada de forma única.
          </p>
          <p className="mt-3 text-ink-muted">
            O novo estúdio nasce para oferecer uma experiência sofisticada e
            acolhedora — do design de sobrancelhas à maquiagem para os seus momentos
            mais especiais.
          </p>
          <Link href="/agendar" className="btn-primary mt-6 inline-flex">
            Agendar meu horário
          </Link>
        </div>

        <div className="relative min-h-[320px] overflow-hidden rounded-xl2 border border-line bg-rose-soft shadow-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1400&auto=format&fit=crop"
            alt="Estúdio Lidiane Carvalho"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </section>

      {/* LOCALIZACAO */}
      <section className="mt-16">
        <div className="mb-6 text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-gold-dark">
            Localização
          </span>
          <h2 className="h-serif mt-1 text-3xl">Onde nos encontrar</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-solid flex flex-col justify-center">
            <h3 className="font-serif text-xl text-rose-wine">Endereço</h3>
            <p className="mt-2 text-ink-soft">📍 {config.endereco}</p>
            <a
              href={config.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost mt-4 self-start"
            >
              Abrir no Google Maps
            </a>

            <h3 className="mt-6 font-serif text-xl text-rose-wine">Horário</h3>
            <p className="mt-2 text-sm text-ink-soft">
              Terça a sexta: 09h às 18h
              <br />
              Sábado: 08h às 14h
            </p>
          </div>

          <div className="overflow-hidden rounded-xl2 border border-line shadow-soft">
            <iframe
              title="Mapa do estúdio"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                config.endereco
              )}&output=embed`}
              className="h-full min-h-[300px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
