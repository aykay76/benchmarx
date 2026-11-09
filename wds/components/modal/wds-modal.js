/**
 * WDS Modal — <wds-modal> wraps a native <dialog> for free focus-trapping,
 * Escape-to-close and top-layer stacking.
 *
 * Usage:
 *   <wds-modal id="edit-modal" heading="Edit user" size="md">
 *     <p>Body content goes here…</p>
 *     <div slot="footer">
 *       <button class="wds-btn wds-btn--secondary" data-wds-close>Cancel</button>
 *       <button class="wds-btn wds-btn--primary">Save</button>
 *     </div>
 *   </wds-modal>
 *
 *   document.getElementById('edit-modal').open();
 *
 * Attributes:
 *   heading   - text shown in the header (or use slot="header" for markup)
 *   size      - sm | md (default) | lg | xl
 *   no-close  - hide the built-in close (x) button
 *
 * Events: wds-open, wds-close (detail: { reason: 'backdrop'|'escape'|'close-button'|'api' })
 * Any element inside the modal with [data-wds-close] closes it on click.
 */

const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      --_max-width: var(--wds-modal-max-width, 480px);
    }
    dialog {
      margin: auto;
      padding: 0;
      border: 0;
      border-radius: var(--wds-radius-lg);
      background: var(--wds-surface);
      color: var(--wds-text);
      box-shadow: var(--wds-shadow-xl);
      width: min(var(--_max-width), calc(100vw - 32px));
      max-height: calc(100vh - 64px);
      display: flex;
      flex-direction: column;
    }
    dialog::backdrop {
      background: var(--wds-overlay);
    }
    :host([size="sm"]) { --_max-width: 360px; }
    :host([size="lg"]) { --_max-width: 640px; }
    :host([size="xl"]) { --_max-width: 860px; }

    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--wds-space-sm);
      padding: var(--wds-space-md) var(--wds-space-lg);
      border-bottom: 1px solid var(--wds-border);
      flex: none;
    }
    .heading {
      font-size: var(--wds-text-md);
      font-weight: var(--wds-font-weight-semibold);
      margin: 0;
    }
    .close-btn {
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: var(--wds-radius-md);
      color: var(--wds-text-muted);
      background: transparent;
      border: 0;
      cursor: pointer;
    }
    .close-btn:hover { background: var(--wds-surface-sunken); }
    .body {
      padding: var(--wds-space-lg);
      overflow-y: auto;
    }
    .footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--wds-space-xs);
      padding: var(--wds-space-sm) var(--wds-space-lg);
      border-top: 1px solid var(--wds-border);
      flex: none;
    }
    .footer:empty { display: none; }
  </style>
  <dialog part="dialog">
    <div class="header">
      <h2 class="heading"><slot name="header"></slot></h2>
      <button type="button" class="close-btn" aria-label="Close dialog"><wds-icon name="close" size="16"></wds-icon></button>
    </div>
    <div class="body"><slot></slot></div>
    <div class="footer"><slot name="footer"></slot></div>
  </dialog>
`;

class WdsModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).appendChild(TEMPLATE.content.cloneNode(true));
    this._dialog = this.shadowRoot.querySelector("dialog");
    this._headingSlot = this.shadowRoot.querySelector('slot[name="header"]');
  }

  connectedCallback() {
    this._dialog.addEventListener("click", this._onBackdropClick);
    this._dialog.addEventListener("close", this._onClose);
    this.shadowRoot.querySelector(".close-btn").addEventListener("click", () => this.close("close-button"));
    this.shadowRoot.addEventListener("click", this._onDelegatedClose);
    if (this.hasAttribute("no-close")) {
      this.shadowRoot.querySelector(".close-btn").style.display = "none";
    }
    const heading = this.getAttribute("heading");
    if (heading && !this.querySelector('[slot="header"]')) {
      this.shadowRoot.querySelector(".heading").textContent = heading;
    }
  }

  disconnectedCallback() {
    this._dialog.removeEventListener("click", this._onBackdropClick);
  }

  _onDelegatedClose = (e) => {
    const path = e.composedPath();
    if (path.some((el) => el.nodeType === 1 && el.hasAttribute && el.hasAttribute("data-wds-close"))) {
      this.close("close-button");
    }
  };

  _onBackdropClick = (e) => {
    const rect = this._dialog.getBoundingClientRect();
    const inDialog =
      e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!inDialog) this.close("backdrop");
  };

  _onClose = () => {
    this.dispatchEvent(new CustomEvent("wds-close", { detail: { reason: this._closeReason || "escape" } }));
    this._closeReason = null;
  };

  open() {
    if (!this._dialog.open) this._dialog.showModal();
    this.dispatchEvent(new CustomEvent("wds-open"));
  }

  close(reason = "api") {
    this._closeReason = reason;
    if (this._dialog.open) this._dialog.close();
  }

  get open_() {
    return this._dialog.open;
  }
}

customElements.define("wds-modal", WdsModal);
