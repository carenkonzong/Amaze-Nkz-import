import DeclarationElement from "../components/DeclarationElement";
import { User, SquareArrowDownRight, FileText, Info } from "lucide-react";
import { Scale, DollarSign, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import {
  calculateTotalItem,
  formatDate,
  generateInvoiceNumber,
} from "../services/index";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Facture } from "../types/invoice";
import getNextInvoiceNumber from "../services/invoiceService";
import FormValidation from "../components/FormValidation";

// 👇 extra type for the form values (includes dates)
type FactureFormValues = {
  numeroFacture: string;
  dateExpedition: string;
  dateFacture: string;
  /* totalFacture: string; */ // we don't really use this from form, but it's in schema

  expediteur: {
    nomExpediteur: string;
    telephoneExpediteur: string;
  };

  destinataire: {
    nomDestinataire: string;
    telephoneDestinataire: string;
    villeDestinataire: string;
  };

  infoColis: {
    descriptionColis: string;
    poidsColis: string;
  };

  detailFacture: {
    valeurColis: string;
    assurance: string; // "true" | "false"
    montantAssurance?: string;
    modePaiement: string;
  };
};

function NewDeclarationPage() {
  // ---- Dates & invoice number ----
  const dateExpedition = new Date("2025-11-21");
  const [numeroFacture, setNumeroFacture] = useState("");
  const today = new Date();
  const dateFacture = formatDate(today);
  const dateExpeditionFormatted = formatDate(dateExpedition);

  // ---- Review vs Form state ----
  const [previewFacture, setPreviewFacture] = useState<Facture | null>(null);
  const [form, setForm] = useState(true);

  // ---- Generate invoice number based on shipment date ----
  useEffect(() => {
    const fetchNextInvoiceNumber = async () => {
      const nextNumber = await getNextInvoiceNumber(dateExpeditionFormatted); // e.g. 1, 2, 3...
      const generated = generateInvoiceNumber(dateExpedition, nextNumber);
      setNumeroFacture(generated);
    };

    fetchNextInvoiceNumber();
  }, [dateExpedition, dateExpeditionFormatted]);

  // ---- Live weight state for UI (prixUnitaire, prixColis, total) ----
  const [poidsItem, setpoidsItem] = useState("");
  const numberWeight = Number(poidsItem || 0);
  const { prixUnitaire, total } = calculateTotalItem(numberWeight);
  const itemTotal = total;

  // ---- Yup schema ----
  const REQUIRED_FIELD = "This Field is Required";

  const schema = yup
    .object({
      numeroFacture: yup.string().required().default(numeroFacture),
      dateExpedition: yup
        .string()
        .required()
        .default(String(formatDate(dateExpedition))),
      dateFacture: yup.string().required().default(String(dateFacture)),
      /* totalFacture: yup.string().required(REQUIRED_FIELD), */
      expediteur: yup.object({
        nomExpediteur: yup.string().required(REQUIRED_FIELD),
        telephoneExpediteur: yup.string().required(REQUIRED_FIELD),
      }),
      destinataire: yup.object({
        nomDestinataire: yup.string().required(REQUIRED_FIELD),
        telephoneDestinataire: yup.string().required(REQUIRED_FIELD),
        villeDestinataire: yup.string().required(REQUIRED_FIELD),
      }),
      infoColis: yup.object({
        descriptionColis: yup.string().required(REQUIRED_FIELD),
        poidsColis: yup.string().required(REQUIRED_FIELD),
        /* prixUnitaire: yup.string().required(REQUIRED_FIELD),
        prixColis: yup.string().required(REQUIRED_FIELD), */
      }),
      detailFacture: yup.object({
        valeurColis: yup.string().required(REQUIRED_FIELD),
        assurance: yup.string().required(REQUIRED_FIELD).default("false"),
        montantAssurance: yup.string(),
        modePaiement: yup.string().required(REQUIRED_FIELD),
      }),
    })
    .required();

  // ---- React Hook Form ----
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FactureFormValues>({
    resolver: yupResolver(schema),
  });

  errors ? console.log(errors) : null;

  // ---- FIRST STAGE: build full Facture object here ----
  const onSubmit = async (data: FactureFormValues) => {
    // 1️⃣ Recalculate pricing based on the weight from the form (source of truth)
    const poids = Number(data.infoColis.poidsColis || "0");
    const { prixUnitaire: pu, total: totalColis } = calculateTotalItem(poids);

    // 2️⃣ Build the complete Facture object
    const factureComplete: Facture = {
      numeroFacture: numeroFacture,
      dateFacture: dateFacture, // 👈 add this
      dateExpedition: dateExpeditionFormatted,
      expediteur: {
        nomExpediteur: data.expediteur.nomExpediteur,
        telephoneExpediteur: data.expediteur.telephoneExpediteur,
      },
      destinataire: {
        nomDestinataire: data.destinataire.nomDestinataire,
        telephoneDestinataire: data.destinataire.telephoneDestinataire,
        villeDestinataire: data.destinataire.villeDestinataire,
      },
      infoColis: {
        descriptionColis: data.infoColis.descriptionColis,
        poidsColis: data.infoColis.poidsColis,
        prixUnitaire: `${pu} FCFA`,
        prixColis: `${totalColis} FCFA`,
      },
      detailFacture: {
        valeurColis: data.detailFacture.valeurColis,
        assurance: data.detailFacture.assurance,
        montantAssurance: data.detailFacture.montantAssurance,
        modePaiement: data.detailFacture.modePaiement,
      },
      totalFacture: `${totalColis} FCFA`,
    };

    // 3️⃣ Save it for the preview step & hide the form
    setPreviewFacture(factureComplete);
    setForm(false);

    console.log("FACTURE COMPLETE:", factureComplete);
  };

  // ---- JSX ----
  return (
    <>
      {form ? (
        <form
          action=""
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <DeclarationElement
            head="Informations Facture"
            icon={Info}
            iconColor="text-blue-800"
            color="bg-[#ebf0f9]"
          >
            <div className="grid grid-cols-3 gap-5">
              <div>
                <div className="text-sm font-semibold pl-2">
                  Numéro de Facture
                </div>
                <div className="bg-gray-400/10 p-2 rounded-2xl text-blue-900 mt-2">
                  {numeroFacture || "Génération en cours..."}
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold pl-2 flex items-center gap-3">
                  <CalendarDays size={18} />
                  Date de Facture
                </div>
                <div className="bg-gray-400/10 p-2 rounded-2xl text-gray-700 mt-2">
                  {dateFacture}
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold pl-2 flex items-center gap-3">
                  <CalendarDays size={18} />
                  Date d'Expédition Prévue
                </div>
                <div className="bg-gray-400/10 p-2 rounded-2xl text-gray-700 mt-2">
                  {dateExpeditionFormatted}
                </div>
              </div>
            </div>
          </DeclarationElement>

          {/* ---- Expéditeur ---- */}
          <DeclarationElement
            head="Informations de l'Expéditeur"
            icon={User}
            iconColor="text-blue-800"
            color="bg-[#ebf0f9]"
          >
            <div className="grid grid-cols-2 gap-x-10">
              <div>
                <label
                  htmlFor="nomExpediteur"
                  className="text-sm font-semibold"
                >
                  Nom de l'Expéditeur *
                </label>
                <input
                  type="text"
                  id="nomExpediteur"
                  className="border rounded-lg w-full border-black/10 p-2 mt-2 bg-[#f8fafc]"
                  {...register("expediteur.nomExpediteur")}
                />
                <span className="text-red-400 text-xs">
                  {errors.expediteur?.nomExpediteur?.message}
                </span>
              </div>
              <div>
                <label
                  htmlFor="telephoneExpediteur"
                  className="text-sm font-semibold"
                >
                  Téléphone de l'Expéditeur *
                </label>
                <input
                  type="text"
                  id="telephoneExpediteur"
                  placeholder="+237 6XX XX XX XX"
                  className="border rounded-lg w-full border-black/10  p-2 mt-2 bg-[#f8fafc]"
                  {...register("expediteur.telephoneExpediteur")}
                />
                <span className="text-red-400 text-xs">
                  {errors.expediteur?.telephoneExpediteur?.message}
                </span>
              </div>
            </div>
          </DeclarationElement>

          {/* ---- Destinataire ---- */}
          <DeclarationElement
            head="Informations du Destinataire"
            icon={SquareArrowDownRight}
            iconColor="text-blue-800"
            color="bg-[#ebf0f9]"
          >
            <div>
              <div className="grid grid-cols-2 gap-x-10 mb-5">
                <div>
                  <label
                    htmlFor="nomDestinataire"
                    className="text-sm font-semibold"
                  >
                    Nom du Destinataire *
                  </label>
                  <input
                    type="text"
                    id="nomDestinataire"
                    className="border rounded-lg w-full border-black/10  p-2 mt-2 bg-[#f8fafc]"
                    {...register("destinataire.nomDestinataire")}
                  />
                  <span className="text-red-400 text-xs">
                    {errors.destinataire?.nomDestinataire?.message}
                  </span>
                </div>
                <div>
                  <label
                    htmlFor="telephoneDestinataire"
                    className="text-sm font-semibold"
                  >
                    Téléphone du Destinataire *
                  </label>
                  <input
                    type="text"
                    id="telephoneDestinataire"
                    placeholder="+1 XXX XXX XXXX"
                    className="border rounded-lg w-full border-black/10  p-2 mt-2 bg-[#f8fafc]"
                    {...register("destinataire.telephoneDestinataire")}
                  />
                  <span className="text-red-400 text-xs">
                    {errors.destinataire?.telephoneDestinataire?.message}
                  </span>
                </div>
              </div>
              <div>
                <label
                  htmlFor="villeDestinataire"
                  className="text-sm font-semibold"
                >
                  Ville de Résidence (Canada) *
                </label>
                <input
                  type="text"
                  id="villeDestinataire"
                  placeholder="Ex: Toronto, Montréal, Quebec City"
                  className="border rounded-lg w-full border-black/10  p-2 mt-2 bg-[#f8fafc]"
                  {...register("destinataire.villeDestinataire")}
                />
                <span className="text-red-400 text-xs">
                  {errors.destinataire?.villeDestinataire?.message}
                </span>
              </div>
            </div>
          </DeclarationElement>

          {/* ---- Colis ---- */}
          <DeclarationElement
            head="Informations Colis"
            icon={FileText}
            iconColor="text-green-800"
            color="bg-[#eff8f1]"
          >
            <div className="border rounded-xl p-3 border-black/10">
              <h1 className="mb-3 font-bold text-blue-800">Colis #1</h1>
              <div className="flex flex-col gap-1 mb-3">
                <label
                  htmlFor="descriptionColis"
                  className="text-sm font-semibold"
                >
                  Description du Colis *
                </label>
                <textarea
                  id="descriptionColis"
                  placeholder="Décrivez le contenu du colis..."
                  rows={3}
                  className="border rounded-xl border-black/10 p-2"
                  {...register("infoColis.descriptionColis")}
                ></textarea>
                <span className="text-red-400 text-xs">
                  {errors.infoColis?.descriptionColis?.message}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-5">
                <div>
                  <label
                    htmlFor="poidsColis"
                    className="text-sm font-semibold flex gap-2"
                  >
                    <Scale size={20} /> Poids (kg) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="border rounded-lg w-full border-black/10  p-2 mt-2 bg-[#f8fafc]"
                    id="poidsColis"
                    value={poidsItem}
                    {...register("infoColis.poidsColis")}
                    onChange={(e) => setpoidsItem(e.target.value)}
                  />
                  <span className="text-red-400 text-xs">
                    {errors.infoColis?.poidsColis?.message}
                  </span>
                </div>
                <div>
                  <label className="flex gap-2 text-sm font-semibold">
                    <DollarSign size={20} /> Prix Unitaire
                  </label>
                  <input
                    type="text"
                    id="prixUnitaire"
                    className="border rounded-lg w-full border-black/10  p-2 mt-2 bg-[#e0e8f0] font-bold"
                    disabled
                    value={`${prixUnitaire} FCFA`}
                  />
                </div>
                <div>
                  <label className="flex gap-2 text-sm font-semibold">
                    <DollarSign size={20} /> Prix Calculé
                  </label>
                  <input
                    type="text"
                    id="prixColis"
                    className="border rounded-lg w-full border-black/10  p-2 mt-2 bg-[#e0e8f0] text-blue-800 font-bold"
                    disabled
                    value={`${itemTotal} FCFA`}
                  />
                </div>
              </div>
            </div>
            <div className="border-t border-black/10 my-7"></div>
            <div className="flex justify-between p-5 bg-[#f4f6fb] rounded-xl items-center">
              <label className="font-semibold text-xl" htmlFor="totalFacture">
                Montant Total:
              </label>
              <input
                className="font-extrabold text-3xl text-blue-800 text-right"
                type="text"
                value={`${itemTotal} FCFA`}
                id="totalFacture"
                disabled
              />
            </div>
          </DeclarationElement>

          {/* ---- Détails Facture ---- */}
          <DeclarationElement
            head="Détails de Facturation"
            icon={FileText}
            iconColor="text-green-800"
            color="bg-[#eff8f1]"
          >
            <div className="flex flex-col mb-5 gap-5">
              <div className="w-full">
                <label htmlFor="" className="text-sm font-semibold">
                  Valeur Déclarée (FCFA)
                </label>
                <input
                  type="text"
                  placeholder="Valeur estimée du colis"
                  {...register("detailFacture.valeurColis")}
                  className="border rounded-lg w-full border-black/10  p-2 mt-2 bg-[#f8fafc]"
                />
                <span className="text-red-400 text-xs">
                  {errors.detailFacture?.valeurColis?.message}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm font-semibold">
                  Assurance (2% de la valeur)
                </label>
                <div className="flex flex-row gap-5">
                  <label
                    htmlFor=""
                    className="text-sm font-semibold gap-2 flex"
                  >
                    <input
                      type="radio"
                      value="true"
                      {...register("detailFacture.assurance")}
                    />
                    Oui
                  </label>
                  <label
                    htmlFor=""
                    className="text-sm font-semibold gap-2 flex"
                  >
                    <input
                      type="radio"
                      value="false"
                      {...register("detailFacture.assurance")}
                    />
                    Non
                  </label>
                </div>
                <span className="text-red-400 text-xs">
                  {errors.detailFacture?.assurance?.message}
                </span>
                {watch("detailFacture.assurance") === "true" && (
                  <div className="mt-3">
                    <label className="text-sm font-semibold">
                      Montant Assurance Payé (FCFA)
                    </label>
                    <input
                      type="number"
                      className="border rounded-lg w-full border-black/10 p-2 mt-2 bg-[#f8fafc]"
                      {...register("detailFacture.montantAssurance")}
                    />
                  </div>
                )}
              </div>
              <div className="w-full">
                <label htmlFor="" className="text-sm font-semibold">
                  Mode de Paiement *
                </label>
                <select
                  className="border rounded-lg w-full border-black/10  p-2 mt-2 bg-[#f8fafc]"
                  {...register("detailFacture.modePaiement")}
                >
                  <option value="select">
                    -- Selectionner une methode de Paiement --
                  </option>
                  <option value="orangeMoney">Orange Money</option>
                  <option value="momo">MTN MoMo</option>
                  <option value="virement">Virement</option>
                </select>
                <span className="text-red-400 text-xs">
                  {errors.detailFacture?.modePaiement?.message}
                </span>
              </div>
            </div>
          </DeclarationElement>

          <div className="flex justify-center mb-5 ">
            <button
              type="submit"
              className="max-w-5xl w-full mx-5 bg-blue-900 py-3 px-5 text-white rounded-xl cursor-pointer hover:bg-green-900 "
            >
              Générer la Facture
            </button>
          </div>
        </form>
      ) : (
        previewFacture && <FormValidation data={previewFacture} />
      )}
    </>
  );
}

export default NewDeclarationPage;
