import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useState
} from 'react'

const { SigningCosmosClient } = require("@cosmjs/launchpad");

const SUPPORTED_NETWORKS = [1]

enum WalletActions {
    SET_ONBOARD = 'SET_ONBOARD',
    SET_BLOCK_NUMBER = 'SET_BLOCK_NUMBER',
    SET_ACCOUNT = 'SET_ACCOUNT',
    SET_PROVIDER = 'SET_PROVIDER',
    SET_WALLET = 'SET_WALLET',
    SET_ACTIVE = 'SET_ACTIVE',
    SET_INITIALIZED = 'SET_INITIALIZED',
    SET_IS_CONNECTED = 'SET_IS_CONNECTED',
    RESET_STATE = 'RESET_STATE'
}

interface InitialState {
    account: string | null
    blockNumber: number | null
    active: boolean
    isConnected: boolean
    initialized: boolean
}

const initialState: InitialState = {
    blockNumber: null,
    account: null,
    active: false,
    isConnected: false,
    initialized: false
}

interface IWalletContext {
    state: InitialState
    dispatch: React.Dispatch<ActionTypes>
    connect: () => Promise<void>
    disconnect: () => void
}

type ActionTypes =
    | { type: WalletActions.SET_BLOCK_NUMBER; payload: number | null }
    | { type: WalletActions.SET_ACCOUNT; payload: string }
    | { type: WalletActions.SET_ACTIVE; payload: boolean }
    | { type: WalletActions.SET_INITIALIZED; payload: boolean }
    | { type: WalletActions.SET_IS_CONNECTED; payload: boolean }
    | { type: WalletActions.RESET_STATE }

const reducer = (state: InitialState, action: ActionTypes) => {
    switch (action.type) {
        case WalletActions.SET_BLOCK_NUMBER:
            return { ...state, blockNumber: action.payload }
        case WalletActions.SET_ACCOUNT:
            return { ...state, account: action.payload }
        case WalletActions.SET_ACTIVE:
            return { ...state, active: action.payload }
        case WalletActions.SET_INITIALIZED:
            return { ...state, initialized: action.payload }
        case WalletActions.SET_IS_CONNECTED:
            return { ...state, isConnected: action.payload }
        case WalletActions.RESET_STATE:
            return {
                ...state,
                account: null,
                provider: null,
                wallet: null,
                active: false,
                isConnected: false
            }
        default:
            return state
    }
}

const WalletContext = createContext<IWalletContext | null>(null)

