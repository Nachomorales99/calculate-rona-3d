import { Link } from "react-router";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { EnergySection } from "./components/EnergySection";
import { ExtrasSection } from "./components/ExtrasSection";
import { PrintSection } from "./components/PrintSection";
import { QuoteSection } from "./components/QuoteSection";
import { ResultPlate } from "./components/ResultPlate";
import { SettingsSection } from "./components/SettingsSection";
import { useCalcResult } from "./selectors";

export function Component() {
  useDocumentTitle("Calculadora de costos");
  const result = useCalcResult();
  return (
    <div className="mx-auto max-w-[1040px]">
      <p className="mb-3 text-sm text-muted">
        <Link to="/apps" className="hover:text-ink">
          Apps
        </Link>{" "}
        / <span className="text-ink">Calculadora</span>
      </p>
      <header className="mb-6">
        <h1 className="text-[clamp(1.8rem,4.5vw,2.4rem)]">¿Cuánto cobro esta impresión?</h1>
        <p className="mt-1.5 max-w-[58ch] text-muted">
          Cargá los datos que te da el laminador, sumá los extras y armá el presupuesto para tu
          cliente. Todo queda guardado en este navegador.
        </p>
      </header>
      <div className="grid items-start gap-5 md:grid-cols-2">
        <div className="grid gap-5">
          <PrintSection />
          <ExtrasSection />
          <SettingsSection />
          <EnergySection />
        </div>
        <ResultPlate result={result} />
      </div>
      <QuoteSection result={result} />
    </div>
  );
}
