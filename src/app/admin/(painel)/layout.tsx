import { AdminSidebar } from "@/components/AdminSidebar";
import { supabaseConfigurado } from "@/lib/data";

export const metadata = {
  title: "Painel — Lidiane Carvalho",
};

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const demo = !supabaseConfigurado();
  return (
    <div className="flex min-h-screen flex-col bg-cream md:flex-row">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden">
        {demo && (
          <div className="bg-gold/15 px-6 py-2 text-center text-xs text-gold-dark">
            Modo demonstração — configure o Supabase (.env.local) para usar dados reais.
          </div>
        )}
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
      </div>
    </div>
  );
}
