import "../styles/Navbar.css";
import { Link } from "react-router-dom";
import dashboard from "../assets/dashboard.svg";
import shieldHalf from "../assets/shield-half.svg";
import student from "../assets/student.svg";
import evaluation from "../assets/evaluation.svg";
import report from "../assets/report.svg";
import setting from "../assets/setting.svg";
import logout from "../assets/logout.svg"

function Navbar(){
    
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
                <Link to="/dashboard" className="link">
                    <div className="dashboard" >
                        <img src={dashboard}/>
                        Dashboard
                    </div>
                </Link>
                
                <Link to="/student"className="link">
                    <div className="student">
                        <img src={student}/>
                        Students
                    </div>
                </Link>
                
                <Link to="/evaluation" className="link">
                    <div className="evaluation">
                        <img src={evaluation}/>
                        Evaluation
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
                
                <Link className="link">
                    <div className="navbar-logout">
                        <img src={logout}/>
                        
                        Logout
                    </div>
                </Link>
                
            </div>
            
            
        </div>

            
                    
    )
}
export default Navbar