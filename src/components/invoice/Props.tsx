import type { Facture } from "@/types/invoice";
import type { Dispatch, SetStateAction } from "react";

export type Props = {
  numeroFacture: string;
  dateFacture: string;
  dateExpeditionFormatted: string;
  setPreviewFacture: Dispatch<SetStateAction<Facture | null>>;
};
