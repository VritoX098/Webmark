(() => {
  let tooltip = null;

  const COLORS = ["#F5CE6E", "#A8D8B9", "#F4A4A4", "#A4C8F4", "#D4A4F4"];

  function createTooltip() {
    if (tooltip) return tooltip;
    tooltip = document.createElement("div");
    tooltip.className = "webmarks-tooltip";
    tooltip.innerHTML = COLORS.map(c =>
      `<button class="webmarks-color-btn" data-color="${c}" style="background:${c}"></button>`
    ).join("");
    document.body.appendChild(tooltip);

    tooltip.addEventListener("click", (e) => {
      const btn = e.target.closest(".webmarks-color-btn");
      if (!btn) return;
      const color = btn.dataset.color;
      const sel = window.getSelection();
      const text = sel.toString().trim();
      if (!text) return;

      chrome.runtime.sendMessage({ type: "SAVE_HIGHLIGHT", text, color }, () => {
        showToast("Saved to Webmarks");
        hideTooltip();
      });
    });

    return tooltip;
  }

  function showTooltip(x, y) {
    const t = createTooltip();
    t.style.left = x + "px";
    t.style.top = (y - 44) + "px";
    t.classList.add("webmarks-visible");
  }

  function hideTooltip() {
    if (tooltip) tooltip.classList.remove("webmarks-visible");
  }

  function showToast(msg) {
    const toast = document.createElement("div");
    toast.className = "webmarks-toast";
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("webmarks-toast-visible"));
    setTimeout(() => {
      toast.classList.remove("webmarks-toast-visible");
      setTimeout(() => toast.remove(), 300);
    }, 1800);
  }

  document.addEventListener("mouseup", (e) => {
    setTimeout(() => {
      const sel = window.getSelection();
      const text = sel.toString().trim();
      if (text.length > 2 && !e.target.closest(".webmarks-tooltip")) {
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        showTooltip(
          rect.left + rect.width / 2 - 70 + window.scrollX,
          rect.top + window.scrollY
        );
      } else if (!e.target.closest(".webmarks-tooltip")) {
        hideTooltip();
      }
    }, 10);
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "HIGHLIGHT_SAVED") showToast("Saved to Webmarks");
  });
})();
