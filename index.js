/* eslint-disable no-undef */
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const Student = require("./Models/Student");
const Course = require("./Models/Course");
const Enrollment = require("./Models/Enrollment");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.send("Student Course Management API is running");
});

app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();
        return res.status(200).json(students);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

app.post("/api/students", async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            course,
            dateOfJoining
        } = req.body;

        if (!name || !email || !phone || !course || !dateOfJoining) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return res.status(400).json({
                message: "Invalid email"
            });
        }

        const phonePattern = /^[0-9]{10}$/;

        if (!phonePattern.test(phone)) {
            return res.status(400).json({
                message: "Invalid phone number"
            });
        }

        const student = await Student.create({
            name,
            email,
            phone,
            course,
            dateOfJoining
        });

        return res.status(201).json(student);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
});

app.get("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        return res.status(200).json(student);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
});

app.put("/api/students/:id", async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            course,
            dateOfJoining
        } = req.body;

        if (!name || !email || !phone || !course || !dateOfJoining) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            {
                name,
                email,
                phone,
                course,
                dateOfJoining
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        return res.status(200).json(student);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
});

app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        return res.status(200).json(student);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
});

app.get("/api/courses", async (req, res) => {
    try {
        const courses = await Course.find();
        return res.status(200).json(courses);
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
});

app.post("/api/courses", async (req, res) => {
    try {
        const { courseName, duration } = req.body;

        if (!courseName || !duration) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const course = await Course.create({
            courseName,
            duration
        });

        return res.status(201).json(course);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
});

app.post("/api/enrollments", async (req, res) => {
    try {
        const { student, course } = req.body;

        if (!student || !course) {
            return res.status(400).json({
                message: "Student and course are required"
            });
        }

        const enrollment = await Enrollment.create({
            student,
            course
        });

        return res.status(201).json(enrollment);

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Student already enrolled in this course"
            });
        }

        return res.status(400).json({
            message: error.message
        });
    }
});

app.get("/api/enrollments", async (req, res) => {
    try {
        const enrollments = await Enrollment.find()
            .populate("student")
            .populate("course");

        return res.status(200).json(enrollments);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});