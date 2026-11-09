import { theme } from "/wds/wds.js";

const root = document.documentElement;
const toggle = document.querySelector("#theme-toggle");
const icon = document.querySelector("#theme-icon");
const savedTheme = localStorage.getItem("benchmarx-theme") || localStorage.getItem("wds-theme");

const setTheme = (mode) => {
  theme.set(mode);
  toggle.setAttribute("aria-label", `Switch to ${mode === "dark" ? "light" : "dark"} theme`);
  icon.textContent = mode === "dark" ? "☼" : "☾";
};

setTheme(savedTheme === "dark" ? "dark" : "light");
toggle.addEventListener("click", () => {
  const mode = root.dataset.wdsTheme === "dark" ? "light" : "dark";
  setTheme(mode);
  localStorage.setItem("benchmarx-theme", mode);
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
