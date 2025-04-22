import domtoimage from "dom-to-image";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

export const elementToPDF = async (
  elementToPrintId: string,
  fileName = "Untitled"
) => {
  const element = document.getElementById(elementToPrintId);
  if (!element) {
    toast.error(`Element with id ${elementToPrintId} not found`);
    return;
  }

  try {
    element.scrollIntoView({ behavior: "smooth" });
    const dataUrl = await domtoimage.toPng(element);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [129, 70],
    });
    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${fileName}.pdf`);
    toast.success("PDF saved successfully");
  } catch (error) {
    console.error(error);
    toast.error(
      (error as Error)?.message || String(error) || "Failed to export PDF"
    );
  }
};
