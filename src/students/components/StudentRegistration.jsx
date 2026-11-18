import "../styles/StudentRegistration.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { db, studentAuth } from "../../config/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import shieldHalf from "../../assets/shield-half.svg";
import studentEvaluation from "../../assets/student-evaluation.svg";
import chart from "../../assets/chart.svg";
import studentIllustration from "../../assets/student-illustration.png";
import download from "../../assets/download-icon.svg";
import departmentIcon from "../../assets/department-icon.svg";
import levelIcon from "../../assets/level-icon.svg";
import arrowBack from "../../assets/arrow-back.svg";
import userName from "../../assets/user-name.svg";
import phoneIcon from "../../assets/phone-icon.svg";
import matricIcon from "../../assets/matric-icon.svg";
import emails from "../../assets/emails.svg";
import lock from "../../assets/lock.svg";
import eye from "../../assets/eye.svg";
import eyeClose from "../../assets/eye-close.svg";

function StudentRegistration() {

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [matric, setMatric] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");
    const [level, setLevel] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const studentsCollection = collection(db, "students");

    // Creates the student's profile record for a login account.
    async function saveStudentRecord(uid) {
        await addDoc(studentsCollection, {
            uid: uid,
            name: name,
            "matric number": matric,
            phone: phone,
            "email address": email,
            department: department,
            level: level,
            role: "student"
        });
    }

    // The email already has a login. If that student was deleted by an
    // admin, their login still exists, so let them back in with the same
    // password and recreate their record. Otherwise they should log in.
    async function registerExistingLogin() {
        let userCredential;

        try {
            userCredential = await signInWithEmailAndPassword(studentAuth, email, password);
        } catch {
            return "An account with this email already exists. Please log in instead.";
        }

        const existingRecord = await getDocs(
            query(studentsCollection, where("uid", "==", userCredential.user.uid))
        );

        if (!existingRecord.empty) {
            await signOut(studentAuth);
            return "You already have an account. Please log in instead.";
        }

        await saveStudentRecord(userCredential.user.uid);
        return null;
    }

    async function submitDetails(e){
        e.preventDefault();

        if (submitting) {
            return;
        }

        setErrorMessage("");
        setSubmitting(true);

        try{
            const userCredential = await createUserWithEmailAndPassword(
                studentAuth,
                email,
                password
            );

            await saveStudentRecord(userCredential.user.uid);
            navigate("/student/dashboard");
        }
        catch(err){
            console.error("Registration failed:", err);

            if (err?.code === "auth/email-already-in-use") {
                const problem = await registerExistingLogin().catch(() =>
                    "Something went wrong. Please try again."
                );

                if (!problem) {
                    navigate("/student/dashboard");
                    return;
                }

                setErrorMessage(problem);
            } else if (err?.code === "auth/invalid-email") {
                setErrorMessage("Please enter a valid email address.");
            } else if (err?.code === "auth/weak-password") {
                setErrorMessage("Password must be at least 6 characters long.");
            } else if (err?.code === "auth/network-request-failed") {
                setErrorMessage("No internet connection. Please check your connection and try again.");
            } else {
                setErrorMessage("Could not create your account. Please try again.");
            }
        }
        finally {
            setSubmitting(false);
        }
    }

    return(
        <> 
            <div className="page">
                <div className="card">
                    <div className="header">
                        <div className="brand">
                        <div className="brand-icon">
                            <img alt="" src={shieldHalf}/>
                        </div>
                        <div>
                            <div className="brand-name">UniEval</div>
                            <div className="brand-sub">Performance System</div>
                        </div>
                        </div>
                        <Link to="/" className="back-link">
                        <img alt="" src={arrowBack}/>
                        Back to Home
                        </Link>
                    </div>
            
                    <div className="the-body">
                        <div className="left-panel">
                            <h1 className="left-title">
                                Create Your
                                <br />
                                <span className="left-title-highlight">Student Account</span>
                            </h1>
                            <p className="left-subtext">
                                Join UniEval and take charge of your academic journey.
                            </p>
                
                            <div className="image-placeholder">
                                <img alt="" src={studentIllustration}/> 
                            </div>
                
                            <div className="features">
                                <div className="feature">
                                <div className="feature-icon">
                                    <img alt="" src={chart}/>
                                </div>
                                <div>
                                    <div className="feature-title">Track Your Performance</div>
                                    <div className="feature-desc">
                                    Monitor your grades and academic progress
                                    </div>
                                </div>
                                </div>
                                <div className="feature">
                                    <div className="feature-icon">
                                        <img alt="" src={studentEvaluation}/>
                                    </div>
                                    <div>
                                        <div className="feature-title">View Evaluations</div>
                                        <div className="feature-desc">
                                        Check your evaluation results and feedback
                                        </div>
                                    </div>
                                    </div>
                                    <div className="feature">
                                    <div className="feature-icon">
                                        <img alt="" src={download}/>
                                    </div>
                                    <div>
                                        <div className="feature-title">Download Reports</div>
                                        <div className="feature-desc">
                                        Get your academic reports and transcripts
                                        </div>
                                    </div>
                                </div>
                            </div>
                
                            <div className="login-here">
                                Already have an account? <Link to="/student/login">Login here</Link>
                            </div>
                        </div>


                        
                        <div className="right-panel">
                            <h2 className="form-title">Student Registration</h2>
                            <p className="form-subtext">
                                Fill in the details below to create your account.
                            </p>
            
                            <form onSubmit={submitDetails}>
                                <div className="form-row">
                                    <div className="form-field">
                                        <label>Full Name</label>
                                        <div className="input-wrap">
                                            <span className="input-icon">
                                                <img alt="" src={userName}/>
                                            </span>
                                            <input
                                                type="text"
                                                placeholder="Enter your full name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-field">
                                        <label>Matric Number</label>
                                        <div className="input-wrap">
                                            <span className="input-icon">
                                                <img alt="" src={matricIcon}/>
                                            </span>
                                            <input
                                                type="text"
                                                placeholder="e.g. 2023/123456"
                                                value={matric}
                                                onChange={(e) => setMatric(e.target.value)}
                                                pattern="[0-9]{4}/[0-9]{6}"
                                                title="Use the format 2023/123456: 4 digits, a slash, then 6 digits"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                
                                <div className="form-row">
                                    <div className="form-field">
                                        <label>Email Address</label>
                                        <div className="input-wrap">
                                            <span className="input-icon">
                                                <img alt="" src={emails}/>
                                            </span>
                                            <input
                                                type="email"
                                                placeholder="Enter your email address"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-field">
                                        <label>Phone Number</label>
                                        <div className="input-wrap">
                                        <span className="input-icon">
                                            <img alt="" src={phoneIcon}/>
                                        </span>
                                        <input
                                            type="tel"
                                            pattern="[0-9]{11}" 
                                            placeholder="08012345678"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                        />
                                        </div>
                                    </div>
                                </div>
                
                                <div className="form-row">
                                    <div className="form-field">
                                        <label>Department</label>
                                        <div className="input-wrap">
                                            <span className="input-icon">
                                                <img alt="" src={departmentIcon}/>
                                            </span>
                                            <select
                                                value={department}
                                                onChange={(e) => setDepartment(e.target.value)}
                                                required
                                            >
                                                <option value="" disabled>
                                                Select your department
                                                </option>
                                                <option value="Computer Science">Computer Science</option>
                                                <option value="Mechanical Engineering">Mechanical Engineering</option>
                                                <option value="Law">Law</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-field">
                                        <label>Level</label>
                                        <div className="input-wrap">
                                            <span className="input-icon">
                                                <img alt="" src={levelIcon}/>
                                            </span>
                                            <select
                                                value={level}
                                                onChange={(e) => setLevel(e.target.value)}
                                                required
                                            >
                                                <option value="" disabled>
                                                Select your level
                                                </option>
                                                <option value="100">100 Level</option>
                                                <option value="200">200 Level</option>
                                                <option value="300">300 Level</option>
                                                <option value="400">400 Level</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                
                                <div className="form-field full">
                                    <label>Password</label>
                                    <div className="input-wrap">
                                        <span className="input-icon">
                                        <img alt="" src={lock}/>
                                        </span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            minLength={6}
                                            required
                                        />
                                        <button
                                        type="button"
                                        className="toggle-visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                        <img src={showPassword ? eyeClose : eye} alt={showPassword ? "Hide password" : "Show password"} />
                                        </button>
                                    </div>
                                    
                                    <div className="hint">
                                        Password must be at least 6 characters long
                                    </div>
                                </div>
                
                                
                
                                <label className="checkbox-row">
                                    <input type="checkbox" required/>
                                    <span>
                                        I agree to the <Link to="/terms#terms" target="_blank">Terms of Service</Link> and{" "}
                                        <Link to="/terms#privacy" target="_blank">Privacy Policy</Link>
                                    </span>
                                </label>

                                {errorMessage && (
                                    <p className="form-error" role="alert">{errorMessage}</p>
                                )}

                                <button type="submit" className="submit-btn" disabled={submitting}>
                                    {submitting ? "Creating account..." : "Create Account"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StudentRegistration;
