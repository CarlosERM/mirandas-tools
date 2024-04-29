import formatDropZoneOnSuccess from "./format_drop_zone";
import { setSpinner } from "./spinner";
import successPageFormatAndLink from "./succes_page_format";
import { PDFDocument } from "pdf-lib";

export default function initHandleSplitPdf() {
  async function createDownloadPdfSplitted(pdfSplitted) {
    if (canvas_items.length) {
      formatDropZoneOnSuccess();
      successPageFormatAndLink(pdfSplitted, "splitted_pdf.pdf");
    }
  }

  async function handleSplitButtonClick() {
    if (canvas_items.length == 1) {
      let canvas = canvas_items[0];
      const blob = await fetch(canvas.href).then((r) => r.blob());
      const pdf = await PDFDocument.load(await blob.arrayBuffer());
      const split_pdf = await PDFDocument.create();
      const numberPages = pdf.getPages().length;

      split_block.classList.remove("hidden");

      const inputDe = document.getElementById("de");
      const inputAte = document.getElementById("ate");

      inputDe.placeholder = 1;
      inputAte.placeholder = numberPages;

      if (
        inputDe.value &&
        inputAte.value &&
        inputDe.value != 0 &&
        inputAte.value != 0 &&
        inputDe.value >= 1 &&
        inputAte.value >= 1 &&
        inputDe.value <= inputAte.value
      ) {
        setSpinner(true);
        const startPage = inputDe.value - 1;
        const lastPage = inputAte.value - 1;
        for (let i = startPage; i <= lastPage; i++) {
          const [copiedPage] = await split_pdf.copyPages(pdf, [i]);
          split_pdf.addPage(copiedPage);
        }

        const splittedPdf = await split_pdf.save();
        createDownloadPdfSplitted(splittedPdf);
        setSpinner(false);
      }
    }
  }
  const split_block = document.getElementById("split-block");
  const split_button = document.getElementById("split-button");
  const canvas_items = document.getElementsByClassName("pdf-item");

  split_button.addEventListener("click", handleSplitButtonClick);
}
