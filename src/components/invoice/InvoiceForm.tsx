import * as yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ElementInformation from "@/components/ElementInformation";
import type { Facture, infoFormulaire } from "@/types/invoice";
import { useEffect, type Dispatch, type SetStateAction } from "react";

import { User, SquareArrowDownRight, FileText } from "lucide-react";
import calculateTotalItem from "@/features/utils/pricing";
import PackageItem from "../shipment/PackageItem";
import { toast } from "sonner";

type Props = {
  numeroFacture: string;
  dateFacture: string;
  dateExpeditionFormatted: string;
  setPreviewFacture: Dispatch<SetStateAction<Facture | null>>;
  onResetRef?: (resetFn: () => void) => void;
};

function InvoiceForm({
  numeroFacture,
  dateFacture,
  dateExpeditionFormatted,
  setPreviewFacture,
  onResetRef,
}: Props) {
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
    reset,
    formState: { errors },
  } = useForm<infoFormulaire>({
    resolver: yupResolver(schema),
    defaultValues: {
      infoColis: [{ descriptionColis: "", poidsColis: 0 }],
      detailFacture: {
        assurance: "false",
      },
    },
  });

  useEffect(() => {
    if (onResetRef) {
      onResetRef(() => reset());
    }
  }, [onResetRef, reset]);

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
    if (!numeroFacture || numeroFacture === "") {
      toast.error(
        "Le numéro de facture n'a pas pu être généré. Veuillez réessayer ou contacter le support technique."
      );
      console.log("Invoice number not generated");
      return;
    } else {
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
      const totalExpedition = processedPackages.reduce(
        (sum, pkg) => sum + pkg.prixColis,
        0
      );

      /* const montantAssurance = detailFacture.montantAssurance ?? 0; */

      const factureComplete: Facture = {
        numeroFacture: numeroFacture,
        dateFacture: dateFacture,
        dateExpedition: dateExpeditionFormatted,
        expediteur: data.expediteur,
        destinataire: data.destinataire,
        totalExpedition: totalExpedition,
        detailFacture: {
          valeurColis: data.detailFacture.valeurColis,
          assurance: data.detailFacture.assurance,
          montantAssurance: data.detailFacture.montantAssurance,
          modePaiement: data.detailFacture.modePaiement,
        },
        totalPayer:
          totalExpedition + (data.detailFacture.montantAssurance ?? 0),
        infoColis: processedPackages,
      };
      setPreviewFacture(factureComplete);
    }
  };

  return (
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
            <PackageItem
              key={field.id}
              field={field}
              fields={fields}
              index={index}
              prixUnitaire={prixUnitaire}
              total={total}
              remove={remove}
              register={register}
              errors={errors}
            />
          );
        })}

        <div className="border-t border-black/10 my-7"></div>
        <div className="flex justify-between p-5 bg-[#f4f6fb] rounded-xl items-center">
          <label className="font-semibold text-xl" htmlFor="totalExpedition">
            Montant Total:
          </label>
          <input
            className="font-extrabold text-3xl text-blue-800 text-right"
            type="text"
            value={`${calculateGrandTotal()} FCFA`}
            id="totalExpedition"
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
  );
}

export default InvoiceForm;
