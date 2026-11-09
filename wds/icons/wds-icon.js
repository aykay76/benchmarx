/**
 * WDS Icon — <wds-icon name="edit" size="16"></wds-icon>
 *
 * A tiny inline icon set covering the actions used across WDS components
 * (resource panels, tables, menus, nav). Icons are plain 24x24 stroke-based
 * line glyphs so they inherit color via currentColor and resize cleanly.
 *
 * Usage:
 *   <wds-icon name="trash-2"></wds-icon>
 *   <wds-icon name="chevron-down" size="20"></wds-icon>
 *
 * Add new icons by extending the ICONS map below — keep the same
 * viewBox="0 0 24 24", stroke="currentColor", fill="none" style so icons
 * stay visually consistent.
 */

const ICONS = {
  "plus": '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  "close": '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',
  "check": '<polyline points="5 13 10 18 19 7"/>',
  "check-circle": '<circle cx="12" cy="12" r="8.5"/><polyline points="8.5 12.5 11 15 15.5 9"/>',
  "alert-triangle": '<path d="M12 4 L21.5 20 L2.5 20 Z" stroke-linejoin="round"/><line x1="12" y1="10" x2="12" y2="14.5"/><circle cx="12" cy="17.2" r="0.6" fill="currentColor" stroke="none"/>',
  "info": '<circle cx="12" cy="12" r="8.5"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="7.7" r="0.6" fill="currentColor" stroke="none"/>',
  "edit": '<path d="M4 20 L4.7 16.6 L15.8 5.5 a1.8 1.8 0 0 1 2.6 0 l1.1 1.1 a1.8 1.8 0 0 1 0 2.6 L8.4 20.3 Z"/><line x1="14.2" y1="7.1" x2="17.9" y2="10.8"/>',
  "trash-2": '<path d="M4.5 7 L19.5 7"/><path d="M9.5 7 V4.6 a1 1 0 0 1 1 -1 h3 a1 1 0 0 1 1 1 V7"/><path d="M6.5 7 L7.3 19.2 a1.5 1.5 0 0 0 1.5 1.4 h5.4 a1.5 1.5 0 0 0 1.5 -1.4 L17.5 7"/><line x1="10.2" y1="10.8" x2="10.5" y2="16.6"/><line x1="13.8" y1="10.8" x2="13.5" y2="16.6"/>',
  "chevron-down": '<polyline points="5.5 9 12 15.5 18.5 9"/>',
  "chevron-right": '<polyline points="9 5.5 15.5 12 9 18.5"/>',
  "chevron-left": '<polyline points="15 5.5 8.5 12 15 18.5"/>',
  "more-horizontal": '<circle cx="5.5" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="18.5" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
  "search": '<circle cx="10.8" cy="10.8" r="6.3"/><line x1="15.6" y1="15.6" x2="20.5" y2="20.5"/>',
  "drag-handle": '<circle cx="9" cy="6" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="6" r="1.2" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="9" cy="18" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="18" r="1.2" fill="currentColor" stroke="none"/>',
  "folder": '<path d="M3.5 6.5 a1 1 0 0 1 1 -1 h4.4 l1.8 2 h8.3 a1 1 0 0 1 1 1 v9.5 a1 1 0 0 1 -1 1 h-14.5 a1 1 0 0 1 -1 -1 Z"/>',
  "file": '<path d="M6.5 3.5 h7.5 l4 4 v13 a1 1 0 0 1 -1 1 h-10.5 a1 1 0 0 1 -1 -1 v-16 a1 1 0 0 1 1 -1 Z"/><polyline points="14 3.5 14 7.5 18 7.5"/>',
  "home": '<path d="M4 11.5 L12 4.5 L20 11.5 V19.5 a1 1 0 0 1 -1 1 H5 a1 1 0 0 1 -1 -1 Z"/><line x1="9.5" y1="20.3" x2="9.5" y2="14" /><line x1="14.5" y1="20.3" x2="14.5" y2="14" />',
  "settings": '<circle cx="12" cy="12" r="2.8"/><path d="M12 3.5 v2.4 M12 18.1 v2.4 M20.5 12 h-2.4 M5.9 12 H3.5 M17.7 6.3 l-1.7 1.7 M8 16 l-1.7 1.7 M17.7 17.7 l-1.7 -1.7 M8 8 L6.3 6.3"/>',
  "user": '<circle cx="12" cy="8.3" r="3.3"/><path d="M4.8 20 a7.2 6 0 0 1 14.4 0"/>',
  "bell": '<path d="M6 10.5 a6 6 0 0 1 12 0 c0 4 1.4 5.5 1.4 5.5 h-14.8 s1.4 -1.5 1.4 -5.5 Z"/><path d="M10 18.8 a2 2 0 0 0 4 0"/>',
  "menu": '<line x1="4" y1="6.5" x2="20" y2="6.5"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17.5" x2="20" y2="17.5"/>',
  "external-link": '<path d="M10 6.5 H6.5 a1.2 1.2 0 0 0 -1.2 1.2 v10 a1.2 1.2 0 0 0 1.2 1.2 h10 a1.2 1.2 0 0 0 1.2 -1.2 V14"/><line x1="12" y1="12" x2="20" y2="4"/><polyline points="14.5 4 20 4 20 9.5"/>',
  "arrow-left": '<line x1="20" y1="12" x2="4" y2="12"/><polyline points="10 6 4 12 10 18"/>',
  "refresh": '<path d="M4.5 12 a7.5 7.5 0 0 1 12.6 -5.3 L19.5 9"/><polyline points="19.5 4.5 19.5 9 15 9"/><path d="M19.5 12 a7.5 7.5 0 0 1 -12.6 5.3 L4.5 15"/><polyline points="4.5 19.5 4.5 15 9 15"/>',
  "filter": '<path d="M4 5 h16 l-6 7.3 v6.2 l-4 1.8 v-8 Z" stroke-linejoin="round"/>',
  "download": '<line x1="12" y1="3.5" x2="12" y2="14.5"/><polyline points="7.5 11 12 15.5 16.5 11"/><path d="M4.5 17 v2.5 a1 1 0 0 0 1 1 h13 a1 1 0 0 0 1 -1 V17"/>',
  "upload": '<line x1="12" y1="15.5" x2="12" y2="4.5"/><polyline points="7.5 8.5 12 4 16.5 8.5"/><path d="M4.5 17 v2.5 a1 1 0 0 0 1 1 h13 a1 1 0 0 0 1 -1 V17"/>',
  "grip-vertical": '<circle cx="9" cy="6" r="1.2" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="9" cy="18" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="6" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="18" r="1.2" fill="currentColor" stroke="none"/>',
  "x-circle": '<circle cx="12" cy="12" r="8.5"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/>',
  "arrow-up-right": '<line x1="7" y1="17" x2="17" y2="7"/><polyline points="8.5 7 17 7 17 15.5"/>',
  "arrow-down-right": '<line x1="7" y1="7" x2="17" y2="17"/><polyline points="17 8.5 17 17 8.5 17"/>',
};

class WdsIcon extends HTMLElement {
  static get observedAttributes() {
    return ["name", "size"];
  }

  connectedCallback() {
    this._render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this._render();
  }

  _render() {
    const name = this.getAttribute("name");
    const size = this.getAttribute("size") || "16";
    const inner = ICONS[name] || "";
    if (!inner) {
      console.warn(`[wds-icon] unknown icon name "${name}"`);
    }
    this.setAttribute("role", "img");
    this.setAttribute("aria-hidden", this.hasAttribute("label") ? "false" : "true");
    if (this.hasAttribute("label")) {
      this.setAttribute("aria-label", this.getAttribute("label"));
    }
    this.innerHTML =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" ` +
      `fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="wds-icon-svg">${inner}</svg>`;
  }
}

customElements.define("wds-icon", WdsIcon);

export { ICONS };
