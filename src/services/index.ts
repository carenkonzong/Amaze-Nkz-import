function calculateTotalItem(weight: number) {
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

const pad2 = (num: number) => num.toString().padStart(2, "0");

function generateInvoiceNumber(shipmentDate: Date, sequence: number): string {
  const dateFacture = new Date();

  const jourFacture = pad2(dateFacture.getDate());
  const moisFacture = pad2(dateFacture.getMonth() + 1);

  const jourExpedition = pad2(shipmentDate.getDate());
  const moisExpedition = pad2(shipmentDate.getMonth() + 1);

  const seq = sequence.toString().padStart(3, "0");

  return `RECU-${jourFacture}${moisFacture}/${jourExpedition}${moisExpedition}-${seq}`;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

const host = "http://localhost:8000";

const create = async (url: string, body: any) => {
  const response = await fetch(`${host}/${url}`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return response;
};

export { calculateTotalItem, generateInvoiceNumber, formatDate, create };
