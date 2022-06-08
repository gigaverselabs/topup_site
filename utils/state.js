import { Principal } from "@dfinity/principal";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, useAuth } from "./auth";
// import { Listing_2, TokenDesc } from "./canister/icpunks_type";
// import { getCanisterIds } from "./canister/principals";

import cycles_idl from "./idl/cycles.did";
import ledger_idl from "./idl/ledger.did";

import { canisters, ledger_canister, transaction_fee, minting_canister, topup_memo } from './canisters'
import { getAccountIdentifier, getSubAccountArray, getSubaccountFromPrincipal } from "./utils";
import toast from "react-hot-toast";
import axios from "axios";

const { Actor, HttpAgent } = require('@dfinity/agent');
const ic_agent = new HttpAgent({ host: "https://boundary.ic0.app/" });

export function useProvideState() {
    const authContext = useAuth();

    let readActorCache = {}
    function getReadActor(cid) {
        if (cid in readActorCache)
            return readActorCache[cid]

        const actor = Actor.createActor(cycles_idl, {
            agent: ic_agent,
            canisterId: cid,
        });

        readActorCache[cid] = actor;

        return actor;
    }

    const topupCanister = async (canisterId, amountIcp) => {
        let subaccount = getSubaccountFromPrincipal(Principal.from(canisterId));
        let accountId = getAccountIdentifier(Principal.from(minting_canister), subaccount);

        let amount_e8s = amountIcp * Math.pow(10, 8);

        let block_height = await sendDfx(accountId, amount_e8s, topup_memo);

        let block_height_notify = await notifyDfx(block_height, Principal.from(minting_canister), subaccount);
    }

    const sendDfx = async (accountId, amount, memo) => {

        let actor = await auth.wallet.getActor(ledger_canister, ledger_idl)

        //ICP should be sent to proxy address instead of final canister, it may change in the future
        let send_args = {
            to: accountId,
            fee: { e8s: transaction_fee },
            memo: memo, //needs update to match current listing unique id
            amount: { e8s: amount },
            from_subaccount: [],
            created_at_time: [],
        };

        console.log("Sending ICP (e8s)" + amount + " to: " + accountId);

        let send_promise = actor.send_dfx(send_args);

        toast.promise(
            send_promise,
            {
                loading: 'Sending ICP...',
                success: <b>ICP Sent!</b>,
                error: <b>Could not send ICP.</b>,
            }
        );

        let res = await send_promise; //returns block number
        console.log("Block: " + res);

        return res;
    }

    const notifyDfx = async (block_height, canisterId, subaccount) => {
        let actor = await auth.wallet.getActor(ledger_canister, ledger_idl)

        let notifyArgs = {
            to_subaccount: [subaccount], //optional
            from_subaccount: [], //optional
            to_canister: Principal.from(canisterId), //principal
            max_fee: { e8s: transaction_fee },
            block_height: block_height
        }

        console.log("Notifying Cycles canister about topup");

        let notify_promise = actor.notify_dfx(notifyArgs);

        toast.promise(
            notify_promise,
            {
                loading: 'Notifying Cycles canister...',
                success: <b>Topup Sent!</b>,
                error: <b>Could not send Notification.</b>,
            }
        );

        let res = await notify_promise; //returns block number
        console.log("Block: " + res);

        return res;
    }

    return {
        getReadActor,
        topupCanister,
        sendDfx,
        notifyDfx
    };
}

const stateContext = createContext(null);

export function ProvideState({ children }) {
    const state = useProvideState();
    return <stateContext.Provider value={state}>{children}</stateContext.Provider>;
}

export const useLocalState = () => {
    return useContext(stateContext);
};
