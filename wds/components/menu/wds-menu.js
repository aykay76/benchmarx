/**
 * WDS Menu — <wds-menu-button> renders a trigger + dropdown action menu.
 * Built on the native Popover API, so outside-click / Escape-to-dismiss
 * and top-layer stacking come for free.
 *
 * Usage:
 *   <wds-menu-button>
 *     <wds-menu-item value="edit">Edit</wds-menu-item>
 *     <wds-menu-item value="duplicate">Duplicate</wds-menu-item>
 *     <wds-menu-separator></wds-menu-separator>
 *     <wds-menu-item value="delete" danger>Delete</wds-menu-item>
 *   </wds-menu-button>
 *
 *   menuButton.addEventListener('wds-select', (e) => console.log(e.detail.value));
 *
 * Provide a custom trigger with slot="trigger" (defaults to a "⋯" icon button).
 * <wds-menu-item disabled> is supported.
 */

class WdsMenuItem extends HTMLElement {}
class WdsMenuSeparator extends HTMLElement {}

class WdsMenuButton extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;

    let trigger = this.querySelector('[slot="trigger"]');
    if (!trigger) {
      trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "wds-btn wds-btn--ghost wds-btn--icon wds-btn--sm";
      trigger.setAttribute("aria-label", this.getAttribute("label") || "Open menu");
      trigger.innerHTML = '<wds-icon name="more-horizontal" size="16"></wds-icon>';
      this.appendChild(trigger);
    }
    this._trigger = trigger;

    const menu = document.createElement("div");
    menu.className = "wds-menu";
    menu.setAttribute("popover", "auto");
    menu.setAttribute("role", "menu");
    Array.from(this.querySelectorAll(":scope > wds-menu-item, :scope > wds-menu-separator")).forEach((node) => {
      const built = this._buildMenuNode(node);
      node.remove();
      menu.appendChild(built);
    });
    this.appendChild(menu);
    this._menu = menu;

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      if (menu.matches(":popover-open")) {
        menu.hidePopover();
      } else {
        this._position();
        menu.showPopover();
      }
    });

    window.addEventListener("resize", () => {
      if (menu.matches(":popover-open")) this._position();
    });
  }

  _buildMenuNode(node) {
    if (node.tagName === "WDS-MENU-SEPARATOR") {
      const sep = document.createElement("div");
      sep.className = "wds-menu-separator";
      sep.setAttribute("role", "separator");
      return sep;
    }
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "wds-menu-item" + (node.hasAttribute("danger") ? " wds-menu-item--danger" : "");
    btn.setAttribute("role", "menuitem");
    if (node.hasAttribute("disabled")) btn.disabled = true;
    btn.innerHTML = node.innerHTML;
    btn.addEventListener("click", () => {
      this._menu.hidePopover();
      this.dispatchEvent(new CustomEvent("wds-select", { detail: { value: node.getAttribute("value") } }));
    });
    return btn;
  }

  _position() {
    const rect = this._trigger.getBoundingClientRect();
    const menu = this._menu;
    menu.style.top = "0px";
    menu.style.left = "0px";
    // Measure once visible via getBoundingClientRect is unreliable pre-show; use offsetWidth fallback.
    const menuWidth = menu.offsetWidth || 180;
    let left = rect.right - menuWidth;
    if (left < 8) left = rect.left;
    let top = rect.bottom + 4;
    if (top + 240 > window.innerHeight) top = Math.max(8, rect.top - 4 - 240);
    menu.style.left = `${Math.round(left)}px`;
    menu.style.top = `${Math.round(top)}px`;
  }
}

customElements.define("wds-menu-item", WdsMenuItem);
customElements.define("wds-menu-separator", WdsMenuSeparator);
customElements.define("wds-menu-button", WdsMenuButton);
