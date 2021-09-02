import moment from "moment";
import { useState } from "react";
import { Accordion, Button, Col, Row , Badge, Form, InputGroup, FormControl} from "react-bootstrap";
import ReactDatePicker,{registerLocale} from "react-datepicker";
import ko from 'date-fns/locale/ko';
import ContentEditable from 'react-contenteditable'
import 'moment/locale/ko';
import axios from "axios";
import route from "../../route";
import { useCookies } from "react-cookie";

registerLocale("ko",ko);
const dateFormat = (date,format)=>{
    if(!format) return moment(date).format("YYYY-MM-DD");
    else return moment(date).format(format);     
}

export default function CalendarDetail(props){

    const {data : d, update , close} = props;
    const [data] = useState(d);
    const [cookies] = useCookies();

    let start = dateFormat(data.start,"YYYY-MM-DD(dd)");
    let end  = moment(data.end).subtract(1,"d").format("YYYY-MM-DD(dd)");

    const [isUpdate,setIsUpdate] = useState(false);
    
    const updateActHandler = ()=> setIsUpdate(true);
    const updateDisabled = ()=> setIsUpdate(false);


    // change Data zone
    const [title ,setTitle] = useState(d.title);
    const [memo,setMemo] = useState(d.data.memo);
    const [startDate, setStartDate] = useState(d.start);
    const [endDate, setEndDate] = useState(moment(d.end).add(-1,"day").toDate());
    const [color , setColor] = useState(d.color ? d.color : "#0d6efd");

    const resetDate = ()=> {
        setStartDate(d.start);
        setEndDate(moment(d.end).add(-1,"day").toDate());
    }

    const endDateHandler = ()=>{
        if(startDate > endDate){
            setEndDate(startDate);
            return startDate;
        }else{
            return endDate;
        }
    }

    const changeScheduleHandler = ()=>{
        const url =`myApi/calendar/change/schedule`;
        const fd = {
            id : data.id,
            title : title,
            memo : memo,
            start : moment(startDate).format("YYYY-MM-DD") ,
            end : moment(endDate).add(1,"day").format("YYYY-MM-DD"),
            color : color
        }
        axios.post(url, fd,{headers:route.AUTH_TOKEN(cookies.SSID)})
        .then(res=>{
            const result = res.data.data;
            setTitle(result.title);
            setMemo(result.memo);
            setStartDate(new Date(result.start));
            setEndDate(new Date(result.end));
            setIsUpdate(false);
            update();
        })
        .catch(e=> console.log(e.response))
    }

    const deleteSchedule = ()=>{
        try {
            if(window.confirm("정말로 삭제하시겠습니까?")) {
                axios.delete(`/myApi/calendar/delete/schedule/${data.id}`,{headers:route.AUTH_TOKEN(cookies.SSID)})
                .then(res=>{
                    if(res.data.result_state){
                        update();
                        close();
                    }
                })
                .catch(e=>console.log(e.response))
            }
        } catch (error) {
            alert("해당 스케쥴 삭제에 실패했습니다.");
        }
        
        
    }
    const dataUpdate = ()=>{
        return(
        <div className="custom_div">         
            <div className="custom_title">
                일정선택  
                <Badge style={{marginLeft:"10px"}} pill bg="warning" onClick={resetDate}>Reset</Badge>
            </div>
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
            <span className="tilde" style={{margin:"0 6px"}}>~</span>
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
        </div>
        );
    }

    return(    
        <div>  
            <Row className="mb-3">
                {
                isUpdate ? 
                <>
                    <InputGroup className="mb-3">
                    <InputGroup.Text>TITLE</InputGroup.Text>
                    <FormControl defaultValue={title} onChange={(e)=> setTitle(e.target.value)}/>
                </InputGroup>
                </>: 
                <div className="mb-1">
                    <div className="custom_title mt-1">제목</div>
                    <h3>{title}</h3>
                </div>
                }
                <Col className="text-center">  
                {!isUpdate ? <div className="custom_title">일정</div> : ""}           
                {
                isUpdate ? dataUpdate() :          
                start === end ?  
                <div className="custom_datepicker_wrap">    
                    <Button variant="outline-primary custom_datepicker" size="sm">{moment(startDate).format("YYYY-MM-DD(dd)")}</Button>
                </div> : 
                <div className="custom_datepicker_wrap">  
                    <Button variant="outline-primary custom_datepicker" size="sm">{moment(startDate).format("YYYY-MM-DD(dd)")}</Button>
                    <span className="tilde" style={{margin:"0 6px"}}>~</span>   
                    <Button variant="outline-primary custom_datepicker" size="sm">{moment(endDate).format("YYYY-MM-DD(dd)")}</Button>
                </div>    
                }
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Memo</Accordion.Header>
                        <Accordion.Body style={isUpdate ? {padding : "0px"} : {}}>
                            {
                            isUpdate ? 
                            <ContentEditable html={memo} className="custom_textarea" onChange={(e)=>{setMemo(e.target.value)}}/> :                   
                            <p>{memo}</p>
                            }
                            
                        </Accordion.Body>
                    </Accordion.Item>      
                </Accordion>   
                </Col>
            </Row> 
            {
                isUpdate ? <>
                <Row className="mb-3">
                <div className="custom_title">일정바 색 선택</div>
                <div className="mt-2 d-flex">
                    <Form.Control
                        type="color"
                        id="colorInput"
                        defaultValue={color}
                        title="Choose your color"
                        onChange={(e)=>{setColor(e.target.value)}}
                    />
                    <div className="previewColor w-100" style={{backgroundColor : color}} />
                </div>      
                </Row> <hr/></>: ""
            }
            
            
            <Row>
                <Col style={{textAlign:"right"}}>
                    {
                        isUpdate ? 
                        <>
                        <Button variant="success"  type="button" style={{marginRight:"5px"}} onClick={()=>{
                            changeScheduleHandler();
                        }}>완료</Button>
                        <Button variant="secondary" onClick={updateDisabled} type="button" style={{marginRight:"5px"}}>취소</Button>
                        </> :
                        <>
                        <Button variant="primary" onClick={updateActHandler} type="button" style={{marginRight:"5px"}}>수정</Button>
                        <Button variant="danger" type="button" onClick={deleteSchedule}>삭제</Button> 
                        </>
                    }      
                </Col>     
            </Row>
        </div>
    )
}