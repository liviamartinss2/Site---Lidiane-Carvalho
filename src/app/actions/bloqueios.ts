"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/data";

export interface ResultadoBloqueio {
  ok: boolean;
  erro?: string;
}

/**
 * Cria um bloqueio de agenda (dia inteiro ou faixa de horário).
 * Os períodos bloqueados ficam indisponíveis para agendamento no site,
 * pois a lógica de disponibilidade já considera a tabela `bloqueios`.
 */
export async function criarBloqueio(
  _prev: unknown,
  formData: FormData
): Promise<ResultadoBloqueio> {
  if (!supabaseConfigurado()) {
    return {
      ok: false,
      erro: "Modo demonstração — conecte o Supabase para salvar bloqueios.",
    };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, erro: "Sessão expirada. Faça login novamente." };

  const data = String(formData.get("data") ?? "");
  const diaInteiro = formData.get("dia_inteiro") === "on";
  const horaInicio = String(formData.get("hora_inicio") ?? "");
  const horaFim = String(formData.get("hora_fim") ?? "");
  const motivo = String(formData.get("motivo") ?? "").trim() || null;

  if (!data) return { ok: false, erro: "Escolha uma data." };

  let inicio: Date;
  let fim: Date;

  if (diaInteiro) {
    inicio = new Date(`${data}T00:00:00`);
    fim = new Date(`${data}T23:59:59`);
  } else {
    if (!horaInicio || !horaFim) {
      return { ok: false, erro: "Informe o horário de início e de fim." };
    }
    inicio = new Date(`${data}T${horaInicio}:00`);
    fim = new Date(`${data}T${horaFim}:00`);
    if (fim <= inicio) {
      return { ok: false, erro: "O horário final deve ser depois do inicial." };
    }
  }

  const { error } = await supabase.from("bloqueios").insert({
    inicio: inicio.toISOString(),
    fim: fim.toISOString(),
    motivo,
  });

  if (error) return { ok: false, erro: "Não foi possível salvar o bloqueio." };

  revalidatePath("/admin/bloqueios");
  revalidatePath("/admin/agenda");
  return { ok: true };
}

/** Remove um bloqueio existente */
export async function removerBloqueio(formData: FormData): Promise<void> {
  if (!supabaseConfigurado()) return;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("bloqueios").delete().eq("id", id);
  revalidatePath("/admin/bloqueios");
  revalidatePath("/admin/agenda");
}
