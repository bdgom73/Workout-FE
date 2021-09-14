
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from '@fullcalendar/list';
import moment from 'moment';
import useModal from '../../useCustom/useModal';
import { useState } from 'react';
import { useEffect } from 'react';
import CalendarDetail from '../detail/calendarDetail';
import WorkoutStateDetail from '../detail/workoutStateDetail';
import "react-datepicker/dist/react-datepicker.css";
import AddDate from '../inputs/addDate';
import useMember from '../../useCustom/useMember';
import axios from 'axios';
import route from '../../route';
import { useCookies } from 'react-cookie';
import { Modal } from 'react-bootstrap';
import { rgbToHex } from '../../common';

export default function Home(){

    const {SSID} = useMember();
    const {modal, setModal, eventModal, close} = useModal();

    const [currentMonth,setCurrentMonth] = useState([]);

    const [cur_start, setCurStart] = useState("");
    const [cur_end, setCurEnd] = useState("");

    // eslint-disable-next-line no-unused-vars
    const [workout,setWorkout] = useState( []);
     // eslint-disable-next-line no-unused-vars
    const [events,setEvents] = useState([]);

    const [current_data, setCurrent_data] = useState([]);

    const isWorkoutDataList = (update, date)=>{
        let start = update ? moment(cur_start).startOf('month').format("YYYY-MM-DD") : moment().startOf('month').format('YYYY-MM-DD');
        let end = update ? moment(cur_end).startOf('month').add("11","days").format("YYYY-MM-DD") : moment().endOf('month').add("11","days").format("YYYY-MM-DD");
        if(date){
            start = date.start;
            end = date.end;
        }
        const url = `/myApi/workout/get/list/isWorkout?start_date=${start}&end_date=${end}`;
        axios.get(url,{
            headers: route.AUTH_TOKEN()
        })
        .then(res=>{
            setWorkout(res.data.data || []);
        }).catch(e=>console.log(e.response))    
    }

    const calendarMemoList = ()=>{
        let start = moment().startOf('month').format('YYYY-MM-DD');
        let end = moment().endOf('month').add("11","days").format("YYYY-MM-DD");
        axios.get(route.GET_CALENDARLIST(start,end),{
            headers: route.AUTH_TOKEN(SSID)
        })
        .then(res=>{
            console.log(res.data)
            setEvents(res.data.data || []);
        }).catch(e=>console.log(e.response))    
    }
    const modalHandler = ()=>{
        if(modal.modal === 1){      
            return <Modal show={modal.modal === 1} onHide={close}>
                <Modal.Header closeButton>
                    <Modal.Title>일정상세보기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CalendarDetail data={modal.data} update={calendarMemoList} close={close}/>
                </Modal.Body>
            </Modal>
            
        }else if(modal.modal === 2){
            const datas_ = modal.data;
            return <Modal show={modal.modal === 2} onHide={close}>
                <Modal.Header closeButton>
                    <Modal.Title>운동여부 변경</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <WorkoutStateDetail data={datas_} update={isWorkoutDataList} />
                </Modal.Body>      
            </Modal>
        }else if(modal.modal === 3){
            return <Modal show={modal.modal === 3} onHide={close}>
                    <Modal.Header closeButton>
                    <Modal.Title>일정추가</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddDate close={close} update={calendarMemoList}/>
                </Modal.Body>
                </Modal>
        }
    }

    useEffect(()=> {
        isWorkoutDataList();
        calendarMemoList();
    },[]);

    useEffect(()=> eventModal(),[modal])
    
    var enumerateDaysBetweenDates = function(startDate, endDate) {
        var dates = [];
        startDate = startDate.add(0, 'days');  
        while(startDate.format('M/D/YYYY') !== endDate.format('M/D/YYYY')) { 
            if(moment().isBefore(moment(startDate).format("YYYY-MM-DD"))) break;          
            dates.push({
                start :  moment(startDate.toDate()).format("YYYY-MM-DD"),
                isWorkout : false
            });
            startDate = startDate.add(1, 'days');
        }
        return dates;
      };

    useEffect(()=>{
      let cur_date = enumerateDaysBetweenDates(
        moment(cur_start),moment(cur_end)
      );
      setCurrentMonth(cur_date);
      
    },[cur_start,cur_end])

    return(
        <>
        {modalHandler()}
        <FullCalendar    
            plugins={[listPlugin, dayGridPlugin , interactionPlugin]}
            // editable={true}
            // droppable={true}
            headerToolbar={{
                left: "prev,today,next",
                center: "title",
                right: "inputDate,dayGridMonth,listMonth"
            }}
            footerToolbar={{
                right: "inputDate", 
            }}
            customButtons = { {
                inputDate: { 
                    text: 'add',    
                    click: function(event) {         
                      setModal({
                          modal : 3,
                          data : null
                      })
                    }       
                },
                  
            }}   
            timeZone = 'local'  
            eventSources = {[    
                {
                    events : workout.filter(w=> w.isWorkout === true),
                    display : "list-item",
                    backgroundColor : "#198754",
                    editable : false  ,
                    className : "isWorkout"  ,           
                },     
                {
                    events : workout.filter(w=> w.isWorkout === false),
                    display : "list-item",
                    backgroundColor : "#dc3545",
                    editable : false  ,
                    className : "isWorkout" ,     
                }, 
                {
                    events : currentMonth.filter(c=> !workout.includes(c.start)),
                    display : "list-item",
                    backgroundColor : "#dc3545",
                    editable : false,
                    className : "isWorkout"  ,               
                },
                {
                    events : events,                                        
                }
            ]}
            defaultAllDay
            locale='ko'
            eventClick={(e)=>{ 
                console.log(e)
                let isWorkout = e.event._def.extendedProps.isWorkout ;
                const type = e.view.type;
                const dataInfo = {      
                    id : e.event._def.publicId,    
                    start : e.event._instance.range.start,
                    end : e.event._instance.range.end,  
                    title : e.event._def.title,
                    data : e.event._def.extendedProps,
                    color : type === "listMonth" ?  rgbToHex(e.el.childNodes[1].firstChild.style.borderColor) :rgbToHex(e.el.style.backgroundColor)
                }
                setCurrent_data(dataInfo);
                if(isWorkout !== undefined){
                    setModal({
                        modal : 2,
                        data : dataInfo
                    });
                    
                }else{
                    setModal({
                        modal : 1,
                        data : dataInfo
                    });
                }
                    
            }}
            datesSet ={(dateInfo) => {
                setCurStart(dateInfo.startStr);
                setCurEnd(dateInfo.endStr);
                isWorkoutDataList(true, {
                    start : moment(dateInfo.startStr).startOf("month").format("YYYY-MM-DD"),
                    end : moment(dateInfo.endStr).startOf("month").add("11","days").format("YYYY-MM-DD"),
                });
            }}   
            selectable = {true}
        />       
        </>
    )
}