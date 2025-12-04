import DeclarationElement from "../components/DeclarationElement";
import { User, SquareArrowDownRight, FileText } from "lucide-react";
import { Scale, DollarSign } from "lucide-react";

import { useState } from "react";
import calculateTotalItem from "../services/index";

function NewDeclarationPage() {
  const [itemWeight, setItemWeight] = useState("");
  const numberWeight = Number(itemWeight);
  let total = calculateTotalItem(numberWeight);
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
            <label htmlFor="NomExpediteur" className="text-sm font-semibold">
              Nom de l'Expéditeur *
            </label>
            <input
              type="text"
              id="NomExpediteur"
              className="border rounded-lg w-full border-black/10 p-2 mt-2 bg-[#f8fafc]"
              /* {...register("child.firstName")} */
            />
            <span className="text-red-400 text-xs">
              {/* {errors.child?.firstName?.message} */}
            </span>
          </div>
          <div>
            <label
              htmlFor="TelephoneExpéditeur"
              className="text-sm font-semibold"
            >
              Téléphone de l'Expéditeur *
            </label>
            <input
              type="text"
              id="TelephoneExpéditeur"
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
                htmlFor="NomDestinataire"
                className="text-sm font-semibold"
              >
                Nom du Destinataire *
              </label>
              <input
                type="text"
                id="NomDestinataire"
                className="border rounded-lg w-full border-black/10  p-2 mt-2 bg-[#f8fafc]"
                /* {...register("child.firstName")} */
              />
              <span className="text-red-400 text-xs">
                {/* {errors.child?.firstName?.message} */}
              </span>
            </div>
            <div>
              <label
                htmlFor="TelephoneDestinataire"
                className="text-sm font-semibold"
              >
                Téléphone du Destinataire *
              </label>
              <input
                type="text"
                id="TelephoneDestinataire"
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
                htmlFor="VilleDestinataire"
                className="text-sm font-semibold"
              >
                Ville de Résidence (Canada) *
              </label>
              <input
                type="text"
                id="VilleDestinataire"
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
            <label htmlFor="itemDescription">Description du Colis *</label>
            <textarea
              id="itemDescription"
              placeholder="Décrivez le contenu du colis..."
              rows={3}
              className="border rounded-xl border-black/10 p-2"
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label htmlFor="itemWeight" className="flex gap-2">
                <Scale size={20} /> Poids (kg) *
              </label>
              <input
                type="number"
                min={0}
                className="border rounded-lg w-full border-black/10  p-2 mt-2 bg-[#f8fafc]"
                id="itemWeight"
                value={itemWeight}
                onChange={(e) => setItemWeight(e.target.value)}
              />
            </div>
            <div>
              <label className="flex gap-2">
                <DollarSign size={20} /> Prix Calculé
              </label>
              <input
                type="text"
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
    </form>
  );
}

export default NewDeclarationPage;
