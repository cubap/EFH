// Scrape the Shadowdark homebrew Google Site into a committed data.json.
// Run: node scrape-rules.js
//
// The site has two kinds of class pages:
//   - TEXT pages: real DOM text (headings, paragraphs, lists)
//   - IMAGE pages: a single scanned parchment image (no DOM text)
// This script detects each page's type and extracts accordingly.
// Text pages -> ordered blocks in data.json
// Image pages -> downloaded to images/rules/<slug>.png, path stored in data.json
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = "https://sites.google.com/view/sd-homebrew-edition";
const HOME = `${BASE}/home`;
const OUT = path.resolve(__dirname, "data.json");
const IMG_DIR = path.resolve(__dirname, "images", "rules");

// Extract ordered content blocks from the main content area, excluding nav chrome.
const EXTRACT_TEXT = (base) => {
  const main =
    document.querySelector(".KjwYKd") ||
    document.querySelector("main") ||
    document.querySelector(".YrVfcd") ||
    document.body;

  const inChrome = node =>
    node.closest("nav, header, footer, [role='navigation']") !== null;

  const blocks = [];
  const seen = new Set();
  const push = (type, text, level) => {
    const clean = text.replace(/\s+/g, " ").trim();
    if (!clean) return;
    const key = `${type}:${level ?? ""}:${clean}`;
    if (seen.has(key)) return;
    seen.add(key);
    blocks.push(level !== undefined ? { type, text: clean, level } : { type, text: clean });
  };

  const walker = document.createTreeWalker(main, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (inChrome(node)) return NodeFilter.FILTER_REJECT;
      const tag = node.tagName;
      if (/^H[1-6]$/.test(tag)) return NodeFilter.FILTER_ACCEPT;
      if (tag === "P") return NodeFilter.FILTER_ACCEPT;
      if (tag === "LI") return NodeFilter.FILTER_ACCEPT;
      return NodeFilter.FILTER_SKIP;
    }
  });

  let node;
  while ((node = walker.nextNode())) {
    const tag = node.tagName;
    if (/^H[1-6]$/.test(tag)) push("heading", node.textContent, Number(tag[1]));
    else if (tag === "P") push("paragraph", node.textContent);
    else if (tag === "LI") push("listitem", node.textContent);
  }

  // Collect nav links for page discovery.
  const links = [...document.querySelectorAll("a[href]")].map(a => a.href);
  const pageLinks = [...new Set(links.filter(h => h.startsWith(base)))];
  return { blocks, pageLinks };
};

