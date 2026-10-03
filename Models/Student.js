/* eslint-disable no-undef */
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    course: { type: String, required: true },
    dateOfJoining: { type: Date, required: true }
});

module.exports = mongoose.model("Student", studentSchema);