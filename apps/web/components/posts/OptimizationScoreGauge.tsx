function toneFor(score: number): { stroke: string; text: string; label: string } {
  if (score >= 80) return { stroke: "var(--status-success)", text: "text-status-success", label: "Excellent" };
  if (score >= 50) return { stroke: "var(--status-pending-accent)", text: "text-status-pending-accent", label: "Needs work" };
  return { stroke: "var(--error)", text: "text-error", label: "Low" };
}

/** A small SVG progress ring — no chart library. Reuses the app's existing
 *  three-state status-color vocabulary (success/pending/error) rather than
 *  introducing a fourth color, per DESIGN.md's explicit rule. */
export function OptimizationScoreGauge({ score, size = 96 }: { score: number; size?: number }) {
  const tone = toneFor(score);
  const strokeWidth = size * 0.09;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="inline-flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--outline-variant)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={tone.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[20px] font-bold tabular text-on-surface">{score}</span>
          <span className="text-[10px] text-on-surface-variant">/100</span>
        </div>
      </div>
      <span className={`text-[12px] font-semibold ${tone.text}`}>{tone.label}</span>
    </div>
  );
}
