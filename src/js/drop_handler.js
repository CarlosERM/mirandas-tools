import createPdfItem from "./create_pdf_item";
export default function dropHandler(e) {
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
