import { PDFDocument } from "pdf-lib";
import Sortable from "sortablejs";

const drop_zone = document.getElementById("drop_zone");
const upload_image = document.getElementById("upload_image");
const upload_title = document.getElementById("upload_title");
const merge_bottom = document.getElementById("merge-button");
const input_pdf = document.getElementById("input_pdf");
const canvas_items = document.getElementsByClassName("pdf-item");
const split_block = document.getElementById("split-block");
const split_button = document.getElementById("split-button");

const sortable = Sortable.create(drop_zone, {
  animation: 150,
  // ghostClass: "bg-c13",
});

let pdfItems = [];

function makeThumb(page) {
  let scale = 0.2;
  let viewport = page.getViewport({ scale: scale });
  let outputScale = window.devicePixelRatio || 1;
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");

  canvas.width = Math.floor(viewport.width * outputScale);
  canvas.height = Math.floor(viewport.height * outputScale);
  canvas.style.width = Math.floor(viewport.width) + "px";
  canvas.style.height = Math.floor(viewport.height) + "px";

  let transform =
    outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

  let renderContext = {
    canvasContext: context,
    transform: transform,
    viewport: viewport,
  };
  return page.render(renderContext).promise.then(function () {
    return canvas;
  });
}

function formatNewDropzone() {
  drop_zone.classList.remove("flex-col");
  drop_zone.classList.remove("flex-wrap");
  drop_zone.classList.remove("justify-center");
  drop_zone.classList.remove("flex");

  drop_zone.classList.add("grid");
  drop_zone.classList.add("sm:grid-cols-2");
  drop_zone.classList.add("md:grid-cols-3");
  drop_zone.classList.add("lg:grid-cols-4");
  drop_zone.classList.add("xl:grid-cols-5");

  drop_zone.classList.add("gap-4");
  drop_zone.classList.add("overflow-y-scroll");
  drop_zone.classList.add("auto-rows-min");
}

function createPdfItem(file) {
  upload_image.remove();
  upload_title.remove();

  formatNewDropzone();
  let fileReader = new FileReader();

  fileReader.onload = async function () {
    let typedArray = new Uint8Array(this.result);
    let pdfData = typedArray.buffer;
    let pdfBlob = new Blob([pdfData], { type: "application/pdf" });

    let url = URL.createObjectURL(pdfBlob);
    pdfjsLib.getDocument(url).promise.then(function (doc) {
      return doc
        .getPage(1)
        .then(makeThumb)
        .then(function (canvas) {
          const itemPdf = document.createElement("a");
          itemPdf.href = url;
          itemPdf.target = "_blank";
          itemPdf.rel = "noopener noreferrer";

          itemPdf.classList.add("py-4");
          itemPdf.classList.add("pdf-item");
          itemPdf.classList.add("px-3");
          itemPdf.classList.add("flex");
          itemPdf.classList.add("flex-col");
          itemPdf.classList.add("gap-2");
          itemPdf.classList.add("rounded-md");
          itemPdf.classList.add("bg-c1");
          itemPdf.classList.add("hover:bg-c13");
          itemPdf.classList.add("hover:bg-opacity-10");

          itemPdf.classList.add("cursor-pointer");

          const namePdf = document.createElement("h3");
          namePdf.classList.add("text-center");
          namePdf.innerText = file.name;

          canvas.classList.add("self-center");
          canvas.classList.add("rounded-md");
          canvas.addEventListener("click", handlePdfClick);

          itemPdf.appendChild(canvas);
          itemPdf.appendChild(namePdf);
          drop_zone.appendChild(itemPdf);
        });
    });
  };
  fileReader.readAsArrayBuffer(file);
}

function dropHandler(e) {
  e.preventDefault();
  if (e.dataTransfer.items) {
    [...e.dataTransfer.items].forEach(async (item, i) => {
      if (item.type == "application/pdf") {
        file = item.getAsFile();
        createPdfItem(file);
      }
    });
  } else {
    [...e.dataTransfer.files].forEach((file, i) => {
      console.log(`FILES  file[${i}].name = ${file.name}`);
    });
  }
}

function dragOverHandler(e) {
  e.preventDefault();
}

function onClickHandler(e) {
  const input = document.getElementById("input_pdf");
  input.click();
}

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

function formatDropZoneOnSuccess() {
  drop_zone.classList.remove("outline-dashed");
  drop_zone.classList.remove("hover:outline-offset-8");
  drop_zone.classList.remove("hover:mb-2");
  drop_zone.classList.remove("hover:drop-shadow-2xl");
  drop_zone.classList.remove("outline-3");
  drop_zone.classList.remove("outline-c6");
  drop_zone.classList.remove("cursor-pointer");
  drop_zone.classList.remove("grid");
  drop_zone.classList.remove("overflow-y-scroll");

  drop_zone.classList.add("outline");
  drop_zone.classList.add("outline-2");
  drop_zone.classList.add("outline-c14");
  drop_zone.classList.add("flex");
  drop_zone.classList.add("flex-col");
  drop_zone.classList.add("justify-center");

  drop_zone.removeEventListener("drop", dropHandler);
  drop_zone.removeEventListener("dragover", dragOverHandler);
  drop_zone.removeEventListener("click", onClickHandler);
}

async function successPageFormatAndLink(pdf) {
  const blob = new Blob([pdf]);
  const url = URL.createObjectURL(blob);
  const success = document.getElementById("success-block");
  const link_download = document.getElementById("download-pdf");

  drop_zone.innerHTML = "";

  link_download.href = url;
  link_download.download = "merged_pdf.pdf";
  drop_zone.appendChild(success);
  success.classList.remove("hidden");
}

async function createDownloadPdfMerged() {
  if (canvas_items.length) {
    formatDropZoneOnSuccess();
    const mergedPdfFile = await mergePdfs();
    successPageFormatAndLink(mergedPdfFile);
  }
}

async function createDownloadPdfSplitted(pdfSplitted) {
  console.log(pdfSplitted);
  if (canvas_items.length) {
    formatDropZoneOnSuccess();
    successPageFormatAndLink(pdfSplitted);
  }
}

async function handlePdfSelect(e) {
  const files = e.target.files;

  for (const file of files) {
    if (file.type == "application/pdf") {
      createPdfItem(file);
    }
  }
}

function handlePdfClick(e) {
  e.stopPropagation();
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
      const startPage = inputDe.value;
      const lastPage = inputAte.value;
      for (let i = startPage; i <= lastPage; i++) {
        const [copiedPage] = await split_pdf.copyPages(pdf, [i]);
        split_pdf.addPage(copiedPage);
      }

      const splittedPdf = await split_pdf.save();
      createDownloadPdfSplitted(splittedPdf);
    }
  }
}

split_button.addEventListener("click", handleSplitButtonClick);
drop_zone.addEventListener("drop", dropHandler);
drop_zone.addEventListener("dragover", dragOverHandler);
drop_zone.addEventListener("click", onClickHandler);
merge_bottom.addEventListener("click", createDownloadPdfMerged);
input_pdf.addEventListener("change", handlePdfSelect, false);
