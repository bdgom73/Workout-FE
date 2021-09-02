import { useState } from "react";
import { Col, Row,Container, Image, Form, FloatingLabel,Button, ButtonGroup, CloseButton, Spinner } from "react-bootstrap";
import { FiPlus } from 'react-icons/fi';
import { BiEdit } from 'react-icons/bi';
import useMember from "../../useCustom/useMember";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import route from "../../route";


export default function AddWorkout(){

    const {data} = useMember();
    const history = useHistory();
    const [img, setImg] = useState();
    const [previewImageUrl, setPreviewImageUrl] = useState("");
    const [eType, setEType] = useState("유산소");

    const submitHandler = (e)=>{
        e.preventDefault();
        const fd = new FormData();
        const fd2 = {
            name : e.target[0].value,
            e_type : e.target[1].checked ? "0" : "1",
            part : e.target[3].value,
            explanaiton : e.target[4].value,
        }
        console.log(img);
        fd.append("workout", new Blob([JSON.stringify(fd2)],{type : "application/json"}));
        fd.append("workout_image", img);
      
        axios.post(route.ADD_WORKOUT,fd)
        .then(res=> {
            const result = res.data;
            if(result.result_state){
                history.push(`/workout/${result.data}`);
            }else{
                alert("운동 추가에 실패했습니다");
            }
        })
        .catch(e=> alert("운동 추가에 실패했습니다"))
    }

    const fileChangeHandler = (e)=>{
        let file =  e.target.files[0] ;
        setImg(file);
        imagePreviewHandler(file);   
    }

    const imagePreviewHandler = file =>{
        const reader = new FileReader();
        reader.onload = ()=> {
            let url = URL.createObjectURL(file);
            setPreviewImageUrl(url);
        }
        reader.readAsText(file);  
    }

    const clearImageHandler = ()=>{
        setImg(undefined);
        setPreviewImageUrl("");
    }

    useEffect(()=>{
        if(data.member)
            if(data.member.rank !== "ADMIN")
                history.goBack(-1);    
    },[data]);

    if(data.member ? data.member.rank === "ADMIN" : false){
        return(
            <>
            <Container  className="mt-3 mb-3" style={{maxWidth:"1050px"}} >
            <Row className="mt-3 mb-3" ><h1><BiEdit/>운동등록</h1></Row>
            <hr/>
            <Row>
                <Col className="d-flex justify-content-center mb-3" md="5">
                    <div>
                        <div className="custom_title" style={{fontSize:"20px"}}>운동이미지</div>
                        {
                            img ? 
                            <div className="add-close">
                                <CloseButton className="close" onClick={clearImageHandler}/>
                                <Image src={previewImageUrl} style={{width:"300px"}} thumbnail></Image>
                            </div> : 
                            <div className="file_wrap">
                                <label htmlFor="workout_image"><FiPlus size="100" className="plus"/></label>
                                <input type="file" id="workout_image" onChange={fileChangeHandler}/>
                            </div>
                        } 
                    </div> 
                </Col>
                <Col md="7" >
                    <div className="custom_title" style={{fontSize:"20px"}}>운동정보입력</div>
                    <Form onSubmit={submitHandler}>
                        <FloatingLabel controlId="floatingName" label="운동명" className="mb-2 mt-2">
                            <Form.Control placeholder="Leave a name here" />
                        </FloatingLabel>
                        <Form.Group className="border p-2 mb-2 mt-2">
                            <Form.Label>운동유형</Form.Label> <br/>
                            <Form.Check inline label="유산소" name="type" type="radio" defaultChecked />
                            <Form.Check inline label="무산소" name="type" type="radio" />
                        </Form.Group>
                        <FloatingLabel controlId="floatingPart" label="운동 부위" className="mb-2 mt-2">
                            <Form.Select aria-label="Leave a part here" required >
                                <option value="">운동 부위를 입력해주세요</option>     
                                <option value="가슴">가슴</option>
                                <option value="등">등</option>
                                <option value="하체">하체</option>
                                <option value="어깨">어깨</option>
                                <option value="팔">팔</option>
                                <option value="복근">복근</option>
                            </Form.Select> 
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingTextarea" label="운동설명" className="mb-2 mt-2">
                            <Form.Control as="textarea" placeholder="Leave a expain here"   style={{ height: '150px' }}/>
                        </FloatingLabel> 
                        <div className="btn_wrap">
                            <Button type="submit" size="lg">등록</Button>   
                        </div>
                    </Form>
                </Col>
            </Row>
            </Container>
            </>
        );
    }else{
        return(
        <div className="d-flex justify-content-center align-items-center" style={{height:"400px"}}>
        <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
        </div>
        );
    }
   
}