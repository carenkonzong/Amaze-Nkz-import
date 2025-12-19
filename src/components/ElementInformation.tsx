import { Plus, type LucideIcon } from "lucide-react";

type Props = {
  head: string;
  children?: React.ReactNode;
  icon: LucideIcon;
  iconColor: string;
  color: string;
  btn?: boolean;
  onBtnClick?: () => void;
};

function ElementInformation({
  head,
  children,
  icon: Icon,
  iconColor,
  color,
  btn = false,
  onBtnClick,
}: Props) {
  return (
    <div className="flex justify-center mt-5 px-5">
      <div className="max-w-5xl  border w-full  shadow-md rounded-2xl border-black/10">
        <div
          className={`flex flex-row justify-between p-5 ${color} rounded-t-2xl`}
        >
          <div className="flex items-center gap-3">
            <Icon className={`${iconColor}`} />
            <h1 className="text-2xl font-semibold ">{head}</h1>
          </div>
          {btn && (
            <button
              type="button"
              onClick={onBtnClick}
              className="flex gap-3 items-center mr-2 cursor-pointer border rounded-xl px-3 py-2 bg-white border-black/10 hover:bg-green-600 hover:text-white hover:border-black/5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
            >
              <Plus size={18} /> Ajouter un Colis
            </button>
          )}
        </div>
        <div className="border-t border-black/10" />

        <div className="m-7">{children}</div>
      </div>
    </div>
  );
}

export default ElementInformation;
