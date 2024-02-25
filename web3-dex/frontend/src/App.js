
import React, { useState, useEffect } from 'react';
import Mint from './components/ Mint';
import { ethers } from 'ethers';
import Deposit from './components/Deposit';
import { AMMABI, AMMAddress } from './Constants';
import { TokenAAddress,TokenBAddress,TokenABI} from "./Constants";
import Trade from './components/Trade';
import Withdraw from './components/Withdraw';
import UserShare from './components/UserShare';




function App() {
  const [account, setAccount] = useState(null);
  const [provider,setProvider] = useState(null);
  const [ammContract,setAMMContract] = useState(null);
  const [tokenAContract ,setTokenAContract] = useState(null);
  const [tokenBContract ,setTokenBContract] = useState(null);
  const [liquidA,setLiquidA] = useState(0);
  const [liquidB,setLiquidB] = useState(0);


  useEffect(()=>{
    async function getLiqudityPoolDetails(){
      try {
        if(ammContract){
          const options = {
            gasLimit: 500000, // Set an appropriate gas limit value
          };
            const details = await ammContract.getLiquidityPoolDetails();
            console.log(details);
            setLiquidA(ethers.utils.formatEther(details.tokenAAmount));
            setLiquidB(ethers.utils.formatEther(details.tokenBAmount));
        }
      }
      catch(e){
        console.log(e);
      }
    }
    getLiqudityPoolDetails();
},[ammContract]);

  useEffect(() => {
    async function connectWallet() {
      // Connect to the user's wallet
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      const signer = provider.getSigner();
      console.log("Signer : ",signer);
      // Request access to the user's accounts
      const accounts = await provider.send('eth_requestAccounts', []);
      console.log(accounts);
      console.log('Connected account:', accounts[0]);
      setAccount(accounts[0]);  
    }
    connectWallet();
  }, []);

  useEffect(()=>{
    function makeAMMContract(){
       if(provider && account){
           setAMMContract(new ethers.Contract(AMMAddress,AMMABI,provider.getSigner()));
       }
    }
    makeAMMContract();
  },[provider,account]);

  useEffect(()=>{
    if(account && provider){
        console.log("Provider1  : ",provider);
        setTokenAContract(new ethers.Contract(TokenAAddress,TokenABI, provider.getSigner()));
        setTokenBContract(new ethers.Contract(TokenBAddress,TokenABI,provider.getSigner()));
    }
},[account,provider]);


  return (
    <div className="App">
    <div className="wallet-connection">
        <div className="user-icon">{/* Insert user icon here */}</div>
        <div className="network-icon">{/* Insert network icon here */}</div>
        <h3>Connected to Wallet : {account} on Goerli TestNet</h3>
    </div>
    <div className="container">
        <Mint account={account} provider={provider} tokenAContract={tokenAContract} tokenBContract={tokenBContract}/>
        <Deposit provider={provider} account={account} ammContract={ammContract} tokenAContract={tokenAContract} tokenBContract={tokenBContract} liquidA={liquidA} liquidB={liquidB}/>
        <Trade provider={provider} account={account} tokenAContract={tokenAContract} tokenBContract={tokenBContract} ammContract={ammContract} liquidA={liquidA} liquidB={liquidB}/>
        <Withdraw provider={provider} account={account} tokenAContract={tokenAContract} tokenBContract={tokenBContract} ammContract={ammContract} liquidA={liquidA} liquidB={liquidB}/>
        <UserShare provider={provider} account={account} tokenAContract={tokenAContract} tokenBContract={tokenBContract} ammContract={ammContract} liquidA={liquidA} liquidB={liquidB}/>
    </div>
</div>

  );
}

export default App;
