
import { useEffect, useState } from "react";
import { Button, Image, Col, Container, FloatingLabel, Form, Row, OverlayTrigger,Tooltip } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { FaLastfmSquare, FaRegImages } from "react-icons/fa";
import route from "../../route";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useRouteMatch } from "react-router-dom";
import useMember from "../../useCustom/useMember";
export default function WorkoutDetail(){

    const {params} = useRouteMatch();
    const [cookies] = useCookies();
    const {data} = useMember();

    const [update, setUpdate] = useState(false);
    const [imageUpdate, setImageUpdate] = useState(false);
    
    // 변경 데이터
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [part, setPart] = useState("");
    const [explain, setExplain] = useState("");
    const [img, setImg] = useState();
    const [previewImageUrl,setPreviewImageUrl] = useState("");

    const [rank,setRank] =useState("");
    // 원래 데이터
    const [p_name, setPName] = useState("");
    const [p_type, setPType] = useState(0);
    const [p_part, setPPart] = useState("");
    const [p_explain, setPExplain] = useState("");
    const [p_img, setPImg] = useState("/images/noimage.png");

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

    const cancleUpdateHandler = ()=>{
        setName(p_name);
        setExplain(p_explain);
        setType(p_type);
        setPart(p_part);
    }

    const getWorkoutDataHandler =()=>{
        axios.get(route.GET_WORKOUT(params.id),{headers : route.AUTH_TOKEN(cookies.SSID)})
        .then(res=>{
            const result = res.data;
            setPName(result.data.name); setName(result.data.name);
            setPPart(result.data.part); setPart(result.data.part);
            setPType(result.data.e_type); setType(result.data.e_type);
            setPExplain(result.data.explain || "설명이 없습니다.");
            setExplain(result.data.explain || "설명이 없습니다.");
            setPImg(result.data.workout_img ? "http://localhost:5000"+ result.data.workout_img  : "/images/noimage.png")
        })
        .catch(e=> console.log(e.response))
    }

    useEffect(getWorkoutDataHandler,[]);
    useEffect(()=>{
        if(data.member){
            setRank(data.member.rank || "USER");
        }
    },[data]);

    const workoutUpdateHandler = ()=>{
        const fd = new FormData();
        const infos = {
            name : name ,
            e_type : type ,
            part : part,
            explanation : explain
        }
        fd.append("workout", new Blob([JSON.stringify(infos)],{type : "application/json"}));
        axios.post(route.UPDATE_WORKOUT(params.id),fd,{headers : route.AUTH_TOKEN(cookies.SSID)})
        .then(res=>{
            const result = res.data;
            setPName(result.data.name); setName(result.data.name);
            setPPart(result.data.part); setPart(result.data.part);
            setPType(result.data.e_type); setType(result.data.e_type);
            setPExplain(result.data.explain || "설명이 없습니다.");
            setExplain(result.data.explain || "설명이 없습니다.");
            setPImg(result.data.workout_img ? "http://localhost:5000"+ result.data.workout_img  : "/images/noimage.png")
            setUpdate(false);
        })
        .catch(e => console.log(e.response))
    }

    const workoutImageUpdateHandler = ()=>{
        const fd = new FormData();
        fd.append("workout_image" , img );
        axios.post(route.UPDATE_WORKOUT_IMAGE(params.id),fd,{headers : route.AUTH_TOKEN(cookies.SSID)})
        .then(res=>{
            const result = res.data;  
            setImg(result.data.workout_img ? "http://localhost:5000"+ result.data.workout_img  : "/images/noimage.png")
            setImageUpdate(false);
        })
        .catch(e => console.log(e.response))
    }
    return(
        <>
        <Container  className="mt-3 mb-3" style={{maxWidth:"1050px"}} >
        <Row className="mt-3 mb-3" ><h1>운동정보</h1></Row>
        <hr/>
        <Row>
            <Col className="d-flex justify-content-center mb-3" md="5">
                <div>
                    <div className="custom_title" style={{fontSize:"20px"}}>운동이미지</div>
                    <div className="add-close">       
                        <Image src={previewImageUrl ? previewImageUrl : p_img} style={{width:"300px"}} thumbnail></Image>
                        {
                            imageUpdate ? 
                                <OverlayTrigger
                                    placement={"bottom"}
                                    overlay={<Tooltip>{previewImageUrl ? "원본이미지 / 변경" : "이미지 변경"}</Tooltip>}>
                                    <div className="file_wrap" style={{
                                    position:"absolute", width : "50px", height : "50px",
                                    bottom : "10px" , right : "10px", borderRadius:"5px",
                                    backgroundImage : previewImageUrl ? `url('${p_img}')` : `url('${previewImageUrl}')`,
                                    backgroundSize: "100% 100%"
                                }}>
                                    <label htmlFor="workout_image"><FiPlus size="28" className="plus"/></label>
                                    <input type="file" id="workout_image" onChange={fileChangeHandler} />
                                </div>
                                </OverlayTrigger>    
                             : <></>
                        }
                    </div>  
                    <div className="btn_wrap">
                    {
                        rank === "ADMIN" ? 
                        imageUpdate? 
                        <>
                        <Button className="mt-3" variant="danger" size="sm" onClick={workoutImageUpdateHandler}>완료</Button>  
                        <Button className="mt-3" variant="secondary" size="sm" onClick={()=> {setImageUpdate(false); clearImageHandler()}}>취소</Button>
                        </> :      
                        <Button className="mt-3" variant="warning" size="sm" onClick={()=> setImageUpdate(true)}><FaRegImages size="20"/></Button>     
                        : <></>
                    }
              
                   </div> 
                </div> 
            </Col>
            <Col md="7" >
                <div className="custom_title" style={{fontSize:"20px"}}>운동정보</div>
                <FloatingLabel controlId="floatingName" label="운동명" className="mb-2 mt-2">
                    <Form.Control 
                        placeholder="Leave a name here" 
                        // defaultValue={p_name}
                        readOnly={!update} 
                        value={name}
                        onChange={(e)=> setName(e.target.value)}
                    />
                </FloatingLabel>
                <Form.Group className="border p-2 mb-2 mt-2">
                    <Form.Label>운동유형</Form.Label> <br/>
                    <Form.Check inline label="유산소" name="type" type="radio" checked={type === 0 } onChange={()=> setType(0)} disabled={!update && type !== 0}/>
                    <Form.Check inline label="무산소" name="type" type="radio" checked={type === 1 } onChange={()=> setType(1)} disabled={!update && type !== 1}/>
                </Form.Group>
                <FloatingLabel controlId="floatingPart" label="운동부위" className="mb-2 mt-2">
                    {
                        update ? 
                        <Form.Select aria-label="Default select example" 
                            required                            
                            value={part}     
                            onChange={(e)=>{setPart(e.target.value)}}                          
                        >
                            <option value="">운동 부위를 입력해주세요</option>   
                            <option value="all">전체</option>  
                            <option value="가슴">가슴</option>
                            <option value="등">등</option>
                            <option value="하체">하체</option>
                            <option value="어깨">어깨</option>
                            <option value="팔">팔</option>
                            <option value="복근">복근</option>
                            <option value="유산소">유산소</option>
                        </Form.Select> :
                        <Form.Control placeholder="Leave a part here" readOnly={!update} defaultValue={part} />
                    }
                   
                </FloatingLabel> 
                <FloatingLabel controlId="floatingTextarea" label="운동설명" className="mb-2 mt-2">
                    <Form.Control as="textarea" placeholder="Leave a expain here" 
                    value={explain}
                    onChange={(e)=> setExplain(e.target.value)}
                    readOnly={!update} style={{ height: '150px' }}/>
                </FloatingLabel>        
            </Col>
            <div className="btn_wrap">
            {
                rank === "ADMIN" ?
                update ? <>
                <Button type="button" size="sm" variant="danger" onClick={workoutUpdateHandler}>완료</Button> 
                <Button type="button" size="sm" variant="secondary" onClick={()=>{ setUpdate(false); cancleUpdateHandler()}}>취소</Button> 
                </> :
                <Button type="button" size="sm" variant="warning" onClick={()=> setUpdate(true)}>수정하기</Button> 
                : <></>
            }       
            </div>
        </Row>
      
        </Container>
        </>
    );
}