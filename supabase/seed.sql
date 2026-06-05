-- =====================================================================
--  SEED — dados iniciais do estudio Lidiane Carvalho
--  Execute APOS o schema.sql
-- =====================================================================

-- Servicos oferecidos
insert into servicos (nome, descricao, beneficios, categoria, duracao_min, valor, mostrar_valor, ordem) values
  ('Design de Sobrancelhas',
   'Mapeamento facial e modelagem que valoriza o seu olhar, respeitando a simetria natural do seu rosto.',
   'Realça o olhar; corrige assimetrias; resultado natural e duradouro.',
   'Sobrancelhas', 40, 30.00, true, 1),

  ('Brow Lamination',
   'Alinhamento dos fios que deixa as sobrancelhas mais cheias, alinhadas e com efeito penteado por semanas.',
   'Efeito volumoso; fios disciplinados; dura de 4 a 6 semanas.',
   'Sobrancelhas', 60, null, false, 2),

  ('Lift de Cilios',
   'Curvatura natural dos cilios a partir da raiz, abrindo o olhar sem necessidade de alongamento.',
   'Olhar aberto e marcante; sem extensoes; baixa manutencao.',
   'Cilios', 60, null, false, 3),

  ('Revitalizacao Labial',
   'Tratamento que hidrata, esfolia e devolve o vico natural dos labios, realçando a cor e a textura.',
   'Labios hidratados; aspecto saudavel; realça a cor natural.',
   'Labios', 45, null, false, 4),

  ('Make Express',
   'Maquiagem rapida e elegante para o dia a dia ou compromissos de ultima hora.',
   'Pratica e rapida; visual leve e natural; pronta em 30 minutos.',
   'Maquiagem', 30, null, false, 5),

  ('Make Intermediaria',
   'Maquiagem completa para eventos sociais, com acabamento sofisticado e duradouro.',
   'Acabamento profissional; longa duracao; ideal para eventos.',
   'Maquiagem', 50, null, false, 6),

  ('Make Premium',
   'Experiencia completa de beleza para noivas e ocasioes especiais, com prova e acabamento de alta durabilidade.',
   'Para momentos unicos; alta durabilidade; atendimento exclusivo.',
   'Maquiagem', 90, null, false, 7);

-- Horario de funcionamento padrao (terca a sabado, 09h-18h)
insert into disponibilidade (dia_semana, hora_abertura, hora_fechamento, ativo) values
  (2, '09:00', '18:00', true),  -- terca
  (3, '09:00', '18:00', true),  -- quarta
  (4, '09:00', '18:00', true),  -- quinta
  (5, '09:00', '18:00', true),  -- sexta
  (6, '08:00', '14:00', true);  -- sabado

-- Depoimentos de exemplo (aprovados)
insert into depoimentos (cliente_nome, texto, nota, aprovado) values
  ('Ana Souza',    'Melhor design de sobrancelhas que ja fiz! A Lidiane tem mao de fada.', 5, true),
  ('Carla Mendes', 'Saio sempre me sentindo mais bonita. Atendimento impecavel e acolhedor.', 5, true),
  ('Juliana Lima', 'O brow lamination mudou meu rosto. Recomendo de olhos fechados!', 5, true);
