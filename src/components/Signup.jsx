import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";
import shield from "../assets/shield.svg";
import emails from "../assets/emails.svg";
import lock from "../assets/lock.svg";
import eye from "../assets/eye.svg";
import signupLock from "../assets/signinLock.svg";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()

  const signup = async (e) => {
    e.preventDefault();

    // no confirm-password check

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard")

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <img src={shield} className="shield" alt="shield" />
        <h1>Admin Signup</h1>
        <p className="subtitle">Create an administrator account</p>

        <form onSubmit={signup}>
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
              Sign up
            </button>

            <p>
                Already have an account?
                <Link to="/">Log in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
