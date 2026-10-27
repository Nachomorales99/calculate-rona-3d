import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SelectProps extends Omit<ComponentProps<"select">, "id"> {
  label: ReactNode;
  id?: string;
  className?: string;
}

export function Select({ label, id, className, children, ...rest }: SelectProps) {
  const auto = useId();
  const selectId = id ?? auto;
  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={selectId} className="text-sm font-semibold">
        {label}
      </label>
      <div className="flex overflow-hidden rounded-sm border-[1.5px] border-line bg-field focus-within:border-accent">
        <select
          id={selectId}
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-[1.05rem] text-ink outline-none"
          {...rest}
        >
          {children}
        </select>
      </div>
    </div>
  );
}
