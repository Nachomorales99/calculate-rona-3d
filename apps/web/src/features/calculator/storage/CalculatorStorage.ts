import type { StateStorage } from "zustand/middleware";

/**
 * Puerto de persistencia de la calculadora (patrón Strategy).
 * Hoy: LocalStorageAdapter. Fase 2: ApiStorageAdapter contra la API para usuarios con cuenta.
 * Es compatible con el StateStorage de zustand/persist para enchufarlo sin adaptadores extra.
 */
export interface CalculatorStorage extends StateStorage {
  readonly kind: "local" | "api";
}

export const STORAGE_KEY = "rona3d.calculator.v1";

/** Claves de la calculadora HTML original. Se migran una sola vez. */
const LEGACY_KEYS = ["calc3d-v2", "calc3d-v1"] as const;

interface LegacyState {
  kwh?: number;
  watts?: number;
  costoImp?: number;
  vida?: number;
  rep?: number;
  fallas?: number;
  precios?: Record<string, number>;
  tipo?: string;
  mult?: number;
  multExtras?: boolean;
  extras?: Array<{ name?: string; price?: number; qty?: number }>;
  q?: {
    contact?: string;
    valid?: number;
    notes?: string;
    round?: boolean;
    incl?: boolean;
    counter?: number;
  };
}

function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function readLegacyState(): LegacyState | null {
  for (const key of LEGACY_KEYS) {
    const raw = safeGet(key);
    if (!raw) continue;
    try {
      return JSON.parse(raw) as LegacyState;
    } catch {
      // seguimos con la siguiente clave
    }
  }
  return null;
}

export class LocalStorageAdapter implements CalculatorStorage {
  readonly kind = "local" as const;

  getItem(name: string): string | null {
    return safeGet(name);
  }

  setItem(name: string, value: string): void {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      // navegador en privado o sin espacio: la calculadora sigue funcionando en memoria
    }
  }

  removeItem(name: string): void {
    try {
      window.localStorage.removeItem(name);
    } catch {
      // idem
    }
  }
}
