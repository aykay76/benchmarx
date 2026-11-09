/**
 * WDS Table enhancer — <wds-table> progressively enhances a real <table class="wds-table">
 * child with sortable headers and row selection. It renders light DOM (the table
 * itself), so accessibility and styling behave exactly like a normal table.
 *
 * Sorting:
 *   <th data-sortable data-sort-key="name">Name</th>
 *   Cells can override the compared value with data-sort-value="…".
 *   Emits "wds-sort" (detail: { key, direction }) — client-side reorder happens
 *   automatically for rows currently in the DOM; for server-side paging, listen
 *   for the event and re-fetch instead.
 *
 * Selection:
 *   <th class="wds-table-select-col"><input type="checkbox" data-select-all></th>
 *   <tr data-row-id="…"><td class="wds-table-select-col"><input type="checkbox" data-select></td>
 *   Emits "wds-selection-change" (detail: { selected: string[] })
 */

class WdsTable extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;

    this._table = this.querySelector("table");
    if (!this._table) return;
    this._selected = new Set();

    this._table.querySelectorAll("th[data-sortable]").forEach((th) => {
      const label = document.createElement("button");
      label.type = "button";
      label.className = "wds-table-sort-btn";
      label.innerHTML = `<span>${th.textContent.trim()}</span><wds-icon class="wds-table-sort-icon" name="chevron-down" size="14"></wds-icon>`;
      th.textContent = "";
      th.appendChild(label);
      th.setAttribute("aria-sort", "none");
      label.addEventListener("click", () => this._sortBy(th));
    });

    const selectAll = this._table.querySelector("[data-select-all]");
    if (selectAll) {
      selectAll.addEventListener("change", () => {
        this._table.querySelectorAll("tbody tr[data-row-id]").forEach((tr) => {
          this._setRowSelected(tr, selectAll.checked);
        });
        this._emitSelection();
      });
    }

    this._table.querySelectorAll("tbody tr[data-row-id] [data-select]").forEach((cb) => {
      cb.addEventListener("change", () => {
        this._setRowSelected(cb.closest("tr"), cb.checked);
        this._emitSelection();
      });
    });
  }

  _setRowSelected(tr, isSelected) {
    const id = tr.getAttribute("data-row-id");
    const cb = tr.querySelector("[data-select]");
    if (cb) cb.checked = isSelected;
    tr.setAttribute("data-selected", String(isSelected));
    if (isSelected) this._selected.add(id);
    else this._selected.delete(id);
  }

  _emitSelection() {
    this.dispatchEvent(
      new CustomEvent("wds-selection-change", { detail: { selected: Array.from(this._selected) } })
    );
  }

  _sortBy(th) {
    const key = th.getAttribute("data-sort-key");
    const index = Array.from(th.parentElement.children).indexOf(th);
    const current = th.getAttribute("aria-sort");
    const direction = current === "ascending" ? "descending" : "ascending";

    th.parentElement.querySelectorAll("th[aria-sort]").forEach((h) => h.setAttribute("aria-sort", "none"));
    th.setAttribute("aria-sort", direction);

    const tbody = this._table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const dir = direction === "ascending" ? 1 : -1;

    rows.sort((a, b) => {
      const av = a.children[index]?.getAttribute("data-sort-value") ?? a.children[index]?.textContent.trim() ?? "";
      const bv = b.children[index]?.getAttribute("data-sort-value") ?? b.children[index]?.textContent.trim() ?? "";
      const an = Number(av);
      const bn = Number(bv);
      if (!Number.isNaN(an) && !Number.isNaN(bn) && av !== "" && bv !== "") return (an - bn) * dir;
      return av.localeCompare(bv) * dir;
    });

    rows.forEach((row) => tbody.appendChild(row));
    this.dispatchEvent(new CustomEvent("wds-sort", { detail: { key, direction } }));
  }
}

customElements.define("wds-table", WdsTable);
