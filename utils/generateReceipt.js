const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

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

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(receiptPath);

    stream.on("finish", () => resolve(receiptPath));
    stream.on("error", reject);

    doc.pipe(stream);

    doc.fontSize(22).text("Jeevan Ankur Trust", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(18).text("Donation Receipt", {
      align: "center",
    });

    doc.moveDown(2);

    doc.fontSize(12);
    doc.text(`Donor Name: ${name}`);
    doc.text(`Donation Amount: Rs. ${amount}`);
    doc.text(`Date: ${date}`);
    doc.text(`Transaction ID: ${transactionId}`);

    doc.moveDown(2);

    doc.text("Thank you for your generous donation!", {
      align: "center",
    });

    doc.end();
  });
}

module.exports = generateReceipt;