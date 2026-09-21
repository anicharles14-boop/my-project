import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import shield from "../../assets/shield.svg";
import emails from "../../assets/emails.svg";
import lock from "../../assets/lock.svg";
import eye from "../../assets/eye.svg";
import signupLock from "../../assets/signinLock.svg";
import { studentAuth, db } from "../../config/firebase";

import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

function StudentLogin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const ensureStudentAccess = async (uid) => {
        const studentQuery = query(
            collection(db, "students"),
            where("uid", "==", uid)
        );

        const studentSnapshot = await getDocs(studentQuery);

        if (studentSnapshot.empty) {
            await signOut(studentAuth);
            throw new Error("This account does not have student access.");
        }
    };

    const signin = async (e) => {

        e.preventDefault();
        setErrorMessage("");

        try {
            const userCredential = await signInWithEmailAndPassword(
                studentAuth,
                email,
                password
            );

            await ensureStudentAccess(userCredential.user.uid);
            navigate("/student/dashboard");
        } catch (err) {
            console.error("Login failed:", err);
            setErrorMessage("Username or password is incorrect");
        }
    };
    
    return (

        <div className="signup-page">
            <div className="signup-container">
                <img src={shield} className="shield" alt="shield" />
                <h1>Student Login</h1>
                <p className="subtitle">Sign in to your account</p>

                <form onSubmit={signin}>
                    <div className="ep-input-signup">
                        <img src={emails} className="email" alt="email icon" />
                        <img src={lock} className="lock" alt="lock icon" />
                        <img src={eye} className="eye-signup" alt="eye icon"
                        onClick={() => setShowPassword(!showPassword)}
                         />

                        <label>
                        Email Address<br />
                        <input
                            type="email"
                            placeholder="student@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        </label>
                        <br />
                        <label>
                        Password<br />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {errorMessage && (
                            <div className="error-message" style={{ color: "red", marginTop: "0px", fontSize: "13px", lineHeight: "1.2" }}>
                                {errorMessage}
                            </div>
                        )}
                        </label>
                    
                    </div>

                    <div className="signup-actions">
                        <button className="signup-btn" type="submit">
                            <img src={signupLock} className="signup-lock" alt="lock icon" />
                            Sign in
                        </button>

                        <p>
                            Dont have an account? {""}
                            <Link to="/student/registration">Register</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default StudentLogin;
