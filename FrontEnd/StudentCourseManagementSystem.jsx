import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3001/api";

export default function StudentCourseManagementSystem() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState("");

  const [studentForm, setStudentForm] = useState({ name: "", email: "", phone: "", course: "", dateOfJoining: "" });
  const [courseForm, setCourseForm] = useState({ courseName: "", duration: "" });
  const [enrollmentForm, setEnrollmentForm] = useState({ student: "", course: "" });

  const getStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/students`);
      setStudents(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch students");
    }
  };

  const getCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses`);
      setCourses(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch courses");
    }
  };

  const getEnrollments = async () => {
    try {
      const response = await axios.get(`${API_URL}/enrollments`);
      setEnrollments(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch enrollments");
    }
  };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentForm({ ...studentForm, [name]: value });
  };

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourseForm({ ...courseForm, [name]: value });
  };

  const addStudent = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const response = await axios.post(`${API_URL}/students`, studentForm);
      setStudents([...students, response.data]);
      setStudentForm({ name: "", email: "", phone: "", course: "", dateOfJoining: "" });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add student");
    }
  };

  const addCourse = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const response = await axios.post(`${API_URL}/courses`, courseForm);
      setCourses([...courses, response.data]);
      setCourseForm({ courseName: "", duration: "" });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add course");
    }
  };

  const enrollStudent = async (e) => {
    e.preventDefault();
    if (!enrollmentForm.student || !enrollmentForm.course) {
      setError("Please select both a student and a course.");
      return;
    }
    try {
      setError("");
      await axios.post(`${API_URL}/enrollments`, enrollmentForm);
      // Refresh enrollments from server to pull fully populated student/course names
      getEnrollments(); 
      setEnrollmentForm({ student: "", course: "" });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to enroll student");
    }
  };

  useEffect(() => {
    getStudents();
    getCourses();
    getEnrollments();
  }, []);

  return (
    <div>
      <h1>Student Course Management System</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Dashboard</h2>
      <p>Total Students: {students.length}</p>
      <p>Total Courses: {courses.length}</p>
      <p>Total Enrollments: {enrollments.length}</p>

      <h2>Add Student</h2>
      <form onSubmit={addStudent}>
        <input name="name" placeholder="Name" value={studentForm.name} onChange={handleStudentChange} />
        <input name="email" placeholder="Email" value={studentForm.email} onChange={handleStudentChange} />
        <input name="phone" placeholder="Phone" value={studentForm.phone} onChange={handleStudentChange} />
        <input name="course" placeholder="Course" value={studentForm.course} onChange={handleStudentChange} />
        <input type="date" name="dateOfJoining" value={studentForm.dateOfJoining} onChange={handleStudentChange} />
        <button type="submit">Add Student</button>
      </form>

      <h2>Students</h2>
      {students.map((student) => (
        <div key={student._id}>
          <h3>{student.name}</h3>
          <p>Email: {student.email}</p>
          <p>Phone: {student.phone}</p>
          <p>Course: {student.course}</p>
          <p>
            Joining Date:{" "}
            {student.dateOfJoining ? new Date(student.dateOfJoining).toLocaleDateString("en-GB") : "N/A"}
          </p>
        </div>
      ))}

      <h2>Add Course</h2>
      <form onSubmit={addCourse}>
        <input name="courseName" placeholder="Course Name" value={courseForm.courseName} onChange={handleCourseChange} />
        <input name="duration" placeholder="Duration" value={courseForm.duration} onChange={handleCourseChange} />
        <button type="submit">Add Course</button>
      </form>

      <h2>Courses</h2>
      {courses.map((course) => (
        <div key={course._id}>
          <h3>{course.courseName}</h3>
          <p>Duration: {course.duration}</p>
        </div>
      ))}

      <h2>Enroll Student</h2>
      <form onSubmit={enrollStudent}>
        <select 
          value={enrollmentForm.student} 
          onChange={(e) => setEnrollmentForm({ ...enrollmentForm, student: e.target.value })}
        >
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name}
            </option>
          ))}
        </select>

        <select 
          value={enrollmentForm.course} 
          onChange={(e) => setEnrollmentForm({ ...enrollmentForm, course: e.target.value })}
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.courseName}
            </option>
          ))}
        </select>
        <button type="submit">Enroll</button>
      </form>

      <h2>Enrollments</h2>
      {enrollments.map((enrollment) => (
        <div key={enrollment._id}>
          <p>Student: {enrollment.student?.name || "Unknown Student"}</p>
          <p>Course: {enrollment.course?.courseName || "Unknown Course"}</p>
        </div>
      ))}
    </div>
  );
}
