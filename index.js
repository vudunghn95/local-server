// server.js
const {
  ThermalPrinter,
  PrinterTypes,
  CharacterSet,
  BreakLine,
} = require("node-thermal-printer");
const express = require("express");
const cors = require("cors");
// const path = require("path");
// const puppeteer = require("puppeteer");

const app = express();
const port = 3003;

// Set EJS as the templating engine
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// Initialize the printer
let printer = new ThermalPrinter({
  type: PrinterTypes.EPSON, // Printer type: 'star' or 'epson'
  interface: "tcp://192.168.1.199", // Printer interface
  characterSet: CharacterSet.PC852_LATIN2, // Printer character set
  removeSpecialCharacters: false, // Removes special characters - default: false
  lineCharacter: "=", // Set character for lines - default: "-"
  breakLine: BreakLine.WORD, // Break line after WORD or CHARACTERS. Disabled with NONE - default: WORD
  options: {
    // Additional options
    timeout: 10000, // Connection timeout (ms) [applicable only for network printers] - default: 3000
  },
  width: 540,
});

const SUGAR_LEVEL = [
  {
    value: 1,
    label: "100% Standard Sweetness",
  },
  {
    value: 0.75,
    label: "75% Sweetness",
  },
  {
    value: 0.5,
    label: "50% Sweetness",
  },
  {
    value: 0.25,
    label: "25% Sweetness",
  },
  {
    value: 0,
    label: "0% Sweetness",
  },
  {
    value: 1.25,
    label: "125% Extra Sweetness",
  },
];

const ICE_LEVEL = [
  {
    value: 1,
    label: "Full Ice",
  },
  {
    value: 0.5,
    label: "Half Ice",
  },
  {
    value: 0,
    label: "No Ice",
  },
];

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
}

// Endpoint to handle print requests
app.post("/print", async (req, res) => {
  const { data, table } = req.body;

  if (!data) {
    return res.status(400).send("Data is required for printing.");
  }

  try {
    // const html = await new Promise((resolve, reject) => {
    //   app.render(
    //     "template",
    //     { orders: data, table, formatPrice, SUGAR_LEVEL, ICE_LEVEL },
    //     (err, html) => {
    //       if (err) {
    //         console.error("Render error:", err);
    //         return reject("Template rendering failed.");
    //       }
    //       resolve(html);
    //     }
    //   );
    // });

    // // Convert HTML to PDF buffer using Puppeteer
    // const browser = await puppeteer.launch({ defaultViewport: null });
    // const page = await browser.newPage();

    // // Set the initial viewport size

    // await page.setContent(html);

    // // Adjust the viewport size to fit the content

    // // Optionally, you can set the scale to ensure the content fits well
    // await page.evaluate(() => {
    //   document.body.style.zoom = "1.8"; // Adjust zoom level as needed
    // });
    // let contentHeight = await page.evaluate(() => document.body.scrollHeight);

    // await page.setViewport({ width: 540, height: contentHeight });
    // // Capture a screenshot of the page
    // const imageBuffer = await page.screenshot({
    //   fullPage: true,
    //   encoding: "binary",
    // });
    // await browser.close();

    // Send the buffer to the printer
    // printer.printImageBuffer(Buffer.from(imageBuffer, "binary"));
    printer.print("Hello World");
    printer.cut();
    await printer.execute();
    printer.clear();

    res.send("Print job sent successfully.");
  } catch (error) {
    console.error("Print error:", error);
    res.status(500).send("Failed to send print job.");
  }
});

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
