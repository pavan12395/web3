import { useState,useEffect} from "react";
import { ethers } from "ethers";

export default function UserShare(props){
    const ammContract = props.ammContract;
    console.log(ammContract);
    const [userShare,setUserShare] = useState(0);
    useEffect(()=>{
        async function fetchUserShares(){
            if(ammContract!=null){
                const data = await ammContract.getUserShareDetails();
                const tokenAAmount = data.tokenAAmount;
                const tokenBAmount = data.tokenBAmount;
                console.log(data);
                setUserShare("TokenA : "+(tokenAAmount) + " TokenB : "+(tokenBAmount));
            }
        }
        fetchUserShares();
    },[ammContract]);
    return <div className="user-share-section">
    <h3>User Share Details</h3>    
    <h4>{userShare}</h4>
    </div>;
}