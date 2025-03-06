app.post("/print", async (req, res) => {
  const { data, table } = req.body;

  if (!data) {
    return res.status(400).send("Data is required for printing.");
  }

  try {
    const html = await new Promise((resolve, reject) => {
      app.render(
        "template",
        { orders: data, table, formatPrice, SUGAR_LEVEL, ICE_LEVEL },
        (err, html) => {
          if (err) {
            console.error("Render error:", err);
            return reject("Template rendering failed.");
          }
          resolve(html);
        }
      );
    });

    // Convert HTML to PDF buffer using Puppeteer
    const browser = await puppeteer.launch({ defaultViewport: null });
    const page = await browser.newPage();

    // Set the initial viewport size

    await page.setContent(html);

    // Adjust the viewport size to fit the content

    // Optionally, you can set the scale to ensure the content fits well
    await page.evaluate(() => {
      document.body.style.zoom = "1.8"; // Adjust zoom level as needed
    });
    let contentHeight = await page.evaluate(() => document.body.scrollHeight);

    await page.setViewport({ width: 540, height: contentHeight });
    // Capture a screenshot of the page
    const imageBuffer = await page.screenshot({
      fullPage: true,
      encoding: "binary",
    });
    await browser.close();

    // Send the buffer to the printer
    printer.printImageBuffer(Buffer.from(imageBuffer, "binary"));
    printer.cut();
    await printer.execute();
    printer.clear();

    res.send("Print job sent successfully.");
  } catch (error) {
    console.error("Print error:", error);
    res.status(500).send("Failed to send print job.");
  }
});
