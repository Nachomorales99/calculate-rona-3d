import { Link, useMatches } from "react-router";
import { Button, Ficha, Pill } from "@/components/ui";
import { CONTACT } from "@/content/contact";
import { findApp } from "@/content/apps";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { Component as NotFound } from "./NotFoundPage";

function isAppHandle(h: unknown): h is { app: string } {
  return typeof h === "object" && h !== null && "app" in h && typeof h.app === "string";
}

export function Component() {
  const matches = useMatches();
  const handle = matches.map((m) => m.handle).find(isAppHandle);
  const app = handle ? findApp(handle.app) : undefined;
  useDocumentTitle(app?.name ?? "Pronto");
  if (!app) return <NotFound />;
  return (
    <div className="mx-auto max-w-[60ch] py-10">
      <p className="mb-3 text-sm text-muted">
        <Link to="/apps" className="hover:text-ink">
          Apps
        </Link>{" "}
        / {app.name}
      </p>
      <div className="grid justify-items-start gap-4 rounded-xl border border-line bg-surface p-6">
        <Ficha className="size-12" />
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-[2rem]">{app.name}</h1>
          {app.pro ? <Pill tone="pro">Pro</Pill> : null}
          <Pill tone="soon">Pronto</Pill>
        </div>
        <p className="text-muted">{app.summary}</p>
        <p className="text-sm text-muted">
          Esta app todavía está en el taller. Si querés que te avisemos cuando salga, o tenés una
          idea para ella, escribinos a{" "}
          <a href={`mailto:${CONTACT.email}`} className="text-ink underline underline-offset-2">
            {CONTACT.email}
          </a>
          .
        </p>
        <Button to="/calculadora" variant="secondary" size="sm">
          Mientras tanto, la calculadora →
        </Button>
      </div>
    </div>
  );
}
