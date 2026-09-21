import Navbar from "./Navbar";
import Header from "./Header";
import "../styles/Student.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

function Student(){

    const [students, setStudents] = useState([  ]);

  useEffect(function () {
    async function getStudents() {
        try {
            const studentCollection = collection(db, "students");

            const studentSnapshot = await getDocs(studentCollection);

            const studentList = studentSnapshot.docs.map(function (doc) {
                return {
                    id: doc.id,
                    ...doc.data()
                };
            });

            setStudents(studentList);

        } catch (error) {
            console.error("Error getting students:", error);
        }
    }

    getStudents();
}, []);

    const [search, setSearch] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [levelFilter, setLevelFilter] = useState("");
    const navigate = useNavigate();

    const handleEditStudent = (student) => {
        navigate("/admin/evaluation", { 
            state: { 
                student 
            } 
        });
    };


    const handleDeleteStudent = async (studentId) => {
    try {
        const studentsSnapshot = await getDocs(collection(db, "students"));
        const remainingStudentIds = new Set(
            studentsSnapshot.docs
                .map((studentDoc) => studentDoc.id)
                .filter((id) => id !== studentId)
        );

        const evaluationsSnapshot = await getDocs(collection(db, "evaluations"));
        const evaluationsToDelete = evaluationsSnapshot.docs.filter((evaluationDoc) => {
            const studentReference = evaluationDoc.data().studentId;
            const evaluationStudentId = typeof studentReference === "string"
                ? studentReference
                : studentReference?.id || studentReference?.path?.replace("students/", "");

            return !remainingStudentIds.has(evaluationStudentId);
        });

        await Promise.all(
            evaluationsToDelete.map((evaluationDoc) =>
                deleteDoc(doc(db, "evaluations", evaluationDoc.id))
            )
        );

        await deleteDoc(doc(db, "students", studentId));

        setStudents((prevStudents) =>
            prevStudents.filter((student) => student.id !== studentId)
        );

    } catch (error) {
        console.error("Error deleting student:", error);
    }
};




    const departments = [...new Set(students.map((student) => student.department).filter(Boolean))].sort();
    const levels = [...new Set(students.map((student) => student.level).filter(Boolean))].sort();

    const filteredStudents = students.filter((student) => {
        const matchesSearch = `${student.matric} ${student["matric number"]} ${student.name} ${student.department}`
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesDepartment = !departmentFilter || student.department === departmentFilter;
        const matchesLevel = !levelFilter || String(student.level) === levelFilter;

        return matchesSearch && matchesDepartment && matchesLevel;
    });

    return(
        <div className="universal-layout">
            <Navbar/>
            <div className="layout">
                
                <Header/>

                <div className="student-header">
                    <div className="manage-student">
                        <h2>Students</h2>
                        <p>Manage and view all registered students</p>
                    </div>
                </div>

                <div className="universal-student-table-container">

                    <div className="student-table-container">

                        {/* Search */}
                        <div className="table-toolbar">
                            <div className="search-box">
                            <span className="search-icon">⌕</span>

                            <input
                                type="text"
                                placeholder="Search student..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            </div>

                            <select
                                className="student-filter"
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                                aria-label="Filter by department"
                            >
                                <option value="">All departments</option>
                                {departments.map((department) => (
                                    <option key={department} value={department}>{department}</option>
                                ))}
                            </select>

                            <select
                                className="student-filter"
                                value={levelFilter}
                                onChange={(e) => setLevelFilter(e.target.value)}
                                aria-label="Filter by level"
                            >
                                <option value="">All levels</option>
                                {levels.map((level) => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>

                        {/* Table */}
                        <div className="table-wrapper">
                            <table className="student-table">

                                <thead>
                                    <tr>
                                        <th>MATRIC NUMBER</th>
                                        <th>NAME</th>
                                        <th>DEPARTMENT</th>
                                        <th>LEVEL</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredStudents.map((student) => (
                                    <tr key={student.matric}>

                                        <td>{student["matric number"]}</td>

                                        <td>{student.name}</td>

                                        <td>{student.department}</td>

                                        <td>{student.level}</td>

                                        <td>
                                            <div className="action-buttons">

                                                <button
                                                    className="edit-btn"
                                                    title="Edit"
                                                    onClick={() => handleEditStudent(student)}
                                                >
                                                    ✎
                                                </button>

                                                <button
                                                    className="delete-btn"
                                                    title="Delete"
                                                    onClick={() => handleDeleteStudent(student.id)}
                                                >
                                                    🗑
                                                </button>

                                            </div>
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
export default Student