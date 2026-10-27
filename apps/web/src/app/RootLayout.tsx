import { Outlet, ScrollRestoration } from "react-router";
import { FloatNav } from "@/components/FloatNav";
import { Footer } from "@/components/Footer";
import { RouteTransition } from "@/lib/motion/RouteTransition";

export function RootLayout() {
  return (
    <>
      <FloatNav />
      <RouteTransition>
        <main id="contenido" className="gutter mx-auto w-full max-w-[1120px]">
          <Outlet />
        </main>
      </RouteTransition>
      <Footer />
      <ScrollRestoration />
    </>
  );
}
