import React,{useRef, useState,useEffect} from "react";
import Payments from "./Payments";
import Buyers from "./Buyers";
import { contractABI } from "./Abi";
import Web3 from 'web3';
function App() {
  const [courseFee,setCourseFee] = useState();
  const [web3,setWeb3] = useState();
  const [courseContract,setCourseContract] = useState();
  const [count,setCount] = useState(0);
  const [payments,setPayments] = useState([]);
  const contractAddress = '0x71063eab9440f0116a853d301af97a0649e513ff';
  const mailRef = useRef();
  const buttonClickHandler = async (e)=>
  {
    e.preventDefault();
    if(!web3)
    {
      console.log("Wallet not connected");
      return;
    }
    else if(!courseContract)
    {
      console.log("Try reconnecting to the Contract");
      return;
    }
    const accounts = await web3.eth.getAccounts();
    courseContract.methods.payForCourse(mailRef.current.value).send({from: accounts[0], value: web3.utils.toWei(courseFee, 'ether') }).
    on('transactionHash', hash => {
      console.log('Transaction hash:', hash);
    })
    .on('receipt', receipt => {
      console.log('Transaction successful:', receipt);
    })
    .on('error', error => {
      console.error('Error:', error);
    }).on('deny',error => {
      console.error(error);
    })
  }
  const fetchContent = ()=>
  {
     courseContract.methods.getAllPayments().call()
     .then(values => {
         setPayments(values)
     });
     
  }
  useEffect(() => {
    const intervalId = setInterval(() => {
      if(count==10)
      {
         setCount(0);
         fetchContent();
      }
      else
      {
        setCount(count+1);
      }
    }, 1000); // Run every 1 second (1000 milliseconds)

    return () => clearInterval(intervalId); // Clean up the interval when the component unmounts
  }, [count]);
  useEffect(() => {
    if (window.ethereum) {
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(() => {
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);

                const courseInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
                setCourseContract(courseInstance);

                courseInstance.methods.courseFee().call()
                    .then(fee => {
                        setCourseFee(web3Instance.utils.fromWei(fee, 'ether'));
                    });
            })
            .catch(err => {
                // Handle error if the user rejects the connection request
                console.error(err);
            });
    } else {
        alert('Please install an another Ethereum wallet.');
    }
}, []);
  return (
    <div>
      <h2>Buy Course for this Price {courseFee} Wei</h2>
      <form>
        <label>Email</label>
        <input type="text" ref={mailRef}></input>
        <button onClick={buttonClickHandler}>Buy the Course!</button>
      </form>
      <div>
        <h3>Fetching the Content in {count} Seconds</h3>
      <h2>Payments Fetched from contracts</h2>  
      <Payments payments={payments}/>
      </div>
      <div>
        <h2>Buyers fetched from our backend</h2>
        <Buyers/>
      </div>
    </div>
  )
}

export default App;
