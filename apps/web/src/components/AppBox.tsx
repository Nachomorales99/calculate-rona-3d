import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import type { AppEntry } from "@/content/apps";
import { cn } from "@/lib/cn";
import { Ficha, Pill } from "./ui";

export function AppBox({ app }: { app: AppEntry }) {
  const soon = app.status === "soon";
  return (
    <Link
      to={app.route}
      data-app-box
      className={cn(
        "grid grid-cols-[auto_1fr_auto] items-start gap-3.5 rounded-lg border border-line bg-surface p-4 pb-3.5 text-inherit no-underline transition-[box-shadow,border-color] duration-150 hover:border-ink hover:shadow-hard-lg",
        soon && "opacity-75",
      )}
    >
      <span className="grid size-10 place-items-center rounded-sm border border-line bg-paper text-ink">
        <Ficha className="size-[1.35rem]" />
      </span>
      <span className="min-w-0">
        <span className="mb-0.5 flex flex-wrap items-center gap-2 text-[1.02rem] font-bold">
          {app.name}
          {app.pro ? <Pill tone="pro">Pro</Pill> : null}
          {soon ? <Pill tone="soon">Pronto</Pill> : null}
        </span>
        <span className="block text-sm leading-[1.45] text-muted">{app.summary}</span>
        <code className="mt-2.5 inline-block rounded-[6px] border border-line bg-paper px-1.5 py-px font-mono text-xs text-muted">
          {app.route}
        </code>
      </span>
      <ArrowRight className="size-5 self-center text-muted transition-[transform,color] duration-150 group-hover:translate-x-0.5 [a:hover_&]:translate-x-0.5 [a:hover_&]:text-accent" />
    </Link>
  );
}
