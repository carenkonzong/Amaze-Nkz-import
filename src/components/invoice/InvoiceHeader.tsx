import { CalendarDays } from "lucide-react";

type Props = {
  dateExpeditionFormatted: string;
  dateFacture: string;
  numeroFacture: string;
};

function InvoiceHeader({
  dateExpeditionFormatted,
  dateFacture,
  numeroFacture,
}: Props) {
  return (
    <div className="flex justify-center mt-10 px-5">
      <div className="grid grid-cols-3 gap-5">
        <div>
          <div className="text-sm font-semibold pl-2">Numéro de Facture</div>
          <div className="bg-gray-400/10 p-2 rounded-2xl text-blue-900 mt-2">
            {numeroFacture ? (
              <span>{`${numeroFacture}`}</span>
            ) : (
              <span className="text-red-500">Génération en cours...</span>
            )}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold pl-2 flex items-center gap-3">
            <CalendarDays size={18} />
            Date de Facture
          </div>
          <div className="bg-gray-400/10 p-2 rounded-2xl text-gray-700 mt-2">
            {dateFacture || "Alt"}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold pl-2 flex items-center gap-3">
            <CalendarDays size={18} />
            Date d'Expédition Prévue
          </div>
          <div className="bg-gray-400/10 p-2 rounded-2xl text-gray-700 mt-2">
            {dateExpeditionFormatted || "alt"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceHeader;
