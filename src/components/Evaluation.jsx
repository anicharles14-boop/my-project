import Navbar from "./Navbar";
import Header from "./Header";
import { useState } from "react";
import "../styles/Evaluation.css";

function Evaluation() {

    const [scores, setScores] = useState({
        attendance: 0,
        assignment: 0,
        test: 0,
        exam: 0,
    });

    const [result, setResult] = useState(null);


    const handleChange = (e) => {
        const { name, value } = e.target;

        setScores({
            ...scores,
            [name]: Math.min(100, Math.max(0, Number(value)))
        });
    };


    const overallScore = Math.round(
        scores.attendance * 0.10 +
        scores.assignment * 0.10 +
        scores.test * 0.20 +
        scores.exam * 0.60
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


    const evaluateStudent = () => {

        setResult({
            overall: overallScore,
            level: getPerformance(),
            recommendation: getRecommendation(),
        });

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


                        {/* EVALUATION FORM */}

                        <div className="evaluation-card">

                            <h2>Student Evaluation</h2>


                            <label>Student</label>

                            <input
                                value="John Doe — CST001"
                                
                            />


                            <div className="score-grid">

                                <div>

                                    <label>
                                        Attendance (%)
                                    </label>

                                    <input
                                        type="number"
                                        name="attendance"
                                        value={scores.attendance}
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
                                        value={scores.assignment}
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
                                        value={scores.test}
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
                                        value={scores.exam}
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