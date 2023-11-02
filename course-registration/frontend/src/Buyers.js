import React,{useState} from 'react';

export default function Buyers(){
    const [buyers,setBuyers] = useState([]);
    return(
        <div>
            {
                buyers.map((b)=>
                {
                    return <h3 key={b}>{b}</h3>
                })
            }
        </div>
    )
}