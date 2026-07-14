const generateReceipt = require("./utils/generateReceipt");
const path = require("path");

// Test data
const testData = {
  name: "John Doe",
  amount: 5000,
  date: new Date().toISOString(),
  transactionId: "pay_test_12345678",
};

// Generate test receipt
generateReceipt(
  testData.name,
  testData.amount,
  testData.date,
  testData.transactionId
)
  .then((receiptPath) => {
    console.log("✅ Receipt generated successfully!");
    console.log("📄 Receipt saved at:", receiptPath);
    console.log("\nTest Data:");
    console.log(`  Name: ${testData.name}`);
    console.log(`  Amount: ₹${testData.amount}`);
    console.log(`  Date: ${testData.date}`);
    console.log(`  Transaction ID: ${testData.transactionId}`);
  })
  .catch((err) => {
    console.error("❌ Error generating receipt:", err);
  });
