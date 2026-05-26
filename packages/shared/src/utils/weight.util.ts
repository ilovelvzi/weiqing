import { MAX_WEIGHT_KG, MIN_WEIGHT_KG, LB_TO_KG_FACTOR } from "../constants";
import { WeightUnit } from "../enums";

const roundTo = (value: number, digits: number): number => {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

export const kgToLb = (weightKg: number): number => roundTo(weightKg / LB_TO_KG_FACTOR, 2);

export const lbToKg = (weightLb: number): number => roundTo(weightLb * LB_TO_KG_FACTOR, 2);

export const clampWeightKg = (weightKg: number): number => {
  if (!Number.isFinite(weightKg)) {
    return MIN_WEIGHT_KG;
  }

  return Math.min(MAX_WEIGHT_KG, Math.max(MIN_WEIGHT_KG, roundTo(weightKg, 2)));
};

export const normalizeWeightToKg = (value: number, unit: WeightUnit): number => {
  const weightKg = unit === WeightUnit.LB ? value * LB_TO_KG_FACTOR : value;
  return clampWeightKg(weightKg);
};

export const formatWeight = (valueKg: number, unit: WeightUnit): string => {
  const displayValue = unit === WeightUnit.LB ? valueKg / LB_TO_KG_FACTOR : valueKg;
  return `${roundTo(displayValue, 1).toFixed(1)} ${unit}`;
};
