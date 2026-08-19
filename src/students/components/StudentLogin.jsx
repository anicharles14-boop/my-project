import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import shield from "../../assets/shield.svg";
import emails from "../../assets/emails.svg";
import lock from "../../assets/lock.svg";
import eye from "../../assets/eye.svg";
import signupLock from "../../assets/signinLock.svg";
import { auth} from "../../config/firebase";

import { signInWithEmailAndPassword } from "firebase/auth";

function StudentLogin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const signin = async (e) => {

        e.preventDefault();

        try {
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            navigate("/student/profile");
        } catch (err) {
            console.error("Login failed:", err);
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
                        <img src={eye} className="eye-signup" alt="eye icon" />

                        <label>
                        Email Address<br />
                        <input
                            type="email"
                            placeholder="admin@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        </label>
                        <br />
                        <label>
                        Password<br />
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
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
