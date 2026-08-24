import Navbar from "./Navbar";
import Header from "./Header";
import "../styles/Student.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

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
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [matric, setMatric] = useState("");
    const [name, setName] = useState("");
    const [department, setDepartment] = useState("");
    const [level, setLevel] = useState("");
    const navigate = useNavigate();

    const handleEditStudent = (student) => {
        navigate("/evaluation", { 
            state: { 
                student 
            } 
        });
    };


    const handleDeleteStudent = (id) => {
        setStudents((previousStudents) =>
            previousStudents.filter(
                (student) => student.id !== id
            )
        );
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
                    
                    <div className="add-student-button">
                        <button
                            onClick={() => {
                                setEditingStudent(null);
                                setMatric("");
                                setName("");
                                setDepartment("");
                                setLevel("");
                                setShowModal(true);
                            }}>
                            + Add Student
                        </button>
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

                    {showModal && (

                        <div className="modal-overlay">

                            <div className="student-modal">

                                {/* Modal Header */}

                                <div className="modal-header">

                                    <div>
                                        <h2>
                                            {editingStudent ? "Edit Student" : "Add Student"}
                                        </h2>

                                        <p>
                                            {editingStudent
                                                ? "Update the student's information below."
                                                : "Enter the student's information below."
                                            }
                                        </p>
                                    </div>

                                    <button
                                        className="close-modal"
                                        onClick={() => setShowModal(false)}
                                    >
                                        ×
                                    </button>

                                </div>


                                {/* Form */}

                                <form onSubmit={handleAddStudent}>

                                    <div className="form-group">

                                        <label>
                                            Matric Number
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="e.g. CST001"
                                            value={matric}
                                            onChange={(e) =>
                                                setMatric(e.target.value)
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="form-group">
                                        <label>
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Enter student's full name"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            required
                                        />
                                    </div>


                                    <div className="form-group">
                                        <label>
                                            Department
                                        </label>

                                        <select
                                             value={department}
                                            onChange={(e) =>
                                                setDepartment(e.target.value)
                                            }
                                            required
                                        >
                                            <option value="">
                                            Select department
                                            </option>

                                            <option>
                                            Computer Science
                                            </option>

                                            <option>
                                            Software Engineering
                                            </option>

                                            <option>
                                            Information Technology
                                            </option>
                                        </select>

                                    </div>


                                    <div className="form-group">
                                        <label>
                                            Level
                                        </label>

                                        <select
                                            value={level}
                                            onChange={(e) =>
                                                setLevel(e.target.value)
                                            }
                                            required
                                        >

                                            <option value="">Select level</option>
                                            <option value="100">100</option>
                                            <option value="200">200</option>
                                            <option value="300">300</option>
                                            <option value="400">400</option>
                                            <option value="500">500</option>
                                        </select>
                                    </div>


                                    {/* Buttons */}

                                    <div className="modal-actions">

                                        <button
                                            type="button"
                                            className="cancel-btn"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="save-student-btn"
                                        >
                                            {editingStudent ? "Save Changes" : "Add Student"}
                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>

                        )}
                                

                                    

                </div>
            </div>        
        </div>
        
    )
}
export default Student