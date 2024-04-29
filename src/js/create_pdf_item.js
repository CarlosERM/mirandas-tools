import { makeThumb, handlePdfClick } from "./drag_and_drop";
function formatNewDropzone() {
  drop_zone.classList.remove("flex-col");
  drop_zone.classList.remove("flex-wrap");
  drop_zone.classList.remove("justify-center");
  drop_zone.classList.remove("flex");

  drop_zone.classList.add("grid");
  drop_zone.classList.add("sm:grid-cols-2");
  drop_zone.classList.add("md:grid-cols-2");
  drop_zone.classList.add("lg:grid-cols-4");
  drop_zone.classList.add("xl:grid-cols-5");

  drop_zone.classList.add("gap-4");
  //   drop_zone.classList.add("overflow-y-scroll");
  drop_zone.classList.add("auto-rows-min");
}

export default function createPdfItem(file) {
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
          namePdf.innerText = file.name.substring(0, 10) + "...";
          //   console.log(file.name.substring(0, 10));

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
const upload_image = document.getElementById("upload_image");
const upload_title = document.getElementById("upload_title");
