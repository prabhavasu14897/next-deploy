import { chromium } from "@playwright/test";

const browser = await chromium.launch({
  executablePath: "C:/Users/HP/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe",
});
const outDir =
  "C:/Users/HP/AppData/Local/Temp/claude/d--Ascentware-socialmedia-design-smp/275a0602-74ae-4488-80fb-a098386246fe/scratchpad";

async function shot(path, name, setup) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));
  await page.goto(`http://localhost:3001${path}`, { waitUntil: "networkidle" });
  if (setup) await setup(page);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: false });
  const nonApiErrors = errors.filter((e) => !e.includes("ERR_CONNECTION_REFUSED"));
  if (nonApiErrors.length) console.log(`${name} console errors:`, nonApiErrors);
  await page.close();
}

// Dark (default)
await shot("/dashboard", "dark-dashboard");
await shot("/organizations", "dark-organizations");

// Light: click the toggle, then screenshot
await shot("/dashboard", "light-dashboard", async (page) => {
  await page.getByLabel("Switch to light theme").click();
});
await shot("/organizations", "light-organizations", async (page) => {
  await page.getByLabel("Switch to light theme").click();
});

await browser.close();
console.log("done");
