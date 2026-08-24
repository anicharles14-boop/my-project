import Navbar from "./Navbar";
import Header from "./Header";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/Evaluation.css";
import { db } from "../config/firebase";
import { collection, addDoc, query, where, getDocs, updateDoc, serverTimestamp } from "firebase/firestore";

function Evaluation() {

    const location = useLocation();
    const selectedStudent = location.state?.student;

    const [selectedCourse, setSelectedCourse] = useState("");

    const [scores, setScores] = useState({});

    const [result, setResult] = useState(null);


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


    const evaluateStudent = async () => {

        setResult({
            overall: overallScore,
            level: getPerformance(),
            recommendation: getRecommendation(),
        });
        await saveEvaluation();

    };

    const saveEvaluation = async () => {

        if (!selectedStudent) {
            alert("No student selected");
            return;
        }

        if (!selectedCourse) {
            alert("Please select a course");
            return;
        }

        try {

            const evaluationQuery = query(
                collection(db, "evaluations"),
                where("studentId", "==", selectedStudent.id),
                where("course", "==", selectedCourse)
            );

            const existingEvaluation = await getDocs(evaluationQuery);

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

            if (!existingEvaluation.empty) {

                // Evaluation already exists → update it
                const evaluationDoc = existingEvaluation.docs[0];

                await updateDoc(
                    evaluationDoc.ref,
                    evaluationData
                );

                alert("Evaluation updated successfully!");

            } else {

                // No evaluation exists → create one
                await addDoc(
                    collection(db, "evaluations"),
                    {
                        ...evaluationData,
                        createdAt: serverTimestamp()
                    }
                );

                alert("Evaluation saved successfully!");
            }

        } catch (error) {

            console.error("Error saving evaluation:", error);
            alert("Failed to save evaluation");

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
                            Evaluate student performance using fuzzy logic.
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
                            <select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                            >

                                <option>COURSES</option>
                                <option>COS 313</option> 
                                <option>COS 333</option> 
                                <option>COS 331</option> 
                                <option>COS 361</option> 
                                <option>COS 315</option> 
                            </select>


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


                            <button onClick={evaluateStudent}>
                                Evaluate Student
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
                                        className="level"
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