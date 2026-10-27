import { useId, type ComponentProps, type ReactNode } from "react";

interface CheckboxProps extends Omit<ComponentProps<"input">, "type" | "id"> {
  label: ReactNode;
  id?: string;
}

export function Checkbox({ label, id, ...rest }: CheckboxProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <label htmlFor={inputId} className="flex cursor-pointer items-center gap-2.5 text-sm">
      <input id={inputId} type="checkbox" className="size-4 accent-accent" {...rest} />
      <span>{label}</span>
    </label>
  );
}
