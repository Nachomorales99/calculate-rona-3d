import type { ComponentProps, ReactNode } from "react";
import { Link } from "react-router";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-bold leading-none whitespace-nowrap transition-[transform,box-shadow,filter] duration-150 ease-out disabled:opacity-50 disabled:pointer-events-none";
const sizes: Record<Size, string> = {
  md: "px-4 py-3 text-base",
  sm: "px-3.5 py-2 text-sm",
};
const variants: Record<Variant, string> = {
  primary:
    "border-[1.5px] border-accent bg-accent text-accent-ink shadow-hard hover:-translate-x-px hover:-translate-y-px hover:shadow-hard-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
  secondary:
    "border-[1.5px] border-ink bg-surface text-ink shadow-hard hover:-translate-x-px hover:-translate-y-px hover:shadow-hard-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
  ghost: "border-[1.5px] border-line bg-transparent text-ink hover:border-ink",
};

interface Common {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}
type ButtonProps = Common &
  Omit<ComponentProps<"button">, "className" | "children"> & { to?: undefined };
type LinkProps = Common & { to: string; external?: boolean };

export function Button(props: ButtonProps | LinkProps) {
  const { variant = "secondary", size = "md", className, children } = props;
  const classes = cn(base, sizes[size], variants[variant], className);
  if ("to" in props && props.to !== undefined) {
    if (props.external) {
      return (
        <a className={classes} href={props.to} target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link className={classes} to={props.to}>
        {children}
      </Link>
    );
  }
  const { variant: _v, size: _s, className: _c, children: _ch, to: _t, ...rest } = props;
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
