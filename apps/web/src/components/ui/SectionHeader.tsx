import type { ReactNode } from "react";
import { Link } from "react-router";

interface Props {
  title: ReactNode;
  text?: ReactNode;
  link?: { to: string; label: string };
  as?: "h1" | "h2";
}

export function SectionHeader({ title, text, link, as = "h2" }: Props) {
  const Tag = as;
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-[60ch]">
        <Tag className={as === "h1" ? "text-[2.4rem] sm:text-[3rem]" : "text-[1.9rem]"}>
          {title}
        </Tag>
        {text ? <p className="mt-1.5 text-muted">{text}</p> : null}
      </div>
      {link ? (
        <Link to={link.to} className="text-sm font-semibold whitespace-nowrap hover:text-accent">
          {link.label} →
        </Link>
      ) : null}
    </div>
  );
}

export function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mt-6 mb-3 flex items-center gap-3 text-xs font-bold tracking-[0.1em] text-muted uppercase after:h-px after:flex-1 after:bg-line after:content-['']">
      {children}
    </p>
  );
}
