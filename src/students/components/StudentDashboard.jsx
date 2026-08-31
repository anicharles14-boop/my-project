import { useState, useEffect } from "react";
import StudentNavbar from "./StudentNavbar"
import Header from "../../components/Header";
import "../styles/StudentDashboard.css";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import attendanceIcon from "../../assets/attendance-icon.svg";
import bookIcon from "../../assets/book-icon.svg";
import averageIcon from "../../assets/average-icon.svg";


function StudentDashboard(){
    const [studentName, setStudentName] = useState("");
    const [averageScore, setAverageScore] = useState(0);
    const [averageAttendance, setAverageAttendance] = useState(0);
    

    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
            setStudentName("");
            setAverageScore(0);
            setAverageAttendance(0);
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
                return;
            }
            
            const studentDoc = studentSnapshot.docs[0];
            const studentId = studentDoc.id;
            setStudentName(studentDoc.data().name);
            // Now query evaluations using the correct studentId
            const evaluationQuery = query(
                collection(db, "evaluations"),
                where("studentId", "==", studentId)
            );
            
            const evaluationSnapshot = await getDocs(evaluationQuery);
            
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
            //Attendance

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

    
    const courses = [
        { code: 'COS 313', name: 'Data Structures', credit: 3, lecturer: 'Dr. A. Johnson' },
        { code: 'COS 333', name: 'Operating Systems', credit: 3, lecturer: 'Prof. M. Khan' },
        { code: 'COS 331', name: 'Computer Programming', credit: 2, lecturer: 'Dr. L. Carter' },
        { code: 'COS 361', name: 'Computer Networks', credit: 2, lecturer: 'Prof. S. Patel' },
        { code: 'COS 315', name: 'Software Engineering', credit: 2, lecturer: 'Dr. T. Williams' },
        
    ];

  const timetable = [
        { title: 'Data Structures', subtitle: 'Lecture • Room 204', time: '9:00 AM' },
        { title: 'Computer Programming', subtitle: 'Lab • Room 102', time: '11:00 AM' },
        { title: 'Operating Systems', subtitle: 'Lecture • Room 315', time: '2:00 PM' },
        
    ];

    return(
        <div className="universal-layout">
            <StudentNavbar/>
            <div className="layout">
                
                <Header/>
                <div className="dash-dashboard">
      <header className="dash-welcome-header">
        <h1>Welcome back, {studentName.split(" ")[0]}</h1>
        <p>Fall semester, week 9</p>
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
            <span className="dash-stat-value">5</span>
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
                {courses.map((course) => (
                  <tr key={course.code}>
                    <td>{course.code}</td>
                    <td>{course.name}</td>
                    <td>{course.credit}</td>
                    <td>{course.lecturer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dash-timetable-panel">
          <h2>Today's Timetable</h2>
          <ul className="dash-timetable-list">
            {timetable.map((item, index) => (
              <li key={index} className="dash-timetable-item">
                <div className="dash-timetable-info">
                  <span className="dash-timetable-title">{item.title}</span>
                  <span className="dash-timetable-subtitle">{item.subtitle}</span>
                </div>
                <span className="dash-timetable-time">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
            </div>
        
        </div>
        
    )
}
export default StudentDashboard