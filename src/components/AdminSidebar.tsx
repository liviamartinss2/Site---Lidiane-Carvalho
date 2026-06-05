"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/login/actions";

const itens = [
  { href: "/admin", label: "Dashboard", icon: "◧" },
  { href: "/admin/agenda", label: "Agenda", icon: "▦" },
  { href: "/admin/bloqueios", label: "Bloqueios", icon: "⛔" },
  { href: "/admin/clientes", label: "Clientes & CRM", icon: "♥" },
  { href: "/admin/financeiro", label: "Financeiro", icon: "₿" },
  { href: "/admin/servicos", label: "Serviços", icon: "✶" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-row gap-1 border-b border-line bg-ink p-2 text-cream/80 md:h-screen md:w-60 md:flex-col md:gap-1 md:border-b-0 md:border-r md:p-4">
      <div className="mb-0 hidden items-center gap-2 px-2 py-3 md:flex">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[conic-gradient(from_160deg,#8E4B5A,#C77B8C)] font-serif text-sm font-bold text-white">
          LC
        </span>
        <span className="font-serif text-sm text-white">Lidiane Carvalho</span>
      </div>

      <nav className="flex flex-1 flex-row gap-1 overflow-x-auto md:flex-col">
        {itens.map((item) => {
          const ativo =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm transition-colors ${
                ativo
                  ? "bg-rose-gradient text-white"
                  : "text-cream/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={logout} className="md:mt-auto">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cream/60 transition-colors hover:bg-white/10 hover:text-white">
          <span aria-hidden="true">⎋</span>
          <span className="hidden md:inline">Sair</span>
        </button>
      </form>
    </aside>
  );
}
