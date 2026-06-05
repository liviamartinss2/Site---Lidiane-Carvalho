"use server";

import { createClient } from "@/lib/supabase/server";
import { getServicoPorId, supabaseConfigurado } from "@/lib/data";
import { normalizarTelefone } from "@/lib/format";

export interface ResultadoAgendamento {
  ok: boolean;
  erro?: string;
  inicioISO?: string;
}

interface DadosAgendamento {
  servicoId: string;
  inicioISO: string;
  nome: string;
  telefone: string;
  aniversario?: string; // "YYYY-MM-DD" ou vazio
  observacoes?: string;
}

/**
 * Cria um agendamento:
 *  1. reconhece/cria a cliente pelo telefone (e guarda aniversario);
 *  2. valida que o horario ainda esta livre;
 *  3. insere o agendamento (o indice unico no banco evita corrida).
 */
export async function criarAgendamento(
  dados: DadosAgendamento
): Promise<ResultadoAgendamento> {
  const nome = dados.nome.trim();
  const telefone = normalizarTelefone(dados.telefone);

  if (!nome || telefone.length < 12) {
    return { ok: false, erro: "Informe nome e telefone válidos." };
  }

  const servico = await getServicoPorId(dados.servicoId);
  if (!servico) return { ok: false, erro: "Serviço não encontrado." };

  const inicio = new Date(dados.inicioISO);
  if (isNaN(inicio.getTime()) || inicio.getTime() < Date.now()) {
    return { ok: false, erro: "Horário inválido ou no passado." };
  }
  const fim = new Date(inicio.getTime() + servico.duracao_min * 60000);

  // Modo demonstracao (sem banco): apenas confirma para exibir o fluxo.
  if (!supabaseConfigurado()) {
    return { ok: true, inicioISO: inicio.toISOString() };
  }

  const supabase = createClient();

  // 1. cliente por telefone
  const { data: clienteExistente } = await supabase
    .from("clientes")
    .select("id")
    .eq("telefone", telefone)
    .maybeSingle();

  let clienteId = clienteExistente?.id as string | undefined;

  if (!clienteId) {
    const { data: novo, error: errCliente } = await supabase
      .from("clientes")
      .insert({
        nome,
        telefone,
        data_nascimento: dados.aniversario || null,
      })
      .select("id")
      .single();
    if (errCliente || !novo) {
      return { ok: false, erro: "Não foi possível registrar seus dados." };
    }
    clienteId = novo.id;
  } else if (dados.aniversario) {
    // atualiza aniversario se a cliente informou agora
    await supabase
      .from("clientes")
      .update({ nome, data_nascimento: dados.aniversario })
      .eq("id", clienteId);
  }

  // 2. revalida disponibilidade do slot exato
  const { data: conflito } = await supabase
    .from("agendamentos")
    .select("id")
    .eq("inicio", inicio.toISOString())
    .in("status", ["agendado", "remarcado"])
    .maybeSingle();

  if (conflito) {
    return {
      ok: false,
      erro: "Ops! Esse horário acabou de ser reservado. Escolha outro, por favor.",
    };
  }

  // 3. cria agendamento
  const { error: errAgend } = await supabase.from("agendamentos").insert({
    cliente_id: clienteId,
    servico_id: servico.id,
    inicio: inicio.toISOString(),
    fim: fim.toISOString(),
    status: "agendado",
    valor_cobrado: servico.valor,
    origem: "site",
    observacoes: dados.observacoes?.trim() || null,
  });

  if (errAgend) {
    // violacao do indice unico = corrida perdida
    return {
      ok: false,
      erro: "Esse horário acabou de ser reservado. Escolha outro, por favor.",
    };
  }

  return { ok: true, inicioISO: inicio.toISOString() };
}
