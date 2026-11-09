/**
 * WDS Confirm — imperative confirmation dialog built on <wds-modal>.
 * Use for destructive actions (delete, revoke, etc.) instead of native confirm().
 *
 *   const ok = await WDS.confirm({
 *     title: "Delete environment?",
 *     message: "This will permanently delete “prod-eu” and cannot be undone.",
 *     confirmLabel: "Delete",
 *     danger: true,
 *   });
 *   if (ok) { ...perform delete... }
 */

import "../modal/wds-modal.js";

export function confirm({
  title = "Are you sure?",
  message = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
} = {}) {
  return new Promise((resolve) => {
    const modal = document.createElement("wds-modal");
    modal.setAttribute("size", "sm");
    modal.setAttribute("heading", title);

    const body = document.createElement("p");
    body.className = "wds-text-muted wds-text-sm";
    body.textContent = message;
    modal.appendChild(body);

    const footer = document.createElement("div");
    footer.slot = "footer";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "wds-btn wds-btn--secondary";
    cancelBtn.textContent = cancelLabel;

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = danger ? "wds-btn wds-btn--danger" : "wds-btn wds-btn--primary";
    confirmBtn.textContent = confirmLabel;

    footer.append(cancelBtn, confirmBtn);
    modal.appendChild(footer);
    document.body.appendChild(modal);

    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
      modal.close("api");
    };

    cancelBtn.addEventListener("click", () => finish(false));
    confirmBtn.addEventListener("click", () => finish(true));
    modal.addEventListener("wds-close", () => {
      if (!settled) resolve(false);
      modal.remove();
    });

    requestAnimationFrame(() => {
      modal.open();
      confirmBtn.focus();
    });
  });
}
