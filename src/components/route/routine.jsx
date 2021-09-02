import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal , Row, Table,Alert, Accordion } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { Link, useHistory } from "react-router-dom";
import route from "../../route";
import useModal from "../../useCustom/useModal";
import Workout from "./workout";
import { BiRightArrow } from 'react-icons/bi';
import { RiCloseCircleFill } from 'react-icons/ri';


const partCom = ['가슴' , '등' , '어깨' , '팔' , '유산소' , '복근' , '하체'] ;
export default function Routine(){

    const {close,eventModal,modal,setModal} = useModal();
    const history = useHistory();
    const [cookies] = useCookies();
    const [data,setData] = useState([]);
    const [total, setTotal] = useState("0");
    const [page,setPage] = useState(0);


    const getRoutineList = ()=>{
      
        let url = `/myApi/workout/get/list/routine?size=${"10"}&page=${"0"}`;
        axios.get(url,{headers : route.AUTH_TOKEN(cookies.SSID)})
        .then(res=>{
            console.log(res);
            const result = res.data;
            setData(result.data || []);
        })
        .catch(e=>console.log(e.response))
       
       
    }


    const deleteRoutine = (id, type)=>{
        try{
            if(type){
                return axios.delete(`/myApi/workout/delete/${id}/routine`,{headers:route.AUTH_TOKEN(cookies.SSID)});
             }else{
                 axios.delete(`/myApi/workout/delete/${id}/routine`,{headers:route.AUTH_TOKEN(cookies.SSID)})
                .then(res=> {
                     if(res.data.result_state){
                         setData(res.data.data || []);
                     }
                }).catch(e=> {
                    try{alert(e.response.data.message);}
                    catch{alert("알수 없는 이유로 삭제에 실패했습니다.");
                }})
            }
        }catch{
            alert("알수 없는 이유로 삭제에 실패했습니다.");
        }  
    }

    useEffect(()=> getRoutineList(), [])
    useEffect(()=> eventModal(),[modal])


    return(
        <>            
        <div className="custom_div mt-3" style={{minHeight:"100vh"}}>
            <div className="d-flex justify-content-between align-items-end">
                <div className="custom_title" style={{fontSize : "32px"}}>내 루틴</div>
                <div>
                    <Button size="sm" onClick={()=> history.push("/add/routine")}>루틴 추가</Button>
                </div>
            </div>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>제목</th>
                        <th>구분</th>
                        <th>생성자</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {           
                    data.map((d,i)=>{
                        return(
                        <tr key={d.id}>
                            <td>{(page)*10 + (i+1)}</td>
                            <td>
                                <Link to={`/routine/${d.id}`}>{d.title}</Link>
                            </td>
                            <td>{d.part}</td>
                            <td>{d.member_name}</td>
                            <td className="text-center"> 
                                <Button variant="danger" size="sm" onClick={()=>{deleteRoutine(d.id)}} >삭제</Button>
                            </td>
                        </tr>
                        )
                    })
                    }
                   
                </tbody>
            </Table>
        </div>
        </>
    );
}