/** Monograma "LC" em arco — inspirado na logo oficial do estudio */
export function Monograma({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 80"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M15 74 V34 a17 17 0 0 1 34 0 V74"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <text
        x="32"
        y="52"
        textAnchor="middle"
        fontFamily="var(--font-serif), Georgia, serif"
        fontSize="27"
        fontWeight="600"
        letterSpacing="1"
        fill="currentColor"
      >
        LC
      </text>
    </svg>
  );
}
