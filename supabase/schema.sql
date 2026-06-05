-- =====================================================================
--  ESTUDIO LIDIANE CARVALHO — Schema do banco de dados (PostgreSQL/Supabase)
--  Execute este script no SQL Editor do Supabase para criar a estrutura.
-- =====================================================================

-- Extensao para gerar UUIDs
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
--  SERVICOS
-- ---------------------------------------------------------------------
create table if not exists servicos (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null,
  descricao     text,
  beneficios    text,
  categoria     text not null default 'Geral',     -- Sobrancelhas | Cilios | Labios | Maquiagem
  duracao_min   integer not null default 60,
  valor         numeric(10,2),                       -- opcional (pode ser "sob consulta")
  mostrar_valor boolean not null default true,
  ativo         boolean not null default true,
  ordem         integer not null default 0,
  criado_em     timestamptz not null default now()
);

-- ---------------------------------------------------------------------
--  CLIENTES (nucleo do CRM)
-- ---------------------------------------------------------------------
create table if not exists clientes (
  id                   uuid primary key default gen_random_uuid(),
  nome                 text not null,
  telefone             text not null unique,         -- chave de reconhecimento
  email                text,
  data_nascimento      date,                          -- aniversario (make gratis)
  primeiro_atendimento timestamptz,
  ultimo_atendimento   timestamptz,
  qtd_atendimentos     integer not null default 0,
  total_gasto          numeric(10,2) not null default 0,
  observacoes          text,
  criado_em            timestamptz not null default now()
);

create index if not exists idx_clientes_ultimo_atend on clientes (ultimo_atendimento);
create index if not exists idx_clientes_nascimento   on clientes (data_nascimento);

-- ---------------------------------------------------------------------
--  AGENDAMENTOS
-- ---------------------------------------------------------------------
create table if not exists agendamentos (
  id                uuid primary key default gen_random_uuid(),
  cliente_id        uuid not null references clientes(id) on delete cascade,
  servico_id        uuid not null references servicos(id),
  inicio            timestamptz not null,
  fim               timestamptz not null,
  status            text not null default 'agendado', -- agendado|concluido|cancelado|remarcado|no_show
  valor_cobrado     numeric(10,2),                     -- snapshot do valor no momento do agendamento
  origem            text not null default 'site',      -- site|whatsapp|manual
  observacoes       text,
  criado_em         timestamptz not null default now()
);

create index if not exists idx_agend_inicio  on agendamentos (inicio);
create index if not exists idx_agend_cliente on agendamentos (cliente_id);
create index if not exists idx_agend_status  on agendamentos (status);

-- Impede dois agendamentos ativos no mesmo horario exato de inicio
create unique index if not exists uq_agend_slot
  on agendamentos (inicio)
  where status in ('agendado', 'remarcado');

-- ---------------------------------------------------------------------
--  BLOQUEIOS DE AGENDA (folgas, almoco, compromissos)
-- ---------------------------------------------------------------------
create table if not exists bloqueios (
  id        uuid primary key default gen_random_uuid(),
  inicio    timestamptz not null,
  fim       timestamptz not null,
  motivo    text,
  criado_em timestamptz not null default now()
);

create index if not exists idx_bloqueios_inicio on bloqueios (inicio);

-- ---------------------------------------------------------------------
--  HORARIO DE FUNCIONAMENTO (por dia da semana)
-- ---------------------------------------------------------------------
create table if not exists disponibilidade (
  id            uuid primary key default gen_random_uuid(),
  dia_semana    integer not null,        -- 0=domingo ... 6=sabado
  hora_abertura time not null,
  hora_fechamento time not null,
  ativo         boolean not null default true
);

-- ---------------------------------------------------------------------
--  RECOMPENSAS / CRM (aniversario, reativacao, fidelidade)
-- ---------------------------------------------------------------------
create table if not exists recompensas (
  id          uuid primary key default gen_random_uuid(),
  cliente_id  uuid not null references clientes(id) on delete cascade,
  tipo        text not null,                  -- aniversario | reativacao | fidelidade
  descricao   text not null,                  -- ex.: "Make Express gratis"
  status      text not null default 'pendente', -- pendente|enviado|resgatado|expirado
  valido_ate  date,
  criado_em   timestamptz not null default now()
);

create index if not exists idx_recompensas_cliente on recompensas (cliente_id);
create index if not exists idx_recompensas_status  on recompensas (status);

-- ---------------------------------------------------------------------
--  LOG DE MENSAGENS AUTOMATICAS (evita reenvio duplicado)
-- ---------------------------------------------------------------------
create table if not exists mensagens_enviadas (
  id          uuid primary key default gen_random_uuid(),
  cliente_id  uuid not null references clientes(id) on delete cascade,
  tipo        text not null,           -- reativacao | aniversario | lembrete_24h
  referencia  text,                    -- ex.: ano do aniversario "2026" p/ idempotencia
  canal       text not null default 'whatsapp',
  enviado_em  timestamptz not null default now()
);

create index if not exists idx_msg_cliente on mensagens_enviadas (cliente_id, tipo, referencia);

-- ---------------------------------------------------------------------
--  GALERIA (antes/depois) e DEPOIMENTOS
-- ---------------------------------------------------------------------
create table if not exists galeria (
  id          uuid primary key default gen_random_uuid(),
  servico_id  uuid references servicos(id) on delete set null,
  foto_antes  text,
  foto_depois text,
  descricao   text,
  destaque    boolean not null default false,
  criado_em   timestamptz not null default now()
);

create table if not exists depoimentos (
  id           uuid primary key default gen_random_uuid(),
  cliente_nome text not null,
  texto        text not null,
  nota         integer not null default 5,   -- 1..5
  foto         text,
  aprovado     boolean not null default false,
  criado_em    timestamptz not null default now()
);

-- =====================================================================
--  TRIGGER: ao concluir um atendimento, atualiza estatisticas do cliente
-- =====================================================================
create or replace function atualizar_stats_cliente()
returns trigger as $$
begin
  if (new.status = 'concluido' and (old.status is distinct from 'concluido')) then
    update clientes c set
      qtd_atendimentos    = qtd_atendimentos + 1,
      total_gasto         = total_gasto + coalesce(new.valor_cobrado, 0),
      ultimo_atendimento  = new.inicio,
      primeiro_atendimento = coalesce(c.primeiro_atendimento, new.inicio)
    where c.id = new.cliente_id;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_stats_cliente on agendamentos;
create trigger trg_stats_cliente
  after update on agendamentos
  for each row execute function atualizar_stats_cliente();
