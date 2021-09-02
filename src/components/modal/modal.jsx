import moment from 'moment';
import { Children } from 'react';
import { Badge } from 'react-bootstrap';
import { RiCloseLine } from 'react-icons/ri';

export default function Modal(props){

    const {
        title,  
        width,
        height,   
        titleBgColor,
        titleColor,
        isMessage,
        close,
        messageType,
        message,
        children,
        badge,       
    } = props;

    const messageColor = {
        basic : "#212529",
        info : "#0dcaf0",
        primary : "#0d6efd",
        success : "#198754",
        warning : "#ffc107",
        error : "#dc3545"
    }

    const bodyStyle = {
        display : "flex",
        justifyContent : "center",
        alignItems : "center",
        color : messageType ? messageColor[messageType] : "",
        fontWeight : "bold"
    }

    return(
        <div className="modal_container">  
            <div className="modal" style={{width:width , height : height}} >
                <div className="modal_title" style={{
                    backgroundColor : titleBgColor,
                    color : titleColor 
                }}>
                    <div>
                        {title ? title : "알림"}
                        &nbsp;
                        {badge && badge.date === moment().format("YYYY-MM-DD") ? <>
                        <Badge pill={badge.pill} bg={badge.color ? badge.color:"primary"}>
                            {badge.lang === "en" ? "today" : "오늘"}
                        </Badge>&nbsp;</>: ""}
                        {
                        badge && badge.text ? <>
                        <Badge pill={badge.pill} bg={badge.color ? badge.color:"primary"}>
                            {badge.text}
                        </Badge>&nbsp;</>: ""
                        }
                    </div>
                    <RiCloseLine size="20" onClick={close}/>
                </div>
                <div className="modal_body" 
                style={isMessage ? bodyStyle : {}}>
                    {children ? children : message ? message : ""}
                </div>
            </div>
        </div>
    );
}