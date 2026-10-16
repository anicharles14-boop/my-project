import Navbar from "./Navbar";
import Header from "./Header";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/Evaluation.css";
import { db } from "../config/firebase";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import coursesData from "../data/courses";
import { fetchStudentEvaluations } from "../utils/evaluations";
import { usePopup } from "./PopupContext";

function Evaluation() {

    const location = useLocation();
    const selectedStudent = location.state?.student;

    // Keying by student re-mounts the form when a different student is
    // selected, which resets all of its evaluation state.
    return (
        <EvaluationForm
            key={selectedStudent?.id || "no-student"}
            selectedStudent={selectedStudent}
        />
    );
}

function EvaluationForm({ selectedStudent }) {

    const [selectedCourse, setSelectedCourse] = useState("");
    const [scores, setScores] = useState({});
    const [result, setResult] = useState(null);
    const [saving, setSaving] = useState(false);
    const { showMessage } = usePopup();

    const availableCourses = selectedStudent
        ? coursesData.filter(
            (course) =>
                course.department === selectedStudent.department &&
                course.level === String(selectedStudent.level)
        )
        : [];

    const handleChange = (e) => {
        const { name, value } = e.target;

        setScores({
            ...scores,
            [selectedCourse]: {
                ...scores[selectedCourse],
                [name]: Math.min(100, Math.max(0, Number(value)))
            }
            
        });
    };


    const currentScores = {
        attendance: scores[selectedCourse]?.attendance ?? 0,
        assignment: scores[selectedCourse]?.assignment ?? 0,
        test: scores[selectedCourse]?.test ?? 0,
        exam: scores[selectedCourse]?.exam ?? 0
    };

    const overallScore = Math.round(
        currentScores.attendance * 0.10 +
        currentScores.assignment * 0.10 +
        currentScores.test * 0.20 +
        currentScores.exam * 0.60
    );


    const getPerformance = () => {

        if (overallScore >= 80) return "Excellent";

        if (overallScore >= 70) return "Very Good";

        if (overallScore >= 50) return "Good";

        if (overallScore >= 40) return "Average";

        return "Fail";
    };


    const getRecommendation = () => {

        if (overallScore >= 80)
            return "Excellent performance. Encourage the student to maintain this level of consistency.";

        if (overallScore >= 70)
            return "Very good performance. The student should continue improving weaker areas.";

        if (overallScore >= 50)
            return "Solid performance. Encourage the student to maintain consistency.";

        if (overallScore >= 40)
            return "Average performance. The student should focus on improving academic weaknesses.";

        return "Performance needs improvement. Additional academic support is recommended.";
    };


    const getLevelClass = (level) => {

        if (level === "Excellent") return "level-excellent";

        if (level === "Very Good") return "level-very-good";

        if (level === "Good") return "level-good";

        if (level === "Average") return "level-average";

        return "level-fail";
    };


    const evaluateStudent = async () => {

        if (saving) {
            return;
        }

        if (!selectedStudent) {
            showMessage("No student selected", { variant: "error" });
            return;
        }

        if (!selectedCourse) {
            showMessage("Please select a course", { variant: "error" });
            return;
        }

        setSaving(true);

        try {
            setResult({
                overall: overallScore,
                level: getPerformance(),
                recommendation: getRecommendation(),
            });
            await saveEvaluation();
        } finally {
            setSaving(false);
        }

    };

    const saveEvaluation = async () => {

        try {

            const existingEvaluations = await fetchStudentEvaluations(
                db,
                selectedStudent.id
            );

            const existingEvaluation = existingEvaluations.find(
                (evaluation) => evaluation.course === selectedCourse
            );

            const evaluationData = {
                studentId: selectedStudent.id,
                course: selectedCourse,

                attendance: currentScores.attendance,
                assignment: currentScores.assignment,
                test: currentScores.test,
                exam: currentScores.exam,

                overall: overallScore,
                level: getPerformance(),
                recommendation: getRecommendation(),

                updatedAt: serverTimestamp()
            };

            if (existingEvaluation) {

                // Evaluation already exists → update it
                await updateDoc(
                    doc(db, "evaluations", existingEvaluation.id),
                    evaluationData
                );

                showMessage("Evaluation updated successfully!", { variant: "success" });

            } else {

                // No evaluation exists → create one
                await addDoc(
                    collection(db, "evaluations"),
                    {
                        ...evaluationData,
                        createdAt: serverTimestamp()
                    }
                );

                showMessage("Evaluation saved successfully!", { variant: "success" });
            }

        } catch (error) {

            console.error("Error saving evaluation:", error);
            showMessage("Failed to save evaluation. Please try again.", { variant: "error" });

        }
    };


    return (
        <div className="universal-layout">
            <Navbar />

            <div className="layout">

                <Header />

                <div className="evaluation-content">

                    <div className="evaluation-title">
                        <h1>Student Evaluation</h1>
                        <p>
                            Evaluate student performance 
                        </p>
                    </div>

                    <div className="evaluation-grid">

                        <div className="evaluation-card">

                            <h2>Student Evaluation</h2>
                            


                            <p>
                                {selectedStudent
                                    ? `${selectedStudent.name.toUpperCase()} — ${selectedStudent["matric number"]}`
                                    : "Select a student from the Students page"
                                }
                            </p>

                            <div className= "course-student">
                                <select
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    disabled={!selectedStudent || availableCourses.length === 0}
                                >
                                    <option value="">
                                        {selectedStudent
                                            ? availableCourses.length
                                                ? "COURSES"
                                                : "No courses for this department/level"
                                            : "Select a student first"}
                                    </option>
                                    {availableCourses.map((course) => (
                                        <option key={`${course.code}-${course.department}-${course.level}`} value={course.code}>
                                            {course.code}
                                        </option>
                                    ))}
                                </select>
                                <Link to="/admin/student" className="link">
                                    <button>GO TO STUDENTS</button>
                                </Link>
                                
                            </div>
                            


                            <div className="score-grid">

                                <div>

                                    <label>
                                        Attendance (%)
                                    </label>

                                    <input
                                        type="number"
                                        name="attendance"
                                        value={scores[selectedCourse]?.attendance || 0}
                                        onChange={handleChange}
                                    />

                                </div>


                                <div>

                                    <label>
                                        Assignment Score (%)
                                    </label>

                                    <input
                                        type="number"
                                        name="assignment"
                                        value={scores[selectedCourse]?.assignment || 0}
                                        onChange={handleChange}
                                    />

                                </div>


                                <div>

                                    <label>
                                        Test Score (%)
                                    </label>

                                    <input
                                        type="number"
                                        name="test"
                                        value={scores[selectedCourse]?.test || 0}
                                        onChange={handleChange}
                                    />

                                </div>


                                <div>

                                    <label>
                                        Exam Score (%)
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        name="exam"
                                        value={scores[selectedCourse]?.exam || 0}
                                        onChange={handleChange}
                                    />

                                </div>

                            </div>


                            <button
                                className="evaluate-student-btn"
                                onClick={evaluateStudent}
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Evaluate Student"}
                            </button>

                        </div>


                        {/* EVALUATION RESULT */}

                        <div className="evaluation-card">

                            <h2>Evaluation Result</h2>


                            <div className="result">

                                <p>Overall Score</p>

                                <div className="score">

                                    {result
                                        ? `${result.overall}%`
                                        : "—"
                                    }

                                </div>


                                <hr />


                                <p>Performance Level</p>

                                {result && (

                                    <span
                                        className={"level " + getLevelClass(result.level)}
                                    >
                                        {result.level}
                                    </span>

                                )}


                                <hr />


                                <p>Recommendation</p>

                                <div className="recommendation">

                                    {result
                                        ? result.recommendation
                                        : "Enter scores and click Evaluate Student."
                                    }

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Evaluation;