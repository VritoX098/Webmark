const listEl = document.getElementById("list");
const countEl = document.getElementById("count");
const searchEl = document.getElementById("search");

let allHighlights = [];

function getDomain(url) {
  try { return new URL(url).hostname.replace("www.", ""); }
  catch { return "unknown"; }
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return mins + "m ago";
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + "h ago";
  const days = Math.floor(hrs / 24);
  if (days < 30) return days + "d ago";
  return new Date(dateStr).toLocaleDateString();
}

function render(highlights) {
  countEl.textContent = highlights.length;

  if (!highlights.length) {
    listEl.innerHTML = `<div class="empty-state">
      <div class="icon">✏️</div>
      <p>No highlights yet.<br>Select text on any page and pick a color to save it.</p>
    </div>`;
    return;
  }

  const grouped = {};
  highlights.forEach(h => {
    const domain = getDomain(h.url);
    if (!grouped[domain]) grouped[domain] = { favicon: h.favicon, items: [] };
    grouped[domain].items.push(h);
  });

  let html = "";
  for (const [domain, group] of Object.entries(grouped)) {
    const favHtml = group.favicon
      ? `<img src="${group.favicon}" alt="">`
      : "";
    html += `<div class="site-group">
      <div class="site-header">${favHtml} ${domain}</div>`;

    group.items.forEach(h => {
      html += `<div class="highlight-card" style="--accent-color:${h.color}">
        <div class="highlight-text">${escapeHtml(h.text)}</div>
        <div class="highlight-meta">
          <span>${timeAgo(h.date)}</span>
          <span>
            <a href="${h.url}" target="_blank">${truncate(h.title || domain, 30)}</a>
            <button class="delete-btn" data-id="${h.id}" title="Delete">×</button>
          </span>
        </div>
      </div>`;
    });

    html += `</div>`;
  }

  listEl.innerHTML = html;
}

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n) + "…" : str;
}

function loadHighlights() {
  chrome.runtime.sendMessage({ type: "GET_HIGHLIGHTS" }, (data) => {
    allHighlights = data || [];
    filterAndRender();
  });
}

function filterAndRender() {
  const q = searchEl.value.toLowerCase().trim();
  const filtered = q
    ? allHighlights.filter(h =>
        h.text.toLowerCase().includes(q) ||
        (h.title || "").toLowerCase().includes(q) ||
        h.url.toLowerCase().includes(q))
    : allHighlights;
  render(filtered);
}

searchEl.addEventListener("input", filterAndRender);

listEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".delete-btn");
  if (!btn) return;
  const id = btn.dataset.id;
  chrome.runtime.sendMessage({ type: "DELETE_HIGHLIGHT", id }, () => {
    allHighlights = allHighlights.filter(h => h.id !== id);
    filterAndRender();
  });
});

document.getElementById("exportBtn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "EXPORT_HIGHLIGHTS" }, (data) => {
    if (!data || !data.length) return;
    let md = "# Webmarks Export\n\n";
    const grouped = {};
    data.forEach(h => {
      const d = getDomain(h.url);
      if (!grouped[d]) grouped[d] = [];
      grouped[d].push(h);
    });
    for (const [domain, items] of Object.entries(grouped)) {
      md += `## ${domain}\n\n`;
      items.forEach(h => {
        md += `> ${h.text}\n\n`;
        md += `— [${h.title || domain}](${h.url}) · ${new Date(h.date).toLocaleDateString()}\n\n`;
      });
    }
    const blob = new Blob([md], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "webmarks-export.md";
    a.click();                                                                                        
    URL.revokeObjectURL(a.href);                            
  });
});

document.getElementById("clearBtn").addEventListener("click", () => {
  if (confirm("Delete all highlights?")) {
    chrome.storage.local.set({ highlights: [] }, () => {
      allHighlights = [];
      filterAndRender();
    });
  }
});

loadHighlights();
