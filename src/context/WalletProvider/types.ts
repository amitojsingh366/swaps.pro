export interface Balance {
    blockchain: string;
    symbol: string;
    asset: string;
    path: string;
    pathMaster: string;
    master: string;
    pubkey: string;
    script_type: string;
    network: string;
    created: number;
    tags: string[];
    context: string;
    isToken: boolean;
    lastUpdated: number;
    balance: number;
    source?: string;
    priceUsd: string;
    valueUsd: string;
    onCoinCap: boolean;
    image: string;
    protocols: string[];
    xpub?: string;
    type?: Type;
    address?: string;
    name?: string;
    contract?: string;
    protocal?: string;
    decimals?: number;
    balanceNative?: number;
}

export enum Type {
    Address = "address",
    Erc20 = "ERC20",
    Xpub = "xpub",
}
