(function () {
  function applyTheme(theme) {
    document.documentElement.classList.toggle("dark-mode", theme === "dark");
    const btn = document.getElementById("theme-toggle-btn");
    if (btn) btn.textContent = theme === "dark" ? "☀️" : "🌙";
  }

  const saved = localStorage.getItem("theme") || "light";
  applyTheme(saved);

  const btn = document.createElement("button");
  btn.id = "theme-toggle-btn";
  btn.className = "theme-toggle-btn";
  btn.title = "Toggle dark mode";
  btn.textContent = saved === "dark" ? "☀️" : "🌙";
  btn.addEventListener("click", () => {
    const current = document.documentElement.classList.contains("dark-mode") ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
  });
  document.body.appendChild(btn);
})();
