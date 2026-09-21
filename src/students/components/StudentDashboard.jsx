import { useState, useEffect } from "react";
import StudentNavbar from "./StudentNavbar"
import Header from "../../components/Header";
import "../styles/StudentDashboard.css";
import {Link} from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { studentAuth, db } from "../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import attendanceIcon from "../../assets/attendance-icon.svg";
import bookIcon from "../../assets/book-icon.svg";
import averageIcon from "../../assets/average-icon.svg";
import coursesData from "../../data/courses";
import { downloadResultPDF } from "../utils/downloadResultPDF";



function StudentDashboard(){
    const [studentName, setStudentName] = useState("");
    const [averageScore, setAverageScore] = useState(0);
    const [averageAttendance, setAverageAttendance] = useState(0);
    const [studentCourses, setStudentCourses] = useState([]);
    const [student, setStudent] = useState({
      name: "",
      department: "",
      level: "",
      matricNumber: "",
    });
    const [evaluations, setEvaluations] = useState([]);

    useEffect(() => {
    const unsubscribe = onAuthStateChanged(studentAuth, async (user) => {
        if (!user) {
            setStudentName("");
            setAverageScore(0);
            setAverageAttendance(0);
            setStudentCourses([]);
            setStudent({ name: "", department: "", level: "", matricNumber: "" });
            setEvaluations([]);
            return;
        }

        try {
            
            const studentQuery = query(
                collection(db, "students"),
                where("uid", "==", user.uid)
            );
            
            const studentSnapshot = await getDocs(studentQuery);
            
            if (studentSnapshot.empty) {
                setStudentName("");
                setAverageScore(0);
                setAverageAttendance(0);
                setStudentCourses([]);
                setStudent({ name: "", department: "", level: "", matricNumber: "" });
                setEvaluations([]);
                return;
            }
            
            const studentDoc = studentSnapshot.docs[0];
            const studentData = studentDoc.data();
            const studentId = studentDoc.id;
            const department = studentData.department || "";
            const level = studentData.level || "";

            setStudentName(studentData.name || "");
            setStudent({
              name: studentData.name || "",
              department,
              level,
              matricNumber: studentData["matric number"] || "",
            });

            const matchedCourses = coursesData.filter(
                (course) => course.department === department && course.level === level
            );
            setStudentCourses(matchedCourses);

            const evaluationQuery = query(
                collection(db, "evaluations"),
                where("studentId", "==", studentId)
            );
            
            const evaluationSnapshot = await getDocs(evaluationQuery);
            const evaluationData = evaluationSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setEvaluations(evaluationData);
            
            if (evaluationSnapshot.empty) {
                setAverageScore(0);
                setAverageAttendance(0);
                return;
            }

            const total = evaluationSnapshot.docs.reduce(
                (sum, doc) => {
                    return sum + Number(doc.data().overall || 0);
                },
                0
            );

            const average = total / evaluationSnapshot.docs.length;

            setAverageScore(average);
            const attendanceTotal = evaluationSnapshot.docs.reduce(
              (sum, doc) => {
                  return sum + Number(doc.data().attendance || 0);
              },
              0
            );

            const attendanceAverage = attendanceTotal / evaluationSnapshot.docs.length;
            setAverageAttendance(attendanceAverage);

        } catch (error) {
            console.error("Error calculating average score:", error);
        }
    });

    return () => unsubscribe();
}, []);

  

    return(
        <div className="universal-layout">
            <StudentNavbar/>
            <div className="layout">
                
                <Header/>
                <div className="dash-dashboard">
      <header className="dash-welcome-header">
        <h1>Welcome back, {studentName.split(" ")[0]}</h1>
        <p>Stay on top of your academic journey and keep working toward your goals </p>
      </header>

      <div className="dash-stats">
        <div className="dash-stat-card">
          <div className="dash-stat-icon dash-score-icon">
            <img src={averageIcon}/>
          </div>
          <div className="dash-stat-content">
            <span className="dash-stat-label">Average Score</span>
            <span className="dash-stat-value">{averageScore.toFixed(1)}</span>
          </div>
        </div>

        <div className="dash-stat-card">
          <div className="dash-stat-icon dash-attendance-icon">
            <img src={attendanceIcon}/>
          </div>
          <div className="dash-stat-content">
            <span className="dash-stat-label">Attendance</span>
            <span className="dash-stat-value">{averageAttendance.toFixed(0)}%</span>
          </div>
        </div>

        <div className="dash-stat-card">
          <div className="dash-stat-icon dash-courses-icon">
            <img src={bookIcon}/>
          </div>
          <div className="dash-stat-content">
            <span className="dash-stat-label">Courses enrolled</span>
            <span className="dash-stat-value">{studentCourses.length}</span>
          </div>
        </div>
      </div>

      <div className="dash-main-content">
        <div className="dash-courses-panel">
          <h2>My Courses</h2>
          <div className="dash-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Credit Unit</th>
                  <th>Lecturer</th>
                </tr>
              </thead>
              <tbody>
                {studentCourses.length > 0 ? studentCourses.map((course) => (
                  <tr key={`${course.code}-${course.department}-${course.level}`}>
                    <td>{course.code}</td>
                    <td>{course.name}</td>
                    <td>{course.credit}</td>
                    <td>{course.lecturer}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No courses found for this department and level.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="quick-links">
			<h2>Quick Links</h2>
			<Link to="/student/result" className="the-link">
				<div className="view-result">
					View My Results
					<p>Check your academic results</p>
				</div>
			</Link>
			
			
        <button
          type="button"
          className="download-transcript-button"
          onClick={() => downloadResultPDF({ student, courses: evaluations })}
        >
				Download Transcript
				<p>Download your academic transcript</p>
        </button>
			
        
        </div>
      </div>
    </div>
            </div>
        
        </div>
        
    )
}
export default StudentDashboard