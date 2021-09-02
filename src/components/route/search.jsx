import { Tooltip } from "bootstrap";
import { useRef } from "react";
import { useState } from "react";
import { Badge, OverlayTrigger, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link, useRouteMatch } from "react-router-dom"
import { dateFormat } from "../../common";
import { useCookies } from "react-cookie";
import moment from "moment";
import route from "../../route";
import axios from "axios";
import { useEffect } from "react";
export default function Search(){

    const {params} = useRouteMatch();

    const [cookies] = useCookies();

    const [data, setData] = useState([]);
    const [page , setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [order,setOrder] = useState("desc");

    const [overlay,setOverlay] = useState(false);
    const targetRef = useRef(null); 
    
    const getSearchDataList = ()=>{
        let term = params.term;
        let nArray = [];
        try{
            if(term.indexOf(' ') !== -1){
                let termList = term.split(' ');
                for(let i = 0 ; i < termList.length ; i++){
                    nArray.push(termList[i]);
                }
            }else{
                nArray.push(term);
            }
            console.log(nArray);
            const fd = new FormData();
            fd.append("keywords", nArray);
            axios.post(route.SEARCH(10,page),fd,{headers : route.AUTH_TOKEN(cookies.SSID)})
            .then(res=>{
                console.log(res)
                const result = res.data;
                if(result.result_state){
                    setData(result.data.content || []);
                    setTotal(result.data.total ? (result.data.total / 10) : 0 );
                }
            }).catch(e=> console.log(e.response))
        }catch{
            
        }
    }

    useEffect(getSearchDataList,[params.term]);

    return(
        <>
        {params.term ? params.term : "검색어가 없습니다"}
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
                                    <Link to={`/share/routine/${d.id}`}>{d.title}</Link>  
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
    )
}