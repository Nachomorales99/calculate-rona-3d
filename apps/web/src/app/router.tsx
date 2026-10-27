import { createBrowserRouter } from "react-router";
import { AppShell } from "./AppShell";
import { RootLayout } from "./RootLayout";
import { APPS } from "@/content/apps";

/**
 * Rutas públicas bajo RootLayout (nav flotante + footer) y rutas de apps bajo AppShell
 * (barra lateral). Cada página se carga con lazy para que el bundle inicial sea chico.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, lazy: () => import("@/pages/HomePage") },
      { path: "novedades", lazy: () => import("@/pages/NovedadesPage") },
      { path: "apps", lazy: () => import("@/pages/AppsPage") },
      { path: "piezas", lazy: () => import("@/pages/PiezasPage") },
      { path: "blog", lazy: () => import("@/pages/BlogPage") },
      { path: "blog/:slug", lazy: () => import("@/pages/PostPage") },
      { path: "*", lazy: () => import("@/pages/NotFoundPage") },
    ],
  },
  {
    Component: AppShell,
    children: [
      { path: "calculadora", lazy: () => import("@/features/calculator/CalculatorPage") },
      ...APPS.filter((a) => a.status !== "available").map((a) => ({
        path: a.route.slice(1),
        lazy: () => import("@/pages/ComingSoonPage"),
        handle: { app: a.slug },
      })),
    ],
  },
]);
