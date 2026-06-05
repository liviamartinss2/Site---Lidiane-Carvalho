import { NextRequest, NextResponse } from "next/server";
import { calcularSlotsDisponiveis } from "@/lib/disponibilidade";
import { getServicoPorId, supabaseConfigurado } from "@/lib/data";

/**
 * GET /api/disponibilidade?data=2026-06-12&servico=<id>
 * Retorna os horarios livres para o dia/servico.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const data = searchParams.get("data");
  const servicoId = searchParams.get("servico");

  if (!data || !servicoId) {
    return NextResponse.json({ erro: "Parâmetros faltando." }, { status: 400 });
  }

  const servico = await getServicoPorId(servicoId);
  if (!servico) {
    return NextResponse.json({ erro: "Serviço não encontrado." }, { status: 404 });
  }

  // Sem banco: gera grade de demonstracao (09h-18h, a cada 30 min, futuros)
  if (!supabaseConfigurado()) {
    return NextResponse.json({ slots: slotsDemo(data, servico.duracao_min) });
  }

  const slots = await calcularSlotsDisponiveis(data, servico.duracao_min);
  return NextResponse.json({ slots });
}

function slotsDemo(dataISO: string, duracaoMin: number) {
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  const agora = Date.now();
  const out: { inicio: string; label: string }[] = [];
  for (let h = 9; h <= 17; h++) {
    for (const m of [0, 30]) {
      const d = new Date(ano, mes - 1, dia, h, m, 0);
      if (d.getTime() + duracaoMin * 60000 > new Date(ano, mes - 1, dia, 18, 0).getTime())
        continue;
      if (d.getTime() < agora) continue;
      out.push({
        inicio: d.toISOString(),
        label: new Intl.DateTimeFormat("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(d),
      });
    }
  }
  return out;
}
