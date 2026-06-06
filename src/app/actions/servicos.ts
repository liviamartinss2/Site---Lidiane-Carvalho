"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/data";

export interface ResultadoServico {
  ok: boolean;
  erro?: string;
}

async function guard(): Promise<{
  erro?: string;
  supabase?: ReturnType<typeof createClient>;
}> {
  if (!supabaseConfigurado()) {
    return { erro: "Modo demonstração — conecte o Supabase para gerenciar serviços." };
  }
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { erro: "Sessão expirada. Faça login novamente." };
  return { supabase };
}

function revalidar() {
  revalidatePath("/admin/servicos");
  revalidatePath("/servicos");
  revalidatePath("/agendar");
  revalidatePath("/");
}

/** Cria (sem id) ou atualiza (com id) um serviço */
export async function salvarServico(formData: FormData): Promise<ResultadoServico> {
  const g = await guard();
  if (g.erro || !g.supabase) return { ok: false, erro: g.erro };
  const supabase = g.supabase;

  const id = String(formData.get("id") ?? "").trim();
  const nome = String(formData.get("nome") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "Geral");
  const duracao_min = Number(formData.get("duracao_min") ?? 60);
  const mostrar_valor = formData.get("mostrar_valor") === "on";
  const ativo = formData.get("ativo") === "on";
  const ordem = Number(formData.get("ordem") ?? 0);
  const descricao = String(formData.get("descricao") ?? "").trim() || null;
  const beneficios = String(formData.get("beneficios") ?? "").trim() || null;

  const valorRaw = String(formData.get("valor") ?? "").replace(",", ".").trim();
  const valor = valorRaw === "" ? null : Number(valorRaw);

  if (!nome) return { ok: false, erro: "Informe o nome do serviço." };
  if (!Number.isFinite(duracao_min) || duracao_min <= 0) {
    return { ok: false, erro: "Duração inválida." };
  }
  if (valor !== null && !Number.isFinite(valor)) {
    return { ok: false, erro: "Valor inválido (use apenas números)." };
  }

  const payload = {
    nome,
    categoria,
    duracao_min,
    valor,
    mostrar_valor,
    ativo,
    ordem: Number.isFinite(ordem) ? ordem : 0,
    descricao,
    beneficios,
  };

  if (id) {
    const { error } = await supabase.from("servicos").update(payload).eq("id", id);
    if (error) return { ok: false, erro: "Não foi possível salvar as alterações." };
  } else {
    const { error } = await supabase.from("servicos").insert(payload);
    if (error) return { ok: false, erro: "Não foi possível criar o serviço." };
  }

  revalidar();
  return { ok: true };
}

/** Ativa ou desativa um serviço (some/aparece no site) */
export async function alternarAtivoServico(formData: FormData): Promise<ResultadoServico> {
  const g = await guard();
  if (g.erro || !g.supabase) return { ok: false, erro: g.erro };

  const id = String(formData.get("id") ?? "");
  const ativo = String(formData.get("ativo") ?? "") === "true";
  if (!id) return { ok: false, erro: "Serviço inválido." };

  const { error } = await g.supabase.from("servicos").update({ ativo }).eq("id", id);
  if (error) return { ok: false, erro: "Não foi possível atualizar." };

  revalidar();
  return { ok: true };
}

/** Remove um serviço — bloqueado se houver agendamentos vinculados */
export async function removerServico(formData: FormData): Promise<ResultadoServico> {
  const g = await guard();
  if (g.erro || !g.supabase) return { ok: false, erro: g.erro };
  const supabase = g.supabase;

  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, erro: "Serviço inválido." };

  const { count } = await supabase
    .from("agendamentos")
    .select("id", { count: "exact", head: true })
    .eq("servico_id", id);

  if ((count ?? 0) > 0) {
    return {
      ok: false,
      erro: `Este serviço tem ${count} agendamento(s) no histórico, então não pode ser removido. Em vez disso, use "Desativar" para que ele pare de aparecer no site.`,
    };
  }

  const { error } = await supabase.from("servicos").delete().eq("id", id);
  if (error) return { ok: false, erro: "Não foi possível remover o serviço." };

  revalidar();
  return { ok: true };
}
