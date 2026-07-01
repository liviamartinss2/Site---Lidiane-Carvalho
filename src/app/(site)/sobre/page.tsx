import Link from "next/link";
import { config } from "@/lib/config";
import { Brilho } from "@/components/Brilho";
import { FotoLidiane } from "@/components/FotoLidiane";

export const metadata = {
  title: "Sobre & Localização — Lidiane Carvalho",
  description: "Conheça a história da Lidiane Carvalho e onde fica a clínica em Aquiraz - CE.",
};

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* SOBRE */}
      <section className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <span className="selo-gold">★ {config.anosExperiencia} anos de experiência</span>
          <h1 className="h-serif mt-4 text-5xl">
            Quem é
            <br />
            <span className="italic font-medium text-rose">Lidiane Carvalho</span>
          </h1>
          <p className="mt-4 text-ink-muted">
            Há {config.anosExperiencia} anos transformando olhares e elevando a
            autoestima de mulheres em Aquiraz e região. A Lidiane Carvalho uniu
            técnica, sensibilidade e paixão pela beleza para criar um espaço onde
            cada cliente é cuidada de forma única.
          </p>
          <p className="mt-3 text-ink-muted">
            A nova clínica nasce para oferecer uma experiência sofisticada e
            acolhedora — do design de sobrancelhas à maquiagem para os seus momentos
            mais especiais.
          </p>
          <Link href="/agendar" className="btn-primary mt-6 inline-flex">
            Agendar meu horário
          </Link>
        </div>

        <div className="relative">
          <Brilho className="absolute -left-4 top-10 z-10 text-rose" size={30} />
          <Brilho className="absolute -right-3 -top-4 z-10 text-beige" size={20} />
          <Brilho className="absolute -bottom-4 right-12 z-10 text-rose/70" size={18} />
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl3 bg-rose-soft ring-1 ring-ink/5">
            <FotoLidiane
              alt="Lidiane Carvalho"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* LOCALIZACAO */}
      <section className="mt-16">
        <div className="mb-6 text-center">
          <span className="eyebrow">
            Localização
          </span>
          <h2 className="h-serif mt-1 text-3xl">Onde nos encontrar</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-solid flex flex-col justify-center">
            <h3 className="font-serif text-xl text-rose-wine">Endereço</h3>
            <p className="mt-2 text-ink-soft">📍 {config.endereco}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={config.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Abrir no Google Maps
              </a>
              <a
                href={config.googleAvaliar}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                ★ Avaliar no Google
              </a>
            </div>

            <h3 className="mt-6 font-serif text-xl text-rose-wine">Horário</h3>
            <p className="mt-2 text-sm text-ink-soft">
              Terça a sexta: 09h às 18h
              <br />
              Sábado: 08h às 14h
            </p>
          </div>

          <div className="overflow-hidden rounded-xl2 border border-line shadow-soft">
            <iframe
              title="Mapa da clínica"
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
