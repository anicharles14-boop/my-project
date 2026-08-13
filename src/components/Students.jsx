import Navbar from "./Navbar";
import Header from "./Header";
import "../styles/Student.css";
import { useState } from "react";

function Student(){

    const students = [
    {
      matric: "CST001",
      name: "John Doe",
      department: "Computer Science",
      level: "300",
    },
    {
      matric: "SE001",
      name: "Jane Smith",
      department: "Software Engineering",
      level: "400",
    },
    {
      matric: "IT001",
      name: "Michael Paul",
      department: "Information Technology",
      level: "200",
    },
    {
      matric: "CST002",
      name: "Esther James",
      department: "Computer Science",
      level: "300",
    },
    {
      matric: "SE002",
      name: "David Okoro",
      department: "Software Engineering",
      level: "500",
    },
  ];

  const [search, setSearch] = useState("");

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
                        <button>+ Add Student</button>
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

                                        <td>{student.matric}</td>

                                        <td>{student.name}</td>

                                        <td>{student.department}</td>

                                        <td>{student.level}</td>

                                        <td>
                                            <div className="action-buttons">

                                                <button className="edit-btn" title="Edit">
                                                ✎
                                                </button>

                                                <button className="delete-btn" title="Delete">
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
                

                    {/* Footer */}
                    

                </div>
            </div>
        
        </div>
        
    )
}
export default Student