const express = require("express");
const router = express.Router();

const TeamMember = require("../models/TeamMember");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });


// GET all team members
router.get("/", async (req, res) => {
    try {
        const members = await TeamMember.find().sort({ order: 1 });
        res.json(members);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch team members",
            error: error.message
        });
    }
});


// ADD team member
router.post("/", upload.single("image"), async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                message: "Image is required"
            });
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "jeevan-ankur/team"
            },
            async (error, result) => {

                if (error) {
                    return res.status(500).json({
                        message: "Image upload failed",
                        error: error.message
                    });
                }

                const member = new TeamMember({
                    name: req.body.name,
                    designation: req.body.designation,
                    image: result.secure_url,
                    order: req.body.order || 0
                });

                await member.save();

                res.status(201).json({
                    message: "Team member added successfully",
                    member
                });
            }
        );

        uploadStream.end(req.file.buffer);

    } catch (error) {
        res.status(500).json({
            message: "Failed to add team member",
            error: error.message
        });
    }
});


// DELETE team member
router.delete("/:id", async (req, res) => {
    try {

        const member = await TeamMember.findById(req.params.id);

        if (!member) {
            return res.status(404).json({
                message: "Team member not found"
            });
        }

        await TeamMember.findByIdAndDelete(req.params.id);

        res.json({
            message: "Team member deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete team member",
            error: error.message
        });
    }
});


module.exports = router;