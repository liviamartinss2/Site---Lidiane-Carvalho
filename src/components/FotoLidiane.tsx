"use client";

import { useState } from "react";

/**
 * Foto da Lidiane. Tenta carregar /lidiane.jpg (basta subir esse arquivo em
 * /public). Enquanto o arquivo nao existir, mostra uma imagem de exemplo.
 */
const FALLBACK =
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1200&auto=format&fit=crop";

export function FotoLidiane({
  className = "",
  alt = "Lidiane Carvalho",
}: {
  className?: string;
  alt?: string;
}) {
  const [src, setSrc] = useState("/lidiane.jpg");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setSrc(FALLBACK)}
      className={className}
    />
  );
}
