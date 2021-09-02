import { useState } from "react";
import { Alert, Button, Col, FloatingLabel, Form, Modal, Row } from "react-bootstrap";
import Workout from "../route/workout";

import { AiFillDelete,AiFillPlusCircle } from 'react-icons/ai';
import axios from "axios";
import route from "../../route";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";
export default function AddRoutine(){

    const history = useHistory();
    const [cookies] = useCookies();
  
    const [workout, setWorkout] = useState([]);
    const [title, setTitle] = useState("");
    const [part,setPart] = useState("")
    const [etc, setEtc] = useState("기타");

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [alert,setAlert] = useState(false);
    const handleAlertClose = () => setAlert(false);
    const handleAlertShow = () => setAlert(true);
    const [message, setMessage] = useState("");

    const insideModal = () =>{
        return <Modal show={show} onHide={handleClose} >
            <Modal.Header closeButton>
                <Modal.Title>운동 추가</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Workout isModal onSelect={(d)=> {    
                    let nArray = [...workout, ...d];
                    let n2Array = nArray.filter((item, i) => {
                        return (
                            nArray.findIndex((item2, j) => {
                            return item.id === item2.id;
                          }) === i
                        );
                      });
                    setWorkout(n2Array || []); 
                    
                }} close={handleClose} />
            </Modal.Body>
        </Modal>
        
    }

    const alertModal = () =>{
        return <Modal show={alert} onHide={handleAlertClose} >
            <Modal.Header closeButton>
                <Modal.Title>알림</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message}
            </Modal.Body>
        </Modal>
        
    }

    const onAddRoutineSubmitHandler = (e)=>{
        e.preventDefault();
        let volumes = workout.map(w=>{
            return {
                workout_id : w.id,
                num : w.num,
                sets : w.sets
            }
        })
        const routineRegister = {
            title : title,
            part : part === "기타" ? etc : part,
            volumes : volumes || []
        }

        axios.post(route.ADD_ROUTINE, routineRegister , {headers : route.AUTH_TOKEN(cookies.SSID)})
        .then(res=> {
            console.log(res);
            if(res.data.result_state){
                history.push(`/routine/${res.data.data}`);
            }else{
                setMessage(res.data.message || "알수없는 오류로 인해 실패했습니다.")
                handleAlertShow();
            }
        })
        .catch(e =>{
            try{
                setMessage(e.response.data.message || "알수없는 오류로 인해 실패했습니다.");
                handleAlertShow();
            }catch{
                setMessage("알수없는 오류로 인해 실패했습니다.");
                handleAlertShow();
            }   
        }); 
    }

    return(
        <>
        {insideModal()}
        <div className="custom_div mt-3">
        <div className="custom_title mt-2 mb-2 w-20" style={{fontSize : "30px"}}>
            루틴추가        
        </div>  
        <Form onSubmit={onAddRoutineSubmitHandler}>
            <Form.Group className="mb-3" controlId="Form.ControlInput1">
                <Form.Label>제목</Form.Label>
                <Form.Control type="text" placeholder="제목을 입력해주세요" required onChange={(e)=> setTitle(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="Form.ControlPart">
                <Form.Label>부위</Form.Label>
                <Form.Select aria-label="Default select example" required onChange={(e)=>{setPart(e.target.value)}} isInvalid={part === ""} defaultValue={part}>
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
                    <FloatingLabel className="mt-3" controlId="floatingInput" label="직접 입력 (20자 이내)">
                        <Form.Control onChange={(e)=> setEtc(e.target.value)} placeholder="ex) 전면삼각근" maxLength="20" required/>
                    </FloatingLabel>
                    : <></>
                }
            </Form.Group>
            <Form.Label>운동종류</Form.Label>
            {
                workout.length === 0 ? 
                <Alert variant="danger">선택된 운동이 없습니다</Alert> : ""
            }
            <Form.Group className="mb-3" controlId="Form.ControlWorkout">
                {
                    workout.map((m,i)=>{    
                        return (
                        <Row className="mb-3 workout_card" key={m.id}>
                            <div className="mt-1 d-flex justify-content-end " >
                                <Button variant="danger" size="sm" onClick={()=>{                           
                                    setWorkout(workout.filter(w => w.id !== m.id));
                                }}><AiFillDelete size="20"/></Button>
                            </div>              
                            <Form.Group as={Col} controlId="formGridWn">
                                <Form.Label>운동이름</Form.Label>
                                <Form.Control defaultValue={m.name} readOnly/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridWp">
                                <Form.Label>운동부위</Form.Label>
                                <Form.Control defaultValue={m.part} readOnly/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridset">
                                <Form.Label>세트수</Form.Label>
                                <Form.Control min="0" type="number" max={10000} defaultValue={m.sets} readOnly={m.e_type === 0} onChange={(e)=>{
                                    let nArray = [...workout];
                                    nArray.filter(d => d.id === m.id).forEach(d=> d.sets = e.target.value);
                                    setWorkout(nArray);
                                }}/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridnum">
                                <Form.Label>횟수</Form.Label>
                                <Form.Control defaultValue={m.num} min="0" max={10000} type="number" readOnly={m.e_type === 0} onChange={(e)=>{
                                    let nArray = [...workout];
                                    nArray.filter(d => d.id === m.id).forEach(d=> d.num = e.target.value);
                                    setWorkout(nArray);
                                }}/>
                            </Form.Group>        
                        </Row>
                        )
                    })  
                }
            </Form.Group>   
            <div className="d-flex justify-content-center w-100">
            <Button onClick={handleShow} variant="dark" size="sm"><AiFillPlusCircle size="20" color="#fff"/></Button> 
            </div>
            <hr/>  
            <div className="d-flex justify-content-end w-100">
                <Button type="submit">루틴 추가</Button>
            </div>
        </Form>
       
        </div>
        </>
    );
}