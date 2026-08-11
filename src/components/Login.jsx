
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

import { auth, googleProvider } from "../config/firebase";

import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    // Email and password login
    const signin = async (e) => {

        e.preventDefault();

        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            navigate("/dashboard");

        } catch (err) {

            console.error("Login failed:", err);

        }
    };


    // Google login
    const signinGoogle = async () => {

        try {

            await signInWithPopup(
                auth,
                googleProvider
            );

            navigate("/dashboard");

        } catch (err) {

            console.error("Google sign-in failed:", err);

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
                        <img src={eye} className="eye" />


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
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                        </label>

                    </div>


                    <div className="login-options">

                        


                        <a href="#">
                            Forgot Password
                        </a>

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


                        <p>

                            Don't have an account?{" "}

                            <Link to="/signup">
                                Sign up
                            </Link>

                        </p>


                    </div>

                </form>

            </div>

        </div>

    );
}

export default Login;
