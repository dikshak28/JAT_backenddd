const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const logoPath = path.join(__dirname, "../assets/logo.png");
const stampPath = path.join(__dirname, "../assets/stamp.jpeg");

function numberToWords(number) {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function convertBelowHundred(num) {
    if (num < 20) {
      return ones[num];
    }

    return (
      tens[Math.floor(num / 10)] +
      (num % 10 !== 0 ? " " + ones[num % 10] : "")
    );
  }

  function convertBelowThousand(num) {
    let words = "";

    if (num >= 100) {
      words += ones[Math.floor(num / 100)] + " Hundred";

      if (num % 100 !== 0) {
        words += " ";
      }
    }

    words += convertBelowHundred(num % 100);

    return words.trim();
  }

  number = Math.floor(Number(number));

  if (number === 0) {
    return "Zero";
  }

  let words = "";

  if (number >= 10000000) {
    words +=
      convertBelowThousand(Math.floor(number / 10000000)) +
      " Crore ";

    number %= 10000000;
  }

  if (number >= 100000) {
    words +=
      convertBelowThousand(Math.floor(number / 100000)) +
      " Lakh ";

    number %= 100000;
  }

  if (number >= 1000) {
    words +=
      convertBelowThousand(Math.floor(number / 1000)) +
      " Thousand ";

    number %= 1000;
  }

  if (number > 0) {
    words += convertBelowThousand(number);
  }

  return words.trim();
}

function generateReceipt(name, amount, date, transactionId) {
  return new Promise((resolve, reject) => {
    const receiptsDir = path.join(__dirname, "../receipts");

    if (!fs.existsSync(receiptsDir)) {
      fs.mkdirSync(receiptsDir, { recursive: true });
    }

    const receiptPath = path.join(
      receiptsDir,
      `receipt_${transactionId}.pdf`
    );

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const stream = fs.createWriteStream(receiptPath);

    stream.on("finish", () => resolve(receiptPath));
    stream.on("error", reject);

    doc.pipe(stream);

    const pageWidth = doc.page.width;
    const contentLeft = 60;
    const contentRight = pageWidth - 60;
    const contentWidth = contentRight - contentLeft;

const receiptNumber = `JAT-${new Date().getFullYear()}-${transactionId.slice(-6).toUpperCase()}`;

    const formattedDate = new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );

    const numericAmount = Number(amount);
    const amountWords = numberToWords(numericAmount);

    // Outer receipt border
    doc
      .lineWidth(1.5)
      .rect(
        35,
        35,
        pageWidth - 70,
        doc.page.height - 70
      )
      .stroke();

    // Header
// ---------------- Logo ----------------

if (fs.existsSync(logoPath)) {
    try {
        doc.image(
            logoPath,
            pageWidth / 2 - 50,
            40,
            {
                width: 100
            }
        );
    } catch (err) {
        console.error("Could not load logo:", err);
    }
}

// ---------------- Trust Name ----------------

doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .text(
        "JEEVAN ANKUR TRUST",
        50,
        125,
        {
            align: "center"
        }
    );

doc
    .font("Helvetica")
    .fontSize(9)
    .text(
        "Room 405, Bldg. No. 1, Ashtvinayak Society, Opp RNA Park,",
        50,
        150,
        {
            align: "center"
        }
    );

doc.text(
    "Mhada Colony, Vashinaka, Chembur, Mumbai - 400074",
    {
        align: "center"
    }
);

doc
    .moveTo(contentLeft, 180)
    .lineTo(contentRight, 180)
    .lineWidth(1)
    .stroke();

doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .text(
        "DONATION RECEIPT",
        50,
        195,
        {
            align: "center"
        }
    );

    // Receipt number and date
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(
        `Receipt No.: ${receiptNumber}`,
        contentLeft,
        235
      );

    doc.text(
      `Date: ${formattedDate}`,
      contentRight - 150,
      235,
      {
        width: 150,
        align: "right",
      }
    );

    doc
      .moveTo(contentLeft, 260)
      .lineTo(contentRight, 260)
      .stroke();

    // Receipt wording
    doc
      .font("Helvetica")
      .fontSize(12)
      .text(
        "Received with thanks from",
        contentLeft,
        290
      );

    doc
      .font("Helvetica-Bold")
      .text(name, contentLeft, 313);

    doc
      .moveTo(contentLeft, 331)
      .lineTo(contentRight, 331)
      .lineWidth(0.5)
      .stroke();

    doc
      .font("Helvetica")
      .fontSize(12)
      .text("a sum of Rupees", contentLeft, 360);

    doc
      .font("Helvetica-Bold")
      .text(
        `${amountWords} Rupees Only`,
        contentLeft,
        383
      );

    doc
      .moveTo(contentLeft, 401)
      .lineTo(contentRight, 401)
      .stroke();

    // Payment details section
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("PAYMENT DETAILS", contentLeft, 430);

    doc
      .font("Helvetica")
      .fontSize(11)
      .text("Payment Mode:", contentLeft, 460);

    doc
      .font("Helvetica-Bold")
      .text("Online Payment - Razorpay", contentLeft + 120, 460);

    doc
      .font("Helvetica")
      .text("Payment ID:", contentLeft, 488);

    doc
      .font("Helvetica-Bold")
      .text(transactionId, contentLeft + 120, 488,
        {
          width: contentWidth - 120,
        }
      );

    doc
      .font("Helvetica")
      .text("Towards:", contentLeft, 516);

    doc
      .font("Helvetica-Bold")
      .text("Voluntary Donation", contentLeft + 120, 516);

    // Amount box
    doc
      .lineWidth(1.5)
      .rect(contentLeft, 560, 210, 65)
      .stroke();

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("DONATION AMOUNT", contentLeft + 15, 572);

    doc
      .fontSize(22)
      .text(
        `Rs. ${numericAmount.toLocaleString("en-IN")}`,
        contentLeft + 15,
        592
      );

    // Signature section
doc
  .font("Helvetica-Bold")
  .fontSize(12)
  .text(
    "For JEEVAN ANKUR TRUST",
    contentRight - 210,
    560,
    {
      width: 210,
      align: "center",
    }
  );

// Draw the official stamp
if (fs.existsSync(stampPath)) {
    try {
        doc.image(stampPath, contentRight - 150, 580, {
            width: 78,
        });
    } catch (err) {
        console.error("Could not load stamp:", err);
    }
}

// Signature line
doc
  .moveTo(contentRight - 180, 670)
  .lineTo(contentRight - 30, 670)
  .lineWidth(0.5)
  .stroke();

doc
  .font("Helvetica")
  .fontSize(10)
  .text(
    "Authorised Signatory",
    contentRight - 210,
    678,
    {
      width: 210,
      align: "center",
    }
  );

    // Footer
    doc
      .moveTo(contentLeft, 690)
      .lineTo(contentRight, 690)
      .stroke();

    doc
      .font("Helvetica")
      .fontSize(9)
      .text(
        "This is a computer-generated donation receipt issued by Jeevan Ankur Trust and does not require a physical signature.",
        contentLeft,
        705,
        {
          width: contentWidth,
          align: "center",
        }
      );

    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(
        "Thank you for your generous support.",
        contentLeft,
        722,
        {
          width: contentWidth,
          align: "center",
        }
      );

    doc.end();
  });
}

module.exports = generateReceipt;