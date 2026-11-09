/**
 * WDS Resource Panel — <wds-resource-panel> is the standard shell for a single
 * resource's detail view: heading + status badge, standardized Edit / overflow
 * (⋯ Delete) actions, a content body, and a meta footer. Every resource detail
 * screen in the app should use this instead of a bespoke header/card layout,
 * so Edit/Delete always look and behave the same way.
 *
 * Usage:
 *   <wds-resource-panel
 *     heading="prod-eu"
 *     subheading="Environment · env_8f3ac1"
 *     status="Active" status-variant="success">
 *
 *     <dl class="wds-detail-list">
 *       <div class="wds-detail-row"><dt>Region</dt><dd>eu-west-1</dd></div>
 *       <div class="wds-detail-row"><dt>Owner</dt><dd>platform-team</dd></div>
 *     </dl>
 *
 *     <wds-menu-item slot="actions" value="duplicate">Duplicate</wds-menu-item>
 *     <span slot="footer">Created by Jane Doe on 12 Mar 2025</span>
 *   </wds-resource-panel>
 *
 * Attributes:
 *   heading, subheading, status, status-variant (neutral|success|warning|danger|info|brand)
 *   no-edit           — hide the Edit button
 *   no-delete         — hide the built-in Delete menu item
 *   delete-confirm-title, delete-confirm-message — customize the confirm dialog copy
 *
 * Events:
 *   wds-edit    — Edit button clicked
 *   wds-delete  — user confirmed deletion (confirm dialog already shown)
 *   wds-action  — any custom slot="actions" menu item selected (detail: { value })
 */

import "../menu/wds-menu.js";
import "../../icons/wds-icon.js";
import { confirm } from "../confirm/wds-confirm.js";

class WdsResourcePanel extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;

    const footerNodes = Array.from(this.querySelectorAll(':scope > [slot="footer"]'));
    const actionNodes = Array.from(this.querySelectorAll(':scope > [slot="actions"]'));
    const bodyNodes = Array.from(this.childNodes).filter(
      (n) => !footerNodes.includes(n) && !actionNodes.includes(n)
    );

    const heading = this.getAttribute("heading") || "";
    const subheading = this.getAttribute("subheading");
    const status = this.getAttribute("status");
    const statusVariant = this.getAttribute("status-variant") || "neutral";
    const showEdit = !this.hasAttribute("no-edit");
    const showDelete = !this.hasAttribute("no-delete");

    const header = document.createElement("div");
    header.className = "wds-resource-panel-header";
    header.innerHTML = `
      <div class="wds-resource-panel-heading-group">
        <div class="wds-resource-panel-title-row">
          <h2 class="wds-resource-panel-title"></h2>
          ${status ? `<span class="wds-badge wds-badge--${statusVariant}"></span>` : ""}
        </div>
        ${subheading ? `<div class="wds-resource-panel-subheading"></div>` : ""}
      </div>
      <div class="wds-resource-panel-actions"></div>
    `;
    header.querySelector(".wds-resource-panel-title").textContent = heading;
    if (status) header.querySelector(".wds-badge").textContent = status;
    if (subheading) header.querySelector(".wds-resource-panel-subheading").textContent = subheading;

    const actions = header.querySelector(".wds-resource-panel-actions");
    if (showEdit) {
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "wds-btn wds-btn--secondary wds-btn--sm";
      editBtn.innerHTML = '<wds-icon name="edit" size="14"></wds-icon><span>Edit</span>';
      editBtn.addEventListener("click", () => this.dispatchEvent(new CustomEvent("wds-edit", { bubbles: true })));
      actions.appendChild(editBtn);
    }

    if (actionNodes.length || showDelete) {
      const menu = document.createElement("wds-menu-button");
      actionNodes.forEach((node) => menu.appendChild(node));
      if (actionNodes.length && showDelete) {
        const sep = document.createElement("wds-menu-separator");
        menu.appendChild(sep);
      }
      if (showDelete) {
        const deleteItem = document.createElement("wds-menu-item");
        deleteItem.setAttribute("value", "delete");
        deleteItem.setAttribute("danger", "");
        deleteItem.textContent = "Delete";
        menu.appendChild(deleteItem);
      }
      menu.addEventListener("wds-select", (e) => this._onSelect(e.detail.value));
      actions.appendChild(menu);
    }

    const body = document.createElement("div");
    body.className = "wds-resource-panel-body";
    bodyNodes.forEach((n) => body.appendChild(n));

    const footer = document.createElement("div");
    footer.className = "wds-resource-panel-footer";
    footerNodes.forEach((n) => footer.appendChild(n));

    this.textContent = "";
    this.appendChild(header);
    this.appendChild(body);
    this.appendChild(footer);
  }

  async _onSelect(value) {
    if (value === "delete") {
      const ok = await confirm({
        title: this.getAttribute("delete-confirm-title") || `Delete ${this.getAttribute("heading") || "this resource"}?`,
        message:
          this.getAttribute("delete-confirm-message") ||
          "This action cannot be undone.",
        confirmLabel: "Delete",
        danger: true,
      });
      if (ok) this.dispatchEvent(new CustomEvent("wds-delete", { bubbles: true }));
      return;
    }
    this.dispatchEvent(new CustomEvent("wds-action", { bubbles: true, detail: { value } }));
  }
}

customElements.define("wds-resource-panel", WdsResourcePanel);
