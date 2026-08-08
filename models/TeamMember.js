const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        designation: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        order: {
            type: Number,
            default: 0
        }
    },
    {
        collection: "TeamMember"
    }
);

module.exports = mongoose.model("TeamMember", teamMemberSchema);