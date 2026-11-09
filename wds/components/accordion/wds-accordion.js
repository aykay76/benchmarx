/**
 * WDS Accordion — <wds-accordion> + <wds-accordion-item heading="…">.
 * Light-DOM custom elements (no shadow root) so panel content stays easy
 * to style and can contain other WDS/native form elements freely.
 *
 * Usage:
 *   <wds-accordion>
 *     <wds-accordion-item heading="Network settings" open>
 *       <p>Panel content…</p>
 *     </wds-accordion-item>
 *     <wds-accordion-item heading="Advanced">…</wds-accordion-item>
 *   </wds-accordion>
 *
 * Attributes:
 *   wds-accordion:      multiple  — allow more than one item open at a time
 *   wds-accordion-item: heading, open
 *
 * Events (on the item): wds-toggle (detail: { open })
 */

class WdsAccordionItem extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;

    const heading = this.getAttribute("heading") || "";
    const startOpen = this.hasAttribute("open");
    const id = `wds-accordion-panel-${Math.random().toString(36).slice(2, 9)}`;

    const content = document.createElement("div");
    content.className = "wds-accordion-panel-inner";
    while (this.firstChild) content.appendChild(this.firstChild);

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "wds-accordion-trigger";
    trigger.setAttribute("aria-expanded", String(startOpen));
    trigger.setAttribute("aria-controls", id);
    trigger.innerHTML = `<span>${heading}</span><wds-icon class="wds-accordion-chevron" name="chevron-down" size="16"></wds-icon>`;

    const wrapper = document.createElement("div");
    wrapper.className = "wds-accordion-panel-wrapper" + (startOpen ? " is-open" : "");
    const panel = document.createElement("div");
    panel.className = "wds-accordion-panel";
    panel.id = id;
    panel.setAttribute("role", "region");
    panel.appendChild(content);
    wrapper.appendChild(panel);

    trigger.addEventListener("click", () => this._toggle());

    this.appendChild(trigger);
    this.appendChild(wrapper);
    this._trigger = trigger;
    this._wrapper = wrapper;
  }

  _toggle(forceOpen) {
    const willOpen = forceOpen ?? this._trigger.getAttribute("aria-expanded") !== "true";
    if (willOpen && !this.closest("wds-accordion")?.hasAttribute("multiple")) {
      const parent = this.closest("wds-accordion");
      parent?.querySelectorAll("wds-accordion-item").forEach((item) => {
        if (item !== this) item._toggle(false);
      });
    }
    this._trigger.setAttribute("aria-expanded", String(willOpen));
    this._wrapper.classList.toggle("is-open", willOpen);
    this.dispatchEvent(new CustomEvent("wds-toggle", { detail: { open: willOpen }, bubbles: true }));
  }

  get open() {
    return this._trigger?.getAttribute("aria-expanded") === "true";
  }

  set open(value) {
    this._toggle(Boolean(value));
  }
}

class WdsAccordion extends HTMLElement {}

customElements.define("wds-accordion-item", WdsAccordionItem);
customElements.define("wds-accordion", WdsAccordion);
