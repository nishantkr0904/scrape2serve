const fs = require("node:fs/promises");
const path = require("node:path");
const puppeteer = require("puppeteer-core");

async function scrapeWebsite() {
  const rawUrl = process.env.SCRAPE_URL;

  if (!rawUrl) {
    throw new Error("SCRAPE_URL environment variable is required.");
  }

  let targetUrl;

  try {
    targetUrl = new URL(rawUrl);
  } catch {
    throw new Error("SCRAPE_URL must be a valid URL.");
  }

  if (!["http:", "https:"].includes(targetUrl.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are supported.");
  }

  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;

  if (!executablePath) {
    throw new Error(
      "PUPPETEER_EXECUTABLE_PATH must point to the Chromium executable."
    );
  }

  let browser;

  try {
    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      timeout: 30000
    });

    const page = await browser.newPage();

    await page.goto(targetUrl.href, {
      waitUntil: "domcontentloaded",
      timeout: 30000
    });

    const scrapedData = await page.evaluate(() => ({
      title: document.title,
      heading: document.querySelector("h1")?.innerText.trim() ?? null
    }));

    const result = {
      url: targetUrl.href,
      finalUrl: page.url(),
      ...scrapedData
    };

    const outputFile = path.resolve(
      process.env.OUTPUT_FILE || "scraped_data.json"
    );

    await fs.writeFile(
      outputFile,
      JSON.stringify(result, null, 2) + "\n",
      "utf8"
    );

    console.log(`Scraping completed: ${targetUrl.href}`);
    console.log(`Output saved to: ${outputFile}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

scrapeWebsite().catch((error) => {
  console.error(`Scraping failed: ${error.message}`);
  process.exitCode = 1;
});