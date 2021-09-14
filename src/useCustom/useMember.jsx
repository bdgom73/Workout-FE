import axios from "axios";
import { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";
import { useCookies } from "react-cookie";
import route from "../route";

export default function useMember(){

    const [cookies ,setCookies, removeCookie] = useCookies();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    // const keepToken = window.localStorage.getItem("SSID");
    const fetchMemberData = async ()=>{
        return await axios.get(route.INFO,{
            headers : route.AUTH_TOKEN()
        });
    }

    useEffect(()=>{
        setLoading(true);
        fetchMemberData().then(res=>{
            const result = res.data;
            console.log(result)
            let exp =  result.data.exp;
            if( exp.indexOf("KST") != -1 ){
                exp = exp.replace("KST","");
            }
            if(!cookies.exp){
                setCookies("exp",exp,{path:"/"});
            }
            if(!cookies.SSID && !window.localStorage.getItem("SSID")){
                removeCookie("exp",{path:"/"});
            }
            
            setData(result.data);      
            setLoading(false);

            if(result.result_state === false){
                removeCookie("exp",{path:"/"});
                window.localStorage.removeItem("SSID");
            }
        })
        .catch(e=>{
            console.log(e.response);
            setData({});  
            setLoading(false);
            // removeCookie("SSID",{path:"/"});
            removeCookie("exp",{path:"/"});
            window.localStorage.removeItem("SSID");
        })
    }, []);

    return {    
        loading,
        data,
        message : data.message,
        state : data.result_state,
        SSID : cookies.SSID
    }
}