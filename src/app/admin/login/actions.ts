"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/data";

export async function login(_prev: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const senha = String(formData.get("senha") ?? "");

  if (!supabaseConfigurado()) {
    // modo demo — entra direto
    redirect("/admin");
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) {
    return { erro: "E-mail ou senha incorretos." };
  }
  redirect("/admin");
}

export async function logout() {
  if (supabaseConfigurado()) {
    const supabase = createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
