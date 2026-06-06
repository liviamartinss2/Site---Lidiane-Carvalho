import { getServicosAdmin } from "@/lib/admin-data";
import { supabaseConfigurado } from "@/lib/data";
import { ServicosManager } from "@/components/ServicosManager";

export const dynamic = "force-dynamic";

export default async function ServicosAdminPage() {
  const servicos = await getServicosAdmin();
  const demo = !supabaseConfigurado();

  return (
    <div>
      <h1 className="h-serif text-3xl">Serviços</h1>
      <p className="text-ink-muted">
        Crie, edite, ative/desative ou remova os procedimentos. As mudanças
        aparecem no site na hora.
      </p>

      <div className="mt-6">
        <ServicosManager servicos={servicos} demo={demo} />
      </div>
    </div>
  );
}
