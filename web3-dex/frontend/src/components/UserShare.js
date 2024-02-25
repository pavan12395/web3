import { useState,useEffect} from "react";
import { ethers } from "ethers";

export default function UserShare(props){
    const ammContract = props.ammContract;
    console.log(ammContract);
    const [userShare,setUserShare] = useState(0);
    useEffect(()=>{
        async function fetchUserShares(){
            try {
            if(ammContract!=null){
                const data = await ammContract.getUserShareDetails();
                console.log(data.tokenAAmountPercentage + " and "+data.tokenAAmountPercentage);
                const tokenAAmount = ethers.utils.formatEther(""+data.tokenAAmountPercentage);
                const tokenBAmount = ethers.utils.formatEther(""+data.tokenBAmountPercentage);
                setUserShare("TokenA : "+(tokenAAmount*100) + "% TokenB : "+(tokenBAmount*100)+"%");
            }
        }
        catch(e){
            console.log(e);
        }
        }
        fetchUserShares();
    },[ammContract]);
    return <div className="user-share-section">
    <h3>User Share Details</h3>    
    <h4>{userShare}</h4>
    </div>;
}