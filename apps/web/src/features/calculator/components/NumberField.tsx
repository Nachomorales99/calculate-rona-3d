import type { ReactNode } from "react";
import { Input } from "@/components/ui";

interface Props {
  id: string;
  label: ReactNode;
  value: number;
  onChange: (value: number) => void;
  prefix?: ReactNode;
  suffix?: ReactNode;
  hint?: ReactNode;
  integer?: boolean;
  min?: number;
  max?: number;
}

/** Input numérico controlado que tolera el campo vacío mientras el usuario escribe. */
export function NumberField({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  hint,
  integer,
  min = 0,
  max,
}: Props) {
  return (
    <Input
      id={id}
      label={label}
      type="number"
      inputMode={integer ? "numeric" : "decimal"}
      step={integer ? 1 : "any"}
      min={min}
      max={max}
      value={Number.isFinite(value) ? value : ""}
      onChange={(e) => {
        const n = e.target.valueAsNumber;
        onChange(Number.isFinite(n) ? n : 0);
      }}
      {...(prefix !== undefined ? { prefix } : {})}
      {...(suffix !== undefined ? { suffix } : {})}
      {...(hint !== undefined ? { hint } : {})}
    />
  );
}
