import type { infoFormulaire } from "@/types/invoice";
import { DollarSign, Scale, Trash2 } from "lucide-react";
import type {
  FieldArrayWithId,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";

type Props = {
  fields: FieldArrayWithId<infoFormulaire, "infoColis", "id">[];
  field: FieldArrayWithId<infoFormulaire, "infoColis", "id">;
  index: number;
  prixUnitaire: number;
  total: number;
  remove: (index: number) => void;
  register: UseFormRegister<infoFormulaire>;
  errors: FieldErrors<infoFormulaire>;
};

function PackageItem({
  field,
  index,
  prixUnitaire,
  total,
  remove,
  register,
  errors,
  fields,
}: Props) {
  return (
    <div key={field.id} className="mb-5">
      <div className="border rounded-xl p-3 border-black/10">
        <div className="flex justify-between mb-3">
          <h1 className="font-bold text-blue-800">Article #{index + 1}</h1>
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
}

export default PackageItem;
