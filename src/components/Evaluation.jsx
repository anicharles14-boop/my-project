import Navbar from "./Navbar";
import Header from "./Header";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/Evaluation.css";
import { db } from "../config/firebase";
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import coursesData from "../data/courses";
import { fetchStudentEvaluations } from "../utils/evaluations";
import { getCourseLevel, getGrade, levelClassName } from "../utils/grades";
import { usePopup } from "./PopupContext";

function Evaluation() {

    const location = useLocation();
    const [searchParams] = useSearchParams();
    const studentIdFromUrl = searchParams.get("student");

    // The Students page passes the student along when you click Edit.
    // After a page refresh that is gone, so we load the student again
    // using the id kept in the address (?student=...).
    const studentFromState = location.state?.student;
    const [loadedStudent, setLoadedStudent] = useState(null);

    useEffect(() => {
        if (studentFromState || !studentIdFromUrl) {
            return;
        }

        getDoc(doc(db, "students", studentIdFromUrl))
            .then((studentDoc) => {
                if (studentDoc.exists()) {
                    setLoadedStudent({ id: studentDoc.id, ...studentDoc.data() });
                }
            })
            .catch((error) => console.error("Error loading student:", error));
    }, [studentFromState, studentIdFromUrl]);

    const selectedStudent = studentFromState || loadedStudent;

    // Keying by student re-mounts the form when a different student is
    // selected, which resets all of its evaluation state.
    return (
        <EvaluationForm
            key={selectedStudent?.id || "no-student"}
            selectedStudent={selectedStudent}
        />
    );
}

const recommendations = {
    "Excellent": "Excellent performance. Encourage the student to maintain this level of consistency.",
    "Very Good": "Very good performance. The student should continue improving weaker areas.",
    "Good": "Solid performance. Encourage the student to keep building on it.",
    "Poor": "Below average performance. The student should focus on improving academic weaknesses.",
    "Fail": "Performance needs improvement. Additional academic support is recommended.",
};

function EvaluationForm({ selectedStudent }) {

    const [selectedCourse, setSelectedCourse] = useState("");
    const [scores, setScores] = useState({});
    const [savedEvaluations, setSavedEvaluations] = useState({});
    const [loadingSaved, setLoadingSaved] = useState(Boolean(selectedStudent));
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

    // Load the scores already saved for this student, so editing a course
    // starts from its saved scores instead of zeros.
    useEffect(() => {
        if (!selectedStudent) {
            return;
        }

        fetchStudentEvaluations(db, selectedStudent.id)
            .then((evaluations) => {
                const savedByCourse = {};
                const savedScores = {};

                evaluations.forEach((evaluation) => {
                    savedByCourse[evaluation.course] = evaluation;
                    savedScores[evaluation.course] = {
                        attendance: Number(evaluation.attendance) || 0,
                        assignment: Number(evaluation.assignment) || 0,
                        test: Number(evaluation.test) || 0,
                        exam: Number(evaluation.exam) || 0,
                    };
                });

                setSavedEvaluations(savedByCourse);
                // Anything typed while loading wins over the saved values.
                setScores((current) => ({ ...savedScores, ...current }));
            })
            .catch((error) => {
                console.error("Error loading saved evaluations:", error);
                showMessage("Could not load this student's saved scores.", { variant: "error" });
            })
            .finally(() => setLoadingSaved(false));
    }, [selectedStudent, showMessage]);

    const buildResult = (overall) => {
        const level = getCourseLevel(overall);

        return {
            overall,
            grade: getGrade(overall),
            level,
            recommendation: recommendations[level],
        };
    };

    const handleCourseChange = (e) => {
        const course = e.target.value;
        setSelectedCourse(course);

        // Show the saved result for a course that has already been graded.
        const saved = savedEvaluations[course];
        setResult(saved ? buildResult(Number(saved.overall) || 0) : null);
    };

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
            setResult(buildResult(overallScore));
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
                level: getCourseLevel(overallScore),
                recommendation: recommendations[getCourseLevel(overallScore)],

                updatedAt: serverTimestamp()
            };

            if (existingEvaluation) {

                // Evaluation already exists → update it
                await updateDoc(
                    doc(db, "evaluations", existingEvaluation.id),
                    evaluationData
                );

                setSavedEvaluations((current) => ({
                    ...current,
                    [selectedCourse]: { ...existingEvaluation, ...evaluationData },
                }));

                showMessage("Evaluation updated successfully!", { variant: "success" });

            } else {

                // No evaluation exists → create one
                const newEvaluation = await addDoc(
                    collection(db, "evaluations"),
                    {
                        ...evaluationData,
                        createdAt: serverTimestamp()
                    }
                );

                setSavedEvaluations((current) => ({
                    ...current,
                    [selectedCourse]: { id: newEvaluation.id, ...evaluationData },
                }));

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
                                    onChange={handleCourseChange}
                                    disabled={!selectedStudent || loadingSaved || availableCourses.length === 0}
                                >
                                    <option value="">
                                        {selectedStudent
                                            ? loadingSaved
                                                ? "Loading saved scores..."
                                                : availableCourses.length
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
                                        ? `${result.overall}% (${result.grade})`
                                        : "—"
                                    }

                                </div>


                                <hr />


                                <p>Performance Level</p>

                                {result && (

                                    <span
                                        className={"level level-" + levelClassName(result.level)}
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