export const KeplrWalletProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [network, setNetwork] = useState<number | null>(null)



    //onStart
    let onStart = async function(){
        try{
            //
            //console.log("keplr: onStart called!")

            // @ts-ignore
            if (!window?.getOfflineSigner || !window?.keplr) {
                //alert("Please install keplr extension");
                //console.log("keplr: no keplr found")
            } else {
                //console.log("keplr: keplr found")
                // @ts-ignore
                if (window?.keplr?.experimentalSuggestChain) {
                    //console.log("keplr: Sugest chain!")
                    // Keplr v0.6.4 introduces an experimental feature that supports the feature to suggests the chain from a webpage.
                    // cosmoshub-3 is integrated to Keplr so the code should return without errors.
                    // The code below is not needed for cosmoshub-3, but may be helpful if you’re adding a custom chain.
                    // If the user approves, the chain will be added to the user's Keplr extension.
                    // If the user rejects it or the suggested chain information doesn't include the required fields, it will throw an error.
                    // If the same chain id is already registered, it will resolve and not require the user interactions.
                    // @ts-ignore
                    await window.keplr.experimentalSuggestChain({
                    // Chain-id of the Cosmos SDK chain.
                    chainId: "cosmoshub-3",
                    // The name of the chain to be displayed to the user.
                    chainName: "Cosmos",
                    // RPC endpoint of the chain.
                    rpc: "https://node-cosmoshub-3.keplr.app/rpc",
                    // REST endpoint of the chain.
                    rest: "https://node-cosmoshub-3.keplr.app/rest",
                    // Staking coin information
                    stakeCurrency: {
                        // Coin denomination to be displayed to the user.
                        coinDenom: "ATOM",
                        // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                        coinMinimalDenom: "uatom",
                        // # of decimal points to convert minimal denomination to user-facing denomination.
                        coinDecimals: 6,
                        // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
                        // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
                        // coinGeckoId: ""
                    },
                    // (Optional) If you have a wallet webpage used to stake the coin then provide the url to the website in `walletUrlForStaking`.
                    // The 'stake' button in Keplr extension will link to the webpage.
                    // walletUrlForStaking: "",
                    // The BIP44 path.
                    bip44: {
                        // You can only set the coin type of BIP44.
                        // 'Purpose' is fixed to 44.
                        coinType: 118,
                    },
                    // Bech32 configuration to show the address to user.
                    // This field is the interface of
                    // {
                    //   bech32PrefixAccAddr: string;
                    //   bech32PrefixAccPub: string;
                    //   bech32PrefixValAddr: string;
                    //   bech32PrefixValPub: string;
                    //   bech32PrefixConsAddr: string;
                    //   bech32PrefixConsPub: string;
                    // }
                    bech32Config: {
                        bech32PrefixAccAddr: "cosmos",
                        bech32PrefixAccPub: "cosmospub",
                        bech32PrefixValAddr: "cosmosvaloper",
                        bech32PrefixValPub: "cosmosvaloperpub",
                        bech32PrefixConsAddr: "cosmosvalcons",
                        bech32PrefixConsPub: "cosmosvalconspub"
                    },
                    // List of all coin/tokens used in this chain.
                    currencies: [{
                        // Coin denomination to be displayed to the user.
                        coinDenom: "ATOM",
                        // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                        coinMinimalDenom: "uatom",
                        // # of decimal points to convert minimal denomination to user-facing denomination.
                        coinDecimals: 6,
                        // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
                        // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
                        // coinGeckoId: ""
                    }],
                    // List of coin/tokens used as a fee token in this chain.
                    feeCurrencies: [{
                        // Coin denomination to be displayed to the user.
                        coinDenom: "ATOM",
                        // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                        coinMinimalDenom: "uatom",
                        // # of decimal points to convert minimal denomination to user-facing denomination.
                        coinDecimals: 6,
                        // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
                        // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
                        // coinGeckoId: ""
                    }],
                    // (Optional) The number of the coin type.
                    // This field is only used to fetch the address from ENS.
                    // Ideally, it is recommended to be the same with BIP44 path's coin type.
                    // However, some early chains may choose to use the Cosmos Hub BIP44 path of '118'.
                    // So, this is separated to support such chains.
                    coinType: 118,
                    // (Optional) This is used to set the fee of the transaction.
                    // If this field is not provided, Keplr extension will set the default gas price as (low: 0.01, average: 0.025, high: 0.04).
                    // Currently, Keplr doesn't support dynamic calculation of the gas prices based on on-chain data.
                    // Make sure that the gas prices are higher than the minimum gas prices accepted by chain validators and RPC/REST endpoint.
                    gasPriceStep: {
                        low: 0.01,
                        average: 0.025,
                        high: 0.04
                    }
                    });

                    const chainId = "cosmoshub-3";

                    // You should request Keplr to enable the wallet.
                    // This method will ask the user whether or not to allow access if they haven't visited this website.
                    // Also, it will request user to unlock the wallet if the wallet is locked.
                    // If you don't request enabling before usage, there is no guarantee that other methods will work.
                    // @ts-ignore
                    await window.keplr.enable(chainId);

                    // @ts-ignore
                    const offlineSigner = window.getOfflineSigner(chainId);

                    // You can get the address/public keys by `getAccounts` method.
                    // It can return the array of address/public key.
                    // But, currently, Keplr extension manages only one address/public key pair.
                    // XXX: This line is needed to set the sender address for SigningCosmosClient.
                    const accounts = await offlineSigner.getAccounts();
                    //console.log("keplr: Accounts: ",accounts)
                    dispatch({ type: WalletActions.SET_ACTIVE, payload: true })
                    dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
                    dispatch({ type: WalletActions.SET_ACCOUNT, payload: accounts[0].address })
                    // dispatch({ type: WalletActions.SET_IS_CONNECTED, payload: true })

                    // Initialize the gaia api with the offline signer that is injected by Keplr extension.
                    const cosmJS = new SigningCosmosClient(
                        "https://node-cosmoshub-3.keplr.app/rest",
                        accounts[0].address,
                        offlineSigner,
                    );

                } else {
                    //console.log("keplr: no sugest chain found")
                }
            }


        }catch(e){
            console.error(e)
        }
    }
    window.addEventListener('load', onStart);

    const connect = useCallback(async () => {
        try {

        } catch (error) {
            //console.log(error)
        }
    }, [])

    const disconnect = useCallback(() => {

        dispatch({ type: WalletActions.RESET_STATE })
        window.localStorage.removeItem('selectedWallet')
    }, [])

    const connectPrevious = useCallback(
        async (previous: string) => {
            try {

            } catch (error) {
                console.warn(error)
                dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
                disconnect()
                window.localStorage.removeItem('selectedWallet')
            }
        },
        [disconnect]
    )

    const setBlockNumber = useCallback(
        (blockNumber: number) => {

        },
        [state.blockNumber]
    )

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // we explicitly only want this to happen once

    useEffect(() => {
        const previouslySelectedWallet = window.localStorage.getItem('selectedWallet')
    }, [disconnect, state.active, connectPrevious])

    useEffect(() => {

    }, [state.account, state.active])

    useEffect(() => {

    }, [network, state.active, disconnect])

    // attach/detach listeners
    useEffect(() => {

    }, [setBlockNumber])

    const store: IWalletContext = useMemo(
        () => ({ state, dispatch, connect, disconnect }),
        [state, connect, disconnect]
    )

    return <WalletContext.Provider value={store}>{children}</WalletContext.Provider>
}

export const useWallet = (): IWalletContext =>
    useContext(WalletContext as React.Context<IWalletContext>)
