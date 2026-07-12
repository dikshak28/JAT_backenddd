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
    subject: "Thank You for Supporting Jeevan Ankur Trust ❤️",

    html: `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 650px; margin: auto; border:1px solid #e5e5e5; border-radius:10px; overflow:hidden;">

        <div style="background:#009970; color:white; padding:25px; text-align:center;">
            <h1 style="margin:0;">Jeevan Ankur Trust</h1>
            <p style="margin-top:8px;">
                Thank you for making a difference.
            </p>
        </div>

        <div style="padding:30px; color:#333;">

            <p>Dear <strong>${name}</strong>,</p>

            <p>
                Thank you for your generous donation of
                <strong>₹${Number(amount).toLocaleString("en-IN")}</strong>
                to <strong>Jeevan Ankur Trust</strong>.
            </p>

            <p>
                Your kindness and generosity help us continue serving the community
                and supporting those in need. Every contribution, no matter the size,
                creates a meaningful impact.
            </p>

            <table style="width:100%; border-collapse:collapse; margin:25px 0;">
                <tr>
                    <td style="padding:10px; border:1px solid #ddd;"><strong>Donation Amount</strong></td>
                    <td style="padding:10px; border:1px solid #ddd;">₹${Number(amount).toLocaleString("en-IN")}</td>
                </tr>

                <tr>
                    <td style="padding:10px; border:1px solid #ddd;"><strong>Transaction ID</strong></td>
                    <td style="padding:10px; border:1px solid #ddd;">${transactionId}</td>
                </tr>

                <tr>
                    <td style="padding:10px; border:1px solid #ddd;"><strong>Date</strong></td>
                    <td style="padding:10px; border:1px solid #ddd;">${date}</td>
                </tr>
            </table>

            <p>
                Your donation receipt is attached to this email for your records.
            </p>

            <p>
                If you have any questions, feel free to reply to this email or contact us.
            </p>

            <br>

            <p>
                Warm regards,<br>
                <strong>Jeevan Ankur Trust</strong>
            </p>

        </div>

        <div style="background:#f8f8f8; padding:18px; text-align:center; font-size:13px; color:#666;">
            Jeevan Ankur Trust<br>
            Room 405, Bldg. No. 1, Ashtvinayak Society,<br>
            Opp. RNA Park, Mhada Colony, Vashinaka,<br>
            Chembur, Mumbai – 400074
        </div>

    </div>
    `,

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