async function getNextInvoiceNumber(date: string) {
  const response = await fetch(
    `http://localhost:8000/factures?dateExpedition=${date}`
  );
  const data = await response.json();

  return data.length + 1;
}

export default getNextInvoiceNumber;
