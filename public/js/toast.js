export function showToast(message, type = "info") {
  const existing = document.getElementById("wh-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "wh-toast";
  toast.className = `wh-toast wh-toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}
