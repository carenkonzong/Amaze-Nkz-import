function calculateTotalItem(weight: number) {
  if (weight <= 0) return 0;
  if (weight <= 2.5) return weight * 10000;
  if (weight <= 5) return weight * 8500;
  if (weight <= 15) return weight * 7500;
  if (weight <= 23) return weight * 7000;
  if (weight <= 70) return weight * 6000;
  if (weight <= 120) return weight * 5800;
}

export default calculateTotalItem;
