import React,{useRef, useState} from "react";
import Payments from "./Payments";
import Buyers from "./Buyers";
function App() {
  const [courseFee,setCourseFee] = useState(12);
  const mailRef = useRef();
  const buttonClickHandler = (e)=>
  {
    e.preventDefault();
    mailRef.current.value="";
  }
  return (
    <div>
      <h2>Buy Course for this Price {courseFee} ETH</h2>
      <form>
        <label>Email</label>
        <input type="text" ref={mailRef}></input>
        <button onClick={buttonClickHandler}>Buy the Course!</button>
      </form>
      <div>
      <h2>Payments Fetched from contracts</h2>  
      <Payments/>
      </div>
      <div>
        <h2>Buyers fetched from our backend</h2>
        <Buyers/>
      </div>
    </div>
  )
}

export default App;
