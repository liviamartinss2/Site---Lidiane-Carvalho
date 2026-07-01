// Tipos de dominio do estudio Lidiane Carvalho

export type Categoria =
  | "Sobrancelhas"
  | "Remocao"
  | "Cilios"
  | "Labios"
  | "Maquiagem"
  | "Geral";

export type StatusAgendamento =
  | "agendado"
  | "concluido"
  | "cancelado"
  | "remarcado"
  | "no_show";

export interface Servico {
  id: string;
  nome: string;
  descricao: string | null;
  beneficios: string | null;
  categoria: Categoria;
  duracao_min: number;
  valor: number | null;
  mostrar_valor: boolean;
  ativo: boolean;
  ordem: number;
  criado_em: string;
}

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string | null;
  data_nascimento: string | null;
  primeiro_atendimento: string | null;
  ultimo_atendimento: string | null;
  qtd_atendimentos: number;
  total_gasto: number;
  observacoes: string | null;
  criado_em: string;
}

export interface Agendamento {
  id: string;
  cliente_id: string;
  servico_id: string;
  inicio: string;
  fim: string;
  status: StatusAgendamento;
  valor_cobrado: number | null;
  origem: "site" | "whatsapp" | "manual";
  observacoes: string | null;
  criado_em: string;
}

export interface AgendamentoDetalhado extends Agendamento {
  cliente: Pick<Cliente, "id" | "nome" | "telefone">;
  servico: Pick<Servico, "id" | "nome" | "duracao_min">;
}

export interface Bloqueio {
  id: string;
  inicio: string;
  fim: string;
  motivo: string | null;
}

export interface Disponibilidade {
  id: string;
  dia_semana: number; // 0=domingo ... 6=sabado
  hora_abertura: string; // "09:00"
  hora_fechamento: string; // "18:00"
  ativo: boolean;
}

export interface Recompensa {
  id: string;
  cliente_id: string;
  tipo: "aniversario" | "reativacao" | "fidelidade";
  descricao: string;
  status: "pendente" | "enviado" | "resgatado" | "expirado";
  valido_ate: string | null;
  criado_em: string;
}

export interface Depoimento {
  id: string;
  cliente_nome: string;
  texto: string;
  nota: number;
  foto: string | null;
  aprovado: boolean;
  criado_em: string;
}
