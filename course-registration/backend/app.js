const express = require("express")

const app = express();


const bodyParser = require("body-parser");

app.use(bodyParser.json());


app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const userMailList = [];

app.post("/addUser",(req,res)=>
{
    const userMail = req.body.userMail;
    if(findUser(userMail))
    {
        return res.status(500).json({message:"Already Present"});
    }
    userMailList.push(userMail);
    console.log(userMail +" added");
    return res.status(200).json({message:"Successfully Added"});
});

app.post("/checkUser",(req,res)=>
{
    const userMail = req.body.userMail;
    const found = findUser(userMail);
    console.log(userMail+(found ? "Found" : "Not Found"));
    return found ? res.status(200).json({message:"Found the User"}) : res.status(404).json({message:"Doesnt Exist!"});
});



function findUser(userMail) {
    for(let i=0;i<userMailList.length;i+=1){
        if(userMailList[i]==userMail){
            return true;
        }
    }
    return false;
}


app.listen(5000,()=>
{
    console.log("Backend on 5000");
});