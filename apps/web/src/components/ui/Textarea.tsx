import { useId, type ComponentProps, type ReactNode } from "react";

interface TextareaProps extends Omit<ComponentProps<"textarea">, "id"> {
  label: ReactNode;
  id?: string;
}

export function Textarea({ label, id, ...rest }: TextareaProps) {
  const auto = useId();
  const taId = id ?? auto;
  return (
    <div className="grid gap-1.5">
      <label htmlFor={taId} className="text-sm font-semibold">
        {label}
      </label>
      <textarea
        id={taId}
        className="min-h-20 resize-y rounded-sm border-[1.5px] border-line bg-field px-3 py-2.5 text-base text-ink outline-none focus:border-accent"
        {...rest}
      />
    </div>
  );
}
