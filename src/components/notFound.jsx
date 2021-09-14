import { GiSpaceSuit } from 'react-icons/gi';
import { AiOutlineStop } from 'react-icons/ai';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { useEffect } from 'react';

export default function NotFound(){

    const history = useHistory();


    useEffect(()=>{
       document.body.style.overflow = "hidden";

       return()=>{
            document.body.style.overflow = "auto";
       }
    },[])

    return(
        <>
        <div  style={{position:"absolute",top:"0px", left:"0px", backgroundColor : "#2a2a2a", width : "100%", height:"100%"}}>
            <img src="/images/logo1.png" alt="logo" style={{width:"120px"}} onClick={()=>history.push("/")}/>
            <div className="d-flex  justify-content-center">
                <div className="d-flex  justify-content-center mt-5" >
                    <GiSpaceSuit color="#fff" size="200"/>
                    <div style={{color : "#2a2a2a", height:"180px",fontSize:"50px", textAlign:"center", background:"#ffffff",boxShadow:"2px 2px 5px 1px #000000",padding:"5px",borderRadius:"10px"}}>
                        <article className="d-flex justify-content-center align-items-center" style={{fontWeight:"bold"}}>
                            <AiOutlineStop size="40" color="#dc3545"/>404
                        </article>
                        <article style={{fontWeight:"bold"}}>NOT FOUND</article>
                    </div>
                </div>    
            </div> 
            <div style={{textAlign:"center"}} className="mt-3">
                <Button variant="light" onClick={()=>history.push("/")}>첫 페이지로</Button>
            </div>
        </div>
        </>
    );
}