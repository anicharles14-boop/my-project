import "../styles/StudentRegistration.css";
import illustration from "../../assets/student-illustration.svg"
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import shieldHalf from "../../assets/shield-half.svg";
import studentEvaluation from "../../assets/student-evaluation.svg";
import chart from "../../assets/chart.svg";
import studentIllustration from "../../assets/student-illustration.png";
import arrowBack from "../../assets/arrow-back.svg";
import userName from "../../assets/user-name.svg";
import phoneIcon from "../../assets/phone-icon.svg";
import matricIcon from "../../assets/matric-icon.svg";
import emails from "../../assets/emails.svg";
import lock from "../../assets/lock.svg";
import eye from "../../assets/eye.svg";

function StudentRegistration() {

    const [name, setName] = useState("");
    const [phone, setPhone] = useState();
    const [matric, setMatric] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");
    const [level, setLevel] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const studentsCollection = collection(db, "students");

    async function submitDetails(e){
        e.preventDefault();

        try{
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            await addDoc(studentsCollection, {
                uid: userCredential.user.uid,
                name: name,
                "matric number": matric,
                phone: Number(phone),
                "email address": email,
                department: department,
                level: level
                
            })
            navigate("/student/dashboard");
        }
        catch(err){
            console.log(err)
        }
    }

    return(
        <> 
            <div className="page">
                <div className="card">
                    <div className="header">
                        <div className="brand">
                        <div className="brand-icon">
                            <img src={shieldHalf}/>
                        </div>
                        <div>
                            <div className="brand-name">UniEval</div>
                            <div className="brand-sub">Performance System</div>
                        </div>
                        </div>
                        <a href="#" className="back-link">
                        <img src={arrowBack}/>
                        Back to Login
                        </a>
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
                                <img src={studentIllustration}/> 
                            </div>
                
                            <div className="features">
                                <div className="feature">
                                <div className="feature-icon">
                                    <img src={chart}/>
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
                                        <img src={studentEvaluation}/>
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
                                        yes
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
                                                <img src={userName}/>
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
                                                <img src={matricIcon}/>
                                            </span>
                                            <input
                                                type="text"
                                                placeholder="Enter your matric number"
                                                value={matric}
                                                onChange={(e) => setMatric(e.target.value)}
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
                                                <img src={emails}/>
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
                                            <img src={phoneIcon}/>
                                        </span>
                                        <input
                                            type="tel"
                                            pattern="[0-9]{11}" 
                                            placeholder="0801-123-1234"
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
                                            <select
                                                value={department}
                                                onChange={(e) => setDepartment(e.target.value)}
                                                required
                                            >
                                                <option value="" disabled>
                                                Select your department
                                                </option>
                                                <option value="Computer Science">Computer Science</option>
                                                <option value="Engineering">Engineering</option>
                                                <option value="Business Administration">Business Administration</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-field">
                                        <label>Level</label>
                                        <div className="input-wrap">
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
                                        <img src={lock}/>
                                        </span>
                                        <input
                                            type="password"
                                            placeholder="Create a password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                        type="button"
                                        className="toggle-visibility"
                                        >
                                        <img src={eye}/> 
                                        </button>
                                    </div>
                                    
                                    <div className="hint">
                                        Password must be at least 8 characters long
                                    </div>
                                </div>
                
                                
                
                                <label className="checkbox-row">
                                    <input type="checkbox" />
                                    <span>
                                        I agree to the <a href="#">Terms of Service</a> and{" "}
                                        <a href="#">Privacy Policy</a>
                                    </span>
                                </label>
                
                                <button type="submit" className="submit-btn">
                                    Create Account
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
