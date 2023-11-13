async function deploy() {
    // compile contracts with abi , binary and deploy them on the below url
    // deploy url :- HTTP://127.0.0.1:7545
}


deploy.then(()=>process.exit(0)).catch((error)=>{
    console.log(error);
    process.exit(1);
})