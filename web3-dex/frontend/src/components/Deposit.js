import React,{useState,useEffect,useRef} from 'react';

import {ethers} from 'ethers';
import { AMMAddress } from '../Constants';
import Withdraw from './Withdraw';


export default function Deposit(props){
    const account = props.account;
    const provider = props.providers;
    const ammContract = props.ammContract;
    const tokenAContract = props.tokenAContract;
    const tokenBContract = props.tokenBContract;
    const liquidA = props.liquidA;
    const liquidB = props.liquidB;

    const [selectedToken, setSelectedToken] = useState('TokenA');
    const depositRef = useRef();
    const [output,setOutput] = useState("");
    const [outputString,setOutputString] = useState("");
    


    useEffect(()=>{
        if(selectedToken!=""){
            changeHandler();
        }
    },[selectedToken]);

    useEffect(()=>{
        if(depositRef.current.value==0){
            setOutputString("");
        }
        else {
            const oppToken = selectedToken=="TokenA" ? "TokenB" : "TokenA";
            setOutputString(oppToken +" : "+output);
        }
    },[output]);

    function getEqAmount(){
        const dep = parseFloat(depositRef.current.value);
        const liqA = parseFloat(liquidA);
        const liqB = parseFloat(liquidB);
        if(selectedToken == "TokenA") {
            return ( dep * liqB)  / (liqA); 
        }
        else {
            return (dep * liqA) / (liqB);
        }
    }

    async function depositHandler(e){
        e.preventDefault();
        console.log(depositRef.current.value);
        console.log(output);
        const options = {
            gasLimit: 500000, // Set an appropriate gas limit value
          };
        if(selectedToken == "TokenA"){
            await tokenAContract.approve(AMMAddress,ethers.utils.parseEther(""+depositRef.current.value));
            await tokenBContract.approve(AMMAddress,ethers.utils.parseEther(""+output));
        }  
        else if(selectedToken == "TokenB"){
            await tokenBContract.approve(AMMAddress,ethers.utils.parseEther(""+depositRef.current.value));
            await tokenAContract.approve(AMMAddress,ethers.utils.parseEther(""+output));
        }
        try {
        const data = await ammContract.deposit(ethers.utils.parseEther(""+depositRef.current.value) , ethers.utils.parseEther(""+output) , options);
        console.log(data);
        }
        catch(e){
            console.log(e);
        }
        finally{
            depositRef.current.value = "";
        }
    }

    function changeHandler(e){
        if(depositRef.current.value==""){
            setOutput("");
        }
        else if(liquidA ==0 && liquidB == 0){
            const outputValue = depositRef.current.value;
            setOutput(outputValue);
        }
        else {
            const outputToken = getEqAmount();
            const outputValue = outputToken;
            setOutput(outputValue);
        }
    }
    function dropDownchangeHandler(e){
        setSelectedToken(e.target.value);
    }
    return(
        <div className="deposit-section">
    <h2>Deposit</h2>
    <h3 className="liquidity-details-title">Liquidity Details</h3>
    <h3> Token A: <span className="token-value">{liquidA}</span></h3>
    <h3> Token B: <span className="token-value">{liquidB}</span></h3>
    <div id="depositToken" className="deposit-token">
        <select id="token" className="token-select" value={selectedToken} onChange={dropDownchangeHandler}>
            <option value="TokenA">Token A</option>
            <option value="TokenB">Token B</option>
        </select>
        <input ref={depositRef} type="number" className="deposit-input" onChange={changeHandler}/>
        <h4 className="output-string">{outputString}</h4>
        <button className="deposit-button" onClick={depositHandler}>Deposit!</button>
    </div>
</div>
    );
}