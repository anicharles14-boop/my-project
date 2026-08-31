import { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth } from "../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

import StudentNavbar from "./StudentNavbar";
import Header from "../../components/Header";
import "../styles/StudentProfile.css";
import messageIcon from "../../assets/emails.svg";
import phoneIcon from "../../assets/phone-icon.svg";
import departmentIcon from "../../assets/department-icon.svg";
import graduationIcon from "../../assets/graduation-icon.svg";




function StudentProfile() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [matric, setMatric] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");
    const [level, setLevel] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.log("No user is logged in");
                return;
            }

            try {
                const studentsQuery = query(
                    collection(db, "students"),
                    where("uid", "==", user.uid)
                );
                const studentDetails = await getDocs(studentsQuery);

                if (studentDetails.empty) {
                    console.log("Student document does not exist");
                    return;
                }

                const studentData = studentDetails.docs[0].data();

                setName(studentData.name || "");
                setPhone(studentData.phone || "");
                setMatric(studentData["matric number"] || "");
                setEmail(studentData["email address"] || "");
                setDepartment(studentData.department || "");
                setLevel(studentData.level || "");
            } catch (error) {
                console.error("Error getting student:", error);
            }
        });

        return unsubscribe;
    }, []);


   
    
    return(
        
        <div className="universal-layout">
            <StudentNavbar/>
            <div className="layout">
                
                <Header/>
                <div className="student-profile-wrapper">
                    <h1 className="student-profile-title">My Profile</h1>
                    <p className="student-profile-subtitle">
                        View and manage your personal information.
                    </p>

                    <div className="student-profile-header-card">
                        <div className="student-profile-avatar">
                            {name
                                ? name
                                    .split(" ")
                                    .map(word => word.charAt(0).toUpperCase())
                                    .join("")
                                : "?"}
                        </div>
                        <div className="student-profile-header-info">
                            <h2 className="student-profile-name">{name}</h2>
                            <p className="student-profile-role">{department} Student</p>
                            <p className="student-profile-matric">Matric No: {matric}</p>
                        </div>
                    </div>

                    <div className="student-profile-info-card">
                        <div className="student-profile-info-header">
                            <h3 className="student-profile-info-title">Personal Information</h3>
                        </div>

                        <div className="student-profile-info-list">
                            <div className="student-profile-info-item">
                                <div className="student-profile-info-icon">
                                    ✉️
                                </div>
                                <div className="student-profile-info-content">
                                    <span className="student-profile-info-label">Email:</span>
                                    <span className="student-profile-info-value">
                                        {email}
                                    </span>
                                </div>
                            </div>

                            <div className="student-profile-info-item">
                                <div className="student-profile-info-icon">
                                    📞
                                </div>
                                <div className="student-profile-info-content">
                                    <span className="student-profile-info-label">Phone:</span>
                                    <span className="student-profile-info-value">{phone}</span>
                                </div>
                            </div>

                            <div className="student-profile-info-item">
                                <div className="student-profile-info-icon">
                                    🏛️
                                </div>
                                <div className="student-profile-info-content">
                                    <span className="student-profile-info-label">Department:</span>
                                    <span className="student-profile-info-value">{department}</span>
                                </div>
                            </div>

                            <div className="student-profile-info-item">
                                <div className="student-profile-info-icon">
                                    🎓
                                </div>
                                <div className="student-profile-info-content">
                                    <span className="student-profile-info-label">Level:</span>
                                    <span className="student-profile-info-value">{level}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
        </div>
    )
}

export default StudentProfile;
