import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to your webpage
  await page.goto("http://localhost:3000", {
    waitUntil: "networkidle2",
  });

  // Selector for the <select> element (we assume there is multiple)
  const selectSelector = "table tr td select";

  // Wait for the <select> elements to load
  await page.waitForSelector(selectSelector);

  // Click the first <select> element
  await page.evaluate(() => {
    const selectElement = document.querySelector("table tr td select"); // Adjust as needed
    if (selectElement) {
      // Set the desired option value
      selectElement.value = 'geschlossen';

      // Dispatch a "change" event to trigger update logic
      const event = new Event('change', { bubbles: true });
      selectElement.dispatchEvent(event);
    }
  });


  // Optional: Take a screenshot to verify
  await page.screenshot({ path: "select.png" });

  // Close the browser
  await browser.close();
})();