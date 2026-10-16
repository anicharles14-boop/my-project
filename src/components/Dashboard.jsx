import { useEffect, useState } from "react";
import { collection, documentId, getCountFromServer, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { normalizeStudentId } from "../utils/evaluations";
import studentIcon from "../assets/student.svg";
import evaluationIcon from "../assets/evaluation.svg";
import averageIcon from "../assets/average-score-icon.svg";
import highestIcon from "../assets/highest-icon.svg";
import Navbar from "./Navbar";
import Header from "./Header";
import "../styles/Dashboard.css"

const fetchStudentNames = async (studentIds) => {
    const uniqueIds = [...new Set(studentIds.filter(Boolean))];
    const names = {};

    if (uniqueIds.length === 0) {
        return names;
    }

    // Firestore "in" queries are limited to 30 values per request.
    for (let index = 0; index < uniqueIds.length; index += 30) {
        const idBatch = uniqueIds.slice(index, index + 30);

        const studentsSnapshot = await getDocs(
            query(
                collection(db, "students"),
                where(documentId(), "in", idBatch)
            )
        );

        studentsSnapshot.forEach((studentDoc) => {
            names[studentDoc.id] = studentDoc.data().name || "";
        });
    }

    return names;
};

function Dashboard(){

    const [totalStudents, setTotalStudents] = useState(0);
    const [totalEvaluations, setTotalEvaluations] = useState(0);
    const [averageScore, setAverageScore] = useState(0);
    const [highestScore, setHighestScore] = useState(0);
    const [recentEvaluations, setRecentEvaluations] = useState([]);
    const [showAllEvaluations, setShowAllEvaluations] = useState(false);

    useEffect(() => {

        const getData = async () => {

            // Server-side count — avoids downloading every student document.
            const studentCountSnapshot = await getCountFromServer(
                collection(db, "students")
            );
            setTotalStudents(studentCountSnapshot.data().count);

            // Single read of evaluations, reused for the stats and the table.
            const evaluationSnapshot = await getDocs(
                collection(db, "evaluations")
            );

            const evaluations = evaluationSnapshot.docs
                .map((evaluationDoc) => ({
                    id: evaluationDoc.id,
                    ...evaluationDoc.data(),
                    studentId: normalizeStudentId(evaluationDoc.data().studentId)
                }))
                .sort((first, second) => {
                    const firstTime = (first.updatedAt ?? first.createdAt)?.toDate?.().getTime() ?? 0;
                    const secondTime = (second.updatedAt ?? second.createdAt)?.toDate?.().getTime() ?? 0;

                    return secondTime - firstTime;
                });

            setTotalEvaluations(evaluations.length);

            const scores = evaluations
                .map((evaluation) => Number(evaluation.overall))
                .filter(Number.isFinite);

            if (scores.length > 0) {

                const totalScore = scores.reduce(
                    (sum, score) => sum + score,
                    0
                );
                setAverageScore(totalScore / scores.length);
                setHighestScore(Math.max(...scores));

            } else {
                setAverageScore(0);
                setHighestScore(0);
            }

            // Only fetch names for the students that actually appear in the table.
            const studentNames = await fetchStudentNames(
                evaluations.map((evaluation) => evaluation.studentId)
            );

            setRecentEvaluations(
                evaluations
                    .filter((evaluation) => studentNames[evaluation.studentId] !== undefined)
                    .map((evaluation) => ({
                        ...evaluation,
                        name: studentNames[evaluation.studentId]
                    }))
            );

        };

        getData();

    }, []);

    
   

    return(
        <div className="universal-layout">

            <Navbar />
            <div className="layout">
                <Header />
                <div className="dashboard-content">


                    {/* WELCOME SECTION */}
                    <div className="dashboard-welcome">
                        <div>
                            <h1>
                                Welcome back, Administrator 👋
                            </h1>
                            <p>
                                Monitor and manage academic performance with ease.
                            </p>
                        </div>

                        <div className="dashboard-date">
                            <span>
                                {new Date().toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })}
                            </span>
                        </div>
                    </div>

                    {/* STAT CARDS */}

                    <div className="dashboard-stats">
                        {/* TOTAL STUDENTS */}
                        <div className="dashboard-stat-card">
                            <div className="dashboard-stat-icon">
                                <img src={studentIcon}/>
                            </div>

                            <div className="dashboard-stat-info">
                                <p> Total Students </p>
                                <h2> {totalStudents} </h2>
                                <span>All registered students</span>
                            </div>

                        </div>



                        {/* TOTAL EVALUATIONS */}

                        <div className="dashboard-stat-card">
                            <div className="dashboard-stat-icon">
                                <img src={evaluationIcon}/>
                            </div>
                            <div className="dashboard-stat-info">
                                <p> Total Evaluations</p>
                                <h2>{totalEvaluations}</h2>
                                <span>Total evaluations done</span>
                            </div>
                        </div>

                        {/* AVERAGE SCORE */}

                        <div className="dashboard-stat-card">
                            <div className="dashboard-stat-icon">
                                <img src={averageIcon}/>
                            </div>
                            <div className="dashboard-stat-info">
                                <p> Average Score</p>
                                <h2>{averageScore.toFixed(1)}%</h2>

                                <span>Overall average performance</span>
                            </div>
                        </div>

                        {/* STUDENTS AT RISK */}
                        <div className="dashboard-stat-card">
                            <div className="dashboard-stat-icon">
                                <img src={highestIcon}/>
                            </div>
                            <div className="dashboard-stat-info">
                                <p>Highest score</p>
                                <h2>{highestScore}</h2>
                                <span></span>
                            </div>
                        </div>

                    </div>

                    {/* RECENT EVALUATIONS */}
                    <div className="recent-evaluations">
                        <div className="recent-header">
                            <h2>Recent Evaluations</h2>
                            <button onClick={() => setShowAllEvaluations(!showAllEvaluations)}>
                                {showAllEvaluations ? "Show recent" : "View all"}
                            </button>
                        </div>

                        <div className="evaluation-table-wrapper">
                            <table className="evaluation-table">

                                <thead>
                                    <tr>
                                        <th>STUDENT NAME</th>
                                        <th>COURSE</th>
                                        <th>SCORE</th>
                                        <th>PERFORMANCE</th>
                                        <th>DATE</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {(showAllEvaluations
                                    ? recentEvaluations
                                    : recentEvaluations.slice(0, 5)
                                    ).map((evaluation) => (
                                        <tr key={evaluation.id}>

                                            <td>{evaluation.name}</td>

                                            <td>{evaluation.course}</td>

                                            <td className="student-score">
                                                {evaluation.overall}%
                                            </td>

                                            <td>
                                                {evaluation.level ? (
                                                    <span
                                                        className={`performance-badge ${String(evaluation.level).toLowerCase()}`}
                                                    >
                                                        {evaluation.level}
                                                    </span>
                                                ) : (
                                                    "—"
                                                )}
                                            </td>

                                            <td className="evaluation-date">
                                                {(evaluation.updatedAt ?? evaluation.createdAt)?.toDate().toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric"
                                                })}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}
export default Dashboard