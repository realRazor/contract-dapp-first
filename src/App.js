
import './App.css';
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import HelloWorld from "./contract/HelloWorld.json"
function App() {
  
  const [address,setAddress] = useState("");
  useEffect(() => {
    
    (async() => {
      const provider = new ethers.providers.Web3Provider(window.ethereum,"any");
      
      await provider.send("eth_requestAccounts",[]);

      const signer = provider.getSigner();
      const myAddress = await signer.getAddress();
      setAddress(myAddress);
      const helloContractAddress = "0x75EC69f26FCa67D62f0bfF34e22364001362699d";
      const contract = new ethers.Contract(
        helloContractAddress,
        HelloWorld.abi,
        signer
      );
      const greeter = await contract.helloWorld();
      console.log(greeter);
      
    })();
    return () => {
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        First dApp
        
        <p>Your Address: {address} </p>
        
      </header>  
    </div>
  );
}

export default App;
