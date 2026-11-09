/**
 * WDS — single JS entry point. Registers every WDS custom element and
 * exposes the `WDS` global for imperative APIs (toast, confirm, theme).
 *
 * Load as a module (order matters relative to nothing — components self-register):
 *   <script type="module" src="/wds/wds.js"></script>
 *
 * IMPORTANT: must be loaded as type="module" (or otherwise deferred). Several
 * components read their light-DOM children in connectedCallback and assume
 * the document has already finished parsing.
 */

import "./icons/wds-icon.js";
import "./components/modal/wds-modal.js";
import "./components/drawer/wds-drawer.js";
import "./components/toast/wds-toast.js";
import "./components/accordion/wds-accordion.js";
import "./components/tabs/wds-tabs.js";
import "./components/menu/wds-menu.js";
import "./components/table/wds-table.js";
import "./components/tree/wds-tree.js";
import "./components/pagination/wds-pagination.js";
import "./components/resource-panel/wds-resource-panel.js";
import "./components/nav/wds-nav.js";

import { toast } from "./components/toast/wds-toast.js";
import { confirm } from "./components/confirm/wds-confirm.js";

const THEME_KEY = "wds-theme";

const theme = {
  get() {
    return document.documentElement.getAttribute("data-wds-theme") || localStorage.getItem(THEME_KEY) || "auto";
  },
  set(mode) {
    if (mode === "auto") {
      document.documentElement.removeAttribute("data-wds-theme");
      localStorage.removeItem(THEME_KEY);
    } else {
      document.documentElement.setAttribute("data-wds-theme", mode);
      localStorage.setItem(THEME_KEY, mode);
    }
  },
  toggle() {
    const current = this.get();
    const isDark =
      current === "dark" || (current === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    this.set(isDark ? "light" : "dark");
  },
  init() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) document.documentElement.setAttribute("data-wds-theme", saved);
  },
};

theme.init();

window.WDS = { toast, confirm, theme };

export { toast, confirm, theme };
