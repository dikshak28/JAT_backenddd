const express = require("express");
const router = express.Router();
const generateReceipt = require("./utils/generateReceipt");
const { Resend } = require("resend");
const fs = require("fs");

const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/donate", async (req, res) => {
    try {
        const { name, email, amount, transactionId } = req.body;

        const date = new Date().toISOString().split("T")[0];

        const receiptPath = await generateReceipt(
            name,
            amount,
            date,
            transactionId
        );

        const receiptFile = fs.readFileSync(receiptPath);

        const { data, error } = await resend.emails.send({
            from: "Jeevan Ankur Trust <receipts@jeevanankurtrust.org>",
            to: email,
            subject: "Donation Receipt - Jeevan Ankur Trust",
            text: "Thank you for your donation! Your receipt is attached.",
            attachments: [
                {
                    filename: "Donation_Receipt.pdf",
                    content: receiptFile,
                },
            ],
        });

        if (error) {
            throw new Error(error.message);
        }

        console.log("✅ Receipt email sent:", data);

        res.status(200).json({
            message: "Donation successful. Receipt sent!",
        });

    } catch (error) {
        console.error("Receipt email error:", error);

        res.status(500).json({
            message: "Error sending donation receipt",
        });
    }
});

module.exports = router;