import { useState , useRef, useEffect} from "react"
import { AMMAddress, TokenAAddress, TokenBAddress } from "../Constants";
import { ethers } from "ethers";

export default function Trade(props){
    const liquidA = props.liquidA;
    const liquidB = props.liquidB;
    const ammContract = props.ammContract;
    const tokenAContract = props.tokenAContract;
    const tokenBContract = props.tokenBContract;
    const [selectedToken,setSelectedToken] = useState("TokenA");
    const tradeRef = useRef();
    const [output,setOutput] = useState("");
    function changeHandler(e){
        e.preventDefault();
        setSelectedToken(e.target.value);
    }
    function tokenAmountChangeHandler(){
        const tokenAmount = tradeRef.current.value;
        if(tokenAmount!=0){
            if(selectedToken == "TokenA"){
                const amountAfterTx = (parseFloat(liquidA) * parseFloat(liquidB)) / (parseFloat(liquidA) + parseFloat(tokenAmount));
                setOutput(liquidB - amountAfterTx);
            }
            else {
                const amountAfterTx = (parseFloat(liquidA) * parseFloat(liquidB)) / (parseFloat(liquidB) + parseFloat(tokenAmount));
                setOutput(liquidA - amountAfterTx);
            }
        }
        else {
            setOutput("");
        }
    }
    async function tradeHandler(e){
        e.preventDefault();
        if(tradeRef.current.value==0){
            alert("Please select an amount to trade!");
        }
        const tokenAmount = ethers.utils.parseEther(tradeRef.current.value);
        if(selectedToken == 'TokenA'){
            await tokenAContract.approve(AMMAddress,tokenAmount);
            await ammContract.trade(TokenAAddress,tokenAmount);
        }   
        else {
            await tokenBContract.approve(AMMAddress,tokenAmount);
            await ammContract.trade(TokenBAddress,tokenAmount);
        }
    }
    useEffect(()=>{
        tokenAmountChangeHandler();
    },[selectedToken]);
    return(
        <div className="trade-section">
    <h3>Swap</h3>
    <div id="depositToken" className="trade-token">
        <select id="token" className="token-select" onChange={changeHandler}>
            <option value="TokenA">Token A</option>
            <option value="TokenB">Token B</option>
        </select>
        <input type="number" ref={tradeRef} className="trade-input" onChange={tokenAmountChangeHandler}/>
        <h5 className="output-message">{output === "" ? "" : selectedToken === "TokenA" ? "TokenB of value " + output : "Token A of value " + output}</h5>
        <button className="trade-button" onClick={tradeHandler}>Trade!</button>
    </div>
</div>    )
}