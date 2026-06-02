const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

(async () => {
  const classes = [
    { name: "soulknife", url: "https://sites.google.com/view/sd-homebrew-edition/home/soulknife" },
    { name: "paladin",   url: "https://sites.google.com/view/sd-homebrew-edition/home/paladin" },
    { name: "sorcerer",  url: "https://sites.google.com/view/sd-homebrew-edition/home/sorcerer" },
    { name: "monk",      url: "https://sites.google.com/view/sd-homebrew-edition/home/monk" },
    { name: "kinetic",   url: "https://sites.google.com/view/sd-homebrew-edition/home/kinetic" },
  ];
  const outDir = path.resolve("images");
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  for (const cls of classes) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(cls.url, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(3000);
    const fullH = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.setViewportSize({ width: 1280, height: fullH });
    await page.waitForTimeout(1000);
    const imgSrcs = await page.evaluate(() =>
      [...document.querySelectorAll("img")].map(i => i.src).filter(s => s.includes("googleusercontent"))
    );
    const screenshotPath = path.join(outDir, cls.name + "_full.png");
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(cls.name + " | h=" + fullH + " | imgs=" + JSON.stringify(imgSrcs));
    await page.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
