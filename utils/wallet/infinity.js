import { auth } from "../auth";

export default function inifinityWallet() {
    let agent = undefined;

    async function getActor(canisterId, idl) {
      const actor = await window.ic.infinityWallet.createActor({
        canisterId,
        interfaceFactory: idl,
      });

      return actor
    }

    async function logIn(whitelist) {
      if (window.ic === undefined) {
        window.open('https://infinityWallet.ooo/', '_blank')?.focus();
        
        return
      }

      const connected = await window.ic.infinityWallet.isConnected();
      // const host = getHost();
      // const ids = getCanisterIds();
      // const whitelist = [ids.icpunks, ids.icats];

      if (!connected) {
        const publicKey = await window.ic.infinityWallet.requestConnect({whitelist});

        // if (!publicKey) {
        //   console.log('Could not login to plug');
        //   return;
        // } else {
        //   console.log(`The connected user's public key is:`, publicKey.toDer());
        // }
      }


      // await window.ic.infinityWallet.createAgent({ whitelist, host: "https://boundary.ic0.app/" })
      // agent = window.ic.infinityWallet.agent;
      // // agent.fetchRootKey();

      const principal = await window.ic.infinityWallet.getPrincipal();
      
      auth.setAgent(agent);
      auth.setPrincipal(principal);
    }

    function logOut() {
      auth.setAgent(undefined);
      auth.setPrincipal(undefined);
    }

    async function requestTransfer(data){
      if (window.ic === undefined) return;

      return await window.ic.infinityWallet.requestTransfer(data);
    }
    
    async function getBalance() {
      const result = await window.ic.infinityWallet.requestBalance();

      return result;
    }

    return {
        name: 'infinity',
        logIn,
        logOut,
        getActor,
        requestTransfer,
        getBalance
      };
}