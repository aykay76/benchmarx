/**
 * WDS Pagination — <wds-pagination total-items="134" page-size="20" page="1">
 * Renders Prev/Next + numbered page buttons with ellipsis for large ranges.
 *
 * Events: wds-page-change (detail: { page })
 */

class WdsPagination extends HTMLElement {
  static get observedAttributes() {
    return ["total-items", "page-size", "page"];
  }

  connectedCallback() {
    this._render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this._render();
  }

  get page() {
    return Number(this.getAttribute("page") || 1);
  }

  get pageSize() {
    return Number(this.getAttribute("page-size") || 20);
  }

  get totalItems() {
    return Number(this.getAttribute("total-items") || 0);
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  _goTo(page) {
    const clamped = Math.min(Math.max(1, page), this.totalPages);
    if (clamped === this.page) return;
    this.setAttribute("page", String(clamped));
    this.dispatchEvent(new CustomEvent("wds-page-change", { detail: { page: clamped } }));
  }

  _pageNumbers() {
    const total = this.totalPages;
    const current = this.page;
    const pages = new Set([1, total, current, current - 1, current + 1]);
    return Array.from(pages)
      .filter((p) => p >= 1 && p <= total)
      .sort((a, b) => a - b);
  }

  _render() {
    const total = this.totalPages;
    const current = this.page;
    const start = this.totalItems === 0 ? 0 : (current - 1) * this.pageSize + 1;
    const end = Math.min(current * this.pageSize, this.totalItems);

    const pageBtns = [];
    let prev = 0;
    for (const p of this._pageNumbers()) {
      if (prev && p - prev > 1) pageBtns.push(`<span class="wds-pagination-ellipsis">…</span>`);
      pageBtns.push(
        `<button type="button" class="wds-pagination-btn" data-page="${p}" ${p === current ? 'aria-current="page"' : ""}>${p}</button>`
      );
      prev = p;
    }

    this.innerHTML = `
      <nav class="wds-pagination" aria-label="Pagination">
        <span class="wds-pagination-info">${this.totalItems ? `${start}–${end} of ${this.totalItems}` : "No results"}</span>
        <div class="wds-pagination-controls">
          <button type="button" class="wds-pagination-btn" data-page="${current - 1}" ${current <= 1 ? "disabled" : ""} aria-label="Previous page">
            <wds-icon name="chevron-left" size="16"></wds-icon>
          </button>
          ${pageBtns.join("")}
          <button type="button" class="wds-pagination-btn" data-page="${current + 1}" ${current >= total ? "disabled" : ""} aria-label="Next page">
            <wds-icon name="chevron-right" size="16"></wds-icon>
          </button>
        </div>
      </nav>
    `;

    this.querySelectorAll("[data-page]").forEach((btn) => {
      btn.addEventListener("click", () => this._goTo(Number(btn.getAttribute("data-page"))));
    });
  }
}

customElements.define("wds-pagination", WdsPagination);
