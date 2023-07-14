import { CardContent, Typography } from "@mui/material"
import {Card} from "@mui/material";
import {CardMedia} from "@mui/material";
import styles from '../tracks.module.css'
function TrackCard(props)
{

    function truncate(str, n){
        return (str.length > n) ? str.slice(0, n-1) + '...' : str;
      };

    
      
 let totalArtists = "";
    //create a function for gettin the names of all artists involved
    for(var i = 0; i < props.song?.artists?.length; i++)
    {

 if(i == 0)
{
    const adding = props.song?.artists[i]?.name
    totalArtists = adding
}
else 
{
    const adding2 = props.song?.artists[i]?.name
    totalArtists += ", " + adding2
}


    }


var name =  truncate(props.song?.name,26)
return(
<>
<Card sx={{ maxWidth: 345 }}>
    <CardMedia  
    component="img"
        height="305"
        image={props.song?.album?.images[1]?.url}
        alt="Chevrolet"/>
    <CardContent>
<Typography gutterBottom variant="h5" component="div" className={styles.textFlow}>
{name} 
</Typography>
<Typography variant="body1" className={styles.textFlow}>
{totalArtists}
</Typography>
    </CardContent>
</Card>
</>

)

}

export default TrackCard;