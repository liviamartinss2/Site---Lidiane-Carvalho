/** Brilho decorativo (sparkle de 4 pontas) — estilo da marca Lidiane Carvalho */
export function Brilho({
  className = "",
  size = 24,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 1c.7 5.6 5.4 10.3 11 11-5.6.7-10.3 5.4-11 11-.7-5.6-5.4-10.3-11-11C6.6 11.3 11.3 6.6 12 1Z" />
    </svg>
  );
}
