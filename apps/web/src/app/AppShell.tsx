import { Outlet, ScrollRestoration } from "react-router";
import { Sidebar } from "@/components/Sidebar";
import { RouteTransition } from "@/lib/motion/RouteTransition";

/** Marco de las apps: barra lateral con todas las herramientas + contenido. */
export function AppShell() {
  return (
    <div className="mx-auto grid min-h-dvh w-full max-w-[1400px] md:grid-cols-[240px_1fr]">
      <Sidebar />
      <RouteTransition>
        <main id="contenido" className="gutter min-w-0 pb-16 pt-4 md:pt-6">
          <Outlet />
        </main>
      </RouteTransition>
      <ScrollRestoration />
    </div>
  );
}
