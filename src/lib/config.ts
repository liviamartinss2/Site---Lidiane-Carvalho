// Configuracoes do negocio lidas das variaveis de ambiente (com fallback)

export const config = {
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMERO ?? "5585981933902",
  studioNome: process.env.NEXT_PUBLIC_STUDIO_NOME ?? "Lidiane Carvalho",
  endereco:
    process.env.NEXT_PUBLIC_STUDIO_ENDERECO ??
    "R. 12, 148 - Lot. Sol Nascente, Aquiraz - CE, 61700-000",
  mapsUrl:
    process.env.NEXT_PUBLIC_MAPS_URL ??
    "https://www.google.com/maps/place/Lidiane+Carvalho+-+Estudio+de+Beleza",
  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://instagram.com/lidianecarvalho",
  anosExperiencia: 13,
  reativacaoDias: Number(process.env.REATIVACAO_DIAS ?? 20),
};

/** Monta um link wa.me com mensagem pre-preenchida */
export function whatsappLink(mensagem: string, numero = config.whatsapp) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}
