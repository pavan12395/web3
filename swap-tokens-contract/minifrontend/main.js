import { ethers } from "./ethers.js";




const swapContractAddress = '0xE121ED55fDBb34F24baF45ac409f1dB9e56Ff4B3';
const tokenAddress = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
const swapAbi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "linkTokenAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "priceFeedAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "getPriceForEthByToken",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "swapEthGetToken",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenValue",
          "type": "uint256"
        }
      ],
      "name": "swapTokenGetEth",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]; 


const linktokenAbi = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
];

let swapContract;
let linkTokenContract;

function connectMetaMask() {
    // Check if MetaMask is installed
    if (!window.ethereum) {
        alert('MetaMask is not installed. Please install it to use this dApp.');
        return;
    }

    // Request account access
    window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
            console.log('Connected with account:', accounts[0]);
        })
        .catch(err => {
            console.error('Access denied.', err);
        });
}


// Example of how to interact with the contract using ethers.js
// You would replace the placeholders with actual values and logic
function initSwapContract() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    swapContract = new ethers.Contract(swapContractAddress, swapAbi, signer);
    linkTokenContract = new ethers.Contract(tokenAddress,linktokenAbi,signer);
}

async function changeInputAmountListener(e){
   const tokenSelection = document.getElementById("currencySelect");
   const cost = await swapContract.getPriceForEthByToken();
   if(tokenSelection.value == "LINK"){
    const value = e.target.value * cost;
    console.log("triggered : ",value);
    document.getElementById("amountOutput").value = "ETH : " + (value / 1e18);
   }
   else {
    const value = e.target.value / cost;
    console.log("triggered : ",value);
    document.getElementById("amountOutput").value = "LINK : " + (value / 1e18);
   }
}


async function sendHandler(){
   console.log("Send Invoked"); 
   try{ 
   const tokenSelection = document.getElementById("currencySelect");
    const amount = document.getElementById("amountInput").value;
    if(tokenSelection.value == "LINK"){
        await linkTokenContract.approve(swapContractAddress,ethers.utils.parseEther(amount));
        console.log("Approved!");
        await swapContract.swapTokenGetEth(amount);
    }
    else {
        await swapContract.swapEthGetToken({value : ethers.utils.parseEther(amount),gasLimit: 2000000 });
    }
    alert("Success!");
  }
  catch(e){
    console.log(e);
    alert("error : "+e);
  }
}

connectMetaMask();
initSwapContract();
// Additional logic for handling the swap and updating the UI would go here


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('amountInput').addEventListener('input', changeInputAmountListener);
    document.getElementById("sendBtn").addEventListener("click",sendHandler);
});

