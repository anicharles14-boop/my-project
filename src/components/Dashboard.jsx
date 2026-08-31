import { useEffect, useState } from "react";
import { collection, getDocs,query, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";
import Navbar from "./Navbar";
import Header from "./Header";
import "../styles/Dashboard.css"

function Dashboard(){

    const [totalStudents, setTotalStudents] = useState(0);
    const [totalEvaluations, setTotalEvaluations] = useState(0);
    const [averageScore, setAverageScore] = useState(0);
    const [highestScore, setHighestScore] = useState(0);
    const [recentEvaluations, setRecentEvaluations] = useState([]);
    const [showAllEvaluations, setShowAllEvaluations] = useState(false);

    useEffect(() => {

        const getData = async () => {

            const studentSnapshot = await getDocs(
                collection(db, "students")
            );
            setTotalStudents(studentSnapshot.size);
            const students = {};
                studentSnapshot.docs.forEach((doc) => {
                    students[doc.id] = doc.data();
            });

            const evaluationSnapshot = await getDocs(
                collection(db, "evaluations")
            );
            setTotalEvaluations(evaluationSnapshot.size);

            const scores = evaluationSnapshot.docs.map(
            (doc) => doc.data().overall
            );


            if (scores.length > 0) {

                const totalScore = scores.reduce(
                    (sum, score) => sum + Number(score),
                    0
                );
                const average = totalScore / scores.length;
                setAverageScore(average);


                const highest = Math.max(
                    ...scores.map(score => Number(score))
                );
                setHighestScore(highest);

            } else {
                setAverageScore(0);
                setHighestScore(0);
            }

            const evaluationQuery = query(
                collection(db, "evaluations"),
                orderBy("createdAt", "desc")
            );

            const recentSnapshot = await getDocs(evaluationQuery);

            setRecentEvaluations(recentSnapshot.docs.map((doc) => {

                const evaluation = doc.data();
                const student = students[evaluation.studentId];

                return {
                    id: doc.id,
                    ...evaluation,
                    name: student?.name,
                    course: evaluation.course
                };

            })
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
                            <div className="dashboard-stat-icon"></div>

                            <div className="dashboard-stat-info">
                                <p> Total Students </p>
                                <h2> {totalStudents} </h2>
                                <span>All registered students</span>
                            </div>

                        </div>



                        {/* TOTAL EVALUATIONS */}

                        <div className="dashboard-stat-card">
                            <div className="dashboard-stat-icon"></div>
                            <div className="dashboard-stat-info">
                                <p> Total Evaluations</p>
                                <h2>{totalEvaluations}</h2>
                                <span>Total evaluations done</span>
                            </div>
                        </div>

                        {/* AVERAGE SCORE */}

                        <div className="dashboard-stat-card">
                            <div className="dashboard-stat-icon"></div>
                            <div className="dashboard-stat-info">
                                <p> Average Score</p>
                                <h2>{averageScore.toFixed(1)}%</h2>

                                <span>Overall average performance</span>
                            </div>
                        </div>

                        {/* STUDENTS AT RISK */}
                        <div className="dashboard-stat-card">
                            <div className="dashboard-stat-icon"></div>
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
                                                <span
                                                    className={`performance-badge ${evaluation.level.toLowerCase()}`}
                                                >
                                                    {evaluation.level}
                                                </span>
                                            </td>

                                            <td className="evaluation-date">
                                                {evaluation.createdAt?.toDate().toLocaleDateString("en-US", {
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