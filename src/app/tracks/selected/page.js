"use client";
import { trackSelected } from "@/app/results.js";
import { useAtom } from "jotai";
import { Braah_One } from "next/font/google";
import { useEffect } from "react";
import { useState } from "react";
import { Container, Row, Col } from 'react-grid-system';
import Footer from "@/app/components/Footer";
import styles from '../../details.module.css'
import dotenv from 'dotenv'
function Selected()
{


   const [token, setToken] = useState('');

   async function getToken(){
     
            
    
              const url = 'https://accounts.spotify.com/api/token';
              const authOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'grant_type=client_credentials&client_id=' +  process.env.NEXT_PUBLIC_CLIENT_ID + '&client_secret=' + process.env.NEXT_PUBLIC_CLIENT_PASS
                }
                
              fetch(url,authOptions).then(result=> result.json()).then(data =>  setToken(data.access_token))
           
            }

    const [select, setSelect] = useAtom(trackSelected);
    const [data,setData] = useState(<h1>Loading Selected Track...</h1>);
 let test2 = null

    useEffect( () =>
    {  
      document.title ="Spotify Stats"

        

       
        async  function reactHAH(){
         await  getToken();
        }

        reactHAH();
    },[])

    
useEffect(()=>{
var specs;
   if(token != "")
   {  
     
      
  
   async function apiCall() {
   const searchUrl = "https://api.spotify.com/v1/audio-features/" + select.id
   const searchOpt = {
     method: 'GET',
     headers: {
       'Authorization': 'Bearer ' + token
   
     }
    
    
   }

  

   const rep = await fetch(searchUrl,searchOpt)
  
const details = await rep.json()
specs = details

if( select != null && select!= undefined)
{

   let key = 'none';
let mode = "";
   switch(specs.key)
   {
      case 0:
       key = "C"
       break;
      case 1:
       key = "C#"
       break;
       case 2:
       key =  "D"
       break;
       case 3:
      key = "D#"
      break;
      case 4:
      key = "E"
      break;
      case 5:
      key = "F"
      break;
      case 6:
      key = "F#"
      break;
      case 7:
      key = "G"
      break;
      case 8:
         key = "G#"
         break;
         case 9:
            key = "A"
            break;
            case 10:
               key = "A#"
               break;
               case 11:
                  key = "B"
                  break;
   }

   let firstDuration = (specs.duration_ms / 60000)

   let decimal = ( (60 * (firstDuration % 1))/100).toFixed(2);

  let secondDuration = Math.floor(firstDuration / 1);
  decimal = Number(decimal);
 
  let total = secondDuration + decimal;
 total = total.toString().replace('.',':')


if(total.length==1)
{
   total += ":00"

}
else if(total.length== 3)
{
   total+= '0'
}
else if (total.length >4)
{
   total = (total[0]+ total[1] + total[2] + total[3]);
}



if(specs.mode ==0)
{
mode = "Minor"
}
else{
mode = "Major"
}
  
//process data
const jsx = <div className={styles.cover}><img   src={select.album?.images[0]?.url}/> <div className={styles.textdata}><p>Title: {select.name}</p> <p>key: {key}</p> <p> Duration: {total}</p>  <p>BPM: {specs.tempo}</p> <p>Time Signature: {specs.time_signature}/4 </p> <p>Mode: {mode}</p></div> </div>;
setData(jsx);
}
}

apiCall();





   }
},[token])

    return(<>{data} <Footer></Footer></>)
}

export default Selected;