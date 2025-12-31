import { toast } from "sonner";
import { ENV } from "@/config/env";

async function getNextInvoiceNumber(date: string) {
  try {
    const response = await fetch(
      `${ENV.API_URL}/factures?dateExpedition=${date}`
    );
    if (!response.ok) {
      let serverMessage = "";
      throw new Error(
        `HTTP ${response.status}${serverMessage ? ` - ${serverMessage}` : ""}`
      );
    }
    const data = await response.json();

    return data.length + 1;
  } catch (error) {
    const message =
      error instanceof TypeError
        ? "La reponse du serveur n'est pas conforme."
        : "Impossible de joindre le serveur. Veuillez vérifier votre connexion Internet ou contacter le support.";
    toast.error(`Erreur lors du calcul du numéro de facture: ${message}`);
    console.log(error);

    return null;
  }
}

export default getNextInvoiceNumber;
