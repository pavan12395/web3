import React,{useState} from "react";


export default function Payments({payments}){
    return(
        <div>
            {
                payments.map((payment)=>
                {
                    return <h3 key={payment.email}>{payment.email} and {payment.amount}</h3>
                })
            }
        </div>
    )
}