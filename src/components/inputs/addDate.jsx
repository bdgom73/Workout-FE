import { useState } from "react";
import { Button, FloatingLabel, Form, Row } from "react-bootstrap";
import ReactDatePicker,{registerLocale} from "react-datepicker";
import ko from 'date-fns/locale/ko';
import axios from "axios";
import route from "../../route";
import { useCookies } from "react-cookie";
import moment from "moment";

registerLocale("ko",ko);
export default function AddDate(props){

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [memo, setMemo] = useState("");
    const [title,setTitle] = useState("");
    const [cookies] = useCookies();
    const [msg, setMsg] = useState("");
    const [color ,setColor ] = useState("#0d6efd");
    const todayHandler = ()=> {setStartDate(new Date()); setEndDate(new Date())}
   
    const endDateHandler = ()=>{
        if(startDate > endDate){
            setEndDate(startDate);
            return startDate;
        }else{
            return endDate;
        }
    }

    const addHandler = ()=>{
        const calendarRegister = {
            startDate : moment(startDate).format("YYYY-MM-DD"),
            endDate : moment(endDate).add(1,"day").format("YYYY-MM-DD"),
            memo : memo,
            title : title,
            color : color 
        }
        axios.post(route.ADD_SCHEDULE, calendarRegister , {headers : route.AUTH_TOKEN(cookies.SSID)})
        .then(res=>{
            const result = res.data;
            if(result.result_state){
                props.update();
                props.close();
            }else{
                setMsg(result.message);
            }
        }).catch(e=> setMsg("일정추가 이벤트가 실패했습니다."));
    }

    return(
    <div style={{backgroundColor : "#ffffff", paddingTop : "5px"}}>
        <div className="custom_div">
            <div className="custom_title">
                일정선택  
            </div>
            <Button variant="success" size="sm" style={{marginLeft:"10px"}} onClick={todayHandler}>오늘</Button>
            <div className="custom_datepicker_wrap">
            <ReactDatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="custom_datepicker btn btn-outline-primary btn-sm"
                dateFormat="yyyy-MM-dd(eee)"
                locale="ko"
            />
            <span className="tilde">~</span>
            <ReactDatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDateHandler()}
                minDate={startDate}
                className="custom_datepicker btn btn-outline-primary btn-sm"
                dateFormat="yyyy-MM-dd(eee)"
                locale="ko"
            />
        </div>
        <div className="custom_div">
            <Form>
                <div className="custom_title">제목</div>           
                <Form.Control as="input" type="text"
                placeholder="제목을 입력해주세요"
                onChange={e=> setTitle(e.target.value)}
                />
                <div className="custom_title">메모</div>
                <FloatingLabel controlId="floatingTextarea2" label="Memo">
                    <Form.Control as="textarea"
                    placeholder="Leave a memo here"
                    style={{ height: '230px', resize:"none" }}  
                    onChange={e=> setMemo(e.target.value)}
                    />
                </FloatingLabel>
            </Form>
            <Row>
                <div className="custom_title">일정바 색 선택</div>
                <div className="mt-2 d-flex">
                    <Form.Control
                        type="color"
                        id="colorInput"
                        defaultValue="#0d6efd"
                        title="Choose your color"
                        onChange={(e)=>{setColor(e.target.value)}}
                    />
                    <div className="previewColor w-100" style={{backgroundColor : color}} />
                </div>      
            </Row>
        </div>
        {msg}
        <hr/>
        <div className="custom_div mt-3 text-center ">
            <Button variant="primary" size="sm" style={{marginRight:"5px"}} onClick={addHandler}>등록</Button>
            <Button variant="outline-secondary" size="sm"  onClick={props.close}>닫기</Button>
        </div>
    </div>
    </div>
    );
}