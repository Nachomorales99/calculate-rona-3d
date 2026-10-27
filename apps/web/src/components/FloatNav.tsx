import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { Button } from "./ui";

const links = [
  { to: "/novedades", label: "Novedades" },
  { to: "/apps", label: "Apps" },
  { to: "/piezas", label: "Piezas" },
  { to: "/blog", label: "Blog" },
];

export function FloatNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="gutter sticky top-[env(safe-area-inset-top,0px)] z-20 py-3">
      <nav
        aria-label="Principal"
        className="mx-auto flex max-w-[1120px] items-center gap-5 rounded-pill border border-line bg-surface py-2 pr-2.5 pl-4 shadow-soft"
      >
        <Link to="/" aria-label="Rona 3D, inicio" className="text-ink">
          <Logo className="block h-auto w-24" />
        </Link>
        <ul className="ml-auto hidden gap-4 text-[0.92rem] font-medium md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  cn("text-muted transition-colors hover:text-ink", isActive && "text-ink")
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Button to="/cuenta" variant="ghost" size="sm" className="rounded-pill">
            Ingresar
          </Button>
          <Button
            to="/cuenta"
            variant="primary"
            size="sm"
            className="rounded-pill shadow-none hover:translate-0 hover:shadow-none"
          >
            Crear cuenta
          </Button>
        </div>
        <button
          type="button"
          className="ml-auto grid size-10 place-items-center rounded-pill text-ink md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>
      <div
        id="menu-mobile"
        hidden={!open}
        className="mx-auto mt-2 max-w-[1120px] rounded-xl border border-line bg-surface p-3 shadow-soft md:hidden"
      >
        <ul className="grid gap-1">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "block rounded-sm px-3 py-2.5 font-medium",
                    isActive ? "bg-paper text-ink" : "text-muted",
                  )
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Button to="/cuenta" variant="ghost" size="sm" className="rounded-pill">
            Ingresar
          </Button>
          <Button to="/cuenta" variant="primary" size="sm" className="rounded-pill">
            Crear cuenta
          </Button>
        </div>
      </div>
    </div>
  );
}
