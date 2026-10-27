import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends Omit<ComponentProps<"input">, "prefix" | "id"> {
  label: ReactNode;
  hint?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  /** id estable para que el valor sobreviva re-renders y para tests. */
  id?: string;
  className?: string;
}

export function Input({ label, hint, prefix, suffix, id, className, ...rest }: InputProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={inputId} className="text-sm font-semibold">
        {label}
      </label>
      <div className="flex items-center overflow-hidden rounded-sm border-[1.5px] border-line bg-field transition-colors focus-within:border-accent focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_20%,transparent)]">
        {prefix ? <span className="pl-3 text-sm text-muted">{prefix}</span> : null}
        <input
          id={inputId}
          className="tabular min-w-0 flex-1 bg-transparent px-3 py-2.5 text-[1.05rem] text-ink outline-none placeholder:text-muted/70"
          {...rest}
        />
        {suffix ? (
          <span className="pr-3 text-sm whitespace-nowrap text-muted">{suffix}</span>
        ) : null}
      </div>
      {hint ? <p className="text-sm text-muted">{hint}</p> : null}
    </div>
  );
}
