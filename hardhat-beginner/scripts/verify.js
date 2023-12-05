const hre = require("hardhat");


async function verify(){
    hre.run("verify",{address:"0x36250A35E0165bd9344684e7Fc8DF24848bd8f6e"});
}


verify();
