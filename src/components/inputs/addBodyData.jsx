import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Form, Row, Col, InputGroup, Button} from "react-bootstrap";
import { useCookies } from "react-cookie";
import { GiBodyHeight } from 'react-icons/gi';
import route from "../../route";

export default function AddBodyData(props){

    const {onExist} = props;

    const [cookies] = useCookies();
    const [age, setAge] = useState(0);
    const [smm, setSMM] = useState(0);
    const [height  , setHeight] = useState(0);
    const [weight, setWeight] = useState(0);

    const createBodyData = (e)=>{
        e.preventDefault();
        const fd = new FormData();
        fd.append("age", age);
        fd.append("SMM", smm);
        fd.append("height", height);
        fd.append("weight", weight);
        axios.post(route.CREATE_ME,fd,{headers:route.AUTH_TOKEN(cookies.SSID)})
        .then(res=>{
            const result = res.data;
            if(result.result_state){
                onExist();
            }else{
                alert(result.message || "바디 정보 등록에 실패했습니다");
            }
        })
        .catch(e=> {console.log(e.response); alert("바디 정보 등록에 실패했습니다");});
    }

    return(
        <>
        <h3 className="mt-3 mb-3"><GiBodyHeight size="35"/> BODY 데이터 설정</h3>
        <Form onSubmit={createBodyData}>
            <hr/>
            <Alert className="mt-3 mb-3 p-3 w-100" >
                <Form.Group as={Col} md="10" >
                    <Form.Label as={Row} style={{alignItems:"center"}}>AGE. (나이) 
                        <InputGroup as={Col}>      
                            <Form.Control style={{flex:"0.2"}} min="8" max="100" size="sm" type="number" value={age} onChange={(e)=> setAge(e.target.value)} aria-describedby="basic-addon1"/>
                            <InputGroup.Text id="basic-addon1">세</InputGroup.Text>
                        </InputGroup>
                    </Form.Label>
                    <Form.Range  min="8" max="100" value={age} onChange={(e)=> setAge(e.target.value)}/>             
                    <Form.Text>범위 | 8세 ~ 100세 </Form.Text>
                </Form.Group>
            </Alert>  
            <hr/>
            <Alert className="mt-3 mb-3 p-3 w-100">
                <Form.Group as={Col} md="10" >
                    <Form.Label as={Row} style={{alignItems:"center"}}>Weight. (몸무게)
                        <InputGroup as={Col}>      
                            <Form.Control  step="0.1" style={{flex:"0.3"}} min="0" max="200" size="sm" type="number" value={weight} onChange={(e)=> setWeight(e.target.value)} aria-describedby="basic-addon2"/>
                            <InputGroup.Text id="basic-addon2">kg</InputGroup.Text>
                        </InputGroup>
                    </Form.Label>
                    <Form.Range  step="0.1"  min="0" max="200" value={weight} onChange={(e)=> setWeight(e.target.value)}/>             
                    <Form.Text>범위 | 0kg ~ 200kg </Form.Text>
                </Form.Group>
            </Alert> 
            <hr/>
            <Alert className="d-flex mt-3 mb-3 p-3 w-100">
                <Form.Group as={Col} md="10" >
                    <Form.Label as={Row} style={{alignItems:"center"}}>Height. (키) 
                        <InputGroup as={Col}>      
                            <Form.Control  step="0.1"  style={{flex:"0.3"}} min="110" max="210" size="sm" type="number" value={height} onChange={(e)=> setHeight(e.target.value)} aria-describedby="basic-addon3"/>
                            <InputGroup.Text id="basic-addon3">cm</InputGroup.Text>
                        </InputGroup>
                    </Form.Label>
                    <Form.Range  step="0.1"  min="110" max="210" value={height} onChange={(e)=> setHeight(e.target.value)}/>             
                    <Form.Text>범위 | 110cm ~ 210cm </Form.Text>
                </Form.Group>
            </Alert>   
            <hr/>
            <Alert className="d-flex mt-3 mb-3 p-3 w-100">
                <Form.Group as={Col} md="10" >
                    <Form.Label as={Row} style={{alignItems:"center"}}>골격근량
                        <InputGroup as={Col}>      
                            <Form.Control step="0.1"  tyle={{flex:"0.3"}} min="0" max="100" size="sm" type="number" value={smm} onChange={(e)=> setSMM(e.target.value)} aria-describedby="basic-addon4"/>
                            <InputGroup.Text id="basic-addon4">%</InputGroup.Text>
                        </InputGroup>
                    </Form.Label>
                    <Form.Range  step="0.1"  min="0" max="100" value={smm} onChange={(e)=> setSMM(e.target.value)}/>             
                    <Form.Text>범위 | 0% ~ 100% </Form.Text>
                </Form.Group>
            </Alert>
            <hr/>
            <div className="btn_wrap">
                <Button type="submit">등록</Button>
            </div>
        </Form>
        </>
    );
}