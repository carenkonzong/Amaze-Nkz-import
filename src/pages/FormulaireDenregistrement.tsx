import ElementInformation from "../components/ElementInformation";
import {
  User,
  SquareArrowDownRight,
  FileText,
  PlaneTakeoff,
  Trash2,
} from "lucide-react";
import { Scale, DollarSign, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import {
  calculateTotalItem,
  formatDate,
  generateInvoiceNumber,
} from "../services/index";
import * as yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Facture, infoFormulaire } from "../types/invoice";
import getNextInvoiceNumber from "../services/invoiceService";
import FormValidation from "../components/FormValidation";

function FormulaireDenregistrement() {
  const dateExpedition = new Date("2025-11-21");
  const [numeroFacture, setNumeroFacture] = useState("");
  const today = new Date();
  const dateFacture = formatDate(today);
  const dateExpeditionFormatted = formatDate(dateExpedition);
  const [previewFacture, setPreviewFacture] = useState<Facture | null>(null);

  useEffect(() => {
    const fetchNextInvoiceNumber = async () => {
      const nextNumber = await getNextInvoiceNumber(dateExpeditionFormatted);

      const generated = generateInvoiceNumber(dateExpedition, nextNumber);
      setNumeroFacture(generated);
    };

    fetchNextInvoiceNumber();
  }, [dateExpedition, dateExpeditionFormatted]);

  /* const [poidsItem, setpoidsItem] = useState(""); */

  /* const { prixUnitaire, total } = calculateTotalItem(Number(poidsItem)); */

  /* let itemTotal = total; */

  const REQUIRED_FIELD = "Ce champ est obligatoire";
  const schema = yup
    .object({
      expediteur: yup.object({
        nomExpediteur: yup.string().required(REQUIRED_FIELD),
        telephoneExpediteur: yup.string().required(REQUIRED_FIELD),
      }),
      destinataire: yup.object({
        nomDestinataire: yup.string().required(REQUIRED_FIELD),
        telephoneDestinataire: yup.string().required(REQUIRED_FIELD),
        villeDestinataire: yup.string().required(REQUIRED_FIELD),
      }),
      infoColis: yup
        .array()
        .of(
          yup.object({
            descriptionColis: yup.string().required(REQUIRED_FIELD),
            poidsColis: yup
              .number()
              .transform((value) => (Number.isNaN(value) ? undefined : value))
              .required(REQUIRED_FIELD)
              .min(0.1),
          })
        )
        .min(1)
        .required(),
      detailFacture: yup.object({
        valeurColis: yup.number().required(REQUIRED_FIELD),
        assurance: yup.string().required(REQUIRED_FIELD).default("false"),
        montantAssurance: yup
          .number()
          .transform((value) => (Number.isNaN(value) ? undefined : value))
          .when("assurance", {
            is: "true",
            then: (s) => s.required(REQUIRED_FIELD),
            otherwise: (s) => s.notRequired().nullable(),
          }),
        modePaiement: yup.string().required(REQUIRED_FIELD),
      }),
    })
    .required();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<infoFormulaire>({
    resolver: yupResolver(schema),
    defaultValues: {
      infoColis: [{ descriptionColis: " ", poidsColis: 0 }],
      detailFacture: {
        assurance: "false",
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "infoColis",
  });

  const watchedPackages = watch("infoColis");

  const calculateGrandTotal = () => {
    let grandTotal = 0;
    watchedPackages.forEach((pkg) => {
      if (pkg.poidsColis > 0) {
        const { total } = calculateTotalItem(pkg.poidsColis);
        grandTotal += total;
      }
    });
    return grandTotal;
  };

  const onSubmit = async (data: infoFormulaire) => {
    // Process each package to add pricing info
    const processedPackages = data.infoColis.map((pkg) => {
      const { prixUnitaire, total } = calculateTotalItem(pkg.poidsColis);
      return {
        descriptionColis: pkg.descriptionColis,
        poidsColis: pkg.poidsColis,
        prixUnitaire: prixUnitaire,
        prixColis: total,
      };
    });

    // Calculate total from all packages
    const totalFacture = processedPackages.reduce(
      (sum, pkg) => sum + pkg.prixColis,
      0
    );

    const factureComplete: Facture = {
      numeroFacture: numeroFacture,
      dateFacture: dateFacture,
      dateExpedition: dateExpeditionFormatted,
      expediteur: data.expediteur,
      destinataire: data.destinataire,
      totalFacture: totalFacture,
      detailFacture: {
        valeurColis: data.detailFacture.valeurColis,
        assurance: data.detailFacture.assurance,
        montantAssurance: data.detailFacture.montantAssurance,
        modePaiement: data.detailFacture.modePaiement,
      },
      infoColis: processedPackages,
    };
    setPreviewFacture(factureComplete);
    console.log(data);
  };

  return (
    <>
      <div className="bg-linear-to-r from-blue-500 to-green-500 flex justify-center px-5">
        <div className="flex max-w-7xl justify-between w-full m-5 text-white">
          <div className="flex items-center gap-3">
            <div>
              <PlaneTakeoff size={40} />
            </div>
            <div className="">
              <div className="text-3xl font-bold font-sans">Amaze NKZ</div>
              <div className="text-sm">Cameroun → Canada</div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
      <div className="flex justify-center mt-10 px-5">
        <div className="grid grid-cols-3 gap-5">
          <div>
            <div className="text-sm font-semibold pl-2">Numéro de Facture</div>
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
      </div>
      <form
        action=""
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <ElementInformation
          head="Informations de l'Expéditeur"
          icon={User}
          iconColor="text-blue-800"
          color="bg-[#ebf0f9]"
        >
          <div className="grid grid-cols-2 gap-x-10">
            <div>
              <label htmlFor="nomExpediteur" className="text-sm font-semibold">
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
        </ElementInformation>
        <ElementInformation
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
            <div className="">
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
          </div>
        </ElementInformation>
        <ElementInformation
          head={`Informations Colis (${fields.length})`}
          icon={FileText}
          iconColor="text-green-800"
          color="bg-[#eff8f1]"
          btn={true}
          onBtnClick={() => {
            append({ descriptionColis: "", poidsColis: 0 });
          }}
        >
          {fields.map((field, index) => {
            // Get the current package data to calculate its price
            const currentPackage = watchedPackages[index];
            const { prixUnitaire, total } = calculateTotalItem(
              currentPackage?.poidsColis || 0
            );

            return (
              <div key={field.id} className="mb-5">
                <div className="border rounded-xl p-3 border-black/10">
                  <div className="flex justify-between mb-3">
                    <h1 className="font-bold text-blue-800">
                      Article #{index + 1}
                    </h1>
                    {/* Only show delete button if there's more than 1 package */}
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 p-2 rounded-xl hover:bg-red-300/15 cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 my-3">
                    <label
                      htmlFor={`descriptionColis-${index}`}
                      className="text-sm font-semibold"
                    >
                      Description du Colis *
                    </label>
                    <textarea
                      id={`descriptionColis-${index}`}
                      placeholder="Décrivez le contenu du colis..."
                      rows={3}
                      className="border rounded-xl border-black/10 p-2"
                      {...register(`infoColis.${index}.descriptionColis`)}
                    ></textarea>
                    <span className="text-red-400 text-xs">
                      {errors.infoColis?.[index]?.descriptionColis?.message}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-5">
                    <div>
                      <label
                        htmlFor={`poidsColis-${index}`}
                        className="text-sm font-semibold flex gap-2"
                      >
                        <Scale size={20} /> Poids (kg) *
                      </label>
                      <input
                        type="number"
                        min={0}
                        step="0.1"
                        className="border rounded-lg w-full border-black/10  p-2 mt-2 bg-[#f8fafc]"
                        id={`poidsColis-${index}`}
                        {...register(`infoColis.${index}.poidsColis`, {
                          valueAsNumber: true,
                        })}
                      />
                      <span className="text-red-400 text-xs">
                        {errors.infoColis?.[index]?.poidsColis?.message}
                      </span>
                    </div>
                    <div>
                      <label className="flex gap-2 text-sm font-semibold">
                        <DollarSign size={20} /> Prix Unitaire
                      </label>
                      <input
                        type="text"
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
                        className="border rounded-lg w-full border-black/10  p-2 mt-2 bg-[#e0e8f0] text-blue-800 font-bold"
                        disabled
                        value={`${total} FCFA`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="border-t border-black/10 my-7"></div>
          <div className="flex justify-between p-5 bg-[#f4f6fb] rounded-xl items-center">
            <label className="font-semibold text-xl" htmlFor="totalFacture">
              Montant Total:
            </label>
            <input
              className="font-extrabold text-3xl text-blue-800 text-right"
              type="text"
              value={`${calculateGrandTotal()} FCFA`}
              id="totalFacture"
              disabled
            />
          </div>
        </ElementInformation>
        <ElementInformation
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
                type="number"
                placeholder="Valeur estime du colis"
                {...register("detailFacture.valeurColis", {
                  valueAsNumber: true,
                })}
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
                <label htmlFor="" className="text-sm font-semibold gap-2 flex">
                  <input
                    type="radio"
                    value="true"
                    {...register("detailFacture.assurance")}
                  />
                  Oui
                </label>
                <label htmlFor="" className="text-sm font-semibold gap-2 flex">
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
                <>
                  <div className="mt-3">
                    <label className="text-sm font-semibold">
                      Montant Assurance Payé (FCFA) *
                    </label>
                    <input
                      type="number"
                      className="border rounded-lg w-full border-black/10 p-2 mt-2 bg-[#f8fafc]"
                      {...register("detailFacture.montantAssurance", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <span className="text-red-400 text-xs">
                    {errors.detailFacture?.montantAssurance?.message}
                  </span>
                </>
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
                <option value="">
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
        </ElementInformation>
        <div className="flex justify-center mb-5 ">
          <button
            type="submit"
            className="max-w-5xl w-full mx-5 bg-blue-900 py-3 px-5 text-white rounded-xl cursor-pointer hover:bg-green-900 transition duration-300 hover:-translate-y-1 hover:scale-110"
          >
            Générer la Facture
          </button>
        </div>
      </form>
      {previewFacture && (
        <div className="fixed inset-0 z-50">
          {/* overlay */}
          <button
            type="button"
            aria-label="Close preview"
            onClick={() => setPreviewFacture(null)}
            className="absolute inset-0 bg-black/60"
          />

          {/* modal layout */}
          <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <FormValidation
                data={previewFacture}
                onClose={() => setPreviewFacture(null)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FormulaireDenregistrement;
