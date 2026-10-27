import {
  DEFAULT_COST_SETTINGS_ARS,
  DEFAULT_FILAMENT_PRICES_ARS,
  DEFAULT_PRICING,
  EDEMSA_PARAMS,
  type CostSettings,
  type Extra,
  type FilamentType,
  type MarginalKwhParams,
} from "@rona3d/shared";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { LocalStorageAdapter, readLegacyState, STORAGE_KEY } from "./storage/CalculatorStorage";

export interface EnergyHistoryEntry {
  period: string;
  provider: string;
  unitPrice: number;
  kwhPrice: number;
  source: "manual" | "ai";
  createdAt: string;
}

export interface QuoteFields {
  contact: string;
  client: string;
  description: string;
  qty: number;
  validDays: number;
  notes: string;
  useRounded: boolean;
  showIncludes: boolean;
  counter: number;
}

export interface CalculatorState {
  // Lo que sale del laminador
  grams: number;
  hours: number;
  minutes: number;
  pieces: number;
  filamentType: FilamentType;
  filamentPrices: Record<FilamentType, number>;
  extras: Extra[];
  /** Precios recordados por nombre de extra (en minúscula). */
  extraPrices: Record<string, number>;
  // Configuración
  settings: CostSettings;
  multiplier: number;
  multiplyExtras: boolean;
  currencyCode: string;
  // Luz desde la factura
  energyParams: MarginalKwhParams;
  energyProvider: string;
  energyHistory: EnergyHistoryEntry[];
  // Presupuesto
  quote: QuoteFields;
  // Acciones
  set: <K extends keyof CalculatorState>(key: K, value: CalculatorState[K]) => void;
  setSetting: <K extends keyof CostSettings>(key: K, value: CostSettings[K]) => void;
  setFilamentType: (type: FilamentType) => void;
  setFilamentPrice: (price: number) => void;
  addExtra: (name: string) => void;
  updateExtra: (index: number, patch: Partial<Extra>) => void;
  removeExtra: (index: number) => void;
  setQuote: <K extends keyof QuoteFields>(key: K, value: QuoteFields[K]) => void;
  bumpQuoteCounter: () => void;
  applyKwh: (entry: Omit<EnergyHistoryEntry, "createdAt">) => void;
  setEnergyParams: (params: MarginalKwhParams) => void;
  resetSettings: () => void;
}

export const DEFAULT_QUOTE: QuoteFields = {
  contact: "",
  client: "",
  description: "",
  qty: 1,
  validDays: 7,
  notes: "Seña del 50% para comenzar. Tiempo de entrega a coordinar.",
  useRounded: true,
  showIncludes: true,
  counter: 1,
};

export const storageAdapter = new LocalStorageAdapter();

function isFilamentType(value: unknown, prices: Record<string, number>): value is FilamentType {
  return typeof value === "string" && value in prices;
}

/** Estado inicial: defaults ARS, y si existe la calculadora HTML vieja en este navegador, sus valores. */
function initialState(): Omit<CalculatorState, keyof Actions> {
  const base = {
    grams: 153,
    hours: 9,
    minutes: 0,
    pieces: 1,
    filamentType: "PLA" as FilamentType,
    filamentPrices: { ...DEFAULT_FILAMENT_PRICES_ARS },
    extras: [] as Extra[],
    extraPrices: {} as Record<string, number>,
    settings: { ...DEFAULT_COST_SETTINGS_ARS },
    multiplier: DEFAULT_PRICING.multiplier,
    multiplyExtras: DEFAULT_PRICING.multiplyExtras,
    currencyCode: "ARS",
    energyParams: { ...EDEMSA_PARAMS, taxes: EDEMSA_PARAMS.taxes.map((t) => ({ ...t })) },
    energyProvider: "Edemsa",
    energyHistory: [] as EnergyHistoryEntry[],
    quote: { ...DEFAULT_QUOTE },
  };
  const legacy = readLegacyState();
  if (!legacy) return base;
  if (legacy.precios) {
    for (const [k, v] of Object.entries(legacy.precios)) {
      if (isFilamentType(k, base.filamentPrices) && typeof v === "number")
        base.filamentPrices[k] = v;
    }
  }
  if (isFilamentType(legacy.tipo, base.filamentPrices)) base.filamentType = legacy.tipo;
  base.settings = {
    kwhPrice: legacy.kwh ?? base.settings.kwhPrice,
    printerWatts: legacy.watts ?? base.settings.printerWatts,
    printerPrice: legacy.costoImp ?? base.settings.printerPrice,
    printerLifeHours: legacy.vida ?? base.settings.printerLifeHours,
    repairsPct: legacy.rep ?? base.settings.repairsPct,
    failuresPct: legacy.fallas ?? base.settings.failuresPct,
  };
  if (typeof legacy.mult === "number" && legacy.mult > 0) base.multiplier = legacy.mult;
  if (typeof legacy.multExtras === "boolean") base.multiplyExtras = legacy.multExtras;
  if (Array.isArray(legacy.extras)) {
    base.extras = legacy.extras.map((e) => ({
      name: e.name ?? "",
      unitPrice: e.price ?? 0,
      qtyPerPiece: e.qty ?? 1,
    }));
  }
  if (legacy.q) {
    base.quote = {
      ...base.quote,
      contact: legacy.q.contact ?? "",
      validDays: legacy.q.valid ?? 7,
      notes: legacy.q.notes ?? base.quote.notes,
      useRounded: legacy.q.round ?? true,
      showIncludes: legacy.q.incl ?? true,
      counter: legacy.q.counter ?? 1,
    };
  }
  return base;
}

