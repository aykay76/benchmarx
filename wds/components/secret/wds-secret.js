/**
 * WDS Secret — <wds-secret> displays a sensitive value (password, token, key)
 * blurred out by default, with an eye button to reveal / hide it. While hidden
 * the real value is never written to the DOM — a fixed-length placeholder is
 * blurred instead, so neither the text nor its length can be read or copied.
 *
 * Usage:
 *   <dl class="wds-detail-list">
 *     <div class="wds-detail-row"><dt>Username</dt><dd>jane.doe</dd></div>
 *     <div class="wds-detail-row"><dt>Password</dt><dd><wds-secret value="s3cr3t" copyable></wds-secret></dd></div>
 *   </dl>
 *
 * Attributes:
 *   value      — the secret. Can also be set via the `value` property.
 *   copyable   — show a copy-to-clipboard button
 *   revealed   — start (or currently) revealed; reflects toggle state
 *
 * Methods:  reveal(), hide(), toggle()
 * Events:   wds-secret-toggle (detail: { revealed }) — fired on user toggle
 */

import "../../icons/wds-icon.js";
import { toast } from "../toast/wds-toast.js";

const MASK = "••••••••••••";

class WdsSecret extends HTMLElement {
  static get observedAttributes() {
    return ["value", "copyable", "revealed"];
  }

  get value() {
    return this.getAttribute("value") || "";
  }
  set value(v) {
    this.setAttribute("value", v ?? "");
  }

  get revealed() {
    return this.hasAttribute("revealed");
  }

  reveal() {
    this.setAttribute("revealed", "");
  }
  hide() {
    this.removeAttribute("revealed");
  }
  toggle() {
    this.toggleAttribute("revealed");
  }

  connectedCallback() {
    this._render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this._render();
  }

  _render() {
    const revealed = this.revealed;
    const copyable = this.hasAttribute("copyable");

    this.textContent = "";

    const text = document.createElement("span");
    text.className = "wds-secret-value";
    if (revealed) {
      text.textContent = this.value;
    } else {
      text.classList.add("wds-secret-value--hidden");
      text.setAttribute("aria-hidden", "true");
      text.textContent = MASK;
    }
    this.appendChild(text);

    const label = revealed ? "Hide" : "Show";
    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "wds-btn wds-btn--ghost wds-btn--icon wds-btn--sm";
    toggleBtn.setAttribute("aria-label", `${label} secret`);
    toggleBtn.setAttribute("aria-pressed", String(revealed));
    toggleBtn.setAttribute("data-wds-tooltip", label);
    toggleBtn.innerHTML = `<wds-icon name="${revealed ? "eye-off" : "eye"}" size="14"></wds-icon>`;
    toggleBtn.addEventListener("click", () => {
      this.toggle();
      this.dispatchEvent(
        new CustomEvent("wds-secret-toggle", { bubbles: true, detail: { revealed: this.revealed } })
      );
      this.querySelector("button")?.focus();
    });
    this.appendChild(toggleBtn);

    if (copyable) {
      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "wds-btn wds-btn--ghost wds-btn--icon wds-btn--sm";
      copyBtn.setAttribute("aria-label", "Copy secret");
      copyBtn.setAttribute("data-wds-tooltip", "Copy");
      copyBtn.innerHTML = '<wds-icon name="copy" size="14"></wds-icon>';
      copyBtn.addEventListener("click", () => this._copy());
      this.appendChild(copyBtn);
    }
  }

  async _copy() {
    try {
      await navigator.clipboard.writeText(this.value);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy to clipboard");
    }
  }
}

customElements.define("wds-secret", WdsSecret);
