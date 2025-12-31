import { PlaneTakeoff } from "lucide-react";

function Header() {
  return (
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
  );
}

export default Header;
