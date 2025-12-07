import DeclarationElement from "../components/DeclarationElement";
import { User, SquareArrowDownRight, FileText } from "lucide-react";
import { Scale, DollarSign } from "lucide-react";
import { useState } from "react";
import { calculateTotalItem } from "../services/index";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Facture } from "../types/invoice";

function NewDeclarationPage() {
  const [itemWeight, setItemWeight] = useState("");
  const numberWeight = Number(itemWeight);
  const { prixUnitaire, total } = calculateTotalItem(numberWeight);

  let itemTotal = total;

  const REQUIRED_FIELD = "This Field is Required";
  const schema = yup
    .object({
      numeroFacture: yup.string(),
      totalFacture: yup.string().required(),
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
        prixUnitaire: yup.string().required(REQUIRED_FIELD),
        prixColis: yup.string().required(REQUIRED_FIELD),
      }),
      detailFacture: yup.object({
        valeurColis: yup.string().required(REQUIRED_FIELD),
        assurance: yup.string().required(REQUIRED_FIELD).default("false"),
        montantAssurance: yup.string(),
        modePaiement: yup.string().required(REQUIRED_FIELD),
      }),
    })
    .required();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data: Facture) => {
    console.log(data);
  };

  return (
    <form
      action=""
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3"
    >
      <DeclarationElement
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
      </DeclarationElement>
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
      </DeclarationElement>
      <DeclarationElement
        head="Informations Colis"
        icon={FileText}
        iconColor="text-green-800"
        color="bg-[#eff8f1]"
      >
        <div className="border rounded-xl p-3 border-black/10">
          <h1 className="mb-3 font-bold text-blue-800">Colis #1</h1>
          <div className="flex flex-col gap-1 mb-3">
            <label htmlFor="descriptionColis" className="text-sm font-semibold">
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
                value={itemWeight}
                {...register("infoColis.poidsColis")}
                onChange={(e) => setItemWeight(e.target.value)}
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
                {...register("infoColis.prixUnitaire")}
                value={`${prixUnitaire} FCFA`}
              />
              <span className="text-red-400 text-xs">
                {errors.infoColis?.prixUnitaire?.message}
              </span>
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
                {...register("infoColis.prixColis")}
                value={`${itemTotal} FCFA`}
              />
              <span className="text-red-400 text-xs">
                {errors.infoColis?.prixColis?.message}
              </span>
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
            {...register("totalFacture")}
            id="totalFacture"
            disabled
          />
        </div>
      </DeclarationElement>
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
              placeholder="Valeur estime du colis"
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
              Mode de Paiement
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
              {errors.detailFacture?.assurance?.message}
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
  );
}

export default NewDeclarationPage;
