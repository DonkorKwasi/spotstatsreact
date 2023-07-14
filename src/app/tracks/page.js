"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePathname,useSearchParams } from "next/navigation";
import { useState } from "react";
import TrackCard from "../components/TrackCard.js";
import { Pagination } from "@mui/material";
import { Container, Row, Col } from 'react-grid-system';
import { useAtom } from "jotai";
import Footer from "../components/Footer.js";
import { trackSelected } from "../results.js";
import styles from '../cards.module.css'
import {motion} from 'framer-motion'
import dotenv from 'dotenv'
function Tracks()
{


  var does = null;
const router = useRouter();
    const pageLimit = 20;
    const [token,setToken]= useState("")
    const [allSongs,SetAllSongs] = useState([])
    const [page,setPage]= useState(1);
    const [display,setDisplay]= useState([]);
    const [loading, setLoading] = useState(null)
    const [select, setSelect] = useAtom(trackSelected);
    let currentPageData = [];
    var songCard = null;
    let displayVAR = null;
    //function for the pagination event
    const handleChange = (event,value) => {
setPage(value)
console.log(page)

    };

    function choose(index)
    {


     let x = page -1;
let actualIndex =  (20 * x) + index;
console.log(actualIndex);
setSelect(allSongs[actualIndex]);
router.push('/tracks/selected')

    }

    //function for retrieving a valid token for acessing the spotify api
    async function getToken(){
console.log('token was called')
       
      
        const url = 'https://accounts.spotify.com/api/token';
        const authOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: 'grant_type=client_credentials&client_id=' + process.env.NEXT_PUBLIC_CLIENT_ID + '&client_secret=' + process.env.NEXT_PUBLIC_CLIENT_PASS
          }
          
        fetch(url,authOptions).then(result=> result.json()).then(data =>  setToken(data.access_token))
      }
      var songs;
//get input from router path

let path = useSearchParams().toString()
const input = path.split('=')[1];





      async function trackSearch()
      {
      //this function will search for tracks from the spotify api
      //after it has retrieved the search it will then search up to 10 pages from the ui
      //after it is done getting all the songs it will set the songs into  a state array 
        

if (token == "")
{
  console.log('here')
  return;
}

console.log(token);
      const searchUrl = "https://api.spotify.com/v1/search?q="
      const searchOpt = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token
      
        }
       
       
      }
      
      const compSearch =  searchUrl + input+ '&type=track';
      const rep = await fetch(compSearch,searchOpt)
      
       songs = await rep.json() 
     
const totalSongs= songs.tracks.items;

var currentPoint;
let limit = 0;
const limitRaw = songs.tracks.limit
if(limitRaw <= 10)
{
limit = limitRaw;

}
else{
  limit = 10;
}

for(var i = 0; i <limit; i++)
{

  if( i == 0)
  {
currentPoint = songs.tracks.next;

  }
  else{
currentPoint = currentPoint.next

  }
  const searchUrlNext = currentPoint;
  const searchOptNext = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
  
    }
  }
    const nextDataRaw = await fetch(searchUrlNext,searchOptNext)
    const nextData = await nextDataRaw.json() 
    totalSongs.push(...nextData.tracks.items);
    if(nextData.tracks != undefined)
    {
    currentPoint = nextData.tracks
    }
    else
    {
      currentPoint = nextData;
    }
  }
  


 
 var songs = totalSongs;

console.log("ive been called")
return totalSongs;



}


useEffect(() => {

  if(allSongs != undefined )
  {
  
    setLoading(null)
    if(page == 1)
{
for(let y = 0; y < 20 ; y++)
{
  if(y <= (allSongs.length -1))
  {
currentPageData.push(allSongs[y]);
  }



}
const get =  currentPageData.map((song,index) => <motion.Col className={styles.col} whileHover={{y: -10}}  key={song?.id} onClick={() =>choose(index)}><TrackCard   song={song} key={song?.id} ></TrackCard></motion.Col>)
setDisplay(get);
}


  }
  else{
    console.log('should be loading');
    let load = <h1>Loading up  to 220 results!</h1>
    setLoading(load)
  }

},[allSongs])
useEffect(() => {
      //get token on page mount
  async  function reactHAH(){
    await  getToken();
 
   }
 
 reactHAH();
},[]);

useEffect(() =>{
//set the songs into a state after all the songs have finished loading from the api
async function gettingTracks(){
 songs=  await trackSearch();
console.log(songs);
 SetAllSongs(songs)
 
}

 gettingTracks();


},[token])

useEffect(() =>{
  songCard = null;
  console.log(allSongs)
  currentPageData = [];
console.log("page number:"+page);
//get the songs data for the first page and create the ui cards for the first page
if(allSongs.length > 0)
{
console.log("page was called")
console.log(allSongs)
  //solving for where in the array we must  start displaying tracks from depending on what the current page is
var start =  (page * pageLimit) - pageLimit
console.log(start)
//create the ui cards for the first page based off the data
for(let x = start; x < (start + pageLimit); x++)
{
currentPageData.push(allSongs[x])
}


const get =  currentPageData.map((song,index) => <motion.Col className={styles.col}   whileHover={{y: -10}} key={song?.id} onClick={() =>choose(index)}><TrackCard  song={song}  key={song?.id}></TrackCard></motion.Col>)

setDisplay(get)
does = display
}
},[page])

//do api stuff here
let pageinate = null;

//if all songs have finsihed loading then  create the pagination ui element

if(allSongs != undefined)
{
let wholeAmount = Math.floor(allSongs.length/20)
const remainder =   allSongs.length % 20;
if(remainder != 0)
{
  wholeAmount++;
}
console.log(allSongs);


pageinate = <Pagination className={styles.page} count={wholeAmount} page={page} onChange={handleChange}/>

}

let rows = [[],[],[],[],[]]
if(display != undefined)
{
  let count = 0;
  let cardCount = 0;

for(let t = 0; t < display.length; t++)
{

if(cardCount <  4 )
{
rows[count].push(display[t])
cardCount++;
}
else if(cardCount <  8 &&  cardCount >=  4)
{

if(cardCount== 4)
{
  count++;
}
rows[count].push(display[t])
cardCount++;

}

else if(cardCount <  12 &&  cardCount >=  8)
{
  if(cardCount== 8)
  {
    count++;
  }
  rows[count].push(display[t])
  cardCount++;
  
}
else if(cardCount <  16 &&  cardCount >=  12)
{
  if(cardCount== 12)
  {
    count++;
  }
  rows[count].push(display[t])
  cardCount++;
}
else if(cardCount <  20 &&  cardCount >=  16)
{
  if(cardCount== 16)
  {
    count++;
  }
  rows[count].push(display[t])
  cardCount++;
}

}
//PUT EACH ROW ARRAY INTO A ROW GRID THING
console.log(rows);
}

var row1 = <Row className={styles.row}>{rows[0]}</Row>;
var row2 = <Row className={styles.row}>{rows[1]}</Row>
var row3= <Row className={styles.row}>{rows[2]}</Row>;
var row4= <Row className={styles.row}>{rows[3]}</Row>;
var row5= <Row className={styles.row}>{rows[4]}</Row>;

 displayVAR = <Container>{row1}{row2}{row3}{row4}{row5}</Container>
return(

  <>
  
{loading}
{songCard}
{displayVAR}
{pageinate}

  </>
)

}

      
    


     
export default Tracks;