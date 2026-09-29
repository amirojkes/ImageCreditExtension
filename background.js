chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copyImageCredit",
    title: "Copy image credit",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "copyImageCredit" || !tab) return;

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: buildAndCopyCredit,
      args: [info.srcUrl || ""]
    });
  } catch (e) {
    console.error("Image Credit: could not build the credit", e);
  }
});

// This function runs inside the page itself, so it must be fully self contained
function buildAndCopyCredit(srcUrl) {
  const clean = (t) => (t || "").replace(/\s+/g, " ").trim();
  const normalize = (u) => {
    try {
      return new URL(u, location.href).href;
    } catch (e) {
      return u;
    }
  };

  // Site details
  const meta = document.querySelector('meta[property="og:site_name"]');
  const siteName =
    (meta && meta.content && meta.content.trim()) ||
    location.hostname.replace(/^www\./, "");
  const siteUrl = location.origin;
  const title = document.title.trim();

  // Page language: decided by the letters in the title, then by the lang attribute
  const hebrewLetters = (title.match(/[\u0590-\u05FF]/g) || []).length;
  const latinLetters = (title.match(/[A-Za-z]/g) || []).length;
  const htmlLang = (document.documentElement.lang || "").toLowerCase();
  let isHebrew;
  if (hebrewLetters !== latinLetters) {
    isHebrew = hebrewLetters > latinLetters;
  } else {
    isHebrew = /^(he|iw)/.test(htmlLang);
  }

  const now = new Date();
  const date = isHebrew
    ? now.toLocaleDateString("he")
    : now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  // Find the image that was clicked
  const target = normalize(srcUrl);
  const matches = Array.from(document.images).filter((img) => {
    const singles = [
      img.currentSrc,
      img.src,
      img.getAttribute("data-src"),
      img.getAttribute("data-lazy-src")
    ];
    if (singles.some((s) => s && normalize(s) === target)) return true;
    const set = img.getAttribute("srcset") || img.getAttribute("data-srcset") || "";
    return set.split(",").some((p) => {
      const u = p.trim().split(/\s+/)[0];
      return u && normalize(u) === target;
    });
  });

  // Extract the photographer or creator
  const stripLabel = (t) =>
    t.replace(/^(?:צילום|קרדיט|photo(?:graph)?|image|credit)\s*[:：]\s*/i, "").trim();

  const creditFromText = (text) => {
    if (!text) return "";
    let m = text.match(
      /(?:צילום|קרדיט|photo(?:graph)?|image|credit)\s*[:：]\s*([^\n]{2,120}?)\s*$/i
    );
    if (m) return m[1].trim();
    m = text.match(/(?:©|\(c\))\s*([^\n]{2,120}?)\s*$/i);
    if (m) return m[1].trim();
    m = text.match(/\bphoto(?:graph)?\s+by\s+([^.()\n]{2,120}?)\s*$/i);
    if (m) return m[1].trim();
    m = text.match(/\(([^()]{2,120})\)\s*$/);
    return m ? m[1].trim() : "";
  };

  const CREDIT_SEL =
    '[class*="credit" i], [class*="photographer" i], [itemprop="creator"], [aria-label*="credit" i]';
  const CAPTION_SEL = 'figcaption, [class*="caption" i], [aria-label*="caption" i]';

  const creditFromImage = (img) => {
    // Surrounding containers that hold this one image only, nearest first (up to 5 levels),
    // so that the credit of another image is never attached by mistake
    const scopes = [];
    let el = img.parentElement;
    for (let depth = 0; el && depth < 5; depth++, el = el.parentElement) {
      if (/^(BODY|HTML|MAIN|ARTICLE)$/.test(el.tagName)) break;
      if (el.querySelectorAll("img").length !== 1) break;
      scopes.push(el);
    }

    // A dedicated credit element. Wrappers that contain another credit element are skipped
    for (const scope of scopes) {
      const els = Array.from(scope.querySelectorAll(CREDIT_SEL)).filter(
        (e) => !e.querySelector(CREDIT_SEL)
      );
      for (const e of els) {
        const t = stripLabel(clean(e.textContent));
        if (t && t.length < 120) return t;
      }
    }

    // Captions: a figcaption can sit inside a figure, inside a picture, or in another wrapper
    const texts = [];
    const fig = img.closest("figure");
    for (const scope of [fig, ...scopes]) {
      if (!scope) continue;
      scope.querySelectorAll(CAPTION_SEL).forEach((c) => texts.push(clean(c.textContent)));
    }
    texts.push(clean(img.title), clean(img.alt));

    for (const t of texts) {
      const c = creditFromText(t);
      if (c) return c;
    }
    return "";
  };

  let credit = "";
  for (const img of matches) {
    credit = creditFromImage(img);
    if (credit) break;
  }

  console.log("[ImageCredit]", { srcUrl, matchedImages: matches.length, credit, language: isHebrew ? "he" : "en" });

  const creditPart = credit ? `${credit}, ` : "";
  const text = isHebrew
    ? `קרדיט תמונה: ${creditPart}${siteName} (${siteUrl}), "${title}" (תועד בתאריך ${date})`
    : `Image credit: ${creditPart}${siteName} (${siteUrl}), "${title}" (documented on ${date})`;
  const doneMsg = credit ? "Credit copied" : "Credit copied (no photographer or creator found)";

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
      direction: "ltr"
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
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
    showToast(ok ? doneMsg : "Copy failed");
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => showToast(doneMsg))
      .catch(fallbackCopy);
  } else {
    fallbackCopy();
  }
}
