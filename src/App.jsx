import { useEffect, useState } from 'react'
import './App.css'

import io from 'socket.io-client'
import {ToastContainer, toast} from 'react-toastify'
const socket = io('ws://10.0.0.7:5000');
import 'react-toastify/dist/ReactToastify.css'

function App() {

  const[name, setName] = useState();
  const[room, setRoom] = useState([]);
  const[info, setInfo] = useState(false);
  const[question, setQuestion] = useState('');
  const[options, setOptions] = useState([]);
  const[scores, setScores]= useState([]);
  const[seconds, setSeconds] = useState();
  const [selectedAnswerIndex, setSelectedAnswerIndex]=useState(null);
  const [answered, setAnswered]=useState(false);
  const[winner, setWinner] = useState();
  const[isCorrect, isSetCorrect] = useState(false);
  
  
  
  



  function handelSubmit(e){

    e.preventDefault();

    if(name && room){
      setInfo(true);
    }
    //console.warn(name, room);

  }

  const handleAnswer = (answerIndex)=>{
 // alert(room.length);
    if(!answered){
      setSelectedAnswerIndex(answerIndex);
      socket.emit('submitAnswer', room, answerIndex);
      setAnswered(true);
    }

  }
  useEffect(()=>{

    if(seconds === 0) return;

    const timerInterval = setInterval(()=>{

      setSeconds(prevTime=>prevTime-1);
    },1000);
    return ()=>{

      clearInterval(timerInterval);
    }

  },[seconds])
// socket io logic

useEffect(()=>{

  if(name){

    socket.emit('joinRoom', room, name);
  }

},[info])

useEffect(()=>{

  socket.on('message', (message)=>{
    toast(`${message} joined`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",

    }
  )})
  return ()=>{
    socket.off('message');
  }
},[])

useEffect(()=>{

socket.on('newQuestion', (data)=>{

  setQuestion(data.question);
  setOptions(data.answers);
  setSeconds(data.timer);
  setAnswered(false);
  setSelectedAnswerIndex();
  setScores(data.scores);
  


})

/*
  playerName: "no one",
        isCorrect: false,
        correctAnswer: rooms[room].correctAnswer,
        scores: rooms[room].players.map((player)=>({

            name: player.name,
            score: player.score || 0,
*/
socket.on('answerResult', (data)=>{
  //alert(data.scores[0].name);
  
 // alert(data.scores.name[0])

  if(data.isCorrect){

    toast(`correct! ${data.playerName} got it right`, {

      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",


      })
    }
setScores(data.scores);
  })
socket.on('gameOver', (data)=>{

  setWinner(data.winner);
})

return ()=>{

  socket.off('newQuestion');
  socket.off('answerResult');
  socket.off('gameOver');
}

},[])



  return(

  <div className='App'>
    { !info ?

 <div className='join-dev'> 
  <h1> QuizClash </h1>
  <form  onSubmit={handelSubmit}>
    <input className='join-name' required placeholder='Enter your Name' value={name} onChange={(e)=> setName(e.target.value)}/>
    <input className='join-room' required placeholder='Enter your Room' value={room} onChange={(e)=> setRoom(e.target.value)}/>
    <button className='join-btn' type='submit'>JOIN</button>
  </form>
 </div>:(
  <div>

{ //Check if message failed
        (winner)
          ? <h2 className='quiz-winner'>  The Winner is  {winner}  </h2> 
          : <div> {scores.map((player, index)=>( 
           <table className='answer-player'>  <th>ScoreBoard</th><tr>
            <td  key={index}> {player.name} {player.score}</td> </tr></table>
          ))} </div> 
      }


  <h1 className='room-quiz'> QuizClash</h1>
  <p className='room-id'>Room Id: {room}</p>
  <button className='button-option' onClick= {()=>handleAnswer(index)} disabled={answered} >Restart</button>

  <ToastContainer/>

  {question ?(


    <div className='quiz-div'>
      Remaining Time: {seconds}

  <div className='question'> 

  <p className='question-text'>
    {question}
  </p>

  </div>
 
  <ul className='answer-option'>
          {options.map((answer, index)=>(

            <li key={index}>
              <button className='button-option' onClick= {()=>handleAnswer(index)} disabled={answered} >{answer}</button>

            </li>

          ))}

  </ul>



 </div>

 ) : (

  <p> Loading Questions.....</p>
 )
}
  </div>
)}</div>
)
}

export default App
