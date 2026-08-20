import StudentNavbar from "./StudentNavbar"
import Header from "../../components/Header"


function StudentResult(){
    return(
        <div className="universal-layout">
            <StudentNavbar/>
            <div className="layout">
                
                <Header/>
                <p>Student Result</p>
            </div>
        
        </div>
        
    )
}
export default StudentResult