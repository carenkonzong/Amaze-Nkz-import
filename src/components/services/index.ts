import type { Facture } from "@/types/invoice";
import { ENV } from "@/config/env";

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

const create = async (url: string, body: Facture) => {
  const response = await fetch(`${ENV.API_URL}/${url}`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return response;
};

export { generateInvoiceNumber, formatDate, create };
