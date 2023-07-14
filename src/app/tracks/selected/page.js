"use client";
import { trackSelected } from "@/app/results.js";
import { useAtom } from "jotai";
import { Braah_One } from "next/font/google";
import { useEffect } from "react";
import { useState } from "react";
import { Container, Row, Col } from 'react-grid-system';
import Footer from "@/app/components/Footer";
import styles from '../../details.module.css'
function Selected()
{


   const [token, setToken] = useState('');

   async function getToken(){
      console.log('token was called')
              const client_id = '3b4a09d08d634156b36117aed03332e5';
             const client_secret = 'f6f409a0924e4d09ad1630be3411d6a7';
            
              const url = 'https://accounts.spotify.com/api/token';
              const authOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'grant_type=client_credentials&client_id=' + client_id + '&client_secret=' + client_secret
                }
                
              fetch(url,authOptions).then(result=> result.json()).then(data =>  setToken(data.access_token))
           
            }

    const [select, setSelect] = useAtom(trackSelected);
    const [data,setData] = useState(<h1>Loading Selected Track...</h1>);
 let test2 = null

    useEffect( () =>
    {

        //BASICALLY DO SOME STUFF SO THAT IF PEOPLE COME TO THIS PAGE AFTER REFRESHING I.E SELECTED TRACK IS UNDEFINED THAT IT DISPLAYS A MESSAGEE SAYING  PLEASE GO BACK
        // MAYBE SAVE SELECT INTO COOKIES OR SOMETHING SO THAT EVEN ON REFRESH IT CAN SAVE SELECTED TRACK (SOME KIND OF PERMANENT STORAGE AFTER REFRESH)

       
        async  function reactHAH(){
         await  getToken();
        }

        reactHAH();
    },[])

    
useEffect(()=>{
var specs;
   if(token != "")
   {  
      console.log(token)
      console.log(select.id)
  
   async function apiCall() {
   const searchUrl = "https://api.spotify.com/v1/audio-features/" + select.id
   const searchOpt = {
     method: 'GET',
     headers: {
       'Authorization': 'Bearer ' + token
   
     }
    
    
   }

   console.log(searchOpt);

   const rep = await fetch(searchUrl,searchOpt)
  
const details = await rep.json()
specs = details
console.log(specs);
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
console.log(total);

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

  console.log(firstDuration)
  console.log(decimal)
  console.log(secondDuration)
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