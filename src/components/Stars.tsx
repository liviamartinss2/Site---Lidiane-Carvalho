export function Stars({ nota }: { nota: number }) {
  return (
    <div className="flex gap-0.5 text-gold" aria-label={`${nota} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden="true">
          {i < nota ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}
