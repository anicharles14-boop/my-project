import StudentNavbar from "./StudentNavbar"
import Header from "../../components/Header"
import { useState, useEffect } from "react";
import "../styles/StudentResult.css";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../config/firebase";

const IconBox = ({ size = "" }) => (
  <span className={`result-icon-box ${size ? `result-${size}` : ""}`}></span>
);
const courseNames = {
    "COS 313": "Data Structures",
    "COS 333": "Operating Systems",
    "COS 331": "Computer Programming",
    "COS 361": "Computer Networks",
    "COS 315": "Software Engineering"
};
const getGrade = (score) => {
    if (score >= 70) return "A";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    if (score >= 45) return "D";
    if (score >= 40) return "E";

    return "F";
};
const courseUnits = {
    "COS 313": 3,
    "COS 333": 3,
    "COS 331": 2,
    "COS 361": 2,
    "COS 315": 2
};
const gradePoints = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
    E: 1,
    F: 0
};



function StudentResult(){
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [studentName, setStudentName] = useState("");
    const [loading, setLoading] = useState(true);

    
    // Get student's evaluations from Firebase
    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, async (user) => {

            if (!user) {
                setLoading(false);
                return;
            }

            try {

                // Find the logged-in student's document
                const studentQuery = query(
                    collection(db, "students"),
                    where("uid", "==", user.uid)
                );

                const studentSnapshot = await getDocs(studentQuery);

                if (studentSnapshot.empty) {
                    console.log("Student not found");
                    setLoading(false);
                    return;
                }

                const studentDoc = studentSnapshot.docs[0];
                setStudentName(studentDoc.data().name);

                // Find evaluations belonging to this student
                const evaluationQuery = query(
                    collection(db, "evaluations"),
                    where("studentId", "==", studentDoc.id)
                );

                const evaluationSnapshot = await getDocs(evaluationQuery);

                const evaluationData = evaluationSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setCourses(evaluationData);

                // Select the first course automatically
                if (evaluationData.length > 0) {
                    setSelectedCourse(evaluationData[0]);
                }

            } catch (error) {

                console.error("Error getting results:", error);

            }

            setLoading(false);
        });

        return () => unsubscribe();

    }, []);


    const totalQualityPoints = courses.reduce((total, course) => {

        const grade = getGrade(course.overall);
        const point = gradePoints[grade];
        const unit = courseUnits[course.course];

        return total + (point * unit);

    }, 0);

    const totalUnits = courses.reduce((total, course) => {

        return total + (courseUnits[course.course] || 0);

    }, 0);

    const gpa = totalUnits > 0
        ? (totalQualityPoints / totalUnits).toFixed(2)
        : "0.00";

    // Overall score of selected course
    const overallScore = selectedCourse?.overall ?? 0;

    const circumference = 2 * Math.PI * 54;

    const dashOffset =
        circumference * (1 - overallScore / 100);


    if (loading) {
        return <p>Loading results...</p>;
    }
    return(
        <div className="universal-layout">
            <StudentNavbar/>
            <div className="layout">
                
                <Header/>
                <div className="result-dashboard">
  
      

      <div className="result-grid">
        {/* Left / main column */}
        <div>
          <h2 className="result-student-name">{studentName.toUpperCase()}</h2>
          <p className="result-student-subtitle">
            Here's a complete overview of your academic results across all courses this semester.
          </p>

          {/* Stat cards */}
          <div className="result-stat-cards">
            <div className="result-stat-card">
              <div className="result-stat-icon">
                <IconBox />
              </div>
              <div>
                <div className="result-stat-label">Total Courses</div>
                <div className="result-stat-value">{courses.length}</div>
              </div>
            </div>

            <div className="result-stat-card">
              <div className="result-stat-icon">
                <IconBox />
              </div>
              <div>
                <div className="result-stat-label">GPA</div>
                <div className="result-stat-value">{gpa}</div>
              </div>
            </div>

            <div className="result-stat-card">
              <div className="result-stat-icon ">
                <IconBox />
              </div>
              <div>
                <div className="result-stat-label">Highest Grade</div>
                <span className="result-grade-badge result-grade-A">A</span>
              </div>
            </div>
          </div>

          {/* Courses table */}
          <div className="result-table-card">
            <table className="result-course-table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Score</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                    <tr
                        key={course.id}
                        onClick={() => setSelectedCourse(course)}
                        className={
                            "result-course-row" +
                            (selectedCourse?.id === course.id
                                ? " result-selected"
                                : "")
                        }
                    >
                    <td>
                      <span className="result-course-code">{course.course}</span>
                    </td>
                    <td>{courseNames[course.course]}</td>
                    <td>{course.overall}%</td>
                    <td>
                      <span className={`result-grade-badge result-grade-${course.grade}`}>
                        {getGrade(course.overall)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div>
          <div className="result-panel-card">
            <div className="result-panel-header">
              <div>
                <div className="result-panel-header-title">
                  {selectedCourse?.course}
                </div>
                <div className="result-panel-header-subtitle">Selected Course</div>
              </div>
              <button
                className="result-panel-close"
                onClick={() => setSelectedCourse(courses[0])}
                aria-label="Close"
              >
                <IconBox size="tiny" />
              </button>
            </div>

            <div className="result-panel-body">
              <div className="result-panel-section-label">Overall Score</div>

              <div className="result-score-ring-wrap">
                <div className="result-score-ring">
                  <svg viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="#7c3aed"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                    />
                  </svg>
                  <div className="result-score-ring-value">{overallScore}%</div>
                </div>
              </div>

              <div className="result-performance-badge-wrap">
                <span className="result-performance-badge">
                  <IconBox size="tiny" />
                  {selectedCourse?.level}
                </span>
              </div>

              <div className="result-panel-section-label">Evaluation Components</div>
              <div className="result-eval-list">
                {[
        {
            label: "Attendance (%)",
            value: selectedCourse?.attendance ?? 0
        },
        {
            label: "Assignment Score (%)",
            value: selectedCourse?.assignment ?? 0
        },
        {
            label: "Test Score (%)",
            value: selectedCourse?.test ?? 0
        },
        {
            label: "Exam Score (%)",
            value: selectedCourse?.exam ?? 0
        }
    ].map((item) => (

        <div
            className="result-eval-item"
            key={item.label}
        >

            <div className="result-eval-item-top">

                <span className="result-eval-item-label">
                    {item.label}
                </span>

                <span className="result-eval-item-value">
                    {item.value}%
                </span>

            </div>

            <div className="result-eval-bar-track">

                <div
                    className="result-eval-bar-fill"
                    style={{
                        width: `${item.value}%`
                    }}
                ></div>

            </div>

        </div>

    ))}
              </div>

              <div className="result-meta-list">
                
                <div className="result-meta-row">
                  <span className="result-meta-row-label">
                    <IconBox />
                    Evaluation Date
                  </span>
                  <span className="result-meta-row-value">
                    {selectedCourse?.createdAt
                        ? selectedCourse.createdAt.toDate().toLocaleDateString()
                        : "N/A"
                    }
                </span>
                </div>
                <div className="result-meta-row">
                  <span className="result-meta-row-label">
                    <IconBox />
                    Status
                  </span>
                  <span className="result-meta-row-status">
                    <IconBox size="tiny" />
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

            </div>
        
        </div>
        
    )
}
export default StudentResult