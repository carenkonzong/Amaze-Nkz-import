import DeclarationElement from "../components/DeclarationElement";
import { User, SquareArrowDownRight, FileText } from "lucide-react";
import { Scale, DollarSign } from "lucide-react";
import { useState } from "react";
import { calculateTotalItem } from "../services/index";

function NewDeclarationPage() {
  const [itemWeight, setItemWeight] = useState("");
  const numberWeight = Number(itemWeight);
  /*   let total = calculateTotalItem(numberWeight);
   */ const { prixUnitaire, total } = calculateTotalItem(numberWeight);

  let itemTotal = total;

  return (
    <form action="" className="flex flex-col gap-3">
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
              /* {...register("child.firstName")} */
            />
            <span className="text-red-400 text-xs">
              {/* {errors.child?.firstName?.message} */}
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
              /* {...register("child.firstName")} */
            />
            <span className="text-red-400 text-xs">
              {/* {errors.child?.firstName?.message} */}
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
                /* {...register("child.firstName")} */
              />
              <span className="text-red-400 text-xs">
                {/* {errors.child?.firstName?.message} */}
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
                /* {...register("child.firstName")} */
              />
              <span className="text-red-400 text-xs">
                {/* {errors.child?.firstName?.message} */}
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
                /* {...register("child.firstName")} */
              />
              <span className="text-red-400 text-xs">
                {/* {errors.child?.firstName?.message} */}
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
            ></textarea>
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
                onChange={(e) => setItemWeight(e.target.value)}
              />
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
          <div className="font-semibold text-xl">Montant Total: </div>
          <div className="font-extrabold text-3xl text-blue-800">
            {itemTotal} FCFA
          </div>
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
              className="border rounded-lg w-full border-black/10  p-2 mt-2 bg-[#f8fafc]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="text-sm font-semibold">
              Assurance (2% de la valeur)
            </label>
            <div className="flex flex-row gap-5">
              <label htmlFor="" className="text-sm font-semibold gap-2 flex">
                <input type="radio" name="assurance" value="true" />
                Oui
              </label>
              <label htmlFor="" className="text-sm font-semibold gap-2 flex">
                <input type="radio" name="assurance" value="false" />
                Non
              </label>
            </div>
          </div>
          <div className="w-full">
            <label htmlFor="" className="text-sm font-semibold">
              Mode de Paiement
            </label>
            <select className="border rounded-lg w-full border-black/10  p-2 mt-2 bg-[#f8fafc]">
              <option value="select">
                -- Selectionner une methode de Paiement --
              </option>
              <option value="orangeMoney">Orange Money</option>
              <option value="momo">MTN MoMo</option>
              <option value="virement">Virement</option>
            </select>
          </div>
        </div>
      </DeclarationElement>
      <div className="flex justify-center mb-5 ">
        <button className="max-w-5xl w-full bg-blue-900 py-3 px-5 text-white rounded-xl cursor-pointer  ">
          Générer la Facture
        </button>
      </div>
    </form>
  );
}

export default NewDeclarationPage;
