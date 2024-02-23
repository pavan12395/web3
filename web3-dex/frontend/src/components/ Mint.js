import React,{useState,useEffect,useRef} from "react";
import { ethers } from 'ethers';


export default function Mint(props){
    const account  = props.account;
    const provider = props.provider;
    const tokenAContract = props.tokenAContract;
    const tokenBContract = props.tokenBContract;
    const [tokenAAmount , setTokenAAmount] = useState(0);
    const [tokenBAmount , setTokenBAmount] = useState(0);

    const tokenARef = useRef(0);
    const tokenBRef = useRef(0);
    
    
    useEffect(()=>{
        const fetchTokenDetails = async ()=>{
            if(tokenAContract && tokenBContract){
                const amountA = await tokenAContract.balanceOf(account);
                const amountB = await tokenBContract.balanceOf(account);
                setTokenAAmount(ethers.utils.formatEther(amountA));
                setTokenBAmount(ethers.utils.formatEther(amountB));
            }
        }
        fetchTokenDetails();
    },[tokenAContract,tokenBContract]);
    const mintAHandler = async (e)=>{
        e.preventDefault();
        console.log(tokenARef.current.value);
        console.log("Mint A");
        if(tokenAContract){
            await tokenAContract.mintForMe(""+tokenARef.current.value);
        }
        else {
            alert("try again!");
        }
    }
    const mintBHandler = async (e)=>{
        e.preventDefault();
        console.log(tokenBRef.current.value);
        console.log("Mint B");
        if(tokenBContract){
            await tokenBContract.mintForMe(parseFloat(tokenBRef.current.value));
        }
        else {
            alert("try again!");
        }
    }
    return(
        <div className="wallet-details-section">
    <h3>Wallet Details</h3>
    <div id="tokenA" className="token-details">
        <h4>TokenA : {tokenAAmount}</h4>
        <input ref={tokenARef} className="token-input"></input>
        <button onClick={mintAHandler} className="mint-button">Mint More!</button>
    </div>
    <div id="tokenB" className="token-details">
        <input ref={tokenBRef} type="text" className="token-input"></input>
        <button onClick={mintBHandler} className="mint-button">Mint More!</button>
        <h4>TokenB : {tokenBAmount}</h4>
    </div>
</div>

    )
}