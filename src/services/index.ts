export function calculateTotalItem(weight: number) {
  if (weight <= 0) return { total: 0, prixUnitaire: 0 };
  if (weight <= 2.5) return { total: weight * 10000, prixUnitaire: 10000 };
  if (weight <= 5) return { total: weight * 8500, prixUnitaire: 8500 };
  if (weight <= 15) return { total: weight * 7500, prixUnitaire: 7500 };
  if (weight <= 23) return { total: weight * 7000, prixUnitaire: 7000 };
  if (weight <= 70) return { total: weight * 6000, prixUnitaire: 6000 };
  if (weight <= 120) return { total: weight * 5800, prixUnitaire: 5800 };
  if (weight > 120) return { total: weight * 5500, prixUnitaire: 5800 };

  return { total: weight * 0, prixUnitaire: 0 };
}
