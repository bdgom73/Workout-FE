import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Form, Row, Tab, Table ,Button, Spinner, Badge, Col, InputGroup, Modal} from "react-bootstrap";
import { FaUser } from 'react-icons/fa';
import { GiMeal,GiChickenOven } from 'react-icons/gi';
import useMember from "../../useCustom/useMember";
import axios from "axios";
import route from "../../route";
import { useCookies } from 'react-cookie';
import AddBodyData from "../inputs/addBodyData";
import WeightLogDetail from "../detail/weightLogDetail";
const proteins = [
    "닭가슴살", "돼지고기 후지살", "돼지고기 안심살", "계란 흰자 6~7개",
    "참치캔 (기름제거)" , "소고기 우둔살" , "소고기 홍두깨", "소고기 설도살",
    "오징어","고등어","연어"
]
const carbs = [
    "고구마", "단호박", "귀리", "퀴노아", "브로콜리","양배추","오트밀",
    "버섯","잡곡밥","현미밥","호밀빵"
]
const fruits = [
    "사과", "바나나","블루베리","아보카도","귤","오렌지","파인애플","블루베리","자몽","배","키위"
]

export default function Me(){

    const {data} = useMember();
    const [cookies] = useCookies();

    const [height  , setHeight] = useState(0);
    const [weight, setWeight] = useState(0);
    const [age , setAge] = useState(0);
    const [smm, setSMM] = useState(0);

    const [update ,setUpdate] = useState(false);
    const [isBring, setIsBring] = useState(false);
    const [isBodyData, setIsBodyData] = useState(false);

    const [show, setShow] = useState(false);
    const showHandler = ()=> setShow(true);
    const hideHandler = ()=> setShow(false);

    const updateHandler = ()=>{

    }

    const bmiCalculator = (h, w)=>{
        if(!h) h= height;
        if(!w) w= weight;
        let p_bmi = w / Math.pow(h / 140, 2).toFixed(2);
        let bmi =  (w / Math.pow(h / 100, 2)).toFixed(2);
        const bmi_result = {
            bmi : bmi,
            percent : 0,
            diff : "정상"
        }
        if(Number(bmi) < 18.5){
            bmi_result.percent = Number(p_bmi).toFixed(2);
            bmi_result.diff = "저체중";
            return bmi_result;
        }else if(Number(bmi) < 23){
            bmi_result.percent = (Number(p_bmi)+4.0).toFixed(2);
            return bmi_result;
        }else if(Number(bmi) < 25){
            bmi_result.percent =  (Number(p_bmi) + 8.0).toFixed(2);
            bmi_result.diff = "과체중";
            return bmi_result;
        }else if(Number(bmi) < 30){
            bmi_result.percent =  (Number(p_bmi) + 14.0).toFixed(2);
            bmi_result.diff = "비만";
            return bmi_result;
        }else if(Number(bmi) >= 41){
            bmi_result.percent = 100;
            bmi_result.diff = "고도비만";
            return bmi_result;
        }else{
            bmi_result.percent =  (Number(p_bmi) + 16.0).toFixed(2);
            bmi_result.diff = "고도비만";
            return bmi_result;
        }
    }

    const getMyBodyData = ()=>{
        axios.get(route.ME,{ headers: route.AUTH_TOKEN(cookies.SSID)})
        .then(res=>{
            const result = res.data;
            if(result.result_state){
                setAge(result.data.age);
                setHeight(result.data.height);
                setWeight(result.data.weight);
                setSMM(result.data.smm);
                setIsBodyData(true);
                setIsBring(true);
            }else{
                setIsBodyData(false);
                setIsBring(true);
            }
        })
        .catch(e=> console.log(e.response));
    }

    const updateMyData = (e)=>{
        const fd = new FormData();
        fd.append("age", age);
        fd.append("SMM", smm);
        fd.append("height", height);
        fd.append("weight", weight);
        axios.post(route.UPDATE_ME,fd,{headers:route.AUTH_TOKEN(cookies.SSID)})
        .then(res=>{
            const result = res.data;
            if(result.result_state){
                setAge(result.data.age);
                setHeight(result.data.height);
                setWeight(result.data.weight);
                setSMM(result.data.smm);
                setUpdate(false);
            }else{
                alert(result.message || "바디 정보 수정에 실패했습니다");
            }
        })
        .catch(e=> {console.log(e.response); alert("바디 정보 수정에 실패했습니다");});
    }

    useEffect(getMyBodyData,[]);

    const isbodyDataHandler = ()=>{
        setIsBodyData(true);
        getMyBodyData();
    }


    const modalPage = ()=>{
        return (
            <Modal show={show} onHide={hideHandler}>
                <Modal.Header closeButton>
                    <Modal.Title>몸무게 변화</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <WeightLogDetail/>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={hideHandler}>닫기</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    if(isBring){
        if(isBodyData){
            return(
                <>
                {modalPage()}      
                <div className="me_wrap">
                    <Table className="mt-3">
                        <thead><tr>
                            <th colSpan="1"><FaUser/> 내 정보</th>
                            <th style={{textAlign:"right"}}><Button size="sm" variant={update ? "warning" : "danger" }
                            onClick={()=>{
                                if(update){
                                    updateMyData();
                                }
                                else setUpdate(true)
                            }}>{update ? "완료" : "수정" }</Button>
                            {
                                update ? <Button size="sm" style={{marginLeft:"5px"}} variant="secondary" onClick={()=> setUpdate(false)}>취소</Button> : ""
                            }
                            </th>
                        </tr></thead>
                        <tbody>
                           <tr>
                               <th style={{width:"20%"}}>이름</th>
                               <td>{data.member ? data.member.name: ""}</td>
                           </tr>
                           <tr>
                               <th>나이</th>
                               <td>{update ? 
                               <InputGroup>
                                    <Form.Control type="number"  min="8" max="100" value={age} onChange={(e)=> setAge(e.target.value)}/>
                                    <InputGroup.Text>세</InputGroup.Text>
                                    <Form.Range  min="8" max="100" value={age} onChange={(e)=> setAge(e.target.value)}/>   
                               </InputGroup> : 
                               <>{age} <small>세</small></>}</td>             
                           </tr>
                           <tr>
                               <th>몸무게</th>
                               <td>{update ? 
                               <InputGroup>
                                    <Form.Control type="number" step="0.1"  min="0" max="200" value={weight} onChange={(e)=> setWeight(e.target.value)}/>
                                    <InputGroup.Text>kg</InputGroup.Text>
                                    <Form.Range  step="0.1"  min="0" max="200" value={weight} onChange={(e)=> setWeight(e.target.value)}/>     
                               </InputGroup> :
                               <span className="anchor" onClick={showHandler}>
                                   {weight} <small>kg</small>
                                </span> 
                               }</td>
                           </tr>
                           <tr>
                               <th>키</th>
                               <td>{update ? 
                               <InputGroup>
                                    <Form.Control type="number"  min="110" max="210" value={height} onChange={(e)=> setHeight(e.target.value)}/>
                                    <InputGroup.Text>cm</InputGroup.Text>
                                    <Form.Range  step="0.1"  min="110" max="210" value={height} onChange={(e)=> setHeight(e.target.value)}/>   
                               </InputGroup> : 
                               <>{height} <small>cm</small></>}</td>
                           </tr>
                           <tr>
                               <th>골격근량</th>
                               <td>{update ? 
                               <InputGroup>
                                    <Form.Control type="number"  min="0" max="100" value={smm} onChange={(e)=> setSMM(e.target.value)}/>
                                    <InputGroup.Text>%</InputGroup.Text>
                                    <Form.Range  step="0.1"  min="0" max="100" value={smm} onChange={(e)=> setSMM(e.target.value)}/>  
                               </InputGroup> : 
                               <>{smm} <small>%</small></>}</td>
                           </tr>
                        </tbody>
                    </Table>              
                    <Row as={Alert}>
                        <div className="bmi_info">
                            <strong>나의 BMI 지수</strong>
                            <span>{bmiCalculator().bmi}({bmiCalculator().diff})</span>
                            <Form.Text as={"li"}>
                                정상체중의 범위는 <b>
                                <i><u>
                                    대략&nbsp;
                                    {(Math.pow(height*0.01,2) * 18.6).toFixed(1)}kg
                                    ~&nbsp;
                                    {(Math.pow(height*0.01,2) * 22.9).toFixed(1)}kg 
                                </u></i>
                                </b> 입니다.
                            </Form.Text>
                            <Form.Text as={"li"}>
                               해당자료는 <b><i><u>참고용으로만</u></i></b> 보시길 바랍니다.
                            </Form.Text>
                        </div>
                        <div className="graph-wrap">
                            <div className="bmi-graph" id="bmi">
                                <span id="bmi-p" className="bmi-target" style={{
                                    left:bmiCalculator().percent+"%",
                                }}>
                                    <span className="bmi_value" style={{
                                        left :  bmiCalculator().bmi > 40 ? "-90px" : "-50px" 
                                    }}>
                                        <small>BMI 지수 :</small> {bmiCalculator().bmi}
                                    </span>
                                </span>
                                <div className="bmi1">
                                    <span className="bmi_start">BMI</span>
                                    저체중
                                    <span className="bmi_label" style={{right : "-8px"}}>18.5</span>
                                </div>
                                <div className="bmi2">
                                    정상
                                    <span className="bmi_label">23</span>
                                </div>
                                <div className="bmi3">
                                    과체중
                                    <span className="bmi_label">25</span>
                                </div>
                                <div className="bmi4">
                                    비만
                                    <span className="bmi_label">30</span>
                                </div>
                                <div className="bmi5">고도비만</div>
                            </div>
                        </div>
                    </Row>
                    <h3 className="mt-3 mb-3"><GiMeal/> 식단</h3>
                    <Table>
                        <thead>
                            <tr>
                                <th>시간</th>
                                <th>식사</th>    
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>아침</td>
                                <th>
                                    <ul>
                                        <li>과일 택1</li>
                                        <li>샐러드</li>
                                        <li>단백질 1종</li>  
                                        <li>견과류</li>
                                        <li>탄수화물 (ex 고구마 (중간크기))</li>
                                    </ul>                 
                                </th>
                            </tr>
                            <tr>
                                <td>점심</td>
                                <th>
                                    <ul>
                                        <li>단백질 1종</li>  
                                        <li>견과류</li>
                                        <li>탄수화물 or 샐러드</li>
                                    </ul>
                                </th>
                            </tr>
                            <tr>
                                <td>저녁</td>
                                <th>
                                    <ul>
                                        <li>단백질 1종</li>  
                                        <li>탄수화물 or 샐러드</li>
                                    </ul>
                                </th>
                            </tr>
                            <tr>
                                <td>간식</td>
                                <th>
                                    <ul>
                                        <li>견과류</li>  
                                        <li>부족한 영양소</li>
                                    </ul>
                                </th>
                            </tr>
                        </tbody>
                    </Table>
                    <h3><GiChickenOven/> 추천 음식</h3>
                    <Table>
                        <thead>
                            <tr>
                                <th style={{width:"33%"}}>단백질 (100g)</th>    
                                <th>탄수화물</th>
                                <th>과일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                proteins.map((v,i)=>{
                                    return(
                                        <tr key={(v+i.toString())}>
                                            <td style={{backgroundColor : "#a35e36", color : "#fff"}}>{v}</td>
                                            <td style={{backgroundColor : "#f1d18d"}}>{carbs[i]}</td>
                                            <td style={{backgroundColor : "#d6e491"}} >{fruits[i]}</td>
                                        </tr>
                                    )
                                })
                            } 
                     
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colSpan="3" style={{textAlign:"center"}}>
                                    <a target="_blank" without="true" rel="noreferrer" href="http://www.foodsafetykorea.go.kr/portal/healthyfoodlife/calorieDic.do?menu_no=3072&menu_grp=MENU_NEW03">
                                        더 많은 정보보기<small>(식품 안전나라)</small>
                                    </a>
                                </th>
                            </tr>
                        </tfoot>
                    </Table>
                   
                </div>
                </>
            );
        }else{          
            return <AddBodyData onExist={isbodyDataHandler}/>      
        }
       
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