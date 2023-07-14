
"use client";
import Image from 'next/image'
import styles from './page.module.css'
import { useEffect } from 'react';
import { useState } from 'react';
import { useAtom } from 'jotai';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from './components/Footer';
import {motion} from 'framer-motion'
import { grey } from '@mui/material/colors';

export default function Home() {
  const [token,setToken]= useState("")
const [errorTxt,setError] = useState(null)
  
 
function handleKeyDown(event){
if(event.key == 'Enter')
{
search();
}
}

let router = useRouter();

  const[searchInput,setSearchInput] = useState("");
 

  var songs;

  

  

async function search()
{


var onlyWhite = false;

 
  if (searchInput.replace(/\s/g, '').length == 0) {
   onlyWhite = true;
  }


  if(onlyWhite == false)
  {
    setError(null)
    router.push('/tracks?title=' + searchInput);
  }
  else{
setError(<p className={styles.error}>The search input must not be empty!</p>)
  }




//PUSH TO NEW PAGE AND SEND THE ARTIST DATA THERE
}
 
  return (
    <>
    <div className={styles.controls}>
   <h1 className={styles.title}>Spotify stats</h1>
<div className={styles.content}>
   <motion.input whileHover={{backgroundColor: ['#e1e6ed','#babfc2']}} type='text' placeholder='Enter a song title or artist name' className={styles.text}
   onChange={e => {setSearchInput(e.target.value); setError(null)}} onKeyDown={e => handleKeyDown(e)}></motion.input>
 <div className={styles.search}> <motion.button whileHover={{backgroundColor: ['#e1e6ed','#babfc2']}}  className={styles.button} onClick={search}>Search</motion.button></div>

</div>
{errorTxt}
<div className={styles.desc}>
  <p>
Currently, this site is designed by to help users find detailed information about any song that is  available on spotify. Soon user accounts, voting and a leaderboard system will be implemented. Once those features are in place Spotify Stats will be more than a place for just information about music, it will be a great way to visualize and quantify fan reception to new music!</p>
</div>
</div>
<Footer></Footer>
   </>
  )
}
