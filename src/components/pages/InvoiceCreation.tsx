import Header from "@/components/layout/Header";
import InvoiceHeader from "@/components/invoice/InvoiceHeader";
import getNextInvoiceNumber from "@/components/services/invoiceService";
import { formatDate, generateInvoiceNumber } from "@/components/services/index";
import { useEffect, useRef, useState } from "react";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import type { Facture } from "@/types/invoice";
import InvoicePreview from "../invoice/InvoicePreview";

function InvoiceCreation() {
  const dateExpedition = new Date("2025-11-21");
  const dateExpeditionFormatted = formatDate(dateExpedition);
  const today = new Date();
  const dateFacture = formatDate(today);
  const [numeroFacture, setNumeroFacture] = useState("");
  const [previewFacture, setPreviewFacture] = useState<Facture | null>(null);
  const formResetRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const fetchNextInvoiceNumber = async () => {
      const nextNumber = await getNextInvoiceNumber(dateExpeditionFormatted);

      const generated = generateInvoiceNumber(dateExpedition, nextNumber);
      setNumeroFacture(generated);
    };

    fetchNextInvoiceNumber();
  }, [dateExpedition, dateExpeditionFormatted]);

  const handleConfirm = () => {
    if (formResetRef.current) {
      formResetRef.current();
    }
    setPreviewFacture(null);
  };
  return (
    <>
      <Header />
      <InvoiceHeader
        dateExpeditionFormatted={dateExpeditionFormatted}
        dateFacture={dateFacture}
        numeroFacture={numeroFacture}
      />
      <InvoiceForm
        dateExpeditionFormatted={dateExpeditionFormatted}
        dateFacture={dateFacture}
        numeroFacture={numeroFacture}
        setPreviewFacture={setPreviewFacture}
        onResetRef={(resetFn) => {
          formResetRef.current = resetFn;
        }}
      />
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
              <InvoicePreview
                data={previewFacture}
                onClose={() => setPreviewFacture(null)}
                onConfirm={handleConfirm}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default InvoiceCreation;
