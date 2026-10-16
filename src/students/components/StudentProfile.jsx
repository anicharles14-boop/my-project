import { useState, useEffect } from "react";
import { db, studentAuth } from "../../config/firebase";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import StudentNavbar from "./StudentNavbar";
import Header from "../../components/Header";
import "../styles/StudentProfile.css";

const emptyDraft = { name: "", email: "", phone: "" };

function StudentProfile() {
    const [studentDocId, setStudentDocId] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [matric, setMatric] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");
    const [level, setLevel] = useState("");

    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(emptyDraft);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(studentAuth, async (user) => {
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

                const studentDoc = studentDetails.docs[0];
                const studentData = studentDoc.data();

                setStudentDocId(studentDoc.id);
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

    const startEditing = () => {
        setDraft({ name, email, phone });
        setMessage(null);
        setEditing(true);
    };

    const cancelEditing = () => {
        setEditing(false);
        setMessage(null);
    };

    const handleDraftChange = (field) => (event) => {
        setDraft((current) => ({ ...current, [field]: event.target.value }));
    };

    const handleSave = async (event) => {
        event.preventDefault();

        if (saving) {
            return;
        }

        const trimmedName = draft.name.trim();
        const trimmedEmail = draft.email.trim();
        const trimmedPhone = draft.phone.trim();

        if (!trimmedName) {
            setMessage({ type: "error", text: "Name cannot be empty." });
            return;
        }

        if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            setMessage({ type: "error", text: "Please enter a valid email address." });
            return;
        }

        if (!studentDocId) {
            setMessage({ type: "error", text: "Could not find your profile. Please refresh and try again." });
            return;
        }

        setSaving(true);
        setMessage(null);

        try {
            await updateDoc(doc(db, "students", studentDocId), {
                name: trimmedName,
                "email address": trimmedEmail,
                phone: trimmedPhone,
            });

            setName(trimmedName);
            setEmail(trimmedEmail);
            setPhone(trimmedPhone);
            setEditing(false);
            setMessage({ type: "success", text: "Profile updated successfully." });
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({ type: "error", text: "Could not save your changes. Please try again." });
        } finally {
            setSaving(false);
        }
    };

    const displayName = editing ? draft.name : name;

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
                            {displayName
                                ? displayName
                                    .split(" ")
                                    .map(word => word.charAt(0).toUpperCase())
                                    .join("")
                                : "?"}
                        </div>
                        <div className="student-profile-header-info">
                            <h2 className="student-profile-name">{displayName}</h2>
                            <p className="student-profile-role">{department} Student</p>
                            <p className="student-profile-matric">Matric No: {matric}</p>
                        </div>
                    </div>

                    <div className="student-profile-info-card">
                        <div className="student-profile-info-header">
                            <h3 className="student-profile-info-title">Personal Information</h3>
                            {!editing && (
                                <button
                                    type="button"
                                    className="student-profile-edit-btn"
                                    onClick={startEditing}
                                >
                                    <span className="student-profile-edit-icon">✏️</span>
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSave} noValidate>
                            <div className="student-profile-info-list">
                                <div className="student-profile-info-item">
                                    <div className="student-profile-info-icon">
                                        👤
                                    </div>
                                    <div className="student-profile-info-content">
                                        <span className="student-profile-info-label">Full Name:</span>
                                        {editing ? (
                                            <input
                                                className="student-profile-edit-input"
                                                type="text"
                                                value={draft.name}
                                                onChange={handleDraftChange("name")}
                                                disabled={saving}
                                                aria-label="Full name"
                                            />
                                        ) : (
                                            <span className="student-profile-info-value">
                                                {name}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="student-profile-info-item">
                                    <div className="student-profile-info-icon">
                                        ✉️
                                    </div>
                                    <div className="student-profile-info-content">
                                        <span className="student-profile-info-label">Email:</span>
                                        {editing ? (
                                            <input
                                                className="student-profile-edit-input"
                                                type="email"
                                                value={draft.email}
                                                onChange={handleDraftChange("email")}
                                                disabled={saving}
                                                aria-label="Email address"
                                            />
                                        ) : (
                                            <span className="student-profile-info-value">
                                                {email}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="student-profile-info-item">
                                    <div className="student-profile-info-icon">
                                        📞
                                    </div>
                                    <div className="student-profile-info-content">
                                        <span className="student-profile-info-label">Phone:</span>
                                        {editing ? (
                                            <input
                                                className="student-profile-edit-input"
                                                type="tel"
                                                value={draft.phone}
                                                onChange={handleDraftChange("phone")}
                                                disabled={saving}
                                                aria-label="Phone number"
                                            />
                                        ) : (
                                            <span className="student-profile-info-value">{phone}</span>
                                        )}
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

                            {editing && (
                                <>
                                    <div className="student-profile-edit-actions">
                                        <button
                                            type="submit"
                                            className="student-profile-save-btn"
                                            disabled={saving}
                                        >
                                            {saving ? "Saving..." : "Save Changes"}
                                        </button>
                                        <button
                                            type="button"
                                            className="student-profile-cancel-btn"
                                            onClick={cancelEditing}
                                            disabled={saving}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    <p className="student-profile-edit-note">
                                        Department and level are managed by the school and can't be changed here.
                                    </p>
                                </>
                            )}
                        </form>

                        {message && (
                            <p className={`student-profile-edit-message ${message.type}`}>
                                {message.text}
                            </p>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default StudentProfile;
