/**
 * WDS Drawer — <wds-drawer> is a side-sliding panel built on <dialog>,
 * for secondary workflows (create/edit forms, filters) that shouldn't
 * take over the whole screen like a modal.
 *
 * Usage:
 *   <wds-drawer id="edit-drawer" heading="Edit resource" side="right" size="md">
 *     <div>form fields…</div>
 *     <div slot="footer">
 *       <button class="wds-btn wds-btn--secondary" data-wds-close>Cancel</button>
 *       <button class="wds-btn wds-btn--primary">Save</button>
 *     </div>
 *   </wds-drawer>
 *
 *   document.getElementById('edit-drawer').open();
 *
 * Attributes: side (left|right, default right), size (sm|md|lg), no-close
 * Events: wds-open, wds-close (detail: { reason })
 */

const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host { --_width: var(--wds-drawer-width, 420px); }
    :host([size="sm"]) { --_width: 320px; }
    :host([size="lg"]) { --_width: 560px; }

    dialog {
      position: fixed;
      inset: 0;
      margin: 0;
      padding: 0;
      border: 0;
      width: min(var(--_width), 100vw);
      height: 100vh;
      max-width: none;
      max-height: none;
      background: var(--wds-surface);
      color: var(--wds-text);
      box-shadow: var(--wds-shadow-xl);
      display: flex;
      flex-direction: column;
      transition: transform var(--wds-duration-slow) var(--wds-ease);
    }
    dialog::backdrop { background: var(--wds-overlay); }

    :host(:not([side="left"])) dialog { left: auto; right: 0; transform: translateX(100%); }
    :host(:not([side="left"])) dialog[open] { transform: translateX(0); }
    :host([side="left"]) dialog { right: auto; left: 0; transform: translateX(-100%); }
    :host([side="left"]) dialog[open] { transform: translateX(0); }

    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--wds-space-sm);
      padding: var(--wds-space-md) var(--wds-space-lg);
      border-bottom: 1px solid var(--wds-border);
      flex: none;
    }
    .heading { font-size: var(--wds-text-md); font-weight: var(--wds-font-weight-semibold); margin: 0; }
    .close-btn {
      flex: none; display: flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; border-radius: var(--wds-radius-md);
      color: var(--wds-text-muted); background: transparent; border: 0; cursor: pointer;
    }
    .close-btn:hover { background: var(--wds-surface-sunken); }
    .body { padding: var(--wds-space-lg); overflow-y: auto; flex: 1; }
    .footer {
      display: flex; justify-content: flex-end; gap: var(--wds-space-xs);
      padding: var(--wds-space-sm) var(--wds-space-lg); border-top: 1px solid var(--wds-border); flex: none;
    }
    .footer:empty { display: none; }
  </style>
  <dialog part="dialog">
    <div class="header">
      <h2 class="heading"><slot name="header"></slot></h2>
      <button type="button" class="close-btn" aria-label="Close panel"><wds-icon name="close" size="16"></wds-icon></button>
    </div>
    <div class="body"><slot></slot></div>
    <div class="footer"><slot name="footer"></slot></div>
  </dialog>
`;

class WdsDrawer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).appendChild(TEMPLATE.content.cloneNode(true));
    this._dialog = this.shadowRoot.querySelector("dialog");
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

  _onDelegatedClose = (e) => {
    const path = e.composedPath();
    if (path.some((el) => el.nodeType === 1 && el.hasAttribute && el.hasAttribute("data-wds-close"))) {
      this.close("close-button");
    }
  };

  _onBackdropClick = (e) => {
    const rect = this._dialog.getBoundingClientRect();
    const inPanel =
      e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!inPanel) this.close("backdrop");
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
}

customElements.define("wds-drawer", WdsDrawer);
