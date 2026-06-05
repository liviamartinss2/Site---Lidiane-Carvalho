import { createClient } from "@/lib/supabase/server";
import type { Disponibilidade } from "@/lib/types";

const INTERVALO_SLOT_MIN = 30; // granularidade da grade (slots a cada 30 min)

export interface Slot {
  inicio: string; // ISO
  label: string; // "14:00"
}

/**
 * Calcula os horarios disponiveis para um dado dia e duracao de servico.
 *
 * Regra:
 *   disponiveis = (horario de funcionamento do dia)
 *                 - (slots que ja terminam apos o fechamento)
 *                 - (agendamentos ativos que se sobrepoem)
 *                 - (bloqueios manuais que se sobrepoem)
 *                 - (horarios no passado, se for hoje)
 */
export async function calcularSlotsDisponiveis(
  dataISO: string, // "2026-06-12"
  duracaoMin: number
): Promise<Slot[]> {
  const supabase = createClient();

  const [ano, mes, dia] = dataISO.split("-").map(Number);
  const data = new Date(ano, mes - 1, dia);
  const diaSemana = data.getDay(); // 0=domingo ... 6=sabado

  // 1. Horario de funcionamento do dia
  const { data: dispRows } = await supabase
    .from("disponibilidade")
    .select("*")
    .eq("dia_semana", diaSemana)
    .eq("ativo", true);

  const disp = (dispRows ?? []) as Disponibilidade[];
  if (disp.length === 0) return []; // dia fechado

  // 2. Agendamentos ativos do dia
  const inicioDia = new Date(ano, mes - 1, dia, 0, 0, 0);
  const fimDia = new Date(ano, mes - 1, dia, 23, 59, 59);

  const { data: agendamentos } = await supabase
    .from("agendamentos")
    .select("inicio, fim, status")
    .gte("inicio", inicioDia.toISOString())
    .lte("inicio", fimDia.toISOString())
    .in("status", ["agendado", "remarcado"]);

  const { data: bloqueios } = await supabase
    .from("bloqueios")
    .select("inicio, fim")
    .lte("inicio", fimDia.toISOString())
    .gte("fim", inicioDia.toISOString());

  const ocupados = [
    ...(agendamentos ?? []).map((a) => ({
      inicio: new Date(a.inicio).getTime(),
      fim: new Date(a.fim).getTime(),
    })),
    ...(bloqueios ?? []).map((b) => ({
      inicio: new Date(b.inicio).getTime(),
      fim: new Date(b.fim).getTime(),
    })),
  ];

  const agora = Date.now();
  const slots: Slot[] = [];

  // 3. Gera slots candidatos dentro de cada janela de funcionamento
  for (const janela of disp) {
    const [ha, ma] = janela.hora_abertura.split(":").map(Number);
    const [hf, mf] = janela.hora_fechamento.split(":").map(Number);

    const abertura = new Date(ano, mes - 1, dia, ha, ma, 0).getTime();
    const fechamento = new Date(ano, mes - 1, dia, hf, mf, 0).getTime();

    for (let t = abertura; t + duracaoMin * 60000 <= fechamento; t += INTERVALO_SLOT_MIN * 60000) {
      const slotInicio = t;
      const slotFim = t + duracaoMin * 60000;

      // passado?
      if (slotInicio < agora) continue;

      // conflito com ocupados?
      const conflito = ocupados.some(
        (o) => slotInicio < o.fim && slotFim > o.inicio
      );
      if (conflito) continue;

      const d = new Date(slotInicio);
      slots.push({
        inicio: d.toISOString(),
        label: new Intl.DateTimeFormat("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(d),
      });
    }
  }

  return slots;
}
