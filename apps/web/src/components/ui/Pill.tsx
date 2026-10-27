import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "pro" | "soon" | "eyebrow";

const tones: Record<Tone, string> = {
  neutral: "border-line bg-surface text-ink font-medium text-sm px-3.5 py-1.5",
  pro: "border-accent text-accent text-[0.68rem] font-bold tracking-[0.06em] uppercase px-2 py-px",
  soon: "border-dashed border-line text-muted text-[0.68rem] font-bold tracking-[0.06em] uppercase px-2 py-px",
  eyebrow:
    "border-line bg-surface text-muted text-[0.78rem] font-semibold tracking-[0.08em] uppercase pl-2 pr-3.5 py-1.5",
};

export function Pill({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-2 rounded-pill border", tones[tone], className)}
    >
      {children}
    </span>
  );
}
