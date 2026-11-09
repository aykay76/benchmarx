/**
 * WDS Tabs — <wds-tabs> auto-builds a tablist from its <wds-tab label="…"> children.
 *
 * Usage:
 *   <wds-tabs>
 *     <wds-tab label="Details" active>…</wds-tab>
 *     <wds-tab label="Activity">…</wds-tab>
 *     <wds-tab label="Permissions">…</wds-tab>
 *   </wds-tabs>
 *
 * Events: wds-tab-change (detail: { index })
 */

class WdsTabs extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;

    const tabs = Array.from(this.querySelectorAll(":scope > wds-tab"));
    const tablist = document.createElement("div");
    tablist.className = "wds-tablist";
    tablist.setAttribute("role", "tablist");

    let activeIndex = tabs.findIndex((t) => t.hasAttribute("active"));
    if (activeIndex === -1) activeIndex = 0;

    this._buttons = tabs.map((tab, index) => {
      const id = `wds-tab-${Math.random().toString(36).slice(2, 9)}`;
      tab.id = tab.id || id;
      tab.setAttribute("role", "tabpanel");
      tab.hidden = index !== activeIndex;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "wds-tab-trigger";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", String(index === activeIndex));
      btn.setAttribute("aria-controls", tab.id);
      btn.textContent = tab.getAttribute("label") || `Tab ${index + 1}`;
      btn.addEventListener("click", () => this.select(index));
      tablist.appendChild(btn);
      return btn;
    });

    this._tabs = tabs;
    this.prepend(tablist);
  }

  select(index) {
    this._tabs.forEach((tab, i) => {
      tab.hidden = i !== index;
      this._buttons[i].setAttribute("aria-selected", String(i === index));
    });
    this.dispatchEvent(new CustomEvent("wds-tab-change", { detail: { index } }));
  }
}

class WdsTab extends HTMLElement {}

customElements.define("wds-tab", WdsTab);
customElements.define("wds-tabs", WdsTabs);
