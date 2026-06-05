import { createClient } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/data";
import { config } from "@/lib/config";
import type { AgendamentoDetalhado, Cliente } from "@/lib/types";

export interface MetricasDashboard {
  atendHoje: number;
  atendSemana: number;
  atendMes: number;
  fatHoje: number;
  fatSemana: number;
  fatMes: number;
  inativas: number; // clientes ha +N dias sem voltar
  aniversariantesMes: number;
  proximos: AgendamentoDetalhado[];
}

function inicioDoDia(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function inicioDaSemana(d = new Date()) {
  const x = inicioDoDia(d);
  x.setDate(x.getDate() - x.getDay());
  return x;
}
function inicioDoMes(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function fimDoMes(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
}

// ---------------------------------------------------------------------
//  DEMO — dados de exemplo quando o Supabase nao esta configurado
// ---------------------------------------------------------------------
function demoAgendamentos(): AgendamentoDetalhado[] {
  const hoje = new Date();
  const at = (h: number, addDias = 0): string => {
    const d = new Date(hoje);
    d.setDate(d.getDate() + addDias);
    d.setHours(h, 0, 0, 0);
    return d.toISOString();
  };
  const mk = (
    id: string,
    nome: string,
    tel: string,
    servico: string,
    valor: number,
    inicio: string,
    dur: number
  ): AgendamentoDetalhado => ({
    id,
    cliente_id: id,
    servico_id: id,
    inicio,
    fim: new Date(new Date(inicio).getTime() + dur * 60000).toISOString(),
    status: "agendado",
    valor_cobrado: valor,
    origem: "site",
    observacoes: null,
    criado_em: "",
    cliente: { id, nome, telefone: tel },
    servico: { id, nome: servico, duracao_min: dur },
  });

  return [
    mk("1", "Ana Souza", "5585999990001", "Design de Sobrancelhas", 30, at(9), 40),
    mk("2", "Carla Mendes", "5585999990002", "Brow Lamination", 90, at(11), 60),
    mk("3", "Juliana Lima", "5585999990003", "Make Premium", 250, at(14), 90),
    mk("4", "Beatriz Rocha", "5585999990004", "Lift de Cílios", 80, at(10, 1), 60),
    mk("5", "Fernanda Dias", "5585999990005", "Design de Sobrancelhas", 30, at(15, 2), 40),
  ];
}

function demoMetricas(): MetricasDashboard {
  const ags = demoAgendamentos();
  const fimHoje = new Date();
  fimHoje.setHours(23, 59, 59, 999);
  const doHoje = ags.filter(
    (a) => new Date(a.inicio) >= inicioDoDia() && new Date(a.inicio) <= fimHoje
  );
  const soma = (lista: AgendamentoDetalhado[]) =>
    lista.reduce((s, a) => s + (a.valor_cobrado ?? 0), 0);
  return {
    atendHoje: doHoje.length,
    atendSemana: ags.length,
    atendMes: ags.length,
    fatHoje: soma(doHoje),
    fatSemana: soma(ags),
    fatMes: soma(ags),
    inativas: 3,
    aniversariantesMes: 2,
    proximos: ags.slice(0, 4),
  };
}

// ---------------------------------------------------------------------
//  CONSULTAS REAIS
// ---------------------------------------------------------------------
export async function getMetricasDashboard(): Promise<MetricasDashboard> {
  if (!supabaseConfigurado()) return demoMetricas();

  const supabase = createClient();
  const agora = new Date();
  const fimHoje = new Date();
  fimHoje.setHours(23, 59, 59, 999);

  const { data: ags } = await supabase
    .from("agendamentos")
    .select(
      "id, inicio, fim, status, valor_cobrado, origem, observacoes, criado_em, cliente_id, servico_id, cliente:clientes(id,nome,telefone), servico:servicos(id,nome,duracao_min)"
    )
    .gte("inicio", inicioDoMes(agora).toISOString())
    .lte("inicio", fimDoMes(agora).toISOString())
    .in("status", ["agendado", "remarcado", "concluido"])
    .order("inicio", { ascending: true });

  const lista = (ags ?? []) as unknown as AgendamentoDetalhado[];
  const noPeriodo = (de: Date, ate: Date) =>
    lista.filter((a) => new Date(a.inicio) >= de && new Date(a.inicio) <= ate);
  const soma = (l: AgendamentoDetalhado[]) =>
    l.reduce((s, a) => s + (a.valor_cobrado ?? 0), 0);

  const hoje = noPeriodo(inicioDoDia(agora), fimHoje);
  const semana = noPeriodo(inicioDaSemana(agora), fimDoMes(agora));

  // inativas (+N dias sem atendimento)
  const limite = new Date();
  limite.setDate(limite.getDate() - config.reativacaoDias);
  const { count: inativas } = await supabase
    .from("clientes")
    .select("id", { count: "exact", head: true })
    .lt("ultimo_atendimento", limite.toISOString());

  // aniversariantes do mes
  const { data: clientes } = await supabase
    .from("clientes")
    .select("data_nascimento")
    .not("data_nascimento", "is", null);
  const mesAtual = agora.getMonth() + 1;
  const aniversariantes = (clientes ?? []).filter((c: { data_nascimento: string }) => {
    const m = Number(c.data_nascimento?.split("-")[1]);
    return m === mesAtual;
  }).length;

  return {
    atendHoje: hoje.length,
    atendSemana: semana.length,
    atendMes: lista.length,
    fatHoje: soma(hoje),
    fatSemana: soma(semana),
    fatMes: soma(lista),
    inativas: inativas ?? 0,
    aniversariantesMes: aniversariantes,
    proximos: lista
      .filter((a) => new Date(a.inicio) >= agora && a.status !== "concluido")
      .slice(0, 5),
  };
}

export async function getAgendaDoDia(dataISO: string): Promise<AgendamentoDetalhado[]> {
  if (!supabaseConfigurado()) {
    return demoAgendamentos().filter((a) =>
      a.inicio.startsWith(dataISO.slice(0, 10))
    );
  }
  const supabase = createClient();
  const inicio = new Date(`${dataISO}T00:00:00`);
  const fim = new Date(`${dataISO}T23:59:59`);
  const { data } = await supabase
    .from("agendamentos")
    .select(
      "id, inicio, fim, status, valor_cobrado, origem, observacoes, criado_em, cliente_id, servico_id, cliente:clientes(id,nome,telefone), servico:servicos(id,nome,duracao_min)"
    )
    .gte("inicio", inicio.toISOString())
    .lte("inicio", fim.toISOString())
    .order("inicio", { ascending: true });
  return (data ?? []) as unknown as AgendamentoDetalhado[];
}

export interface ClienteCRM extends Cliente {
  diasSemVir: number | null;
  aniversarianteMes: boolean;
}

export async function getClientesCRM(): Promise<ClienteCRM[]> {
  const calc = (c: Cliente): ClienteCRM => {
    const dias = c.ultimo_atendimento
      ? Math.floor(
          (Date.now() - new Date(c.ultimo_atendimento).getTime()) / 86400000
        )
      : null;
    const mes = c.data_nascimento
      ? Number(c.data_nascimento.split("-")[1])
      : null;
    return {
      ...c,
      diasSemVir: dias,
      aniversarianteMes: mes === new Date().getMonth() + 1,
    };
  };

  if (!supabaseConfigurado()) {
    const demo: Cliente[] = [
      {
        id: "1",
        nome: "Ana Souza",
        telefone: "5585999990001",
        email: null,
        data_nascimento: `1995-${String(new Date().getMonth() + 1).padStart(2, "0")}-15`,
        primeiro_atendimento: "2024-01-10",
        ultimo_atendimento: new Date(Date.now() - 5 * 86400000).toISOString(),
        qtd_atendimentos: 12,
        total_gasto: 480,
        observacoes: null,
        criado_em: "",
      },
      {
        id: "2",
        nome: "Carla Mendes",
        telefone: "5585999990002",
        email: null,
        data_nascimento: "1990-03-22",
        primeiro_atendimento: "2023-06-01",
        ultimo_atendimento: new Date(Date.now() - 28 * 86400000).toISOString(),
        qtd_atendimentos: 8,
        total_gasto: 720,
        observacoes: "Prefere sábado de manhã",
        criado_em: "",
      },
      {
        id: "3",
        nome: "Juliana Lima",
        telefone: "5585999990003",
        email: null,
        data_nascimento: null,
        primeiro_atendimento: "2024-09-01",
        ultimo_atendimento: new Date(Date.now() - 45 * 86400000).toISOString(),
        qtd_atendimentos: 3,
        total_gasto: 90,
        observacoes: null,
        criado_em: "",
      },
    ];
    return demo.map(calc);
  }

  const supabase = createClient();
  const { data } = await supabase
    .from("clientes")
    .select("*")
    .order("ultimo_atendimento", { ascending: false, nullsFirst: false });
  return ((data ?? []) as Cliente[]).map(calc);
}
