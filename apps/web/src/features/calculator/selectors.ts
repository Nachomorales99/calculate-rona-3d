import {
  buildQuote,
  calcPrintCost,
  calcSalePrice,
  getCurrency,
  type CostBreakdown,
  type Currency,
  type QuoteData,
  type SalePrice,
} from "@rona3d/shared";
import { useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { useCalculator } from "./calculator.store";

export interface CalcResult {
  cost: CostBreakdown;
  sale: SalePrice;
  currency: Currency;
}

/** Costo y precio derivados del estado. Se recalcula solo cuando cambia algo que afecta al número. */
export function useCalcResult(): CalcResult {
  const s = useCalculator(
    useShallow((st) => ({
      grams: st.grams,
      hours: st.hours,
      minutes: st.minutes,
      pieces: st.pieces,
      price: st.filamentPrices[st.filamentType],
      extras: st.extras,
      settings: st.settings,
      multiplier: st.multiplier,
      multiplyExtras: st.multiplyExtras,
      currencyCode: st.currencyCode,
    })),
  );
  return useMemo(() => {
    const currency = getCurrency(s.currencyCode);
    const cost = calcPrintCost(
      {
        grams: s.grams,
        hours: s.hours,
        minutes: s.minutes,
        pieces: s.pieces,
        filamentPricePerKg: s.price,
        extras: s.extras,
      },
      s.settings,
    );
    const sale = calcSalePrice(cost, {
      multiplier: s.multiplier,
      multiplyExtras: s.multiplyExtras,
      roundingStep: currency.roundingStep,
    });
    return { cost, sale, currency };
  }, [s]);
}

/** Datos del presupuesto tal como los ve el cliente. */
export function useQuoteData(result: CalcResult): QuoteData {
  const quote = useCalculator((st) => st.quote);
  const extras = useCalculator((st) => st.extras);
  return useMemo(
    () =>
      buildQuote(result.sale, {
        ...quote,
        extras,
        currency: result.currency,
      }),
    [quote, extras, result],
  );
}
