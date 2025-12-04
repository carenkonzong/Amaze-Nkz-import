import { Scale, DollarSign } from "lucide-react";

function ShipmentItem() {
  return (
    <>
      <h1>Colis #1</h1>
      <label htmlFor="">Description du Colis *</label>
      <div className="grid grid-cols-2">
        <div>
          <Scale /> Poids (kg) *
        </div>
        <div>
          <DollarSign /> Prix Calculé (kg) *
        </div>
      </div>
    </>
  );
}

export default ShipmentItem;
