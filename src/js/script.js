import Sortable from "sortablejs";
import initMergePdf from "./merge_pdf";
import initHandlePdfSelect from "./pdf_select";
import initHandleSplitPdf from "./split_pdf";
const workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
const pdfjsLib = window["pdfjs-dist/build/pdf"];

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export const sortable = Sortable.create(drop_zone, {
  animation: 150,
});

initMergePdf();
initHandlePdfSelect();
initHandleSplitPdf();
