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
    const navigate = useNavigate();

    const handleEditStudent = (student) => {
        navigate("/evaluation", { 
            state: { 
                student 
            } 
        });
    };


    const handleDeleteStudent = async (studentId) => {
    try {
        await deleteDoc(doc(db, "students", studentId));

        // Remove the student from the screen immediately
        setStudents((prevStudents) =>
            prevStudents.filter((student) => student.id !== studentId)
        );

    } catch (error) {
        console.error("Error deleting student:", error);
    }
};




    const filteredStudents = students.filter((student) =>
        `${student.matric} ${student.name} ${student.department}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

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

                            <button className="filter-btn">
                            ⚑
                            </button>
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