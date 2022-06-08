const ledger_canister = "ryjl3-tyaaa-aaaaa-aaaba-cai";
const minting_canister = "rkp4c-7iaaa-aaaaa-aaaca-cai";
const transaction_fee = 10_000;

const topup_memo = 0x50555054;

const canisters = [
    { name: "Top up Site", canister: 'oncq2-raaaa-aaaah-qc22q-cai' },
    { name: "ICpunks", canister: 'qcg3w-tyaaa-aaaah-qakea-cai' },
    { name: "ICats", canister: '4nvhy-3qaaa-aaaah-qcnoq-cai' },
    { name: "ICTest", canister: 'nvtz2-maaaa-aaaah-qcohq-cai' },
    { name: "Infinity Flies", canister: 'vrny5-4iaaa-aaaah-qclbq-cai' },
]

export {
    ledger_canister,
    minting_canister,
    transaction_fee,
    canisters,
    topup_memo
};