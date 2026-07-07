const express = require("express");
const router = express.Router();  // Declare router only once

// Test API Route
router.get("/", (req, res) => {
    res.send("API is working!");
});


const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

// Volunteer Schema
const volunteerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    message: String,
});
const Volunteer = mongoose.model("Volunteer", volunteerSchema);

// Contact Schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
});
const Contact = mongoose.model("Contact", contactSchema);

// Donation Schema
const donationSchema = new mongoose.Schema({
    name: String,
    email: String,
    amount: Number,
    phone: String,
    message: String,
});
const Donation = mongoose.model("Donation", donationSchema);

// 📌 Test Route
router.get("/test", (req, res) => {
    res.send("API is working ✅");
});

// 📌 Volunteer API
router.post("/volunteer", async (req, res) => {
    try {
        const newVolunteer = new Volunteer(req.body);
        await newVolunteer.save();
        console.log(res);
        res.status(201).json({ message: "Volunteer form submitted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error submitting volunteer form" });
    }
});

// 📌 Contact Us API
router.post("/contact", async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        await newContact.save();
        res.status(201).json({ message: "Contact form submitted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error submitting contact form" });
    }
});

// 📌 Donation API
router.post("/donation", async (req, res) => {
    try {
        const newDonation = new Donation(req.body);
        await newDonation.save();
        res.status(201).json({ message: "Donation form submitted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error submitting donation form" });
    }
});

module.exports = router;
