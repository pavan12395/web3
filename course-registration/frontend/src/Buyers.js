import React,{useState} from 'react';

export default function Buyers(){
    const [buyers,setBuyers] = useState(["kongara.pavan1@gmail.com"]);
    return(
        <div>
            {
                buyers.map((b)=>
                {
                    return <h3>{b}</h3>
                })
            }
        </div>
    )
}