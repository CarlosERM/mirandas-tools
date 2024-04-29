import { dropHandler, dragOverHandler, onClickHandler } from "./drag_and_drop";

export default function formatDropZoneOnSuccess() {
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
