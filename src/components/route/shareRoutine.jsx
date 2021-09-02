import axios from "axios";
import moment from "moment";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { Badge, Overlay, OverlayTrigger, Table, Tabs, Tooltip,Tab } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { RiTimerLine } from "react-icons/ri";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { dateFormat } from "../../common";
import route from "../../route";

export default function ShareRoutine(){

    const [cookies] = useCookies();

    const [data, setData] = useState([]);
    const [page , setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [order,setOrder] = useState("desc");

    const [overlay,setOverlay] = useState(false);
    const targetRef = useRef(null); 

    const getShareRoutineList = ()=>{
        axios.get(route.GET_SHARE_ROUTINELIST(10,page,order),{headers : route.AUTH_TOKEN(cookies.SSID)})
        .then(res=>{
            const result = res.data;
            console.log(res);
            if(result.result_state){
                setData(result.data.content || []);
                setTotal((result.data.count / 10) || 0);
            }
        }).catch(e=> console.log(e.response))
    }

    useEffect(getShareRoutineList,[page, order]);

    return(
        <>
        <div className="custom_title mt-3" style={{fontSize : "32px"}}>공유 루틴</div>
        <Tabs
            defaultActiveKey="desc"
            transition={false}
            className="mb-0 mt-3"     
            onSelect = {(e)=> { 
                setPage(0);
                setOrder(e);
            }}      
        >
                <Tab eventKey="desc" title="최신순" />
                <Tab eventKey="asc" title="오래된순"/>
                <Tab eventKey="recommend" title="추천순"/>   
            </Tabs> 
        <Table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>루틴제목</th>
                    <th>구분</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>추천수</th>
                </tr>
            </thead>
            <tbody>
                {
                    data.length > 0 ?
                    data.map((d,i)=>{
                        const createdDate = dateFormat(d.createdDate);
                        const modifiedDate = dateFormat(d.modifiedDate);
                        const time = moment().diff(moment(createdDate), "hours");
                        return(
                            <tr key={i+"share"}>
                                <td>{(page)*10 + (i+1)}</td>
                                <td>
                                    <Link to={`/share/routine/${d.id}`}>{d.title}</Link> &nbsp;
                                    {time < 24 ? 
                                    <>    
                                    <OverlayTrigger placement="bottom" overlay={
                                        <Tooltip>
                                            루틴 작성 24시간 이내
                                        </Tooltip>
                                    }>  
                                        <Badge ref={targetRef} bg="warning" onMouseOver={()=> setOverlay(true)} onMouseLeave={()=> setOverlay(false)}>NEW</Badge>       
                                    </OverlayTrigger>
                                    </>
                                    : ""}
                                </td>
                                <td>{d.part}</td>
                                <td>{d.member_name}</td>
                                <td>
                                {
                                createdDate === modifiedDate ? 
                                time >= 24 ? dateFormat(createdDate,"YYYY-MM-DD") : createdDate :
                                time >= 24 ? 
                                <>{dateFormat(modifiedDate,"YYYY-MM-DD")} &nbsp; <Badge bg="secondary" size="sm">수정됨</Badge></> :
                                <>{modifiedDate} &nbsp; <Badge bg="secondary" size="sm">수정됨</Badge></>
                                }
                                </td>
                                <td>{d.recommend}</td>
                            </tr>
                        );
                    }) : <tr>
                        <td colSpan="6" className="text-center">공유 루틴이 없습니다</td>
                    </tr>
                }
            </tbody>
        </Table>
        <div className="d-flex justify-content-center mb-3">
            <ReactPaginate
                pageCount={total}
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
        </>
    );
}