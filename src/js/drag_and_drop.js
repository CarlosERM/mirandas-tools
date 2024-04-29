import createPdfItem from "./create_pdf_item";
export function makeThumb(page) {
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

export function handlePdfClick(e) {
  e.stopPropagation();
}

export function dropHandler(e) {
  e.preventDefault();
  if (e.dataTransfer.items) {
    [...e.dataTransfer.items].forEach(async (item, i) => {
      if (item.type == "application/pdf") {
        let file = item.getAsFile();
        createPdfItem(file);
      }
    });
  } else {
    [...e.dataTransfer.files].forEach((file, i) => {
      console.log(`FILES  file[${i}].name = ${file.name}`);
    });
  }
}

export function dragOverHandler(e) {
  e.preventDefault();
}

export function onClickHandler(e) {
  const input = document.getElementById("input_pdf");
  input.click();
}

const drop_zone = document.getElementById("drop_zone");
const upload_image = document.getElementById("upload_image");
const upload_title = document.getElementById("upload_title");

drop_zone.addEventListener("drop", dropHandler);
drop_zone.addEventListener("dragover", dragOverHandler);
drop_zone.addEventListener("click", onClickHandler);
