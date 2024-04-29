import { sortable } from "./script";
export default async function successPageFormatAndLink(pdf, filename) {
  const blob = new Blob([pdf]);
  const url = URL.createObjectURL(blob);
  const success = document.getElementById("success-block");
  const link_download = document.getElementById("download-pdf");
  const restart_button = document.getElementById("restart-button");

  drop_zone.innerHTML = "";

  link_download.href = url;
  link_download.download = filename;
  drop_zone.appendChild(success);

  success.classList.remove("hidden");
  restart_button.classList.remove("hidden");
  sortable.option("disabled", true);
}
