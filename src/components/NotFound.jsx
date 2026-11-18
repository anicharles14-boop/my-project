import { Link } from "react-router-dom";
import "../styles/InfoPage.css";

// Shown for any address that doesn't match a page in the app.
function NotFound() {
    return (
        <div className="info-page">
            <div className="info-card info-card-small">
                <p className="info-code">404</p>
                <h1>Page not found</h1>
                <p>The page you're looking for doesn't exist or has been moved.</p>

                <div className="info-actions">
                    <Link to="/" className="info-btn">Go to home page</Link>
                    <Link to="/student/login" className="info-btn info-btn-outline">Student login</Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
