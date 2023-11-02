import React,{useState} from "react";


export default function Payments(){
  const [payments,setPayments] = useState([{email:"kongara.pavan1@gmail.com",amount:"1 ETH"}]);

    return(
        <div>
            {
                payments.map((payment)=>
                {
                    return <h3>{payment.email} and {payment.amount}</h3>
                })
            }
        </div>
    )
}