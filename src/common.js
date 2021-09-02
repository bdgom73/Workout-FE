import moment from "moment";

export function rgbToHex ( rgbType ){    
    var rgb = rgbType.replace( /[^%,.\d]/g, "" ).split( "," );  
    rgb.forEach(function (str, x, arr){ 
        if ( str.indexOf( "%" ) > -1 ) str = Math.round( parseFloat(str) * 2.55 );     
        str = parseInt( str, 10 ).toString( 16 ); 
        if ( str.length === 1 ) str = "0" + str;     
        arr[ x ] = str; 
    });    
    return "#" + rgb.join( "" ); 
} 

export function dateFormat(date, format){ 
    if(!format)  format = "YYYY-MM-DD HH:MM:ss";
    return moment(date).format(format);
}