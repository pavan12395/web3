export default function Withdraw(props){
    const ammContract = props.ammContract;
    async function withdrawHandler(e){
        try {
            e.preventDefault();
            await ammContract.withDrawAllFunds();
        }
        catch(e){
            alert(e);
        }
        finally{
            alert("withdrawed funds");
        }
        
    }
    return(
    <div className="withdraw-section">
    <h4>Withdraw</h4>
    <button onClick={withdrawHandler}>Withdraw</button>
    </div>);

}