// Stylized rice-grain mark inside a hexagon. Original mark from primitives.jsx.
export function MiniLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-label="Satria Tani logo">
      <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="var(--ink)" />
      <ellipse cx="16" cy="16" rx="3.2" ry="9" fill="var(--gold)" transform="rotate(-22 16 16)" />
      <ellipse
        cx="16"
        cy="16"
        rx="3.2"
        ry="9"
        fill="var(--terracotta)"
        transform="rotate(22 16 16)"
        opacity="0.9"
      />
      <circle cx="16" cy="16" r="1.6" fill="var(--bone)" />
    </svg>
  );
}
