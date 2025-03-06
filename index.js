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
  lineCharacter: "-", // Set character for lines - default: "-"
  breakLine: BreakLine.WORD, // Break line after WORD or CHARACTERS. Disabled with NONE - default: WORD
  options: {
    // Additional options
    timeout: 10000, // Connection timeout (ms) [applicable only for network printers] - default: 3000
  },
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
  return new Intl.NumberFormat("vi-VN").format(price);
}

function convertVietnameseToLatin(input) {
  const vietnameseMap = {
    á: "a",
    à: "a",
    ả: "a",
    ã: "a",
    ạ: "a",
    ă: "a",
    ắ: "a",
    ằ: "a",
    ẳ: "a",
    ẵ: "a",
    ặ: "a",
    â: "a",
    ấ: "a",
    ầ: "a",
    ẩ: "a",
    ẫ: "a",
    ậ: "a",
    é: "e",
    è: "e",
    ẻ: "e",
    ẽ: "e",
    ẹ: "e",
    ê: "e",
    ế: "e",
    ề: "e",
    ể: "e",
    ễ: "e",
    ệ: "e",
    í: "i",
    ì: "i",
    ỉ: "i",
    ĩ: "i",
    ị: "i",
    ó: "o",
    ò: "o",
    ỏ: "o",
    õ: "o",
    ọ: "o",
    ô: "o",
    ố: "o",
    ồ: "o",
    ổ: "o",
    ỗ: "o",
    ộ: "o",
    ơ: "o",
    ớ: "o",
    ờ: "o",
    ở: "o",
    ỡ: "o",
    ợ: "o",
    ú: "u",
    ù: "u",
    ủ: "u",
    ũ: "u",
    ụ: "u",
    ư: "u",
    ứ: "u",
    ừ: "u",
    ử: "u",
    ữ: "u",
    ự: "u",
    ý: "y",
    ỳ: "y",
    ỷ: "y",
    ỹ: "y",
    ỵ: "y",
    đ: "d",
    Á: "A",
    À: "A",
    Ả: "A",
    Ã: "A",
    Ạ: "A",
    Ă: "A",
    Ắ: "A",
    Ằ: "A",
    Ẳ: "A",
    Ẵ: "A",
    Ặ: "A",
    Â: "A",
    Ấ: "A",
    Ầ: "A",
    Ẩ: "A",
    Ẫ: "A",
    Ậ: "A",
    É: "E",
    È: "E",
    Ẻ: "E",
    Ẽ: "E",
    Ẹ: "E",
    Ê: "E",
    Ế: "E",
    Ề: "E",
    Ể: "E",
    Ễ: "E",
    Ệ: "E",
    Í: "I",
    Ì: "I",
    Ỉ: "I",
    Ĩ: "I",
    Ị: "I",
    Ó: "O",
    Ò: "O",
    Ỏ: "O",
    Õ: "O",
    Ọ: "O",
    Ô: "O",
    Ố: "O",
    Ồ: "O",
    Ổ: "O",
    Ỗ: "O",
    Ộ: "O",
    Ơ: "O",
    Ớ: "O",
    Ờ: "O",
    Ở: "O",
    Ỡ: "O",
    Ợ: "O",
    Ú: "U",
    Ù: "U",
    Ủ: "U",
    Ũ: "U",
    Ụ: "U",
    Ư: "U",
    Ứ: "U",
    Ừ: "U",
    Ử: "U",
    Ữ: "U",
    Ự: "U",
    Ý: "Y",
    Ỳ: "Y",
    Ỷ: "Y",
    Ỹ: "Y",
    Ỵ: "Y",
    Đ: "D",
  };

  return input
    .split("")
    .map((char) => vietnameseMap[char] || char)
    .join("");
}

// Endpoint to handle print requests
app.post("/print", async (req, res) => {
  const { data, table } = req.body;

  if (!data) {
    return res.status(400).send("Data is required for printing.");
  }

  try {
    // Print header
    printer.alignCenter();
    printer.println("Lewa Gourmet");
    printer.println("https://lewagourmet.com/");
    printer.println("98A Le Lai, Pham Ngu Lao, District 1, HCMC");
    printer.println("(+84) 0916 38 83 82");
    printer.println("");

    // Print date and time
    const date = new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());
    printer.println(date);
    printer.println("");

    // Print table header

    printer.tableCustom([
      { text: "Item", align: "LEFT", width: 0.6 },
      { text: "Price", align: "CENTER", width: 0.15 },
      { text: "Qty", align: "CENTER", width: 0.1 },
      { text: "Total", align: "CENTER", width: 0.15 },
    ]);

    // Print each order
    let grandTotal = 0;
    for (let i = 0; i < data.length; i++) {
      const order = data[i];
      const itemTotal = order.price * order.quantity;
      grandTotal += itemTotal;

      printer.tableCustom([
        {
          text: convertVietnameseToLatin(order.name),
          align: "LEFT",
          width: 0.6,
        },
        { text: formatPrice(order.price), align: "CENTER", width: 0.15 },
        { text: order.quantity.toString(), align: "CENTER", width: 0.1 },
        { text: formatPrice(itemTotal), align: "CENTER", width: 0.15 },
      ]);
      printer.setTypeFontB();
      // Print sugar and ice level notes
      const sugarLabel = order.sugarLevel
        ? SUGAR_LEVEL.find((sugar) => sugar.value === order.sugarLevel).label
        : "";
      const iceLabel = order.iceLevel
        ? ICE_LEVEL.find((ice) => ice.value === order.iceLevel).label
        : "";
      if (sugarLabel || iceLabel) {
        printer.alignLeft();
        printer.println(`${sugarLabel} ${iceLabel}`);
        printer.alignCenter();
      }
      printer.setTypeFontA();
      if (i < data.length - 1) {
        printer.println("");
      }
    }

    printer.drawLine();

    // Print grand total
    printer.println("");
    printer.bold(true);
    printer.println(`Grand Total: ${formatPrice(grandTotal)}`);
    printer.bold(false);
    printer.println("");
    printer.println("Thank you for choosing Lewa Gourmet!");

    // Cut the paper and execute the print job
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
