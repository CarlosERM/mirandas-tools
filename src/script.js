import { PDFDocument } from "pdf-lib";
// const submit = document.getElementById("predict-button");
const drop_zone = document.getElementById("drop_zone");
const upload_image = document.getElementById("upload_image");
const upload_title = document.getElementById("upload_title");
// const upload_input = document.getElementById("input_photo");

// const image_zone = document.getElementById("drop_zone");
// const upload_image = document.getElementById("upload_image");

function addPdf() {}

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

function dropHandler(e) {
  e.preventDefault();
  if (e.dataTransfer.items) {
    [...e.dataTransfer.items].forEach(async (item, i) => {
      if (item.type == "application/pdf") {
        upload_image.remove();
        upload_title.remove();

        drop_zone.classList.remove("flex-col");
        drop_zone.classList.remove("justify-center");
        drop_zone.classList.add("flex-row");
        drop_zone.classList.add("gap-4");

        file = item.getAsFile();

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
                const itemPdf = document.createElement("div");
                itemPdf.classList.add("py-4");
                itemPdf.classList.add("px-3");
                itemPdf.classList.add("flex");
                itemPdf.classList.add("flex-col");
                itemPdf.classList.add("gap-2");
                itemPdf.classList.add("rounded-md");
                itemPdf.classList.add("bg-c1");
                // itemPdf.classList.add("hover:bg-opacity-10");
                itemPdf.classList.add("cursor-pointer");

                const namePdf = document.createElement("h3");
                namePdf.classList.add("text-center");
                namePdf.innerText = file.name;

                canvas.classList.add("self-center");
                canvas.classList.add("rounded-md");

                itemPdf.appendChild(canvas);
                itemPdf.appendChild(namePdf);
                drop_zone.appendChild(itemPdf);
              });
          });
        };
        fileReader.readAsArrayBuffer(file);
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

drop_zone.addEventListener("drop", dropHandler);
drop_zone.addEventListener("dragover", dragOverHandler);
drop_zone.addEventListener("click", onClickHandler);
