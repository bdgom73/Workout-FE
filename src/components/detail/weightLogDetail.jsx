import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Alert, InputGroup,Form,Row,Col, CloseButton, Button, Spinner } from "react-bootstrap";
import { useCookies } from "react-cookie";
import route from "../../route";
import { FaWeight } from 'react-icons/fa';
import { CgCalendarToday } from 'react-icons/cg';
import { MdDelete } from "react-icons/md";


export default function WeightLogDetail(){

    const [cookies] = useCookies();
    const [log , setLog] = useState([]);
    const [load, setLoad] = useState(true);

    const getWeightLog = ()=>{
        axios.get(route.GET_WEIGHT_LOG(), {headers : route.AUTH_TOKEN(cookies.SSID)})
        .then(res=>{
            console.log(res);
            const result = res.data;
            if(result.result_state){
                setLog(result.data || []);
            }else{
                alert(result.message || "로그 가져오기에 실패했습니다")
            }
            setLoad(false);
        })
        .catch(()=>{ alert("로그 가져오기에 실패했습니다"); setLoad(false);});
    }

    useEffect(getWeightLog,[])                                          

    const deleteLog = (log_id)=>{
        axios.delete(route.DELETE_WEIGHT_LOG(log_id),{headers:route.AUTH_TOKEN(cookies.SSID)})
        .then(res=>{
            const result = res.data;
            if(result.result_state){
                const f_log = log.filter(d => d.id !== log_id);
                setLog([...f_log]);
            }else{
                alert(result.message || "로그 삭제에 실패했습니다.")
            }
        }).catch(e=> { console.log(e.response); alert("로그 삭제에 실패했습니다.")})
    }

    return(
        <>
        <div style={{maxHeight:"300px", overflow:"auto", position:"relative"}}>
            <div className="d-flex mb-2">
                <span className="i_date"><CgCalendarToday/> 날짜</span>
                <span className="i_weight"><FaWeight/> 몸무게</span>
            </div>
            {
            load ? <Spinner animation="border" /> :
            log.length > 0 ?
            log.map((l)=>{
                return(
                <InputGroup key={l.id} className="mt-1">
                    <InputGroup.Text style={{backgroundColor : "#fff", fontSize:"13px",color : "#808080"}}>
                        {l.date ? moment(l.date).format("YYYY-MM-DD HH:mm:ss") : ""}                     
                    </InputGroup.Text>
                    <Form.Control disabled value={l.weight+"kg"} style={{backgroundColor : "#fff"}}/>
                    <InputGroup.Text style={{backgroundColor : "#dc3545"}}><CloseButton variant="white" onClick={()=> deleteLog(l.id)}/></InputGroup.Text>
                </InputGroup>
                );
            }) : <><hr/><p style={{textAlign:"center"}} className="mt-3 mb-3"><i>로그가 없습니다.</i></p></>
            }
        </div>
        <hr/>
        <div className="btn_wrap mt-3">
        {
            log.length > 0 ? <Button variant="danger" size="sm"><MdDelete size="18"/> 전체삭제</Button> : ""
        }
        </div>
        </>
    );
}