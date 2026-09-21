
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

import shield from "../assets/shield.svg";
import emails from "../assets/emails.svg";
import lock from "../assets/lock.svg";
import eye from "../assets/eye.svg";
import signinLock from "../assets/signinLock.svg";
import google from "../assets/google.svg";
import secure from "../assets/secure.svg";

import { adminAuth, googleProvider, db } from "../config/firebase";

import { signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const ensureAdminAccess = async (uid) => {
        const adminQuery = query(
            collection(db, "admins"),
            where("uid", "==", uid)
        );

        const adminSnapshot = await getDocs(adminQuery);

        if (adminSnapshot.empty) {
            await signOut(adminAuth);
            throw new Error("This account does not have admin access.");
        }
    };

    // Email and password login
    const signin = async (e) => {

        e.preventDefault();
        setErrorMessage("");

        try {

            const userCredential = await signInWithEmailAndPassword(
                adminAuth,
                email,
                password
            );

            await ensureAdminAccess(userCredential.user.uid);

            navigate("/admin/dashboard");

        } catch (err) {

            console.error("Login failed:", err);
            setErrorMessage("Username or password is incorrect");

        }
    };


    // Google login
    const signinGoogle = async () => {

        try {

            const userCredential = await signInWithPopup(
                adminAuth,
                googleProvider
            );

            await ensureAdminAccess(userCredential.user.uid);

            navigate("/admin/dashboard");

        } catch (err) {

            console.error("Google sign-in failed:", err);
            setErrorMessage("Username or password is incorrect");

        }
    };


    return (

        <div className="login-page">

            <div className="login-container">

                <img src={shield} className="shield"/>

                <h1>Admin Login</h1>


                <form onSubmit={signin}>

                    <div className="ep-input-login">

                        <img src={emails} className="email"/>
                        <img src={lock} className="lock" />
                        <img src={eye} className="eye" 
                        onClick={() => setShowPassword(!showPassword)}
                        />


                        <label>
                            Email Address
                            <br />

                            <input
                                className="email-input"
                                type="email"
                                placeholder="admin@gmail.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />

                        </label>


                        <br />


                        <label>

                            Password
                            <br />

                            <input
                                className="password-input"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                            {errorMessage && (
                                <div className="error-message" style={{ color: "red", marginTop: "0px", fontSize: "13px", lineHeight: "1.2" }}>
                                    {errorMessage}
                                </div>
                            )}

                        </label>

                    </div>


                    <div className="signin">


                        {/* Email/password login */}

                        <button
                            className="signin-btn"
                            type="submit"
                        >

                            <img
                                src={signinLock}
                                className="signin-lock-signin"
                            />

                            Sign in

                        </button>


                        <div className="line">

                            <hr />

                            <span>OR</span>

                            <hr />

                        </div>


                        {/* Google login */}

                        <button
                            type="button"
                            className="signin-google"
                            onClick={signinGoogle}
                        >

                            <img
                                src={google}
                                className="google-signin"
                            />

                            Sign in with Google

                        </button>


                        {/*<p>

                            Don't have an account?{" "}

                            <Link to="/admin/signup">
                                Sign up
                            </Link>

                        </p>*/}


                    </div>

                </form>

            </div>

        </div>

    );
}

export default Login;
