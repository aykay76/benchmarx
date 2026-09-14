document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const toggle = document.querySelector(".theme-toggle");
  const icon = document.querySelector(".theme-icon");
  const year = document.querySelector("#current-year");
  const savedTheme = localStorage.getItem("benchmarx-theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    localStorage.setItem("benchmarx-theme", theme);
    toggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
    icon.textContent = theme === "dark" ? "☼" : "☾";
  };

  setTheme(savedTheme || (prefersLight ? "light" : "dark"));
  toggle.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });
  year.textContent = new Date().getFullYear();
});
