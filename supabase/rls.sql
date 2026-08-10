-- =====================================================================
--  RLS (Row Level Security) — Clínica Lidiane Carvalho
--  Rode este script no SQL Editor do Supabase.
--
--  O QUE ELE FAZ:
--   - Liga o RLS em TODAS as tabelas.
--   - Libera leitura PÚBLICA (anon) só do catálogo público
--     (serviços ativos, depoimentos aprovados, horários, galeria).
--   - Bloqueia ao público as tabelas sensíveis (clientes, agendamentos,
--     bloqueios, recompensas, mensagens). O servidor acessa essas tabelas
--     via chave "service_role", que IGNORA o RLS — por isso o site, o
--     agendamento e o painel continuam funcionando.
--
--  Pode rodar quantas vezes quiser (é idempotente).
-- =====================================================================

-- 1) Liga o RLS em todas as tabelas
alter table servicos           enable row level security;
alter table clientes           enable row level security;
alter table agendamentos       enable row level security;
alter table bloqueios          enable row level security;
alter table disponibilidade    enable row level security;
alter table recompensas        enable row level security;
alter table mensagens_enviadas enable row level security;
alter table galeria            enable row level security;
alter table depoimentos        enable row level security;

-- 2) Leitura PÚBLICA (anon/authenticated) só do catálogo público

-- Serviços ativos
drop policy if exists "public_read_servicos" on servicos;
create policy "public_read_servicos" on servicos
  for select to anon, authenticated using (ativo = true);

-- Depoimentos aprovados
drop policy if exists "public_read_depoimentos" on depoimentos;
create policy "public_read_depoimentos" on depoimentos
  for select to anon, authenticated using (aprovado = true);

-- Horário de funcionamento (informação pública)
drop policy if exists "public_read_disponibilidade" on disponibilidade;
create policy "public_read_disponibilidade" on disponibilidade
  for select to anon, authenticated using (true);

-- Galeria antes/depois (pública)
drop policy if exists "public_read_galeria" on galeria;
create policy "public_read_galeria" on galeria
  for select to anon, authenticated using (true);

-- 3) clientes, agendamentos, bloqueios, recompensas, mensagens_enviadas:
--    NENHUMA policy para anon/authenticated => totalmente bloqueadas ao público.
--    O servidor acessa via service_role (ignora RLS), então tudo segue funcionando.

-- Conferência rápida (opcional): deve listar RLS habilitado nas 9 tabelas
-- select relname, relrowsecurity from pg_class
--   where relname in ('servicos','clientes','agendamentos','bloqueios',
--   'disponibilidade','recompensas','mensagens_enviadas','galeria','depoimentos');
