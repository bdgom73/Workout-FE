import axios from "axios";
import moment from "moment";
import { useEffect } from "react";
import { useState } from 'react';
import { Alert, Button, Form, Modal, Table } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { Link, useHistory } from "react-router-dom";
import route from "../../route";
import useModal from "../../useCustom/useModal";
import { MdArrowDropDown,MdArrowDropUp } from 'react-icons/md';


export default function WorkoutStateDetail(props){

    // Props 
    const {data,update} = props;
    
    // Custom Hooks
    const {modal, setModal, eventModal, close} = useModal();

    // State 
    const [workout , setWorkout] = useState(data.data.isWorkout);
    const [cookies] = useCookies();


    // Effect Mount
    useEffect(()=> setWorkout(data.data.isWorkout),[data]);
    useEffect(()=> eventModal(),[modal]);

    // HTTP request
    const changeWorkoutStateHandler = (e)=>{
        let state = workout;    
        let url = `/myApi/workout/${moment(data.start).format("YYYY-MM-DD")}/change/isWorkout=${!state}`
        axios.get(url,{headers : route.AUTH_TOKEN(cookies.SSID)})
        .then(res=>{
            setWorkout(res.data.data.isWorkout);
            update(true);
        });
      
    };

    

    return(
        <>       
        <div>    
            <Alert variant={workout  ? "primary" : "danger"}>
                <Alert.Heading>{moment(data.start).format("YYYY-MM-DD")}</Alert.Heading>
                <p>
                    현재상태 :  {workout ? "운동함" : "운동안함"}
                </p>      
            </Alert>
            <div>{data.memo}</div>
            <div className="dot_header" data-color={
                workout  ? "ok" : "no"
            }>상태변경</div>
            <div className="d-grid gap-2 mt-1">  
                <Button size="lg" variant={workout ? "danger" : "primary"} onClick={changeWorkoutStateHandler} >
                    {workout  ? "운동안함" : "운동함"}
                </Button>
            </div>          
        </div>       
        </>
    );
}

