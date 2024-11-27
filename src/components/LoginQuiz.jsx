import { useState } from "react";

import './LoginQuiz.css';


function LoginQuiz(){

const[name, setName] = useState();
const[room, setRoom] = useState();
const[info, setInfo] = useState(false);

    function handelSubmit(e){

        e.preventDefault();
     alert(name)
        if(name && room){
            alert(name)
          setInfo(true);
        }
        //console.warn(name, room);
    
      }
 return(
<div>
<form  onSubmit={handelSubmit}>
    <input className='join-name' required placeholder='Enter your Name' value={name} onChange={(e)=> setName(e.target.value)}/>
    <input className='join-room' required placeholder='Enter your Room' value={room} onChange={(e)=> setRoom(e.target.value)}/>
    <button className='join-btn' type='submit'>JOIN</button>
  </form>

</div>
  
 )
 
}
export default LoginQuiz