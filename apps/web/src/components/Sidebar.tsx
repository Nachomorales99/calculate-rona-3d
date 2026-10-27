import { ChevronLeft, Menu } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router";
import { APP_GROUPS, APPS, type AppGroup } from "@/content/apps";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { Ficha, Pill } from "./ui";

const groups: AppGroup[] = ["tools", "business"];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const nav = (
    <nav aria-label="Apps" className="grid content-start gap-0.5 text-[0.92rem]">
      <Link
        to="/"
        className="mx-2 mt-1 mb-3 inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
      >
        <ChevronLeft className="size-4" aria-hidden="true" /> Volver a Rona 3D
      </Link>
      {groups.map((g) => (
        <div key={g} className="contents">
          <p className="px-2 pt-3 pb-1 text-[0.68rem] font-bold tracking-[0.1em] text-muted uppercase">
            {APP_GROUPS[g]}
          </p>
          {APPS.filter((a) => a.group === g).map((a) => (
            <NavLink
              key={a.slug}
              to={a.route}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-sm px-2.5 py-2 text-ink no-underline",
                  isActive
                    ? "border border-line bg-surface font-semibold shadow-[2px_2px_0_var(--color-line)]"
                    : "hover:bg-surface/60",
                )
              }
            >
              <Ficha className="size-4 shrink-0 text-muted" />
              <span className="truncate">{a.name}</span>
              {a.pro ? (
                <Pill tone="pro" className="ml-auto">
                  Pro
                </Pill>
              ) : null}
            </NavLink>
          ))}
        </div>
      ))}
      <p className="px-2 pt-3 pb-1 text-[0.68rem] font-bold tracking-[0.1em] text-muted uppercase">
        Cuenta
      </p>
      <Link to="/cuenta" className="rounded-sm px-2.5 py-2 text-ink hover:bg-surface/60">
        Ingresar
      </Link>
    </nav>
  );

  return (
    <>
      <aside className="hidden border-r border-line bg-paper px-3 py-4 md:block">
        <Link to="/" className="mx-2 mb-2 block text-ink" aria-label="Rona 3D, inicio">
          <Logo className="h-auto w-[84px]" />
        </Link>
        {nav}
      </aside>
      <div className="gutter sticky top-[env(safe-area-inset-top,0px)] z-20 flex items-center gap-3 border-b border-line bg-paper py-2 md:hidden">
        <button
          type="button"
          className="grid size-10 place-items-center rounded-sm text-ink"
          aria-expanded={open}
          aria-controls="apps-mobile"
          aria-label={open ? "Cerrar apps" : "Abrir apps"}
          onClick={() => setOpen((v) => !v)}
        >
          <Menu className="size-5" />
        </button>
        <Link to="/" className="text-ink" aria-label="Rona 3D, inicio">
          <Logo className="h-auto w-20" />
        </Link>
      </div>
      <div
        id="apps-mobile"
        hidden={!open}
        className="gutter border-b border-line bg-paper pb-3 md:hidden"
      >
        {nav}
      </div>
    </>
  );
}
