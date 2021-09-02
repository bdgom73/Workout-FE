import axios from "axios";
import moment from "moment";
import { useEffect } from "react";
import { useState } from "react";
import { Badge, Button, Col, Form, Row, Table } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { useHistory, useRouteMatch } from "react-router-dom";
import { dateFormat } from "../../common";
import route from "../../route";
import useMember from "../../useCustom/useMember";

export default function ShareRoutineDetail(){

    const {data} = useMember();
    const [cookies] = useCookies();
    const {params} = useRouteMatch();
    const history = useHistory();

    const [routineID] = useState(params.id);
    const [routine, setRoutine] = useState({});
    const [member , setMember] = useState({});
    
    const getRoutineDetail = ()=>{
        try{
            axios.get(route.GET_SHARE_ROUTINE(routineID), {headers : route.AUTH_TOKEN(cookies.SSID)})
            .then(res=>{
                console.log(res);
                setRoutine(res.data.data || []);
            })
            .catch(e=> console.log(e.response));
        }catch{

        }     
    }

    useEffect(getRoutineDetail,[]);
    useEffect(()=>{setMember(data.member || {});},[data])

    const showCreationDate = ()=>{
        const createdDate = dateFormat(routine.createdDate);
        const modifiedDate = dateFormat(routine.modifiedDate);
        if(createdDate === modifiedDate) return createdDate;
        else return <>{modifiedDate} &nbsp; <Badge bg="secondary">수정됨</Badge></>;
    }

    return(
        <>
        <div className="custom_div">
            <div className="d-flex mt-3 justify-content-between">
                <Button size="sm" variant="outline-dark" onClick={()=> history.goBack(-1)}>뒤로가기</Button>       
            </div>
            <hr/>
            <div className="mt-3 ">   
                <h2>{routine.title}</h2>    
            </div>  
            <div className="mt-3 d-flex justify-content-between">   
                <span>
                    <Badge bg="dark">작성자</Badge>  &nbsp;
                    <small style={{color : "#808080"}}>{routine.member_name || "알수없음"}</small>
                </span>
                <span>
                    <Badge bg="dark">작성일</Badge>  &nbsp;
                    <small style={{color : "#808080"}}>
                        {showCreationDate()}
                    </small>
                </span>
            </div>
            <div className="d-flex justify-content-between mt-3">
                <Row xs="auto" >
                    <Col style={{fontWeight:"bold"}}>구분</Col>
                    <Col><small>{routine.part}</small></Col>
                </Row>
                <Row xs="auto" >
                    <Col style={{fontWeight:"bold"}}>운동수</Col>
                    <Col><small>{routine.volumes ? routine.volumes.length : 0}</small></Col>
                </Row>
            </div>              
            <Table>
                <thead>
                    <tr>
                        <th>#</th>  
                        <th>운동명</th>
                        <th>부위</th>
                        <th>set x num</th>
                    </tr>    
                </thead>
                <tbody>
                {
                    routine.volumes ? 
                    routine.volumes.length > 0 ?
                    routine.volumes.map((v,i)=>{
                        const w = v.workout;
                        return(
                            <tr key={v.id}>   
                                <td>{i+1}</td>  
                                <td ><span>{w.name}</span></td>
                                <td>{w.part}</td>
                                <td>{v.sets} x {v.num}</td>
                            </tr>
                        );
                    }) :
                    <tr><td colSpan="4" className="text-center">운동이 없습니다.</td></tr> :<></>
                }
                </tbody>         
            </Table>   
            <div className="btn_wrap">
                {
                    member.id === routine.member_id ? 
                    <Button  onClick={()=> history.push(`/routine/${routineID}`)}>수정하러가기</Button> : 
                    <Button variant="success" onClick={()=> history.push(`/routine/${routineID}`)}>루틴 복사</Button>
                }
               
            </div>
        </div>
        </>
    );
}