import { formatDate, formatMoney } from "@rona3d/shared";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Button, Checkbox, Input, Panel, Textarea } from "@/components/ui";
import { useCalculator } from "../calculator.store";
import { useQuoteData, type CalcResult } from "../selectors";
import { NumberField } from "./NumberField";

export function QuoteSection({ result }: { result: CalcResult }) {
  const s = useCalculator();
  const q = useQuoteData(result);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const money = (v: number) => formatMoney(v, q.currency);
  const date = (d: Date) => formatDate(d, q.currency.locale);

  async function download() {
    setBusy(true);
    setStatus("Armando el PDF…");
    try {
      const { buildQuotePdf } = await import("../pdf/buildQuotePdf");
      const { doc, filename } = await buildQuotePdf(q);
      doc.save(filename);
      s.bumpQuoteCounter();
      setStatus("Presupuesto descargado.");
    } catch (err) {
      console.error(err);
      setStatus("No se pudo generar el PDF. Probá de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-10" aria-labelledby="t-presupuesto">
      <h2 id="t-presupuesto" className="mb-5 text-[1.7rem]">
        Presupuesto para el cliente
      </h2>
      <div className="grid items-start gap-5 md:grid-cols-[1fr_1.15fr]">
        <Panel className="grid gap-4">
          <Input
            id="q-contact"
            label="Tu contacto"
            placeholder="WhatsApp, Instagram o email"
            value={s.quote.contact}
            onChange={(e) => s.setQuote("contact", e.target.value)}
          />
          <Input
            id="q-client"
            label="Cliente"
            placeholder="Nombre del cliente"
            value={s.quote.client}
            onChange={(e) => s.setQuote("client", e.target.value)}
          />
          <Input
            id="q-desc"
            label="Descripción del trabajo"
            placeholder="Ej.: Llavero personalizado con nombre"
            value={s.quote.description}
            onChange={(e) => s.setQuote("description", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              id="q-qty"
              label="Cantidad"
              value={s.quote.qty}
              onChange={(v) => s.setQuote("qty", Math.max(1, Math.round(v)))}
              suffix="u."
              integer
              min={1}
            />
            <NumberField
              id="q-valid"
              label="Validez"
              value={s.quote.validDays}
              onChange={(v) => s.setQuote("validDays", Math.max(1, Math.round(v)))}
              suffix="días"
              integer
              min={1}
            />
          </div>
          <Textarea
            id="q-notes"
            label="Notas para el cliente"
            value={s.quote.notes}
            onChange={(e) => s.setQuote("notes", e.target.value)}
          />
          <div className="grid gap-2">
            <Checkbox
              id="q-round"
              label="Usar el precio redondeado"
              checked={s.quote.useRounded}
              onChange={(e) => s.setQuote("useRounded", e.target.checked)}
            />
            <Checkbox
              id="q-incl"
              label="Mostrar los extras incluidos"
              checked={s.quote.showIncludes}
              onChange={(e) => s.setQuote("showIncludes", e.target.checked)}
            />
          </div>
          <Button
            variant="primary"
            onClick={() => void download()}
            disabled={busy}
            className="w-full"
          >
            Descargar presupuesto en PDF
          </Button>
          <p className="min-h-5 text-sm text-muted" role="status">
            {status}
          </p>
        </Panel>

        <div
          className="overflow-hidden rounded-[6px] bg-white text-[0.92rem] text-[#16161A] shadow-[0_1px_2px_rgba(22,22,26,.08),0_10px_28px_rgba(22,22,26,.14)]"
          aria-label="Vista previa del presupuesto"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#F5EFE4] px-6 py-5">
            <Logo className="w-[120px] text-[#16161A]" />
            <div className="text-right text-[0.85rem] text-[#6A655E]">
              <div className="font-slab text-[1.35rem] leading-[1.1] text-[#16161A]">
                Presupuesto
              </div>
              <div>{q.number}</div>
              <div>Fecha: {date(q.issuedAt)}</div>
              <div>Válido hasta: {date(q.validUntil)}</div>
            </div>
          </div>
          <div className="px-6 pt-5 pb-6">
            <p className="mb-4">
              <span className="block text-[0.8rem] text-[#6A655E]">Cliente</span>
              <strong className="text-[1.05rem]">{q.client}</strong>
            </p>
            <div className="overflow-x-auto">
              <table className="tabular w-full border-collapse">
                <thead>
                  <tr className="text-left text-[0.82rem]">
                    <th className="border-b-2 border-[#16161A] px-2 py-2">Descripción</th>
                    <th className="border-b-2 border-[#16161A] px-2 py-2 text-right">Cant.</th>
                    <th className="border-b-2 border-[#16161A] px-2 py-2 text-right">
                      Precio unit.
                    </th>
                    <th className="border-b-2 border-[#16161A] px-2 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="align-top">
                    <td className="border-b border-[#E8E0D2] px-2 py-2.5">
                      {q.description}
                      {q.includes ? (
                        <small className="mt-0.5 block text-[#6A655E]">{q.includes}</small>
                      ) : null}
                    </td>
                    <td className="border-b border-[#E8E0D2] px-2 py-2.5 text-right whitespace-nowrap">
                      {q.qty}
                    </td>
                    <td className="border-b border-[#E8E0D2] px-2 py-2.5 text-right whitespace-nowrap">
                      {money(q.unitPrice)}
                    </td>
                    <td className="border-b border-[#E8E0D2] px-2 py-2.5 text-right whitespace-nowrap">
                      {money(q.total)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <div className="flex items-baseline gap-6 rounded-[4px] bg-[#E14424] px-4 py-2 text-white">
                <span>Total</span>
                <strong className="font-slab text-[1.4rem] font-normal">{money(q.total)}</strong>
              </div>
            </div>
            {q.notes ? (
              <div className="mt-4 whitespace-pre-wrap text-[#6A655E]">
                <b className="mb-0.5 block text-[#16161A]">Notas</b>
                {q.notes}
              </div>
            ) : null}
            <div className="mt-5 flex flex-wrap justify-between gap-4 border-t border-[#E8E0D2] pt-3 text-[0.8rem] text-[#6A655E]">
              <span>Rona 3D, Mendoza, Argentina</span>
              <span>{q.contact}</span>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 max-w-[70ch] text-sm text-muted">
        El presupuesto no muestra tus costos, el multiplicador ni la ganancia: el cliente solo ve el
        precio final.
      </p>
    </section>
  );
}
