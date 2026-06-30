import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase para leitura de dados PUBLICOS (servicos ativos, depoimentos
 * aprovados). Nao usa cookies/sessao — assim as paginas publicas podem ser
 * geradas estaticamente e cacheadas via ISR, em vez de renderizadas (e
 * consultar o banco) a cada acesso.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
