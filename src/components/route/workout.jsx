import { renderFill } from "@fullcalendar/react";
import axios from "axios";
import { Tab } from "bootstrap";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { Table,Image, Button, Tabs, Pagination, Form, Modal, Alert } from "react-bootstrap";
import ReactPaginate from 'react-paginate';
import { Link, useHistory } from "react-router-dom";
import useMember from "../../useCustom/useMember";
export default function Workout(props){

    const {isModal, onSelect, close : c, single , onSingleSelect} = props

    const [page, setPage] = useState(0);
    const history = useHistory();
    const { data } = useMember();
    const [cnt, setCnt] = useState(0);
    const [tab,setTab] = useState("all");
    const [show, setShow] = useState(false);
    const [workoutList, setWorkoutList] = useState([]);
    const [workout, setWorkout] = useState([]);

    const getAllWorkouts = (p)=>{
        let url = `/myApi/workout/findAll?page=${p}&size=${isModal ? 5 : 10}`
        if(tab === "유산소" || tab === "무산소"){
            url += `&condition=type&term=${tab === "유산소" ? "0" : "1"}`;
        }else if(tab === "가슴" || tab === "등" || 
        tab === "하체" || tab === "어깨" || tab === "복근" || tab === "팔"){
            url += `&condition=part&term=${tab}`;
        }
        axios.get(url)
        .then(res=>{
            setCnt(res.data.data.totalPages);
            setWorkout(res.data.data.content || [])
        })
    }

    useEffect(()=> getAllWorkouts(page), [tab,page]);

    const handleClose = ()=> {setShow(false) };

    const addButton = ()=>{
        if(!isModal && data){
            if(data.member) {
                if(data.member.rank === "ADMIN"){
                    return <div className="btn_wrap">
                    <Button size="sm" onClick={()=> history.push("/add/workout")}>운동추가</Button>
                    </div>
                }
            }
        }
    }

    const modalPage = ()=>{
        return(
            <Modal show={show} onHide={handleClose} >
                <Modal.Header closeButton>
                    <Modal.Title>알림</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        workoutList.length > 0 ?
                       <Alert variant={"primary"}>다음 운동을 선택했습니다.</Alert> : <></>
                    }
                    <Table  variant="" striped size="sm" >
                    <thead>
                        <tr>
                            <th>운동번호</th>
                            <th>운동이름</th>
                            <th>운동부위</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                    workoutList.length > 0 ?
                    workoutList.map((w,i)=>{
                        return (
                            <tr key={i}>
                                <td>{w.id}</td>
                                <td>
                                   {w.name}
                                </td>
                                <td>{w.part}</td>
                            </tr>                               
                        );
                    }) : <tr><td>선택한 운동이 없습니다.</td></tr>
                    }
                    </tbody>
                    </Table>
                    
                    <div></div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>{
                        if(workoutList.length > 0){
                            if(onSelect){ onSelect(workoutList)}
                            document.body.scrollTop = document.body.scrollHeight;
                            if(c) c();
                        }else{
                            alert("추가할 운동이 없습니다.");
                        }
                        
                    }}>{"추가"}</Button>
                    <Button onClick={handleClose} variant="secondary">Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    const onSelectHandler = ()=>{    
        setShow(true);
        
    }

    return(
        <>
        {modalPage()}
        <div className="custom_div">
            {
                !isModal ? 
                <div className="custom_title mt-3" style={{fontSize:"30px"}}>운동종류</div> :<></>
            }
            
            <Tabs
                defaultActiveKey="all"
                transition={false}
                className="mb-0 mt-3"     
                onSelect = {(e)=> { 
                    setPage(0);
                    setTab(e);
                }}      
            >
                <Tab eventKey="all" title="전체" />
                <Tab eventKey="유산소" title="유산소"/>
                <Tab eventKey="무산소" title="무산소"/>
                <Tab eventKey="가슴" title="가슴"/>
                <Tab eventKey="등" title="등"/>
                <Tab eventKey="하체" title="하체" />
                <Tab eventKey="어깨" title="어깨" />
                <Tab eventKey="복근" title="복근" />
                <Tab eventKey="팔" title="팔" /> 
            </Tabs>   
            <Form>
            <Table responsive="sm" className="custom_table">
                <thead>
                <tr>
                    <th>#</th>
                    <th>이미지</th>
                    <th>운동명</th>
                    <th>운동유형</th>    
                    <th>운동부위</th>
                </tr>
                </thead>
                <tbody>
                    {
                        workout.map((d,i) =>{
                            const data = {
                                ...d,
                                num:0,
                                sets : 0
                            }
                            return (
                                <tr key={i}>
                                    {isModal && !single? 
                                    <td>
                                        <Form.Check type="checkbox" value={data} checked={workoutList.some(w=> w.id === d.id)} onChange={(e)=>{
                                            const checked  = e.target.checked;
                                            if(checked){
                                                setWorkoutList([...workoutList, data]);
                                            }else{
                                                setWorkoutList(workoutList.filter(w=> w.id !== d.id));
                                            }
                                        }}/>
                                    </td> : <td>{(page)*10 + (i+1)}</td>}     
                                    <td className="thumbnail"><Image src={d.workout_img ? "http://localhost:5000"+ d.workout_img : "/images/noimage.png"} rounded/></td>
                                    <td>
                                        {
                                            isModal ?  <span className={onSingleSelect ? "hover-underline" : ""} onClick={()=>{
                                                if(single){
                                                    if(onSingleSelect) {
                                                        onSingleSelect(d);         
                                                    }
                                                }
                                                }}>{d.name}</span> :
                                            <Link to={`/workout/${d.id}`}>{d.name}</Link>
                                        }
                                       </td>
                                    <td>{d.e_type === 0 ? "유산소" : "무산소"}</td>
                                    <td>{d.part}</td>  
                                </tr>
                            )
                        })
                    }          
                </tbody>
            </Table>    
            {addButton()}  
            <div className="d-flex justify-content-center mb-3">
                <ReactPaginate
                    pageCount={cnt}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={1}
                    initialPage = {0}
                    forcePage = {page}
                    previousLabel={"prev"}
                    nextLabel={"next"}
                    containerClassName="custom_paginate"
                    pageClassName="custom_page"
                    pageLinkClassName="custom_page_link"
                    previousClassName="custom_previous"
                    previousLinkClassName="custom_previous_link"
                    nextClassName="custom_next"
                    nextLinkClassName="custom_next_link"
                    activeClassName="custom_active"
                    activeLinkClassName="custom_active_link"
                    onPageChange={(e)=> {
                        const cur_page = e.selected;
                        setPage(cur_page);
                    }}          
                    onPageActive={(e)=>{
                        e.selected = page
                    }}
                    
                />

            </div> 
            {
                isModal && !single? 
                <Button onClick={onSelectHandler} size="sm" variant="success">선택완료</Button> : <></>
            }   
         
            </Form>
            </div>
           
        </>
    )
}