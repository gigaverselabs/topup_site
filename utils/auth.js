import { createContext, useContext, useState } from "react";
import plugWallet from "./wallet/plug";
// import internetIdentity from "./wallet/ii";

import { ledger_canister, canisters } from './canisters'


// Provider hook that creates auth object and handles state
export function useProvideAuth() {
  const [wallet, setWallet] = useState(undefined);

  const [principal, setPrincipal] = useState(undefined);
  const [agent, setAgent] = useState(undefined);

  const usePlug = async function () {
    const wlt = plugWallet();

    let whitelist = [ledger_canister] //ledger canister

    // for (let i in canisters) {
    //   whitelist.push(canisters[i].canister);
    // }

    await wlt.logIn(whitelist)
    setWallet(wlt)
  }

  // const useInternetIdentity = async function () {
  //   const wlt = internetIdentity();

  //   let whitelist = [ledger_canister] //ledger canister

  //   // for (let i in canisters) {
  //   //   whitelist.push(canisters[i].canister);
  //   // }

  //   await wlt.logIn(whitelist)
  //   setWallet(wlt)
  // }

  function get() {
    return {
      setPrincipal,
      principal: principal,

      setAgent,
      agent: agent,

      wallet,

      usePlug,
    };
  }

  return get();
}

const authContext = createContext(null);
export let auth;

export function ProvideAuth({ children }) {
  auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};
