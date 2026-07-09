const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const path = require("path");

dotenv.config();

const app = express();
app.use(express.static(path.join(__dirname, "..")));
app.use(express.json());
app.use(cors());

const paymentRoutes = require("./payment");
app.use("/api/payment", paymentRoutes);

const donationRoutes = require("./donations");
app.use("/api/donations", donationRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Define Mongoose Schemas
const VolunteerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
});

const DonationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  amount: Number,
  transactionId: String,
});

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
});
const Contact = mongoose.model("Contact", contactSchema);

const Volunteer = mongoose.model("Volunteer", VolunteerSchema);
const Donation = mongoose.model("Donation", DonationSchema);

// 📌 Route: Submit Volunteer Form
app.post("/api/volunteer", async (req, res) => {
  try {
    console.log("fore ");
    const newVolunteer = new Volunteer(req.body);
    await newVolunteer.save();
    console.log("afater ");

    // Send email notification
    sendEmail("New Volunteer Submission", newVolunteer);

    res.status(201).json({ message: newVolunteer });
  } catch (error) {
    res.status(500).json({ error: "Error submitting form" });
  }
});


app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Server is working perfectly!" });
});


app.get("/test", (req, res) => {
  res.json({ message: "✅ Server is working perfectly!" });
});

// 📌 Route: Submit Donation Form
app.post("/api/donation", async (req, res) => {
  try {
    const newDonation = new Donation(req.body);
    await newDonation.save();

    // Send email notification
    sendEmail("New Donation Received", newDonation);

    res.status(201).json({ message: "Donation form submitted!" });
  } catch (error) {
    res.status(500).json({ error: "Error submitting form" });
  }
});

app.post("/api/contacts", async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();

    sendEmail("New Contact Form Submission", newContact);

    res.status(201).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error submitting contact form" });
  }
});

// Email Notification Function
const sendEmail = async (subject, formData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.NOTIFICATION_EMAIL,
    subject: subject,
    text: JSON.stringify(formData, null, 2),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent successfully!");
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};

// Start Server
console.log("index.js running");
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Real Server running on port ${PORT}`));