type Actions = Pick<
  CalculatorState,
  | "set"
  | "setSetting"
  | "setFilamentType"
  | "setFilamentPrice"
  | "addExtra"
  | "updateExtra"
  | "removeExtra"
  | "setQuote"
  | "bumpQuoteCounter"
  | "applyKwh"
  | "setEnergyParams"
  | "resetSettings"
>;

export const useCalculator = create<CalculatorState>()(
  persist(
    (set, get) => ({
      ...initialState(),
      set: (key, value) => set({ [key]: value } as Partial<CalculatorState>),
      setSetting: (key, value) => set({ settings: { ...get().settings, [key]: value } }),
      setFilamentType: (type) => set({ filamentType: type }),
      setFilamentPrice: (price) =>
        set({ filamentPrices: { ...get().filamentPrices, [get().filamentType]: price } }),
      addExtra: (name) => {
        const remembered = get().extraPrices[name.trim().toLowerCase()] ?? 0;
        set({ extras: [...get().extras, { name, unitPrice: remembered, qtyPerPiece: 1 }] });
      },
      updateExtra: (index, patch) => {
        const extras = get().extras.map((e, i) => (i === index ? { ...e, ...patch } : e));
        const changed = extras[index];
        const extraPrices = { ...get().extraPrices };
        if (changed?.name.trim() && patch.unitPrice !== undefined) {
          extraPrices[changed.name.trim().toLowerCase()] = patch.unitPrice;
        }
        set({ extras, extraPrices });
      },
      removeExtra: (index) => set({ extras: get().extras.filter((_, i) => i !== index) }),
      setQuote: (key, value) => set({ quote: { ...get().quote, [key]: value } }),
      bumpQuoteCounter: () => set({ quote: { ...get().quote, counter: get().quote.counter + 1 } }),
      applyKwh: (entry) => {
        const history = get().energyHistory.filter((h) => h.period !== entry.period);
        set({
          settings: { ...get().settings, kwhPrice: entry.kwhPrice },
          energyProvider: entry.provider,
          energyHistory: [{ ...entry, createdAt: new Date().toISOString() }, ...history].slice(
            0,
            24,
          ),
        });
      },
      setEnergyParams: (energyParams) => set({ energyParams }),
      resetSettings: () =>
        set({
          settings: { ...DEFAULT_COST_SETTINGS_ARS },
          filamentPrices: { ...DEFAULT_FILAMENT_PRICES_ARS },
          multiplier: DEFAULT_PRICING.multiplier,
          multiplyExtras: DEFAULT_PRICING.multiplyExtras,
        }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => storageAdapter),
      partialize: (s) => {
        // Las acciones no se persisten.
        const {
          set: _a,
          setSetting: _b,
          setFilamentType: _c,
          setFilamentPrice: _d,
          addExtra: _e,
          updateExtra: _f,
          removeExtra: _g,
          setQuote: _h,
          bumpQuoteCounter: _i,
          applyKwh: _j,
          setEnergyParams: _k,
          resetSettings: _l,
          ...data
        } = s;
        return data;
      },
    },
  ),
);
