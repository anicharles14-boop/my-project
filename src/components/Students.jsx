import Navbar from "./Navbar";
import Header from "./Header";

function Student(){
    return(
        <div className="universal-layout">
            <Navbar/>
            <div className="layout">
                
                <Header/>
                <p>Student</p>
            </div>
        
        </div>
        
    )
}
export default Student