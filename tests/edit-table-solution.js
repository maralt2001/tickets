import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to your webpage
  await page.goto("http://localhost:3000/tickets", {
    waitUntil: "networkidle2",
  });

  // Selector for the <select> elements in the table
  const selectSelector = "table tr td select";

  // Wait for the <select> elements to load
  await page.waitForSelector(selectSelector);

  // Find all rows with status "offen"
  /** @type {Array<{ rowIndex: number }>} */
  const rowsWithOpenStatus = await page.$$eval('table tr', (rows) => {
    return rows
      .map((row, index) => {
        /** @type {HTMLSelectElement} */
        const selectElement = row.querySelector('td select');
        if (!selectElement) return null;

        const selectedOption = Array.from(selectElement.options).find(option => option.selected);
        if (!selectedOption || selectedOption.textContent.trim() !== 'offen') return null;

        return {
          rowIndex: index,
          ticketId: index  // Row index will be used to calculate ticket ID
        };
      })
      .filter(info => info !== null);
  });

  console.log(`Found ${rowsWithOpenStatus.length} rows with status "offen"`);

  let updatedCount = 0;

  // Process each row with "offen" status
  for (const row of rowsWithOpenStatus) {
    try {
      // Calculate the ticket ID (row index + 1)
      const ticketId = row.rowIndex + 1;

      // Target the specific select element (add 1 because CSS selectors are 1-based)
      const rowSelector = `table tr:nth-child(${row.rowIndex}) td select`;

      // Wait for the select to be available
      await page.waitForSelector(rowSelector);

      // Find the value of the "in Bearbeitung" option

      const optionInfo = await page.$eval(rowSelector, (select) => {
        const options = Array.from(select.options);
        const targetOption = options.find(opt => opt.textContent.trim() === "in Bearbeitung");
        return targetOption ? { 
          value: targetOption.value, 
          text: targetOption.textContent.trim() 
        } : null;
      });

      if (optionInfo) {
        console.log(`Updating ticket ${ticketId -1} status to "in Bearbeitung" (value: ${optionInfo.value})`);

        // First, update the select value and dispatch the change event
        const url = `http://localhost:3000/api/tickets/${ticketId - 1}`;
        const requestBody = {
          status: `${optionInfo.value}`,
        };

        const response = await page.evaluate(async (apiUrl, body) => {
          const fetchResponse = await fetch(apiUrl, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });
          return await fetchResponse.json();
        }, url, requestBody);

        console.log('Response from Server:', response);


        updatedCount++;
      }
    } catch (error) {
      console.error(`Error updating row ${row.rowIndex}:`, error);
    }
  }

  console.log(`Updated ${updatedCount} select elements from "offen" to "in Bearbeitung"`);
  // Take a screenshot to verify
  //await page.screenshot({ path: "select-updated.png" });

  // Close the browser
  await browser.close();
})();
