import "./App.css";
import InvoiceCreation from "./components/pages/InvoiceCreation";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors expand={true} />
      <InvoiceCreation />
    </>
  );
}

export default App;
