
import './App.css';
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Greeter from "./contract//Greeter.json"
function App() {
  
  const [address,setAddress] = useState("");
  const [message,setMessage] = useState("");
  const [contract,setContract] = useState("");
  const [change,setChange] = useState("");
  
  
  useEffect(() => {
    
    (async() => {
      const provider = new ethers.providers.Web3Provider(window.ethereum,"any");
      
      await provider.send("eth_requestAccounts",[]);

      const signer = provider.getSigner();
      const myAddress = await signer.getAddress();
      setAddress(myAddress);
      
      const greeterContractAddress = "0xb8f445E8a59708A8e18BB5Ee6c2E83409FfCC64C";
      const contract = new ethers.Contract(
        greeterContractAddress,
        Greeter.abi,
        signer
      );
      setContract(contract);
      const greeter = await contract.greet();
      console.log(greeter);
      setMessage(greeter);

      const filter = {
        address: greeterContractAddress,
        topic: [ethers.utils.id("Greet(address,string)")]
      }

      provider.on(filter,(log)=>{
        console.log("log: ",log);
        console.log("Greeter message added");
      })
    })();
    return () => {
    };
  }, []);

  useEffect(() => {
     window.ethereum.on("accountsChanged",(account)=>{
      console.log("accountchanged: ",account);
      setAddress(account[0]);
    });
    window.ethereum.on("chainChanged", (chainId) => {
      console.log("chainId: ",chainId);
      window.location.reload();
    });

    return () => {};
  },[]);

  const onSetGreeting = async () => {
    console.log("tx...");
    const tx = await contract.setGreeting(change);
    const result = await tx.wait();
    console.log("result",result);
    if(result.status === 1){
      setMessage(change);
    }
  }
  const onGetGreets = async () => {
    const eventfilter = contract.filters.Greet(address);
    const events = await contract.queryFilter(eventfilter);
    const oldMessages = [];
    events.forEach(data => {
      oldMessages.push(data.args.message);
    });
    console.log(oldMessages);
    console.log(oldMessages.length," adet eski mesaj bulundu!");
  }

  return (
    <div className="App">
      <header className="App-header">
        Welcome to First dApp !
        
        <p>Your Address: {address} </p>
        <p>Message: {message}</p>
        <div >
          <label>Want to change message?</label>
          <input className='input'
            type="text"
            placeholder ='Change message'
            value={change}
            onChange={(e)=> setChange(e.target.value)}
            
            
          />
        </div>

        <button onClick={onSetGreeting} className="button">
          Leave a message ( Payable !)
        </button>

        <button onClick={onGetGreets} className="getEvent">
            Get previous events
        </button>


       
      </header>  
    </div>
  );
  
}

export default App;
