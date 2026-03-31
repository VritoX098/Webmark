chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-highlight",
    title: "Save highlight to Webmarks",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save-highlight" && info.selectionText) {
    const highlight = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      text: info.selectionText,
      url: tab.url,
      title: tab.title,
      favicon: tab.favIconUrl || "",
      date: new Date().toISOString(),
      color: "#F5CE6E"
    };

    chrome.storage.local.get({ highlights: [] }, (data) => {
      data.highlights.unshift(highlight);
      chrome.storage.local.set({ highlights: data.highlights }, () => {
        chrome.tabs.sendMessage(tab.id, { type: "HIGHLIGHT_SAVED" });
      });
    });
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "SAVE_HIGHLIGHT") {
    const highlight = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      text: msg.text,
      url: sender.tab.url,
      title: sender.tab.title,
      favicon: sender.tab.favIconUrl || "",
      date: new Date().toISOString(),
      color: msg.color || "#F5CE6E"
    };

    chrome.storage.local.get({ highlights: [] }, (data) => {
      data.highlights.unshift(highlight);
      chrome.storage.local.set({ highlights: data.highlights }, () => {
        sendResponse({ success: true });
      });
    });
    return true;
  }

  if (msg.type === "GET_HIGHLIGHTS") {
    chrome.storage.local.get({ highlights: [] }, (data) => {
      sendResponse(data.highlights);
    });
    return true;
  }

  if (msg.type === "DELETE_HIGHLIGHT") {
    chrome.storage.local.get({ highlights: [] }, (data) => {
      data.highlights = data.highlights.filter(h => h.id !== msg.id);
      chrome.storage.local.set({ highlights: data.highlights }, () => {
        sendResponse({ success: true });
      });
    });
    return true;
  }

  if (msg.type === "EXPORT_HIGHLIGHTS") {
    chrome.storage.local.get({ highlights: [] }, (data) => {
      sendResponse(data.highlights);
    });
    return true;
  }
});
