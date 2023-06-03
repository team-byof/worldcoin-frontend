'use client'
import {useCallback, useEffect, useState} from 'react'
import Background from './layouts/background'
import { CredentialType, IDKitWidget, ISuccessResult, solidityEncode } from "@worldcoin/idkit";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./hooks/useLocalStorage";
// const action = "byof"
const action = "test_2"
// const appID = "app_staging_23b713ea1ef2e814d19b3550de74409f"
const appID = "app_5bf8fcd0369d5ac0ec85529e347b5d57"
const signal = "my_signal"
const credentialType = CredentialType.Phone

export function Home(): JSX.Element {
  const navigate = useNavigate();

  // const [cred, saveCred] = useLocalStorage("worldcoin", null);

  const [credential, setCredential] = useState()
  const [worldIDResponse, setWorldIdResponse] = useState<any>(null); // add this

  useEffect(() => {
    if (credential) return
    const credRaw = localStorage.getItem("cred")
    if (!credRaw) return
    const cred = JSON.parse(credRaw)
    setCredential(cred)
    navigate('/execute')
  })

  const handleProof = useCallback((result: ISuccessResult) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 3000);
      // NOTE: Example of how to decline the verification request and show an error message to the user
    });
  }, []);

  const onSuccess = (result: ISuccessResult) => {
    console.log(result);
    setWorldIdResponse(result); // add this
    // localStorage.setItem("worldIDResponse", JSON.stringify(result)); // save to local storage
    const u = {
      ...result,
      action,
      app_id: appID,
      signal,
      credential_type: credentialType,
    }
    // saveCred(u)
    localStorage.setItem("cred", JSON.stringify(u))
    navigate(`/execute`)
  };  

  return (
    <div className="flex flex-col text-center">
      <div className="space-y-2 p-8">
        <h3 className="text-3xl text-gray-700 font-semibold text-center">
        Cross-chain <br/> Worldcoin 👀 <br/> AA Wallet
        </h3>
        <h5 className="text text-gray-500 font text-center">
        Bye bye private keys! 👋 <br /> <br />Chain-agnostic account abstraction wallet using Worldcoin.
        </h5>
      </div>
        <div className="py-8 h-1/3 border-4 rounded-2xl hover:bg-pink-100 border-pink-300">
            <IDKitWidget
              action={action}
              signal="my_signal"
              onSuccess={onSuccess}
              handleVerify={handleProof}
              app_id={appID}
              credential_types={[CredentialType.Orb, CredentialType.Phone]}
            >
              {({ open }) => <button onClick={open} className="text-2xl">👀 Sign in with Worldcoin</button>}
            </IDKitWidget>
          </div>
          {worldIDResponse && <pre>{JSON.stringify(worldIDResponse, null, 2)}</pre>}
    </div>
  )
}

export default function HomeRoot() {
  return (
    <Background>
      <Home />
    </Background>
  )
}
