import { createPublicClient } from "@/lib/supabase/public";
import type { Servico, Depoimento } from "@/lib/types";

/** True quando as variaveis do Supabase estao configuradas */
export function supabaseConfigurado(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// ---------------------------------------------------------------------
//  Fallback estatico — usado quando o banco ainda nao foi configurado.
//  Espelha o supabase/seed.sql para o site funcionar em modo demonstracao.
// ---------------------------------------------------------------------
const SERVICOS_FALLBACK: Servico[] = [
  {
    id: "s1",
    nome: "Design de Sobrancelhas",
    descricao:
      "Mapeamento facial e modelagem que valoriza o seu olhar, respeitando a simetria natural do seu rosto.",
    beneficios: "Realça o olhar; corrige assimetrias; resultado natural e duradouro.",
    categoria: "Sobrancelhas",
    duracao_min: 40,
    valor: 30,
    mostrar_valor: true,
    ativo: true,
    ordem: 1,
    criado_em: "",
  },
  {
    id: "s2",
    nome: "Brow Lamination",
    descricao:
      "Alinhamento dos fios que deixa as sobrancelhas mais cheias, alinhadas e com efeito penteado por semanas.",
    beneficios: "Efeito volumoso; fios disciplinados; dura de 4 a 6 semanas.",
    categoria: "Sobrancelhas",
    duracao_min: 60,
    valor: null,
    mostrar_valor: false,
    ativo: true,
    ordem: 2,
    criado_em: "",
  },
  {
    id: "s3",
    nome: "Lift de Cílios",
    descricao:
      "Curvatura natural dos cílios a partir da raiz, abrindo o olhar sem necessidade de alongamento.",
    beneficios: "Olhar aberto e marcante; sem extensões; baixa manutenção.",
    categoria: "Cilios",
    duracao_min: 60,
    valor: null,
    mostrar_valor: false,
    ativo: true,
    ordem: 3,
    criado_em: "",
  },
  {
    id: "s4",
    nome: "Revitalização Labial",
    descricao:
      "Tratamento que hidrata, esfolia e devolve o viço natural dos lábios, realçando a cor e a textura.",
    beneficios: "Lábios hidratados; aspecto saudável; realça a cor natural.",
    categoria: "Labios",
    duracao_min: 45,
    valor: null,
    mostrar_valor: false,
    ativo: true,
    ordem: 4,
    criado_em: "",
  },
  {
    id: "s5",
    nome: "Make Express",
    descricao: "Maquiagem rápida e elegante para o dia a dia ou compromissos de última hora.",
    beneficios: "Prática e rápida; visual leve e natural; pronta em 30 minutos.",
    categoria: "Maquiagem",
    duracao_min: 30,
    valor: null,
    mostrar_valor: false,
    ativo: true,
    ordem: 5,
    criado_em: "",
  },
  {
    id: "s6",
    nome: "Make Intermediária",
    descricao: "Maquiagem completa para eventos sociais, com acabamento sofisticado e duradouro.",
    beneficios: "Acabamento profissional; longa duração; ideal para eventos.",
    categoria: "Maquiagem",
    duracao_min: 50,
    valor: null,
    mostrar_valor: false,
    ativo: true,
    ordem: 6,
    criado_em: "",
  },
  {
    id: "s7",
    nome: "Make Premium",
    descricao:
      "Experiência completa de beleza para noivas e ocasiões especiais, com prova e acabamento de alta durabilidade.",
    beneficios: "Para momentos únicos; alta durabilidade; atendimento exclusivo.",
    categoria: "Maquiagem",
    duracao_min: 90,
    valor: null,
    mostrar_valor: false,
    ativo: true,
    ordem: 7,
    criado_em: "",
  },
  {
    id: "s8",
    nome: "Remoção de Micropigmentação",
    descricao:
      "Remove gradualmente pigmentos antigos de micropigmentação, microblading ou tatuagem de sobrancelha, clareando a área com segurança para um novo desenho.",
    beneficios:
      "Corrige trabalhos antigos; clareia cores oxidadas; prepara para um novo design.",
    categoria: "Remocao",
    duracao_min: 60,
    valor: null,
    mostrar_valor: false,
    ativo: true,
    ordem: 8,
    criado_em: "",
  },
  {
    id: "s9",
    nome: "Remoção de Tattoo",
    descricao:
      "Clareia e remove a tinta da pele em sessões progressivas, respeitando a cicatrização — para apagar por completo ou preparar uma cobertura (cover-up).",
    beneficios:
      "Apaga ou clareia tatuagens; ideal para cover-up; sessões progressivas e seguras.",
    categoria: "Remocao",
    duracao_min: 45,
    valor: null,
    mostrar_valor: false,
    ativo: true,
    ordem: 9,
    criado_em: "",
  },
];

const DEPOIMENTOS_FALLBACK: Depoimento[] = [
  {
    id: "d1",
    cliente_nome: "Ana Souza",
    texto: "Melhor design de sobrancelhas que já fiz! A Lidiane tem mão de fada.",
    nota: 5,
    foto: null,
    aprovado: true,
    criado_em: "",
  },
  {
    id: "d2",
    cliente_nome: "Carla Mendes",
    texto: "Saio sempre me sentindo mais bonita. Atendimento impecável e acolhedor.",
    nota: 5,
    foto: null,
    aprovado: true,
    criado_em: "",
  },
  {
    id: "d3",
    cliente_nome: "Juliana Lima",
    texto: "O brow lamination mudou meu rosto. Recomendo de olhos fechados!",
    nota: 5,
    foto: null,
    aprovado: true,
    criado_em: "",
  },
];

// ---------------------------------------------------------------------
//  Consultas
// ---------------------------------------------------------------------
export async function getServicos(): Promise<Servico[]> {
  if (!supabaseConfigurado()) return SERVICOS_FALLBACK;
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("servicos")
      .select("*")
      .eq("ativo", true)
      .order("ordem", { ascending: true });
    if (error || !data || data.length === 0) return SERVICOS_FALLBACK;
    return data as Servico[];
  } catch {
    return SERVICOS_FALLBACK;
  }
}

export async function getServicoPorId(id: string): Promise<Servico | null> {
  const todos = await getServicos();
  return todos.find((s) => s.id === id) ?? null;
}

export async function getDepoimentos(): Promise<Depoimento[]> {
  if (!supabaseConfigurado()) return DEPOIMENTOS_FALLBACK;
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("depoimentos")
      .select("*")
      .eq("aprovado", true)
      .order("criado_em", { ascending: false });
    if (error || !data || data.length === 0) return DEPOIMENTOS_FALLBACK;
    return data as Depoimento[];
  } catch {
    return DEPOIMENTOS_FALLBACK;
  }
}
