chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copyImageCredit",
    title: "העתק קרדיט לתמונה",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "copyImageCredit" || !tab) return;

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: buildAndCopyCredit
    });
  } catch (e) {
    console.error("יצירת הקרדיט נכשלה", e);
  }
});

// הפונקציה רצה בתוך הדף עצמו
function buildAndCopyCredit() {
  const meta = document.querySelector('meta[property="og:site_name"]');
  const siteName =
    (meta && meta.content && meta.content.trim()) ||
    location.hostname.replace(/^www\./, "");
  const title = document.title.trim();
  const date = new Date().toLocaleDateString("he");

  const siteUrl = location.origin;
  const text = `קרדיט תמונה: ${siteName} (${siteUrl}), "${title}" (נוצר בתאריך ${date})`;

  const showToast = (msg) => {
    const el = document.createElement("div");
    el.textContent = msg;
    Object.assign(el.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: "#222",
      color: "#fff",
      padding: "10px 16px",
      borderRadius: "6px",
      zIndex: "2147483647",
      font: "14px sans-serif",
      direction: "rtl"
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  };

  const fallbackCopy = () => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    showToast(ok ? "הקרדיט הועתק" : "ההעתקה נכשלה");
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => showToast("הקרדיט הועתק"))
      .catch(fallbackCopy);
  } else {
    fallbackCopy();
  }
}
