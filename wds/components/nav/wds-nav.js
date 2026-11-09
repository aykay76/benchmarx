/**
 * WDS Nav — mobile sidenav toggle behavior for the .wds-app-shell layout.
 *
 * Usage:
 *   <div class="wds-app-shell" id="shell">
 *     <nav class="wds-navbar">
 *       <button class="wds-sidenav-toggle wds-btn wds-btn--ghost wds-btn--icon" data-wds-nav-toggle>
 *         <wds-icon name="menu"></wds-icon>
 *       </button>
 *       …
 *     </nav>
 *     <aside class="wds-sidenav">…</aside>
 *     <main class="wds-app-main">…</main>
 *   </div>
 *
 * Any [data-wds-nav-toggle] button toggles the nearest .wds-app-shell's
 * [data-wds-nav-open] attribute. Clicking the overlay backdrop (outside the
 * sidenav while open, on mobile) closes it again.
 */

document.addEventListener("click", (e) => {
  const toggle = e.target.closest("[data-wds-nav-toggle]");
  if (toggle) {
    const shell = toggle.closest(".wds-app-shell");
    if (shell) shell.toggleAttribute("data-wds-nav-open");
    return;
  }

  const shell = document.querySelector(".wds-app-shell[data-wds-nav-open]");
  if (shell && !e.target.closest(".wds-sidenav") && !e.target.closest("[data-wds-nav-toggle]")) {
    shell.removeAttribute("data-wds-nav-open");
  }
});
