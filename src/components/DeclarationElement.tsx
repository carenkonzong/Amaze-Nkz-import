import { type LucideIcon } from "lucide-react";

type Props = {
  head: string;
  children?: React.ReactNode;
  icon: LucideIcon;
  iconColor: string;
  color: string;
};

function DeclarationElement({
  head,
  children,
  icon: Icon,
  iconColor,
  color,
}: Props) {
  return (
    <div className="flex justify-center mt-5 px-5">
      <div className="max-w-5xl  border w-full  shadow-md rounded-2xl border-black/10">
        <div className={`flex flex-col  ${color} rounded-t-2xl`}>
          <div className="flex m-5 items-center gap-3">
            <Icon className={`${iconColor}`} />
            <h1 className="text-2xl font-semibold ">{head}</h1>
          </div>
          <button> + Ajouter un Colis</button>
        </div>
        <div className="border-t border-black/10" />

        <div className="m-7">{children}</div>
      </div>
    </div>
  );
}

export default DeclarationElement;
