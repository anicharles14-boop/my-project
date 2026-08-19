import { useState } from "react";
import { db } from "../../config/firebase";
import { getDocs, addDoc, collection } from "firebase/firestore";



function StudentProfile() {
    const [details, setDetails] = useState([]);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState(0);
    const [matric, setMatric] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");
    const [level, setLevel] = useState("");

    const studentsCollection = collection(db, "students")

    function displayDetails(e){
        
    }
    async function getStudents(){
        try{
            const data = await getDocs(studentsCollection)
            const filteredData = data.docs.map( (doc)=>({
            ...doc.data(),
            id:doc.id}));
            setDetails(filteredData)
        }catch(err){
            console.error(err)
        }
        
    }

    async function addStudent(){
        try{
            await addDoc(studentsCollection, {
                name: name,
                "matric number": matric,
                phone: phone
            })
        }
        catch(err){
            console.log(err)
        }
    }
    return(
        
        <div>
            <input onChange={(e)=>setName(e.target.value)}/>
            <input onChange={(e)=>setMatric(e.target.value)}/>
            <input />
            <input type="number" onChange={(e)=>setPhone(e.target.value)}/>
            <input />
            <input/>
            <button onClick={addStudent}>add student</button>
            <br/>
            <button onClick={getStudents}>click</button>
            <div>
                {details.map((detail) => (
                    <>
                        <div>{detail.name}</div>
                        <div>{detail["email address"]}</div>
                    </>
                    
                ))}
            </div>
        </div>
    )
}

export default StudentProfile;
