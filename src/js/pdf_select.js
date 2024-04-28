import createPdfItem from "./create_pdf_item";
export default function initHandlePdfSelect() {
  async function handlePdfSelect(e) {
    const files = e.target.files;

    for (const file of files) {
      if (file.type == "application/pdf") {
        createPdfItem(file);
      }
    }
  }

  input_pdf.addEventListener("change", handlePdfSelect, false);
}
