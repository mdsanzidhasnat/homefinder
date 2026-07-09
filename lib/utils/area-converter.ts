import type { AreaUnit } from "@/types";

const CONVERSIONS: Record<AreaUnit, number> = {
  sqft: 1,
  katha: 720,
  bigha: 14400,
  decimal: 435.6,
};

export function convertArea(
  value: number,
  from: AreaUnit,
  to: AreaUnit
): number {
  const sqft = value * CONVERSIONS[from];
  return sqft / CONVERSIONS[to];
}

export function formatArea(
  value: number,
  unit: AreaUnit,
  locale: string
): string {
  const converted = convertArea(value, unit, "sqft");
  const rounded = Math.round(converted);
  if (locale === "bn") {
    return `${rounded.toLocaleString("bn-BD")} বর্গফুট`;
  }
  return `${rounded.toLocaleString("en-US")} sqft`;
}
