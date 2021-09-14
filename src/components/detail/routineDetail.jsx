import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { Alert, Button, Col, Form, Row, Tablem,Modal, Table } from "react-bootstrap";
import { RiCloseCircleFill } from "react-icons/ri";
import { FiShare2 } from "react-icons/fi";

import route from "../../route";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { useEffect } from "react";
import Workout from "../route/workout";
const partCom = ['가슴' , '등' , '어깨' , '팔' , '유산소' , '복근' , '하체'] ;
export default function RoutineDetail(){

    // USE ~~
    const {params} = useRouteMatch();
    const history = useHistory();

    // COOKIES DATA
    const [cookies] = useCookies();

    // UPDATE 여부
    const [update,setUpdate] = useState(false);

    // 단일, 다중 선택 여부
    const [single,setSingle] = useState(true);

    // REQUEST ROUTINE DATA
    const [routine,setRoutine] = useState({});

    const [currentVolume, setCurrentVolume] = useState({});

    /* UPDATE DATA VARIABLE */
    // PART
    const [part, setPart] = useState("");
    // PART === "기타" 때 PART 직접입력
    const [customPart,setCustomPart] = useState("");
    // TITLE
    const [title, setTitle] = useState("");
    const [share, setShare] = useState(false);
    // MODAL 
    const [show,setShow] = useState(false);
    const onShowHandler = () => setShow(true);
    const onCloseHandler = () => setShow(false);

    // ALERT MODAL
    const [alert, setAlert] = useState(false);
    const [alertChild, setAlertChild] = useState("");
    const onAlertShowHandler = ()=> setAlert(true);
    const onAlertHideHandler = ()=> setAlert(false);


    /* HTTP REQUEST */
    const getRoutineList = ()=>{    
        let url = `/myApi/workout/get/routine/${params.id}`;
        axios.get(url,{headers : route.AUTH_TOKEN(cookies.SSID)})
        .then(res=>{
            const result = res.data;
            console.log(res.data);
            if(result.result_state){
                setRoutine(result.data || {});
                setTitle(result.data.title);
                setShare(result.data.share);
                if(result.data.part === "가슴" || result.data.part === "등" || result.data.part === "하체" || result.data.part === "어깨" || result.data.part === "팔" ||
                result.data.part === "복근" || result.data.part === "유산소") {
                    setPart(result.data.part);
                }else{
                    setPart("기타");
                    setCustomPart(result.data.part);
                }
            }else{
                history.goBack(-1);
            }
        })
        .catch(e=>history.goBack(-1))
            
    }

    // EFFECT
    useEffect(getRoutineList,[])

    // 볼륨 변경
    const changeVolumeHandler = (data)=>{
        try{
            let sets = 0;
            let num = 0;
            const url = `/myApi/workout/update/${routine.id}/volume`;
            const resData = [{
                id : currentVolume.id,
                sets : sets,
                num : num,
                workout_id : data.id                                      
            }]
            axios.put(url, resData, {headers : route.AUTH_TOKEN(cookies.SSID)})
            .then(res=> {
                if(res.data.result_state){
                   setUpdate(false);  
                   setRoutine({...routine, volumes: res.data.data || []});                           
                }
            }).catch(e=> alert("변경에 실패했습니다."))
        }catch{

        }       
    }

    // 루틴 변경
    const changeRoutineHandler = ()=>{ 
        try{
            let volumes = [];
            const url = `/myApi/workout/update/routine/${routine.id}`;      
            if(routine.volumes){       
                volumes = routine.volumes.map(v=>{
                    return {
                        id : v.id,
                        num : parseInt(v.num),
                        sets : parseInt(v.sets),
                        workout_id : v.workout ? v.workout.id : 0
                    }
                });
            }
            const fd = {
                title : title,
                part : part === "기타" ? customPart : part,
                volumes : volumes
            }
            axios.put(url,fd,{headers:route.AUTH_TOKEN(cookies.SSID)})
            .then(res=>{
                console.log(res);
                if(res.data.result_state){
                    setUpdate(false);  
                    setRoutine(res.data.data || []);                           
                 }
            })
            .catch(e=> console.log(e.response.data))
        }catch{

        }
    }

    // 루틴제거
    const deleteRoutine = (id, type)=>{
        try{
            if(type){
                return axios.delete(`/myApi/workout/delete/${id}/routine`,{headers:route.AUTH_TOKEN(cookies.SSID)});
             }else{
                 axios.delete(`/myApi/workout/delete/${id}/routine`,{headers:route.AUTH_TOKEN(cookies.SSID)})
                .then(res=> {
                     if(res.data.result_state){
                        setRoutine(res.data.data || []);
                     }
                }).catch(e=> {
                    try{alert(e.response.data.message);}
                    catch{alert("알수 없는 이유로 삭제에 실패했습니다.");
                }})
            }
        }catch{
            alert("알수 없는 이유로 삭제에 실패했습니다.");
        }  
    }

    const shareRoutineHandler = ()=>{     
        onAlertShowHandler();
        setAlertChild(share ? "해당 루틴의 공유를 취소하시겠습니까?" : "해당 루틴을 공유하시겠습니까?");
    }

    // 운동선택 모달
    const modalPage = ()=>{
        return(
        <Modal show={show} onHide={onCloseHandler}>
            <Modal.Header closeButton>
                <Modal.Title>운동선택</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    single ? 
                    <Workout isModal single onSingleSelect={(d)=> {
                        if(window.confirm(d.name + "(으)로 변경하시겠습니까?")){
                            changeVolumeHandler(d);
                            onCloseHandler();
                        }
                    }}></Workout> :
                    <Workout isModal onSelect={(d)=> {
                        try{
                            if(routine.volumes){
                                let nArray = [...d];      
                                let pArray = [];
                                for(let i = 0 ; i < routine.volumes.length ; i++){
                                    nArray.push(routine.volumes[i].workout);
                                    pArray.push(routine.volumes[i].workout);
                                }
                                // 중복제거
                                let n2Array = nArray.filter((item, i) => {
                                    return (
                                        nArray.findIndex((item2, j) => {
                                        return item.id === item2.id;
                                    }) === i
                                    );
                                });          
                                // 차집합 
                                let difference = n2Array.filter(x => !pArray.some(y=> x.id === y.id));
                                let url =`/myApi/workout/add/${routine.id}/volume`;
                                let volumeData = difference.map(m=>{
                                    return {
                                        num : m.num,
                                        sets : m.sets,
                                        workout_id : m.id
                                    }
                                })
                                axios.post(url, volumeData , {headers :route.AUTH_TOKEN(cookies.SSID) })
                                .then(res=>{
                                    if(res.data.result_state){
                                        setRoutine({...routine, volumes: res.data.data || []});   
                                        onCloseHandler();
                                    }
                                })
                                .catch(e => console.log(e.response));
                            }
                        }catch{
                            alert("추가에 실패했습니다");
                        }
                        
                    }}></Workout>
                }           
            </Modal.Body>
        </Modal>
        );
    }

    const alertModal = ()=>{
        return (
            <Modal show={alert} onHide={onAlertHideHandler}>
                <Modal.Header>
                    <Modal.Title>알림</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {alertChild}
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <Button onClick={()=>{
                        try{
                            const url = `/myApi/workout/update/routine/${routine.id}/share=${!share}`;
                            axios.get(url,{headers:route.AUTH_TOKEN(cookies.SSID)})
                            .then(res=> {
                                if(res.data.result_state) {
                                    setShare(!share);
                                    onAlertHideHandler();
                                }
                            })
                            .catch(e=> {
                                setAlertChild("해당 공유 상태 변경에 실패했습니다.");
                            })
                        }catch{
                
                        }
                    }}>확인</Button>
                    <Button variant="secondary" onClick={onAlertHideHandler}>취소</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    return(
        <>
        {modalPage()}
        {alertModal()}
        <div className="custom_div">
            <div className="d-flex mt-3 justify-content-between">
                <Button size="sm" variant="outline-dark" onClick={()=> history.goBack(-1)}>뒤로가기</Button>
                <Button size="sm" variant={share ? "danger" : "primary"}  onClick={shareRoutineHandler}>
                    {
                    share ?
                    <>
                    <FiShare2/> 루틴 공유중
                    </> :
                    <>
                    <FiShare2/> 루틴 공유하기
                    </>
                    }
                </Button>
            </div>
            <hr/>
            <div className="mt-3 ">
                {
                    update ? 
                    <Form.Control defaultValue={routine.title} size="lg" style={{marginTop:"28px", width:"300px"}}
                    onChange={(e)=> setTitle(e.target.value)}/> :
                    <h2>{routine.title}</h2>    
                }
            </div>  
            <div className="d-flex justify-content-between mt-3">
                <Row xs="auto" >
                    <Col style={{fontWeight:"bold"}}>구분</Col>
                    <Col>
                    {
                        update ? 
                        <>         
                        <Form.Select as={Col} aria-label="Default select example" size="sm"
                        onChange={(e)=> setPart(e.target.value)} 
                        defaultValue={
                            (part === "가슴" || part === "등" || part === "하체" || part === "어깨" || part === "팔" ||
                            part === "복근" || part === "유산소" ) ? part : "기타"}>
                            <option value="">운동 부위를 입력해주세요</option>     
                            <option value="가슴">가슴</option>
                            <option value="등">등</option>
                            <option value="하체">하체</option>
                            <option value="어깨">어깨</option>
                            <option value="팔">팔</option>
                            <option value="복근">복근</option>
                            <option value="유산소">유산소</option>
                            <option value="기타">기타</option>
                        </Form.Select>
                        {
                            part === "기타" ? 
                            <Form.Control style={{marginTop:"5px"}} defaultValue={customPart} size="sm" onChange={(e)=> setCustomPart(e.target.value)}/>
                            : <></>
                        }
                        </> :
                        <small>{routine.part}</small>
                        
                    }
                    
                    </Col>
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
                        <th>세트수 x 횟수</th>
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
                                {
                                update ? 
                                <td>
                                    <Button variant="none" size="sm" onClick={()=>{
                                        let url = `/myApi/workout/delete/${routine.id}/volume`;
                                        axios.post(url,[v.id],{headers:route.AUTH_TOKEN(cookies.SSID)})
                                        .then(res=>{
                                            if(res.data.result_state){
                                                setRoutine({...routine, volumes : routine.volumes.filter(m=> m.id !== v.id)})
                                            }else{
                                                alert("삭제에 실패했습니다"); 
                                            }
                                        }).catch(e=> {
                                            try{
                                                alert(e.response.data.message);
                                            }catch{
                                                alert("알수 없는 이유로 인해 삭제에 실패했습니다.");
                                            }
                                            
                                        })
                                    }}>
                                        <RiCloseCircleFill color="#dc3545" size="18"/>
                                    </Button>
                                </td> : <td>{i+1}</td>
                                } 
                                <td >
                                    <span className={update ? "hover-underline" : ""} onClick={()=>{
                                            if(update){
                                                setCurrentVolume(v)
                                                setSingle(true);
                                                onShowHandler();                           
                                            }
                                    }}>{w.name}</span>    
                                </td>
                                <td>{w.part}</td>
                                <td>
                                    {
                                        update ? 
                                        <>    
                                        <input size="sm" min="0" max="9999" defaultValue={v.sets} type="number" onChange={(e)=>{
                                            let nArray = routine.volumes || [];
                                            nArray.filter(r=> r.id === v.id).forEach(c => c.sets = e.target.value);
                                            setRoutine({...routine, volumes : [...nArray] });
                                        }}/>
                                        &nbsp; x &nbsp;                          
                                        <input  size="sm" min="0" max="9999" defaultValue={v.num} type="number" onChange={(e)=>{
                                            let nArray = routine.volumes || [];
                                            nArray.filter(r=> r.id === v.id).forEach(c => c.num = e.target.value);
                                            setRoutine({...routine, volumes : [...nArray] });
                                        }}/>           
                                        </> : v.sets + " x " + v.num 
                                    }    
                                </td>
                            </tr>
                        );
                    }) :
                    <tr><td colSpan="4" className="text-center">운동이 없습니다.</td></tr> :<></>
                }
                </tbody>         
            </Table>
            <Button variant="success" className="mb-3" onClick={()=>{
                setSingle(false);
                onShowHandler();      
            }}>추가</Button> 
            {
            update ? 
            <>
            <Alert variant="dark" className="mb-0">
                <p style={{fontSize:"13px"}}>✔ <span className="hover-underline">[운동이름]</span> 클릭 시 운동을 변경할 수 있습니다.</p>
                <p style={{fontSize:"13px"}}>✔ <Button size="sm" variant="success" >추가</Button> 버튼 클릭시 여러 운동을 추가할 수 있습니다.</p>
                <p style={{fontSize:"13px"}}>✔ <Button size="sm" variant="warning">변경</Button> 버튼 클릭시 제목 , 구분 및 세트 x 횟수 변경 가능합니다.</p>
            </Alert>
            </> : ""
            }  
            <hr/>
            <div className="btn_wrap">        
                <Button variant={update ? "warning" : "primary"} onClick={()=>{
                    if(update){
                        //TODO update 완료버튼으로변경
                        changeRoutineHandler();
                    }else{
                        setUpdate(true);
                    }
                }}>{update ? "변경" : "수정"}</Button> 
                {
                    update ? <>
                    <Button variant="secondary" onClick={()=> setUpdate(false)}>취소</Button> 
                    <Button variant="danger" onClick={()=> {
                        if(window.confirm("정말로 삭제하시겠습니까?")){
                            deleteRoutine(routine.id);
                            history.push("/routine");
                        }
                    
                    }}>삭제</Button> 
                    </>: ""
                }          
            </div>
        </div>
        </>
    )
}