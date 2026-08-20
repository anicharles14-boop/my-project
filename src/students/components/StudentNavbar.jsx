import "../../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import dashboard from "../../assets/dashboard.svg";
import shieldHalf from "../../assets/shield-half.svg";
import student from "../../assets/student.svg";
import evaluation from "../../assets/evaluation.svg";
import report from "../../assets/report.svg";
import setting from "../../assets/setting.svg";
import logout from "../../assets/logout.svg"

function StudentNavbar(){
    
    const navigate = useNavigate();

    async function handleLogout(){
        try{
            await signOut(auth);
            navigate("/student/login")
        }
        catch(error){
            console.log(error)
        }
    }
    return(

        <div className="navbar-container">

            <div className="navbar-name-container">
                <div className="navbar-image">
                    <img src={shieldHalf}/>
                </div>
                
                <div className="navbar-name">
                    <h2>UniEval</h2>
                    <p>PERFORMANCE SYSTEM</p>
                </div>
                
            </div>
            <hr></hr>
            <div className="navbar-elements">
                <Link to="/student/dashboard" className="link">
                    <div className="dashboard" >
                        <img src={dashboard}/>
                        Dashboard
                    </div>
                </Link>
                
                <Link to="/student/profile"className="link">
                    <div className="student">
                        <img src={student}/>
                        Profile
                    </div>
                </Link>
                
                <Link to="/student/result" className="link">
                    <div className="evaluation">
                        <img src={evaluation}/>
                        Result
                    </div>
                </Link>
                
                <Link to="/report" className="link">
                    <div className="report">
                        <img src={report}/>
                        Reports
                    </div>
                </Link>
                
                <Link to="/setting" className="link">
                    <div className="setting">
                        <img src={setting}/>
                        Settings
                    </div>
                </Link>
                
                <Link className="link" onClick={handleLogout}>
                    <div className="navbar-logout">
                        <img src={logout}/>
                        
                        Logout
                    </div>
                </Link>
                
            </div>
            
            
        </div>

            
                    
    )
}
export default StudentNavbar