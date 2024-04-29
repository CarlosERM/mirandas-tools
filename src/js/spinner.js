export function setSpinner(show) {
  if (show) {
    spinner.classList.remove("hidden");
  } else {
    spinner.classList.add("hidden");
  }
}

const spinner = document.getElementById("spinner-miranda");
