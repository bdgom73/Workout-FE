
import moment from "moment";
import { useEffect } from "react";
import { useCallback } from "react";
import { useMemo } from "react";
import { useContext } from "react";
import { useState } from "react";
import {  Form, FormControl, Nav, Navbar,Button, Badge } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import useMember from "../../useCustom/useMember";

export default function Header(){

    // const {} = useMember();
    const history = useHistory();
    const [cookies,_,removeCookies] = useCookies();
    const [time,setTime] = useState("불러오는중");
    const [intervalId, setIntervalId] = useState("");

    const [logoutAct,setLogoutAct] = useState(false);

    const [term, setTerm] = useState("");

    const expTime = ()=>{   
        const t1 = moment(cookies.exp);
        const t2 = moment().format("YYYY-MM-DD HH:mm:ss");       
        let time = moment.duration(t1.diff(t2));           
        if(time.asSeconds() < 0) {
            window.localStorage.removeItem("SSID");
            removeCookies("exp");
            removeCookies("SSID");  
            history.go(0);
        }    
        const dateTime = {
            hours : time.hours(),
            min : time.minutes(),
            sec : time.seconds()
        }
        
        return `${dateTime.hours.toString().length > 1 ? dateTime.hours : "0"+dateTime.hours} : 
        ${dateTime.min.toString().length > 1 ? dateTime.min : "0"+dateTime.min} :
        ${dateTime.sec.toString().length > 1 ? dateTime.sec : "0"+dateTime.sec}`;
        
    };

    useEffect(() => {
        if(cookies.exp){
            let interval = setInterval(() => {
                setTime(expTime());
            }, 1000);
            setIntervalId(interval);
            return () => {
                clearInterval(interval);
            };
        }
       
      }, [cookies.exp]);
   
    const searchHandler = ()=>{history.push(`/search=${term}`);}

    return(
        <Navbar collapseOnSelect  expand="lg" bg="dark" variant="dark" style={{padding : "10px"}} >          
            <Navbar.Brand href="/">Workout App</Navbar.Brand>      
            <Navbar.Toggle aria-controls="responsive-navbar-nav"/>     
            <Navbar.Collapse id="responsive-navbar-nav">      
                <Form.Text style={{margin : "0 5px"}}>
                    로그인 유지시간
                    <Badge bg="primary" style={{display:"block"}} onClick={()=>{setLogoutAct(!logoutAct)}}>
                        {logoutAct ? <span className="span_btn" onClick={()=> {
                            window.localStorage.removeItem("SSID");
                            removeCookies("exp",{path:"/"});
                            removeCookies("SSID",{path:"/"});  
                            
                            window.location.reload();
                        }}>logout</span> : time}       
                    </Badge>   
                </Form.Text>    
                 
                <Nav className="me-auto">
                    <Nav.Link href="/">Calendar</Nav.Link>
                    <Nav.Link href="/routine">Routine</Nav.Link>
                    <Nav.Link href="/workout">Workout</Nav.Link>   
                    <Nav.Link href="/share/routine">Share</Nav.Link>            
                </Nav>          
                <Form className="d-flex">     
                    <FormControl
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        defaultValue={term}
                        onChange={(e)=> setTerm(e.target.value)}
                        onKeyPress={(e)=>{ if(e.key === "Enter") searchHandler(); }}
                    />
                    <Button className="outline-success" onClick={searchHandler}>Search</Button>
                </Form>                      
            </Navbar.Collapse>         
        </Navbar>
    )
}