import { User, MapPin, Package, ReceiptText } from "lucide-react";
import type { Facture } from "../types/invoice";

type Props = {
  data: Facture;
};

function FormValidation({ data }: Props) {
  const {
    expediteur,
    destinataire,
    infoColis,
    detailFacture,
    totalFacture,
    numeroFacture,
  } = data;

  return (
    <div className="flex justify-center mt-5 px-5">
      <div className="max-w-3xl  border w-full rounded-2xl border-black/10 p-5">
        <h1 className="font-semibold text-xl">Confirmer l'Expédition</h1>
        <h2 className="text-sm text-gray-500">
          Veuillez vérifier toutes les informations avant de confirmer.
        </h2>
        <div className="mt-4 w-full bg-blue-300/20 items-center flex flex-col py-3 rounded-2xl">
          <h2 className="text-sm text-gray-500">Numéro de Reçu</h2>
          <p className="font-bold text-xl text-blue-900">{numeroFacture}</p>
        </div>
        <div className="flex items-center gap-2 mt-5 text-gray-500">
          <User size={18} />
          <h1 className=" font-semibold">EXPÉDITEUR</h1>
        </div>
        <div className="grid grid-cols-2 bg-gray-300/10 p-5 rounded-2xl">
          <div>
            <h1 className="text-gray-600 text-sm">Nom</h1>
            <p className="font-semibold text-base text-black">
              {expediteur.nomExpediteur}
            </p>
          </div>
          <div>
            <h1 className="text-gray-600 text-sm">Téléphone</h1>
            <p className="font-semibold text-base text-black">
              {expediteur.telephoneExpediteur}
            </p>
          </div>
        </div>
        <div className="border-b border-black/10 mt-5"></div>
        <div className="flex items-center gap-2 mt-5 text-gray-500">
          <MapPin size={18} />
          <h1 className="font-semibold">DESTINATAIRE</h1>
        </div>
        <div className="grid grid-cols-2 gap-y-5 bg-gray-300/10 p-5 rounded-2xl">
          <div>
            <h1 className="text-gray-600 text-sm">Nom</h1>
            <p className="font-semibold text-base text-black">
              {destinataire.nomDestinataire}
            </p>
          </div>
          <div>
            <h1 className="text-gray-600 text-sm">Téléphone</h1>
            <p className="font-semibold text-base text-black">
              {destinataire.telephoneDestinataire}
            </p>
          </div>
          <div>
            <h1 className="text-gray-600 text-sm">Ville (Canada)</h1>
            <p className="font-semibold text-base text-black">
              {destinataire.villeDestinataire}
            </p>
          </div>
        </div>
        <div className="border-b border-black/10 mt-5"></div>
        <div className="flex items-center gap-2 mt-5 text-gray-500">
          <Package size={18} />
          <h1 className=" font-semibold">COLIS(1)</h1>
        </div>
        <div className="bg-gray-300/10 p-5 rounded-2xl">
          <div className="flex justify-between">
            <h1 className="text-blue-900 text-sm">Colis #1</h1>
            <p className="text-gray-600 text-sm text-right">{`${infoColis.poidsColis} Kg`}</p>
          </div>
          <div className="flex justify-between gap-3">
            <h1 className="text-sm">{infoColis.descriptionColis}</h1>
            <p className="font-semibold text-xl text-right text-blue-900">
              {infoColis.prixColis}
            </p>
          </div>
        </div>
        <div className="border-b border-black/10 mt-5"></div>
        <div className="flex items-center gap-2 mt-5 text-gray-500">
          <ReceiptText size={18} />
          <h1 className=" font-semibold">FACTURATION</h1>
        </div>
        <div className="bg-gray-300/10 p-5 rounded-2xl">
          <div className="flex justify-between">
            <p className="text-gray-600 text-sm">Poids total</p>
            <p className="text-sm text-right">{`${infoColis.poidsColis} Kg`}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600 text-sm">Valeur déclarée</p>
            <p className="text-sm text-right">{detailFacture.valeurColis}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600 text-sm">Assurance</p>
            <p className="text-sm text-right">
              {detailFacture.assurance
                ? `Oui (${detailFacture.montantAssurance} FCFA)`
                : "Non"}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600 text-sm">Mode de paiement</p>
            <p className="text-sm text-right">{detailFacture.modePaiement}</p>
          </div>
          <div className="border-b border-black/10 my-2"></div>
          <div className="flex justify-between">
            <p className="text-gray-600 text-sm">Frais d'expédition</p>
            <p className="text-sm text-right">{totalFacture}</p>
          </div>
          <div className="flex justify-between mt-5 font-bold text-lg">
            <p className="text-blue-900 ">TOTAL À PAYER</p>
            <p className=" text-right text-blue-900">{totalFacture}</p>
          </div>
        </div>
        <div className="justify-end flex gap-5 mt-5">
          <button
            /* onClick={} */
            className="p-2 rounded-xl border border-black/10 cursor-pointer hover:bg-green-600"
          >
            Modifier
          </button>
          <button className="p-2 rounded-xl text-white bg-blue-900 hover:bg-blue-800 cursor-pointer">
            Confirmer et Générer la Facture
          </button>
        </div>
      </div>
    </div>
  );
}

export default FormValidation;
