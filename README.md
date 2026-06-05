# Lidiane Carvalho — Estúdio de Beleza

Plataforma completa de **agendamento online, gestão de agenda e CRM** para o
estúdio de beleza da Lidiane Carvalho (Aquiraz - CE). Construída em **Next.js +
Supabase**, com site público, sistema de agendamento e painel administrativo
estratégico.

> O site funciona em **modo demonstração** mesmo sem banco de dados configurado
> (usa dados de exemplo). Para dados reais, configure o Supabase (passos abaixo).

---

## ✨ Funcionalidades

### Site público
- **Home** com selo "13 anos de experiência", serviços em destaque, depoimentos e CTAs
- **Serviços** agrupados por categoria (sobrancelhas, cílios, lábios, maquiagem)
- **Agendamento em 4 passos** (serviço → data → horário → dados) em menos de 1 minuto
- **Galeria** de resultados (antes/depois) e **depoimentos**
- **Localização** com Google Maps e **WhatsApp** flutuante
- Mensagem de confirmação pronta para o WhatsApp + adicionar ao calendário (.ics / Google)

### Painel administrativo (`/admin`)
- **Dashboard**: atendimentos e faturamento (dia/semana/mês) + alertas de CRM
- **Agenda**: visualização por dia, valores, status e contato rápido
- **Clientes & CRM**: frequência, filtros, e ações de retenção
- **Financeiro**: faturamento previsto e ticket médio
- **Serviços**: gestão de valores e durações

### Automações de CRM (cron diário)
- **Reativação**: clientes com +20 dias sem atendimento recebem convite de retorno
- **Aniversário**: aniversariantes do mês ganham uma **Make Express grátis**
- Guarda o **aniversário** da cliente (capturado no agendamento)

---

## 🎨 Identidade visual
Paleta **rosé / mauve + dourado + preto/branco** (sofisticada, feminina, premium),
com tipografia serifada (Georgia) nos títulos. Definida em `tailwind.config.ts`.

---

## 🚀 Como rodar localmente

```bash
npm install
cp .env.local.example .env.local   # opcional para dados reais
npm run dev
```

Acesse:
- Site: <http://localhost:3000>
- Painel: <http://localhost:3000/admin>

---

## 🗄️ Configurar o Supabase (dados reais)

1. Crie um projeto gratuito em <https://supabase.com>
2. No **SQL Editor**, rode `supabase/schema.sql` e depois `supabase/seed.sql`
3. Em **Settings → API**, copie as chaves para o `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (secreta — usada pelas automações)
4. Em **Authentication → Users**, crie o usuário da Lidiane (e-mail + senha) para o login do painel

---

## ⏰ Automações (cron)

Configuradas em `vercel.json`:
- `/api/cron/reativacao` — todo dia às 12h
- `/api/cron/aniversario` — dia 1 de cada mês às 9h

Protegidas pelo header `Authorization: Bearer <CRON_SECRET>`. Para enviar as
mensagens automaticamente pelo WhatsApp, integre a **WhatsApp Business API**
(Meta/Twilio) nos pontos marcados nas rotas de cron.

---

## 📦 Deploy (Vercel)
1. Importe o repositório na **Vercel**
2. Adicione as variáveis de ambiente do `.env.local`
3. Deploy — os crons são ativados automaticamente pelo `vercel.json`

---

## 🧱 Stack
- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Supabase** (PostgreSQL + Auth)
- **date-fns**

## 📁 Estrutura
```
src/
├── app/
│   ├── (site)/            # site público (home, serviços, agendar, etc.)
│   ├── admin/             # painel (login + dashboard/agenda/clientes/financeiro/serviços)
│   ├── api/               # disponibilidade + crons de CRM
│   └── actions/           # server actions (agendamento)
├── components/            # UI compartilhada
├── lib/                   # config, tipos, dados, disponibilidade, supabase
supabase/                  # schema.sql + seed.sql
legacy/                    # versão estática original (referência)
```
