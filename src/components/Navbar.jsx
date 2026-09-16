import "../styles/Navbar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import dashboard from "../assets/dashboard.svg";
import shieldHalf from "../assets/shield-half.svg";
import student from "../assets/student.svg";
import evaluation from "../assets/evaluation.svg";
import report from "../assets/report.svg";
import setting from "../assets/setting.svg";
import logout from "../assets/logout.svg"

function Navbar(){
    
    const navigate = useNavigate();

    async function handleLogout(){
        try{
            await signOut(auth);
            navigate("/student/login");
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
                <NavLink to="/dashboard" className={({ isActive }) => `link${isActive ? " active" : ""}`}>
                    <div className="dashboard" >
                        <img src={dashboard}/>
                        Dashboard
                    </div>
                </NavLink>
                
                <NavLink to="/student" className={({ isActive }) => `link${isActive ? " active" : ""}`}>
                    <div className="student">
                        <img src={student}/>
                        Students
                    </div>
                </NavLink>
                
                <NavLink to="/evaluation" className={({ isActive }) => `link${isActive ? " active" : ""}`}>
                    <div className="evaluation">
                        <img src={evaluation}/>
                        Evaluation
                    </div>
                </NavLink>
                
                
                
                <NavLink to="/setting" className={({ isActive }) => `link${isActive ? " active" : ""}`}>
                    <div className="setting">
                        <img src={setting}/>
                        Settings
                    </div>
                </NavLink>
                
                <Link className="link navbar-logout" onClick={handleLogout}>
                    <div >
                        <img src={logout}/>
                        
                        Logout
                    </div>
                </Link>
                
            </div>
            
            
        </div>

            
                    
    )
}
export default Navbar