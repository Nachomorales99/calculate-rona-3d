/** Un insumo extra que lleva cada pieza (argolla, cadena, imán…). */
export interface Extra {
  name: string;
  /** Precio de compra por unidad, en la moneda de trabajo. */
  unitPrice: number;
  /** Cuántas unidades lleva cada pieza. */
  qtyPerPiece: number;
}

/** Lo que sale del laminador más lo que agrega el maker. */
export interface PrintInput {
  /** Filamento usado en toda la impresión, en gramos. */
  grams: number;
  /** Tiempo de impresión: horas enteras. */
  hours: number;
  /** Tiempo de impresión: minutos (0–59). */
  minutes: number;
  /** Cuántas piezas salen de esta impresión (mínimo 1). */
  pieces: number;
  /** Precio del kilo del filamento elegido. */
  filamentPricePerKg: number;
  /** Extras por pieza. */
  extras: Extra[];
}

/** Configuración "de fondo": la impresora y la luz del maker. */
export interface CostSettings {
  /** Costo marginal del kWh, con impuestos. */
  kwhPrice: number;
  /** Consumo promedio de la impresora en watts. */
  printerWatts: number;
  /** Precio de compra de la impresora. */
  printerPrice: number;
  /** Vida útil estimada en horas de impresión. */
  printerLifeHours: number;
  /** Reparaciones y repuestos a lo largo de la vida útil, como % del precio. */
  repairsPct: number;
  /** Margen por impresiones fallidas, como % de filamento + luz. */
  failuresPct: number;
}

/** Desglose de costos de una impresión completa. */
export interface CostBreakdown {
  filament: number;
  energy: number;
  wear: number;
  failures: number;
  /** Extras de todas las piezas. */
  extras: number;
  /** Extras de una sola pieza. */
  extrasPerPiece: number;
  /** filament + energy + wear + failures (sin extras). */
  base: number;
  /** base + extras. */
  total: number;
  /** total / pieces. */
  perUnit: number;
  /** Datos derivados, útiles para mostrar. */
  pieces: number;
  totalHours: number;
  kwhUsed: number;
  wearPerHour: number;
}

export interface PricingOptions {
  /** Multiplicador sobre el costo (×3 por defecto). */
  multiplier: number;
  /** Si es false, los extras se suman a precio de costo y solo se multiplica el resto. */
  multiplyExtras: boolean;
  /** Paso de redondeo comercial (100 en ARS). */
  roundingStep: number;
}

export interface SalePrice {
  /** Precio por pieza sin redondear. */
  price: number;
  /** Precio por pieza redondeado hacia arriba al paso. */
  rounded: number;
  /** price − costo por pieza. */
  gain: number;
}
