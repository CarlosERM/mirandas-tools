// import dropHandler from "./drop_handler";
import formatDropZoneOnSuccess from "./format_drop_zone";
import { PDFDocument } from "pdf-lib";
import successPageFormatAndLink from "./succes_page_format";
import { setSpinner } from "./spinner";

export default function initMergePdf() {
  async function mergePdfs() {
    const mergedPdf = await PDFDocument.create();

    for (const item of canvas_items) {
      const blob = await fetch(item.href).then((r) => r.blob());
      const pdf = await PDFDocument.load(await blob.arrayBuffer());
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfFile = await mergedPdf.save();
    return mergedPdfFile;
  }
  async function createDownloadPdfMerged() {
    if (canvas_items.length) {
      setSpinner(true);
      const mergedPdfFile = await mergePdfs();
      formatDropZoneOnSuccess();
      successPageFormatAndLink(mergedPdfFile, "merged_pdf.pdf");
      setSpinner(false);
    }
  }
  const canvas_items = document.getElementsByClassName("pdf-item");
  const merge_bottom = document.getElementById("merge-button");
  merge_bottom.addEventListener("click", createDownloadPdfMerged);
}
