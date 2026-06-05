import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/data";
import { config } from "@/lib/config";

/**
 * CRON diario — Reativacao de clientes inativas.
 *
 * Identifica clientes com +REATIVACAO_DIAS (padrao 20) sem nenhum atendimento
 * e registra uma recompensa + log de mensagem (idempotente por mes).
 *
 * Para enviar de fato pelo WhatsApp, integre a WhatsApp Business API (Meta/Twilio)
 * no ponto indicado abaixo. O link wa.me tambem fica disponivel no painel.
 *
 * Protecao: header "Authorization: Bearer <CRON_SECRET>".
 * Agende no vercel.json (ver raiz do projeto).
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (config && process.env.CRON_SECRET) {
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
    }
  }

  if (!supabaseConfigurado()) {
    return NextResponse.json({
      ok: true,
      modo: "demo",
      mensagem: "Configure o Supabase para ativar as automações.",
    });
  }

  const supabase = createAdminClient();
  const limite = new Date();
  limite.setDate(limite.getDate() - config.reativacaoDias);
  const refMes = new Date().toISOString().slice(0, 7); // "2026-06"

  // clientes inativas
  const { data: clientes, error } = await supabase
    .from("clientes")
    .select("id, nome, telefone, ultimo_atendimento")
    .lt("ultimo_atendimento", limite.toISOString());

  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }

  let processadas = 0;
  for (const c of clientes ?? []) {
    // idempotencia: ja enviamos reativacao este mes?
    const { data: jaEnviou } = await supabase
      .from("mensagens_enviadas")
      .select("id")
      .eq("cliente_id", c.id)
      .eq("tipo", "reativacao")
      .eq("referencia", refMes)
      .maybeSingle();
    if (jaEnviou) continue;

    await supabase.from("recompensas").insert({
      cliente_id: c.id,
      tipo: "reativacao",
      descricao: "Convite de retorno",
      status: "pendente",
    });

    // >>> Ponto de integracao: enviar WhatsApp Business API aqui <<<
    // await enviarWhatsApp(c.telefone, `Oi ${c.nome}! Sentimos sua falta 💕 ...`);

    await supabase.from("mensagens_enviadas").insert({
      cliente_id: c.id,
      tipo: "reativacao",
      referencia: refMes,
      canal: "whatsapp",
    });
    processadas++;
  }

  return NextResponse.json({
    ok: true,
    inativas: clientes?.length ?? 0,
    mensagensRegistradas: processadas,
  });
}
