import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/data";

/**
 * CRON diario — Aniversariantes do mes ganham uma Make Express gratis.
 *
 * Roda 1x por dia; no primeiro dia do mes (ou no dia em que rodar) cria a
 * recompensa de aniversario para quem faz aniversario no mes corrente.
 * Idempotente por ano (campo referencia = ano).
 *
 * Protecao: header "Authorization: Bearer <CRON_SECRET>".
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
  }

  if (!supabaseConfigurado()) {
    return NextResponse.json({
      ok: true,
      modo: "demo",
      mensagem: "Configure o Supabase para ativar as automações.",
    });
  }

  const supabase = createAdminClient();
  const agora = new Date();
  const mesAtual = agora.getMonth() + 1;
  const anoRef = String(agora.getFullYear());

  const { data: clientes, error } = await supabase
    .from("clientes")
    .select("id, nome, telefone, data_nascimento")
    .not("data_nascimento", "is", null);

  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }

  const aniversariantes = (clientes ?? []).filter(
    (c: { data_nascimento: string }) =>
      Number(c.data_nascimento.split("-")[1]) === mesAtual
  );

  // fim do mes para validade do voucher
  const validade = new Date(agora.getFullYear(), agora.getMonth() + 1, 0)
    .toISOString()
    .slice(0, 10);

  let criadas = 0;
  for (const c of aniversariantes) {
    const { data: jaTem } = await supabase
      .from("mensagens_enviadas")
      .select("id")
      .eq("cliente_id", c.id)
      .eq("tipo", "aniversario")
      .eq("referencia", anoRef)
      .maybeSingle();
    if (jaTem) continue;

    await supabase.from("recompensas").insert({
      cliente_id: c.id,
      tipo: "aniversario",
      descricao: "Make Express grátis (aniversário)",
      status: "pendente",
      valido_ate: validade,
    });

    // >>> Ponto de integracao: enviar WhatsApp Business API aqui <<<
    // await enviarWhatsApp(c.telefone, `Feliz mês de aniversário, ${c.nome}! 🎂 ...`);

    await supabase.from("mensagens_enviadas").insert({
      cliente_id: c.id,
      tipo: "aniversario",
      referencia: anoRef,
      canal: "whatsapp",
    });
    criadas++;
  }

  return NextResponse.json({
    ok: true,
    aniversariantesMes: aniversariantes.length,
    vouchersCriados: criadas,
  });
}
