import Navbar from "./Navbar";
import Header from "./Header";

function Dashboard(){
    return(
        <div className="universal-layout">
            <Navbar/>
            <div className="layout">
                
                <Header/>
                <p>Dashboard</p>
            </div>
        
        </div>
        
    )
}
export default Dashboard