// Vision transcriptions of the scanned parchment class pages (no DOM text).
// These are merged into data.json so the rules page can render them as text.
const TRANSCRIPTIONS = {
  "warrior/paladin": [
    { type: "heading", text: "Paladin (Divine Warrior)", level: 2 },
    { type: "paragraph", text: "The Paladin represents the Divine Warrior: a champion of conviction who fights through faith, oath, and sacred purpose. Their strength comes not from instinct or training alone, but from belief made manifest, making them the most principled and resolute expression of martial power." },
    { type: "paragraph", text: "This class originates from Cursed Scroll #1: The Lost Citadel, a Shadowdark expansion module. The full class is not reprinted here, but it is available in that publication or for free on the Shadowdarklings website. See link below." }
  ],
  "warrior/kinetic": [
    { type: "heading", text: "Kinetic (Inner Warrior)", level: 2 },
    { type: "paragraph", text: "The Kinetic represents the Inner Warrior: a combatant who shapes reality through force of will, channeling raw energy into physical impact. Their strength comes from internal power made external, making them the most direct and overwhelming expression of martial force." },
    { type: "paragraph", text: "This class originates from Cursed Scroll #1: The Lost Citadel, a Shadowdark expansion module. The full class is not reprinted here, but it is available in that publication or for free on the Shadowdarklings website. See link below." },
    { type: "heading", text: "Kinetic Surge", level: 3 },
    { type: "paragraph", text: "You have one surge at the start of combat. Declare the surge after you hit with an attack, before rolling damage. If your surge is +1 damage and half your level to those rolls (round down). Regain your surge when you roll a natural 20 in combat or use your defensive field." }
  ],
  "adept/monk": [
    { type: "heading", text: "Monk (Divine Adept)", level: 2 },
    { type: "paragraph", text: "The Monk represents the Divine Adept: a disciplined practitioner who channels spiritual power through body and mind. Their strength comes from inner mastery and sacred training, making them the most focused and self-reliant expression of adept skill." },
    { type: "paragraph", text: "This class originates from Cursed Scroll #1: The Lost Citadel, a Shadowdark expansion module. The full class is not reprinted here, but it is available in that publication or for free on the Shadowdarklings website. See link below." },
    { type: "heading", text: "Ki Mastery", level: 3 },
    { type: "paragraph", text: "You can cast the following spells with Wisdom as your spellcasting ability: Cure Wounds, Holy Weapon (self), Protection From Evil (self), and Shield of Faith. You do not need to prepare these spells; they are always available to you." }
  ],
  "adept/soulknife": [
    { type: "heading", text: "Soulknife (Inner Adept)", level: 2 },
    { type: "paragraph", text: "The Soulknife represents the Inner Adept: a combatant who shapes reality through the mind itself, manifesting psychic energy into tangible force. Their strength comes from mental dominance and inner power, making them the most direct and overwhelming expression of adept skill." },
    { type: "paragraph", text: "This class originates from Cursed Scroll #1: The Lost Citadel, a Shadowdark expansion module. The full class is not reprinted here, but it is available in that publication or for free on the Shadowdarklings website. See link below." },
    { type: "heading", text: "Detect Intent", level: 3 },
    { type: "paragraph", text: "Open your mind to nearby intentions. Make a WIS check. On success the focus lasts 5 rounds. On failure the action is wasted and you cannot use it again until rest. On natural 20, duration is doubled and you gain +2 to your next attack roll or ability check." }
  ],
  "mage/sorcerer": [
    { type: "heading", text: "Sorcerer (Primal Mage)", level: 2 },
    { type: "paragraph", text: "The Sorcerer represents the Primal Mage: a conduit of raw elemental power who shapes reality through instinct and force of will. Their strength comes from channeling primal energy, making them the most direct and overwhelming expression of magical power." },
    { type: "paragraph", text: "This class originates from Cursed Scroll #1: The Lost Citadel, a Shadowdark expansion module. The full class is not reprinted here, but it is available in that publication or for free on the Shadowdarklings website. See link below." },
    { type: "heading", text: "Overchannel", level: 3 },
    { type: "paragraph", text: "After a failed spellcasting check, you may succeed instead. Take 1d6 + tier damage. If reduced to 0 HP, suffer Mishap." }
  ]
};

// Find the largest googleusercontent image on the page (the scanned parchment).
const FIND_IMAGE = () => {
  const imgs = [...document.querySelectorAll("img")];
  let best = null, bestArea = 0;
  for (const img of imgs) {
    const area = (img.naturalWidth || img.width || 0) * (img.naturalHeight || img.height || 0);
    if (area > bestArea && (img.src || "").includes("googleusercontent")) {
      bestArea = area;
      best = img.src;
    }
  }
  return best;
};

(async () => {
  fs.mkdirSync(IMG_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  // Discover all page URLs from the home page nav.
  await page.goto(HOME, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(2000);
  const homeData = await page.evaluate(EXTRACT_TEXT, BASE);
  const pageUrls = [...new Set([HOME, ...homeData.pageLinks])];

  const data = {
    source: BASE,
    scrapedAt: new Date().toISOString(),
    pages: {}
  };

  for (const url of pageUrls) {
    const slug = url.replace(BASE + "/", "").replace(/\/$/, "") || "home";
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(2500);

      const { blocks } = await page.evaluate(EXTRACT_TEXT, BASE);
      const imgSrc = await page.evaluate(FIND_IMAGE);

      const entry = { url };

      // If there's a large content image, download it.
      if (imgSrc) {
        const fileName = slug.replace("/", "-") + ".png";
        const outPath = path.join(IMG_DIR, fileName);
        const buffer = await page.evaluate(async src => {
          const res = await fetch(src);
          const blob = await res.blob();
          const arrayBuf = await blob.arrayBuffer();
          return Array.from(new Uint8Array(arrayBuf));
        }, imgSrc);
        fs.writeFileSync(outPath, Buffer.from(buffer));
        entry.image = `images/rules/${fileName}`;
        console.log(`image ${slug} -> ${fileName} (${buffer.length} bytes)`);
      }

      // Always store text blocks (may be empty for image-only pages).
      // For image-only pages, use the vision transcription if available.
      entry.blocks = blocks.length > 0 ? blocks : (TRANSCRIPTIONS[slug] ?? []);
      data.pages[slug] = entry;
      console.log(`scraped ${slug} (${blocks.length} blocks${imgSrc ? ", image" : ""})`);
    } catch (err) {
      console.error(`failed ${url}: ${err.message}`);
      data.pages[slug] = { url, error: err.message };
    }
  }

  await browser.close();
  fs.writeFileSync(OUT, JSON.stringify(data, null, 2));
  console.log(`wrote ${OUT}`);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
