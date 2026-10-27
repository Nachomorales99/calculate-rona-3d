import { X } from "lucide-react";
import { Chip, Input, Panel } from "@/components/ui";
import { useCalculator } from "../calculator.store";

const QUICK = ["Argolla", "Cadena", "Imán"] as const;

export function ExtrasSection() {
  const extras = useCalculator((s) => s.extras);
  const addExtra = useCalculator((s) => s.addExtra);
  const updateExtra = useCalculator((s) => s.updateExtra);
  const removeExtra = useCalculator((s) => s.removeExtra);

  return (
    <Panel aria-labelledby="t-extras" className="grid gap-3">
      <h2 id="t-extras" className="text-[1.2rem]">
        Extras por pieza
      </h2>
      {extras.length === 0 ? (
        <p className="text-sm text-muted">
          Sin extras. Agregá argollas, cadenas u otros insumos con los botones de abajo.
        </p>
      ) : (
        <ul className="grid gap-2.5">
          {extras.map((ex, i) => (
            <li
              key={i}
              className="grid grid-cols-2 items-end gap-2 sm:grid-cols-[1.4fr_1fr_0.8fr_auto]"
            >
              <Input
                id={`extra-name-${i}`}
                label={<span className="sr-only">Nombre del extra</span>}
                placeholder="Nombre"
                value={ex.name}
                onChange={(e) => updateExtra(i, { name: e.target.value })}
                className="col-span-2 sm:col-span-1"
              />
              <Input
                id={`extra-price-${i}`}
                label={<span className="sr-only">Precio por unidad</span>}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                prefix="$"
                value={ex.unitPrice || ""}
                onChange={(e) =>
                  updateExtra(i, {
                    unitPrice: Number.isFinite(e.target.valueAsNumber) ? e.target.valueAsNumber : 0,
                  })
                }
              />
              <Input
                id={`extra-qty-${i}`}
                label={<span className="sr-only">Cantidad por pieza</span>}
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                suffix="u."
                value={ex.qtyPerPiece}
                onChange={(e) =>
                  updateExtra(i, {
                    qtyPerPiece: Number.isFinite(e.target.valueAsNumber)
                      ? e.target.valueAsNumber
                      : 0,
                  })
                }
              />
              <button
                type="button"
                className="grid size-10 place-items-center justify-self-end rounded-sm text-muted hover:text-accent"
                aria-label={`Quitar ${ex.name || "extra"}`}
                onClick={() => removeExtra(i)}
              >
                <X className="size-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-2">
        {QUICK.map((q) => (
          <Chip key={q} onClick={() => addExtra(q)}>
            + {q}
          </Chip>
        ))}
        <Chip onClick={() => addExtra("")}>+ Otro</Chip>
      </div>
      <p className="text-sm text-muted">
        Precio de compra de cada unidad y cuántas lleva cada pieza. Los precios quedan guardados por
        nombre.
      </p>
    </Panel>
  );
}
