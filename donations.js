const express = require("express");
const router = express.Router();
const generateReceipt = require("../utils/generateReceipt");
const nodemailer = require("nodemailer");

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

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Donation Receipt - Jeevan Ankur Trust",
            text: "Thank you for your donation! Your receipt is attached.",
            attachments: [
                {
                    filename: "Donation_Receipt.pdf",
                    path: receiptPath,
                },
            ],
        });

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