import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { useLocation } from "react-router";
import qs from 'qs';
import route from "../../route";
export default function GithubLoginCallback(){

    const {search} = useLocation();
    const [message, setMessage] = useState("");
    const query = qs.parse(search, {
        ignoreQueryPrefix: true
      });

    const githubLoginHandler = (res)=>{
        const result = res.data;
        const fd = new FormData();
        if(result){
            fd.append("email",result.email);
            fd.append("name",result.name);
            fd.append("socialId",result.node_id);
            fd.append("image_url",result.avatar_url);
            fd.append("type","GITHUB");
            axios.post(route.SOCIAL_LOGIN,fd)
            .then(res=>{
                const result2 = res.data;
                if(result2.result_state){
                    window.localStorage.setItem("SSID", result2.data);  
                    window.close();         
                }else{
                    setMessage(result2.message || "소셜로그인에 실패했습니다");
                    setTimeout(()=>{
                        window.close();
                    },1000)
                   
                }
                
            }).catch((e)=>{
                console.log(e.response)
                window.close();
                alert("소셜로그인에 실패했습니다.")
            })
        }
    }  

    useEffect(()=>{
        // 깃허브 로그인 토큰 발행
        axios.post(
            '/login/oauth/access_token',
            {
                code :  query.code,
                client_id : "55fd921ee403af6b4021",
                client_secret : "f14755ccc5c937eb37a76d009ec94af7ffd249bb",
            },
            {
              headers: {
                accept: 'application/json',
              },
            },
          ).then(res=>{

                // 깃허브 로그인 토큰 값 해석
                const token = res.data.access_token;
                axios.get("/user",{
                    headers : {
                        Authorization : `token ${token}`,
                    }
                }).then(githubLoginHandler).catch(e=>console.log(e.response) );

          }).catch(e=> console.log(e.response))
    },[])
           

    return(
        <div className="d-flex  justify-content-center align-items-center" style={{flexDirection:"column",width:"100%", height:"100vh"}} >
            <div>
                <Spinner animation="border" role="status"/>
            </div>        
            { message ? <><br/><Alert variant="danger">{message}</Alert></> : ""}
        </div>
    )
}