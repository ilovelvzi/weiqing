const MIN_WEIGHT_KG = 20;
const MAX_WEIGHT_KG = 300;

export function parseWeightInput(input: string): number | null {
  const normalized = input.trim();

  if (!/^\d{1,3}(\.\d{1,2})?$/.test(normalized)) {
    return null;
  }

  const value = Number(normalized);

  if (!Number.isFinite(value)) {
    return null;
  }

  return Math.round(value * 100) / 100;
}

export function isValidWeightKg(value: number): boolean {
  return value >= MIN_WEIGHT_KG && value <= MAX_WEIGHT_KG;
}

export function formatWeightKg(value?: number | null): string {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "-- kg";
  }

  return `${value.toFixed(1)} kg`;
}
