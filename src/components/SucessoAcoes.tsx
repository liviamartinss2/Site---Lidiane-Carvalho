"use client";

import { config, whatsappLink } from "@/lib/config";

export function SucessoAcoes({
  servico,
  inicioISO,
  nome,
}: {
  servico: string;
  inicioISO: string;
  nome: string;
}) {
  const inicio = new Date(inicioISO);

  const dataBR = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(inicio);
  const horaBR = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(inicio);

  // Mensagem no formato pedido na especificacao
  const msg = `Olá Lidiane, acabei de agendar ${servico} para o dia ${dataBR} às ${horaBR}.`;
  const waHref = whatsappLink(msg);

  // Google Calendar (duracao padrao 60 min)
  const fim = new Date(inicio.getTime() + 60 * 60000);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const gcal = new URL("https://calendar.google.com/calendar/render");
  gcal.searchParams.set("action", "TEMPLATE");
  gcal.searchParams.set("text", `${servico} — ${config.studioNome}`);
  gcal.searchParams.set("dates", `${fmt(inicio)}/${fmt(fim)}`);
  gcal.searchParams.set("location", config.endereco);
  gcal.searchParams.set("details", `Cliente: ${nome}`);

  function baixarICS() {
    const uid =
      (typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now())) + "@lidiane-carvalho";
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//LidianeCarvalho//Agenda//PT-BR",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(inicio)}`,
      `DTEND:${fmt(fim)}`,
      `SUMMARY:${servico} — ${config.studioNome}`,
      `DESCRIPTION:Cliente: ${nome}`,
      `LOCATION:${config.endereco}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "agendamento-lidiane-carvalho.ics";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();
  }

  return (
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-primary">
        Avisar no WhatsApp
      </a>
      <a href={gcal.toString()} target="_blank" rel="noopener noreferrer" className="btn-ghost">
        Google Calendar
      </a>
      <button onClick={baixarICS} className="btn-ghost" type="button">
        Baixar .ICS
      </button>
    </div>
  );
}
