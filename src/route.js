const COMMON_URL = "/myApi";

const AUTH_TOKEN = (token)=>{
   return {
        "Authorization" : window.localStorage.getItem("SSID") ? window.localStorage.getItem("SSID") : token 
   }
}

// MEMBER
const MEMBER_URL = "/member";

const M_PATH = COMMON_URL + MEMBER_URL;

const LOGIN = M_PATH+"/login";
const SOCIAL_LOGIN = M_PATH + `/social/login`;
const SIGNUP = M_PATH+"/signup";
const INFO = M_PATH+"/information";
const ME = M_PATH + "/me";
const CREATE_ME = M_PATH + "/create/me";
const UPDATE_ME = M_PATH + "/update/me";

const GET_WEIGHT_LOG = (start,end)=> {
    if(start && end){
        return M_PATH + `/weight/log?start=${start}&end=${end}`;
    }
    return M_PATH + `/weight/log`;
} 

const DELETE_WEIGHT_LOG = (log_id) => M_PATH + `/delete/weight/log?log_id=${log_id}`;

// WORKOUT
const WORKOUT_URL = "/workout";

const W_PATH = COMMON_URL + WORKOUT_URL;

/** 루틴 */
const GET_ROUTINLIST = (size,page) => W_PATH + `/get/list/routine?size=${size}&page=${page}`; // 리스트
const DELETE_ROUTINE = (routine_id) => W_PATH + `/delete/${routine_id}/routine`;
const UPDATE_ROUTINE = (routine_id) => W_PATH + `/update/routine/${routine_id}`;
const ADD_ROUTINE = W_PATH + `/add/routine`; 
const GET_ROUTINE = (routine_id) => W_PATH + `/get/routine/${routine_id}`; // 단일
const UPDATE_ROUTINE_SHARE = (routine_id, share) => W_PATH + `/update/routine/${routine_id}/share=${share}`; // 공유상태변경

/** 공유루틴 */
const GET_SHARE_ROUTINELIST = (size,page,term) => W_PATH + `/get/list/share/routine?size=${size}&page=${page}&type=${term}`;
const GET_SHARE_ROUTINE = (routine_id) => W_PATH + `/get/share/routine/${routine_id}`;
const COPY_ROUTINE = (routine_id) => W_PATH + `/copy/routine/${routine_id}`;

/** 운동상태 */
const UPDATE_ISWORKOUT_STATE = (date,state) => W_PATH + `/${date}/change/isWorkout=${state}`; // 운동상태변경
const GET_ISWORKOUTLIST = (start,end) => W_PATH + `/get/list/isWorkout?start_date=${start}&end_date=${end}`; // 운동상태 리스트
const ADD_WORKOUT = W_PATH + "/add";
const UPDATE_WORKOUT = (workout_id) => W_PATH + `/update/${workout_id}`;
const UPDATE_WORKOUT_IMAGE = (workout_id) => W_PATH + `/update/image/${workout_id}`;


/** 운동종류 */
const GET_WORKOUTLIST = (size,page) => W_PATH + `/findAll?page=${page}&size=${size}`; // 운동종류 리스트 
const GET_WORKOUT = (workout_id) => W_PATH + `/find?wid=${workout_id}`;

/** 볼륨 */
const UPDATE_VOLUME = (routine_id) => W_PATH + `/update/${routine_id}/volume`;
const ADD_VOLUME = (routine_id) => W_PATH + `/add/${routine_id}/volume`;
const DELETE_VOLUME = (routine_id) => W_PATH + `/delete/${routine_id}/volume`;

// CALENDAR
const CALENDAR_URL = "/calendar";

const C_PATH = COMMON_URL + CALENDAR_URL;

/** 스케쥴 가져오기 */
const GET_CALENDARLIST = (start,end) => C_PATH + `/get/all/${start}/${end}`;
const UPDATE_SCHEDULE =  C_PATH + `/change/schedule`;
const DELETE_SCHEDULE = (calendar_id) => C_PATH + `/delete/schedule/${calendar_id}`;
const ADD_SCHEDULE = C_PATH + `/add/schedule`;


// SEARCH
const SEARCH_URL = "/search";

const S_PATH = COMMON_URL + SEARCH_URL;

const SEARCH = (size,page) => S_PATH + `?size=${size}&page=${page}`;

const route ={
    AUTH_TOKEN,
    GET_WEIGHT_LOG,
    LOGIN,
    SOCIAL_LOGIN,
    SIGNUP,
    ME,
    INFO,
    CREATE_ME,
    UPDATE_ME,
    DELETE_WEIGHT_LOG,
    GET_ISWORKOUTLIST,
    COPY_ROUTINE,
    GET_ROUTINLIST,
    GET_WORKOUT,
    DELETE_ROUTINE,
    GET_WORKOUTLIST,
    ADD_WORKOUT,
    UPDATE_WORKOUT,
    UPDATE_WORKOUT_IMAGE,
    GET_SHARE_ROUTINE,
    GET_SHARE_ROUTINELIST,
    UPDATE_ISWORKOUT_STATE,
    UPDATE_VOLUME,
    UPDATE_ROUTINE,
    GET_ROUTINE,
    ADD_VOLUME,
    UPDATE_ROUTINE_SHARE,
    DELETE_VOLUME,
    ADD_ROUTINE,
    GET_CALENDARLIST,
    UPDATE_SCHEDULE,
    DELETE_SCHEDULE,
    ADD_SCHEDULE,
    SEARCH
}

export default route 