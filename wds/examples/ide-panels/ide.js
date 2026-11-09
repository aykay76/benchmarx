/**
 * IDE resizable panels example — generic drag-to-resize behaviour.
 * Not part of core WDS: kept local to this example since resizable split
 * panes are specific to this archetype rather than a reusable component.
 */

/**
 * Wire up a drag handle that resizes an adjacent panel.
 * @param {HTMLElement} handle - the draggable divider element
 * @param {HTMLElement} panel - the element whose size is adjusted
 * @param {"width"|"height"} dimension - which CSS dimension to resize
 * @param {{min:number,max:number,invert?:boolean}} opts
 */
function makeResizable(handle, panel, dimension, { min, max, invert = false }) {
  handle.addEventListener("pointerdown", (e) => {
    handle.setPointerCapture(e.pointerId);
    handle.classList.add("is-dragging");
    const start = dimension === "width" ? e.clientX : e.clientY;
    const startSize = dimension === "width" ? panel.offsetWidth : panel.offsetHeight;

    const onMove = (moveEvent) => {
      const current = dimension === "width" ? moveEvent.clientX : moveEvent.clientY;
      const delta = invert ? start - current : current - start;
      const next = Math.min(max, Math.max(min, startSize + delta));
      panel.style[dimension] = `${next}px`;
    };

    const onUp = () => {
      handle.classList.remove("is-dragging");
      handle.releasePointerCapture(e.pointerId);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  });
}

makeResizable(document.querySelector('[data-resizer="sidebar"]'), document.getElementById("sidebar"), "width", {
  min: 160,
  max: 480,
});

makeResizable(document.querySelector('[data-resizer="panel"]'), document.getElementById("bottom-panel"), "height", {
  min: 80,
  max: 560,
  invert: true,
});
