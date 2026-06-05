import Link from "next/link";
import { SucessoAcoes } from "@/components/SucessoAcoes";
import { formatDataHora } from "@/lib/format";

export const metadata = {
  title: "Agendamento confirmado — Lidiane Carvalho",
};

export default function SucessoPage({
  searchParams,
}: {
  searchParams: { servico?: string; inicio?: string; nome?: string };
}) {
  const servico = searchParams.servico ?? "";
  const inicio = searchParams.inicio ?? "";
  const nome = searchParams.nome ?? "";

  if (!servico || !inicio) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="h-serif text-2xl">Agendamento não encontrado</h1>
        <Link href="/agendar" className="btn-primary mt-6 inline-flex">
          Fazer um agendamento
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-gradient text-3xl text-white shadow-glow">
        ✓
      </div>
      <h1 className="h-serif mt-5 text-3xl">Agendamento confirmado!</h1>
      <p className="mt-2 text-ink-muted">
        {nome ? `${nome}, seu` : "Seu"} horário está reservado. 💕
      </p>

      <div className="card-solid mt-6 text-left">
        <p className="text-sm text-ink-muted">Serviço</p>
        <p className="font-serif text-lg text-rose-wine">{servico}</p>
        <p className="mt-3 text-sm text-ink-muted">Data e horário</p>
        <p className="font-medium text-ink">{formatDataHora(inicio)}</p>
      </div>

      <SucessoAcoes servico={servico} inicioISO={inicio} nome={nome} />

      <Link href="/" className="mt-8 inline-block text-sm text-rose-wine hover:underline">
        ← Voltar para o início
      </Link>
    </div>
  );
}
