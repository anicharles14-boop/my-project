import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/InfoPage.css";

// Linked from the registration form ("I agree to the Terms of Service and
// Privacy Policy"). Review this wording with your school before going live.
function Terms() {
    const location = useLocation();

    // Jump to the right section for /terms#terms or /terms#privacy.
    // The short delay lets the router finish resetting the scroll first.
    useEffect(() => {
        if (!location.hash) {
            return;
        }

        const timer = setTimeout(() => {
            document.getElementById(location.hash.slice(1))?.scrollIntoView();
        }, 50);

        return () => clearTimeout(timer);
    }, [location.hash]);

    return (
        <div className="info-page">
            <div className="info-card">
                <Link to="/" className="info-brand">UniEval</Link>

                <h1>Terms of Service and Privacy Policy</h1>
                <p>
                    UniEval is the system your school uses to record your course
                    evaluations and show you your results.
                </p>

                <h2 id="terms">Terms of Service</h2>
                <ul>
                    <li>Register with your own details and your real matric number. Each student should have one account.</li>
                    <li>Keep your password private. You are responsible for anything done with your account.</li>
                    <li>Scores are entered by your lecturers and school staff. If a result looks wrong, contact your department; students can't change scores.</li>
                    <li>The assistant on your dashboard is a study aid. Your official results are the ones recorded by the school.</li>
                    <li>The school may remove accounts, for example when a student leaves.</li>
                </ul>

                <h2 id="privacy">Privacy Policy</h2>
                <ul>
                    <li>
                        <b>What we store:</b> your name, matric number, email address, phone number,
                        department, level, and your course scores (attendance, assignment, test and exam)
                        with the date they were recorded.
                    </li>
                    <li><b>Where it is stored:</b> Google Firebase (Firebase Authentication and Cloud Firestore).</li>
                    <li><b>Who can see it:</b> you, and school staff with admin accounts.</li>
                    <li>
                        <b>The assistant:</b> when you use it, your profile and results are sent to
                        Google's Gemini AI service so it can answer your questions.
                    </li>
                    <li>
                        <b>Your choices:</b> you can update your name and phone number on your Profile page.
                        To have your account removed, contact the school.
                    </li>
                </ul>

                <p className="info-updated">Last updated: November 2026</p>

                <div className="info-actions">
                    <Link to="/student/registration" className="info-btn">Back to registration</Link>
                    <Link to="/" className="info-btn info-btn-outline">Home page</Link>
                </div>
            </div>
        </div>
    );
}

export default Terms;
