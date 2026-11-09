/**
 * WDS Tree — <wds-tree> of nested <wds-tree-item label="…" icon="folder" expanded>.
 * Light-DOM, recursive, keyboard-navigable (arrow keys, Enter/Space).
 *
 * Usage:
 *   <wds-tree>
 *     <wds-tree-item label="Production" icon="folder" expanded>
 *       <wds-tree-item label="eu-west-1" icon="file"></wds-tree-item>
 *       <wds-tree-item label="us-east-1" icon="file"></wds-tree-item>
 *     </wds-tree-item>
 *     <wds-tree-item label="Staging" icon="folder"></wds-tree-item>
 *   </wds-tree>
 *
 * Events (bubble to <wds-tree>): wds-tree-select (detail: { label, item, expanded })
 */

class WdsTreeItem extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;

    const childItems = Array.from(this.querySelectorAll(":scope > wds-tree-item"));
    const hasChildren = childItems.length > 0;
    const label = this.getAttribute("label") || "";
    const icon = this.getAttribute("icon");

    const row = document.createElement("div");
    row.className = "wds-tree-row";

    if (hasChildren) {
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "wds-tree-toggle";
      toggle.tabIndex = -1;
      toggle.innerHTML = '<wds-icon name="chevron-right" size="14"></wds-icon>';
      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggle();
      });
      row.appendChild(toggle);
    } else {
      const spacer = document.createElement("span");
      spacer.className = "wds-tree-toggle-spacer";
      row.appendChild(spacer);
    }

    if (icon) {
      row.innerHTML += `<wds-icon class="wds-tree-icon" name="${icon}" size="15"></wds-icon>`;
    }

    const labelEl = document.createElement("span");
    labelEl.className = "wds-tree-label";
    labelEl.textContent = label;
    row.appendChild(labelEl);

    row.addEventListener("click", () => this.select());

    const childrenWrap = document.createElement("div");
    childrenWrap.className = "wds-tree-children";
    childItems.forEach((child) => childrenWrap.appendChild(child));

    this.textContent = "";
    this.appendChild(row);
    if (hasChildren) this.appendChild(childrenWrap);

    this.setAttribute("role", "treeitem");
    this.setAttribute("aria-selected", "false");
    if (hasChildren) this.setAttribute("aria-expanded", String(this.hasAttribute("expanded")));
    this.tabIndex = -1;
    this.addEventListener("keydown", this._onKeydown);
  }

  get _tree() {
    return this.closest("wds-tree");
  }

  toggle(force) {
    if (!this.hasAttribute("aria-expanded")) return;
    const next = force ?? this.getAttribute("aria-expanded") !== "true";
    this.setAttribute("aria-expanded", String(next));
  }

  select() {
    this._tree?.querySelectorAll('wds-tree-item[aria-selected="true"]').forEach((el) => {
      if (el !== this) el.setAttribute("aria-selected", "false");
    });
    this.setAttribute("aria-selected", "true");
    this._tree?._focusItem(this);
    this.dispatchEvent(
      new CustomEvent("wds-tree-select", {
        bubbles: true,
        detail: { label: this.getAttribute("label"), item: this, expanded: this.getAttribute("aria-expanded") === "true" },
      })
    );
  }

  _onKeydown = (e) => {
    if (e.target !== this) return;
    const visible = this._tree?._visibleItems() || [];
    const idx = visible.indexOf(this);
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this._tree?._focusItem(visible[Math.min(idx + 1, visible.length - 1)]);
        break;
      case "ArrowUp":
        e.preventDefault();
        this._tree?._focusItem(visible[Math.max(idx - 1, 0)]);
        break;
      case "ArrowRight":
        e.preventDefault();
        if (this.hasAttribute("aria-expanded") && this.getAttribute("aria-expanded") !== "true") this.toggle(true);
        else this.querySelector(":scope > .wds-tree-children > wds-tree-item")?.focus();
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (this.getAttribute("aria-expanded") === "true") this.toggle(false);
        else this.parentElement?.closest("wds-tree-item")?.focus();
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        this.select();
        break;
    }
  };
}

class WdsTree extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;
    this.setAttribute("role", "tree");
    requestAnimationFrame(() => {
      const first = this._visibleItems()[0];
      if (first) first.tabIndex = 0;
    });
  }

  _visibleItems() {
    return Array.from(this.querySelectorAll("wds-tree-item")).filter((item) => this._isVisible(item));
  }

  _isVisible(item) {
    let el = item;
    while (el && el !== this) {
      const wrap = el.parentElement?.closest?.(".wds-tree-children");
      if (wrap) {
        const owner = wrap.parentElement;
        if (owner?.getAttribute("aria-expanded") !== "true") return false;
        el = owner;
      } else {
        break;
      }
    }
    return true;
  }

  _focusItem(item) {
    if (!item) return;
    this.querySelectorAll("wds-tree-item").forEach((el) => (el.tabIndex = -1));
    item.tabIndex = 0;
    item.focus();
  }
}

customElements.define("wds-tree-item", WdsTreeItem);
customElements.define("wds-tree", WdsTree);
