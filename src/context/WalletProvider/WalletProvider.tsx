/*
    Wallet Provider
      This provider manages all wallet connections

    supported:
      onboard.js
      pioneer SDK
      keplr plugin
      KeepKey SDK

    Notes:
      This project uses the Pioneer SDK to manage all pubkeys and tx lifecycle hooks
    docs: https://ahead-respect-850.notion.site/Pioneer-Developer-Platform-de0ed9bdaaf44133b6fb1a29e4d29bdf
 */
import { Keyring } from '@shapeshiftoss/hdwallet-core'
import { Web3Provider } from '@ethersproject/providers'
import { API as OnboardAPI, Wallet } from 'bnc-onboard/dist/src/interfaces'
import { getLibrary, initOnboard } from 'lib/onboard'
import { PioneerService } from './Pioneer'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from 'react'
import { useState } from 'react'

import { SUPPORTED_WALLETS } from './config'
import { WalletViewsRouter } from './WalletViewsRouter'
import * as keepkeyWebUSB from "@shapeshiftoss/hdwallet-keepkey-webusb";
const Datastore = require('nedb-promises')
let SDK = require("@keepkey/keepkey-sdk")
let {
  baseAmountToNative,
} = require("@pioneer-platform/pioneer-coins")
//TODO expand networks
const SUPPORTED_NETWORKS = [1]

export enum WalletActions {
  SET_STATUS = 'SET_STATUS',
  INIT_PIONEER = 'INIT_PIONEER',
  INIT_ONBOARD = 'INIT_ONBOARD',
  SET_ONBOARD = 'SET_ONBOARD',
  SET_BLOCK_NUMBER = 'SET_BLOCK_NUMBER',
  SET_ACCOUNT = 'SET_ACCOUNT',
  SET_PROVIDER = 'SET_PROVIDER',
  SET_WALLET = 'SET_WALLET',
  SET_ACTIVE = 'SET_ACTIVE',
  SET_ADAPTERS = 'SET_ADAPTERS',
  SET_PIONEER = 'SET_PIONEER',
  SET_KEEPKEY = 'SET_KEEPKEY',
  SET_BALANCES = 'SET_BALANCES',
  SET_PAIRING_CODE = 'SET_PAIRING_CODE',
  SET_USERNAME = 'SET_USERNAME',
  SET_WALLET_INFO = 'SET_WALLET_INFO',
  SET_INITIALIZED = 'SET_INITIALIZED',
  SET_IS_CONNECTED = 'SET_IS_CONNECTED',
  SET_WALLET_MODAL = 'SET_WALLET_MODAL',
  SET_SELECT_MODAL_TYPE = 'SET_SELECT_MODAL_TYPE',
  SET_SELECT_MODAL = 'SET_SELECT_MODAL',
  SET_ASSET_CONTEXT = 'SET_ASSET_CONTEXT',
  SET_WALLET_CONTEXT = 'SET_WALLET_CONTEXT',
  SET_CONTEXT = 'SET_CONTEXT',
  SET_EXCHANGE_CONTEXT = 'SET_EXCHANGE_CONTEXT',
  SET_INVOCATION_CONTEXT = 'SET_INVOCATION_CONTEXT',
  SET_TRADE_INPUT = 'SET_TRADE_INPUT',
  SET_TRADE_OUTPUT = 'SET_TRADE_OUTPUT',
  SET_TRADE_STATUS = 'SET_TRADE_STATUS',
  SET_TRADE_FULLFILLMENT_TXID = 'SET_TRADE_FULLFILLMENT_TXID',
  SET_INVOCATION_TXID = 'SET_INVOCATION_TXID',
  SET_TOTAL_VALUE_USD = 'SET_TOTAL_VALUE_USD',
  SET_EXCHANGE_INFO = 'SET_EXCHANGE_INFO',
  SET_KEPLR = 'SET_KEPLR',
  SET_KEPLR_CONTEXT = 'SET_KEPLR_CONTEXT',
  SET_KEPLR_NETWORK = 'SET_KEPLR_NETWORK',
  SET_KEEPKEY_STATUS = 'SET_KEEPKEY_STATUS',
  SET_KEEPKEY_STATE = 'SET_KEEPKEY_STATE',
  RESET_STATE = 'RESET_STATE'
}

export interface InitialState {
  keyring: Keyring
  status: any
  isInitPioneer: boolean | null
  isInitOnboard: boolean | null
  onboard: OnboardAPI | null
  account: string | null
  provider: Web3Provider | null
  blockNumber: number | null
  wallet: Wallet | null
  balances: any | null
  active: boolean
  adapters: Record<string, unknown> | null
  walletInfo: { name: string; icon: string } | null
  isConnected: boolean
  initialized: boolean
  modal: boolean
  modalSelect: boolean
  pioneer: any
  keepkey: any
  code: any
  username: any
  assetContext: any
  invocationContext: string | null
  context: any
  exchangeContext: string | null
  totalValueUsd: string | null
  tradeOutput: any
  exchangeInfo: any
  selectType: any
  tradeStatus: string | null,
  fullfillmentTxid: string | null,
  invocationTxid: string | null,
  keplr:any,
  keplrContext:string | null,
  keplrNetworkContext:any
  keepkeyStatus:string | null,
  keepkeyState:number
}

const initialState: InitialState = {
  keyring: new Keyring(),
  isInitPioneer: false,
  isInitOnboard: false,
  status: null,
  onboard: null,
  blockNumber: null,
  account: null,
  provider: null,
  wallet: null,
  balances: null,
  active: false,
  adapters: null,
  walletInfo: null,
  isConnected: false,
  initialized: false,
  modal: false,
  modalSelect: false,
  selectType: null,
  pioneer: null,
  keepkey: null,
  code: null,
  username: null,
  assetContext: null,
  exchangeContext: null,
  invocationContext: null,
  context: null,
  totalValueUsd: null,
  tradeOutput: null,
  tradeStatus: null,
  fullfillmentTxid: null,
  invocationTxid: null,
  exchangeInfo:null,
  keplr:null,
  keplrContext:null,
  keplrNetworkContext:null,
  keepkeyStatus:null,
  keepkeyState:0
}

export interface IWalletContext {
  setRoutePath: any
  buildTransaction: any
  state: InitialState
  username: string | null
  dispatch: React.Dispatch<ActionTypes>
  connect: (adapter: any, icon: string, name: string) => Promise<void>
  disconnect: () => void
}

export type ActionTypes =
  | { type: WalletActions.SET_STATUS; payload: any }
  | { type: WalletActions.INIT_PIONEER; payload: boolean }
  | { type: WalletActions.INIT_ONBOARD; payload: boolean }
  | { type: WalletActions.SET_ADAPTERS; payload: Record<string, unknown> }
  | { type: WalletActions.SET_PIONEER; payload: any | null }
  | { type: WalletActions.SET_KEEPKEY; payload: any | null }
  | { type: WalletActions.SET_PAIRING_CODE; payload: String | null }
  | { type: WalletActions.SET_USERNAME; payload: String | null }
  | { type: WalletActions.SET_TRADE_INPUT; payload: any }
  | { type: WalletActions.SET_TRADE_OUTPUT; payload: any }
  | { type: WalletActions.SET_TRADE_STATUS; payload: string }
  | { type: WalletActions.SET_TRADE_FULLFILLMENT_TXID; payload: string }
  | { type: WalletActions.SET_KEEPKEY_STATUS; payload: string }
  | { type: WalletActions.SET_KEEPKEY_STATE; payload: number }
  | { type: WalletActions.SET_ASSET_CONTEXT; payload: String | null }
  | { type: WalletActions.SET_WALLET_CONTEXT; context: String | null }
  | { type: WalletActions.SET_WALLET_INFO; payload: { name: string; icon: string } }
  | { type: WalletActions.SET_EXCHANGE_INFO; payload: any }
  | { type: WalletActions.SET_INITIALIZED; payload: boolean }
  | { type: WalletActions.SET_IS_CONNECTED; payload: boolean }
  | { type: WalletActions.SET_WALLET_MODAL; payload: boolean }
  | { type: WalletActions.SET_SELECT_MODAL_TYPE; payload: string }
  | { type: WalletActions.SET_SELECT_MODAL; payload: boolean }
  | { type: WalletActions.SET_ONBOARD; payload: OnboardAPI }
  | { type: WalletActions.SET_BLOCK_NUMBER; payload: number | null }
  | { type: WalletActions.SET_ACCOUNT; payload: string }
  | { type: WalletActions.SET_PROVIDER; payload: Web3Provider }
  | { type: WalletActions.SET_WALLET; payload: Wallet }
  | { type: WalletActions.SET_BALANCES; payload: any }
  | { type: WalletActions.SET_ACTIVE; payload: boolean }
  | { type: WalletActions.SET_TOTAL_VALUE_USD; payload: string }
  | { type: WalletActions.SET_INVOCATION_CONTEXT; payload: string }
  | { type: WalletActions.SET_INVOCATION_TXID; payload: string }
  | { type: WalletActions.SET_CONTEXT; payload: string }
  | { type: WalletActions.SET_EXCHANGE_CONTEXT; payload: string }
  | { type: WalletActions.SET_KEPLR; payload: string }
  | { type: WalletActions.SET_KEPLR_CONTEXT; payload: string }
  | { type: WalletActions.SET_KEPLR_NETWORK; payload: any }
  | { type: WalletActions.RESET_STATE }

const reducer = (state: InitialState, action: ActionTypes) => {
  switch (action.type) {
    case WalletActions.SET_STATUS:
      return { ...state, status: action.payload }
    case WalletActions.INIT_ONBOARD:
      return { ...state, isInitOnboard: action.payload }
    case WalletActions.SET_ONBOARD:
      return { ...state, onboard: action.payload }
    case WalletActions.SET_KEEPKEY:
      return { ...state, keepkey: action.payload }
    case WalletActions.SET_BLOCK_NUMBER:
      return { ...state, blockNumber: action.payload }
    case WalletActions.SET_ACCOUNT:
      return { ...state, account: action.payload }
    case WalletActions.SET_PROVIDER:
      return { ...state, provider: action.payload }
    case WalletActions.SET_WALLET:
      return { ...state, wallet: action.payload }
    case WalletActions.SET_BALANCES:
      return { ...state, balances: action.payload }
    case WalletActions.SET_ACTIVE:
      return { ...state, active: action.payload }
    case WalletActions.SET_ADAPTERS:
      return { ...state, adapters: action.payload }
    case WalletActions.SET_PIONEER:
      return { ...state, pioneer: action.payload }
    case WalletActions.SET_KEPLR:
      return { ...state, keplr: action.payload }
    case WalletActions.SET_KEPLR_CONTEXT:
      return { ...state, keplrContext: action.payload }
    case WalletActions.SET_KEPLR_NETWORK:
      return { ...state, keplrNetworkContext: { name: action?.payload?.name, icon: action?.payload?.icon } }
    case WalletActions.SET_PAIRING_CODE:
      return { ...state, code: action.payload }
    case WalletActions.SET_USERNAME:
      return { ...state, username: action.payload }
    case WalletActions.SET_WALLET_INFO:
      return { ...state, walletInfo: { name: action?.payload?.name, icon: action?.payload?.icon } }
    case WalletActions.SET_INITIALIZED:
      return { ...state, initialized: action.payload }
    case WalletActions.SET_EXCHANGE_INFO:
      return { ...state, exchangeInfo: action.payload }
    case WalletActions.SET_EXCHANGE_CONTEXT:
      return { ...state, exchangeContext: action.payload }
    case WalletActions.SET_CONTEXT:
      return { ...state, context: action.payload }
    case WalletActions.SET_INVOCATION_CONTEXT:
      return { ...state, invocationContext: action.payload }
    case WalletActions.SET_TOTAL_VALUE_USD:
      return { ...state, totalValueUsd: action.payload }
    case WalletActions.SET_IS_CONNECTED:
      return { ...state, isConnected: action.payload }
    case WalletActions.SET_ASSET_CONTEXT:
      return { ...state, assetContext: action.payload }
    case WalletActions.SET_WALLET_MODAL:
      return { ...state, modal: action.payload }
    case WalletActions.SET_SELECT_MODAL_TYPE:
      return { ...state, selectType: action.payload }
    case WalletActions.SET_TRADE_OUTPUT:
      return { ...state, tradeOutput: action.payload }
    case WalletActions.SET_TRADE_STATUS:
      return { ...state, tradeStatus: action.payload }
    case WalletActions.SET_KEEPKEY_STATUS:
      return { ...state, keepkeyStatus: action.payload }
    case WalletActions.SET_KEEPKEY_STATE:
      return { ...state, keepkeyState: action.payload }
    case WalletActions.SET_TRADE_FULLFILLMENT_TXID:
      return { ...state, fullfillmentTxid: action.payload }
    case WalletActions.SET_INVOCATION_TXID:
      return { ...state, invocationTxid: action.payload }
    case WalletActions.SET_SELECT_MODAL:
      return { ...state, modalSelect: action.payload }
    case WalletActions.RESET_STATE:
      return {
        ...state,
        code: null,
        walletInfo: null,
        isConnected: false,
        username: null,
        setAssetContext: null,
        pioneer: null,
        keplr: null,
        onboard: null,
        balances: null
      }
    default:
      return state
  }
}

const WalletContext = createContext<IWalletContext | null>(null)
let isPioneerStarted: boolean = false
const pioneer = new PioneerService()
let onboard: OnboardAPI

let db = Datastore.create('/path/to/db.db')
db.ensureIndex({fieldName:"test"})

export const WalletProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [type, setType] = useState<string | null>(null)
  let [username, setUsername] = useState<string | null>(null)
  const [network, setNetwork] = useState<number | null>(null)
  const [routePath, setRoutePath] = useState<string | readonly string[] | undefined>()

  /*
      SDK

   */


  /*
      Pioneer SDK transaction protocal

   */


  const buildTransaction = useCallback(
      async (currentSellAsset:any,currentBuyAsset:any) => {
        if (
            // state?.provider &&
            // state?.account &&
            state?.pioneer?.App?.isPaired &&
            state?.username &&
            state?.assetContext &&
            state?.status &&
            state?.balances &&
            state?.tradeOutput &&
            state?.pioneer &&
            state?.pioneer.App) {
          console.log("Build TX~!")
          await pioneer.App.updateContext()
          if(!pioneer.username){
            throw Error("Pioneer username is required!")
          }
          if(!pioneer.App.username){
            throw Error("Pioneer App username is required!")
          }
          if(!pioneer.App.isPaired){
            throw Error("app is not isPaired!")
          }
          //     //build swap
          //     if(!pioneer.isInitialized){
          //       await pioneer.init()
          //     }
          let contextInput = currentSellAsset.currency.context
          console.log("contextInput: ",contextInput)
          console.log("currentSellAsset.currency: ",currentSellAsset.currency)
          //wallets
          console.log("wallets: ",pioneer.wallets)

          //get walletDescription for context
          //state.balances.filter((balance:any) => balance.symbol === state.tradeOutput)[0]

          //TODO switch on context/wallet?
          //if onboard
          //if keplr
          console.log("currentSellAsset: ",currentSellAsset)
          console.log("currentBuyAsset: ",currentBuyAsset)

          console.log("context: ",state.context)
          console.log("assetContext: ",state.assetContext)
          //tradeOutput
          console.log("tradeOutput: ",state.tradeOutput)
          let tradePair = state.assetContext+"_"+state.tradeOutput
          console.log("tradePair: ",tradePair)

          console.log("status.pools: ",state.status)
          console.log("status.pools: ",state.status.exchanges.pools)
          console.log("state.assetContext: ",state.assetContext)

          //get protocal
          console.log("exchangeContext: ",state.exchangeContext)

          let unsignedTx

          let options: any = {
            verbose: true,
            txidOnResp: false, // txidOnResp is the output format
          }

          if(state.exchangeContext === 'thorchain'){
            //if thorchain
            //get pool address
            let thorVault = state.status.exchanges.thorchain.pools.filter((e:any) => e.chain === state.assetContext)
            thorVault = thorVault[0]
            console.log("thorVault: ",thorVault)

            let vaultAddress = thorVault.address
            console.log("vaultAddress: ",vaultAddress)

            //from pubkeys gets output address
            let pubkeyOutput = state.balances.filter((balance:any) => balance.symbol === state.tradeOutput)[0]
            console.log("pubkeyOutput: ",pubkeyOutput)

            //TODO buildThorChain memo function coolness
            let memo = '=:'+state.tradeOutput+'.'+state.tradeOutput+":"+pubkeyOutput.master
            console.log("memo: ",memo)

            let amountBase = currentSellAsset.amount
            let amountTestNative = baseAmountToNative(state.assetContext,amountBase)
            console.log("amountTestNative: ",amountTestNative)
            console.log("amountBase: ",amountBase)

            /*

              swap

             */
            let swap: any = {
              inboundAddress: thorVault,
              addressFrom: currentSellAsset.currency.address,
              coin: "ETH",
              asset: "ETH",
              memo,
              amount: amountBase
            }

            // console.log("swap: ", swap)
            let responseSwap = await pioneer.App.buildSwapTx(swap, options, swap.asset)
            responseSwap.context = contextInput
            responseSwap.swap.context = contextInput
            console.log("responseSwap: ", responseSwap)
            dispatch({ type: WalletActions.SET_TRADE_STATUS, payload:'built' })


            console.log("state.wallet: ",swap)
            console.log("state.wallet.getSigner: ",swap)
            console.log("currentSellAsset.currency.address: ",currentSellAsset.currency.address)
            // console.log("wallet.account: ",state.account)
            unsignedTx = responseSwap
          }else if(state.exchangeContext === 'osmosis'){
            //build batch
            //TODO if ATOM -> OSMO
            //deposit atom into IBC
            //submit swap
          } else {
            throw Error("protocol not implemented!")
          }


          //
          let transaction:any = {
            type:'keepkey-sdk',
            fee:{
              priority:3
            },
            unsignedTx,
            context:contextInput,
            network:state.assetContext
          }
          console.log("unsigned transaction: ",transaction)
          let responseInvoke = await state.pioneer.App.invokeUnsigned(transaction,options,state.assetContext)
          if(!responseInvoke.invocationId){
            console.error('responseInvoke: ',responseInvoke)
            //display error modal
            throw Error("Failed to build invocation!")
          }
          console.log("responseInvoke: ",responseInvoke)
          let invocationId = responseInvoke.invocationId
          transaction.invocationId = invocationId
          dispatch({ type: WalletActions.SET_INVOCATION_CONTEXT, payload: invocationId })
          dispatch({ type: WalletActions.SET_TRADE_STATUS, payload:'invoked' })

          //metamask payload
          // let txPayload:any = {
          //   from:state.account,
          //   to: responseSwap.HDwalletPayload.to,
          //   data: responseSwap.HDwalletPayload.data,
          //   value: responseSwap.HDwalletPayload.value,
          //   gasLimit: responseSwap.HDwalletPayload.gasLimit,
          //   gasPrice: responseSwap.HDwalletPayload.gasPrice,
          //   nonce: responseSwap.HDwalletPayload.nonce,
          //   chainId: 1
          // }

          console.log("unsignedTx: ",transaction.unsignedTx)
          // let signedTx = await state.keepkey.ethSignTx(transaction.unsignedTx.HDwalletPayload)
          // console.log("signedTx: ",signedTx)

          //TODO get contextType from walletDescripts, filter by context of input
          // console.log("unsignedTx: ",transaction.unsignedTx)
          let signedTx = await state.pioneer.App.signTx(transaction.unsignedTx)
          console.log("signedTx: ",signedTx)

          //TODO fix metamask again
          // let contextType = 'MetaMask'
          // if(contextType === 'MetaMask'){
          //   console.log("Build Transaction with onBoard: MetaMask")
          //   if(state.onboard && state.wallet) {
          //     console.log("txPayload: ",txPayload)
          //     signedTx = await state.provider.getSigner().sendTransaction(txPayload)
          //     console.log("*** signedTx:",signedTx)
          //     //mock send for debugging
          //     //let signedTx:any = {"hash": "0xa4fd92ae21345de0b218f8951b9229d504cd55ef50780a7e5e18a81ecfa22a74", "type": 2, "accessList": null, "blockHash": null, "blockNumber": null, "transactionIndex": null, "confirmations": 0, "from": "0xC3aFFff54122658b89C31183CeC4F15514F34624", "gasPrice": {"type": "BigNumber", "hex": "0x1b5320a25b"}, "maxPriorityFeePerGas": {"type": "BigNumber", "hex": "0x1b5320a25b"}, "maxFeePerGas": {"type": "BigNumber", "hex": "0x1b5320a25b"}, "gasLimit": {"type": "BigNumber", "hex": "0x013880"}, "to": "0xC145990E84155416144C532E31f89B840Ca8c2cE", "value": {"type": "BigNumber", "hex": "0x2386f26fc10000"}, "nonce": 87, "data": "0x1fece7b4000000000000000000000000f56cba49337a624e94042e325ad6bc864436e3700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002386f26fc10000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000403d3a4243482e4243483a626974636f696e636173683a717a78703078633676736a3861706739796d346e346a6c3435707978746b70736875767239736d6a7033", "r": "0x1ccaf7e8e8ee44807686e209cb78972766387a2a59050d6ef7c4467b2bb6d6d0", "s": "0x1a74183927cd0b07ac247156cdfa3b7df9a073b2fa44f684364ac68a04a1afac", "v": 1, "creates": null, "chainId": 0}
          //   } else {
          //
          //   }
          // }

          dispatch({ type: WalletActions.SET_INVOCATION_TXID, payload: signedTx.hash })
          dispatch({ type: WalletActions.SET_TRADE_STATUS, payload:'pending' })
          //signedTx.serialized = "fobarfixme"
          signedTx.network = transaction.network
          signedTx.type = 'keepkey'
          signedTx.invocationId = invocationId
          // signedTx.type = 'MetaMask'

          if(!signedTx.serialized) throw Error("103: failed to build serialized tx")
          if(!signedTx.txid) throw Error("104: failed to build txid")

          //get invcation from api
          let invocation = await state.pioneer.App.getInvocation(invocationId)
          console.log("2invocation: ",invocation)

          //updateTx
          let updateBody = {
            network:state.assetContext,
            invocationId,
            invocation,
            context:contextInput,
            unsignedTx,
            signedTx
          }

          //update invocation remote
          let resultUpdate = await state.pioneer.App.updateInvocation(updateBody)
          console.log("resultUpdate: ",resultUpdate)

          //broadcast transaction
          let broadcastResult = await state.pioneer.App.broadcastTransaction(updateBody)
          console.log("broadcastResult: ",broadcastResult)

          //verify broadcasted
          let invocationView3 = await state.pioneer.App.getInvocation(invocationId)
          console.log("invocationView3: (VIEW) ",invocationView3)
          console.log("state: ",invocationView3.state)
          // if(invocationView3.state !== 'broadcasted'){
          //   console.error("failed to init tx lifecycle hook correctly")
          //   throw Error('Fail fast bro, shits whack')
          // }

          //start loop
          let isConfirmed = false
          let isFullfilled = false
          let fullfillmentTxid = false
          let interval:any
          let checkStatus = async function(){
            try{
              let invocationStatus = await state.pioneer.getInvocationStatus(invocationId)
              console.log("invocationStatus: ",invocationStatus.state)

              if(invocationStatus && invocationStatus.isConfirmed){
                isConfirmed = true
                dispatch({ type: WalletActions.SET_TRADE_STATUS, payload:'confirmed' })
                console.log('WINNING! TX CONFIRMED!')
                //TODO push to state?
              } else {
                console.log('not confirmed!')
              }

              if(invocationStatus && invocationStatus.isFullfilled && invocationStatus.fullfillmentTxid){
                console.log('WINNING2! TX FULLFILLED YOU GOT PAID BRO!')
                dispatch({ type: WalletActions.SET_TRADE_STATUS, payload:'fullfilled' })
                dispatch({ type: WalletActions.SET_TRADE_FULLFILLMENT_TXID, payload:invocationStatus.fullfillmentTxid })
                fullfillmentTxid = invocationStatus.fullfillmentTxid
                isFullfilled = true
                //TODO push to state?
                console.log("destroyed interval: ",interval)
                interval.destroy()
              } else {
                console.log('not fullfilled!')
              }
            }catch(e){
              console.error(e)
            }
          }
          interval = setInterval(checkStatus,6000)


        } else {
          //state?.provider && state?.account && state?.assetContext && state?.status
          // if(!state?.provider) console.error("Wallet not initialized")
          // if(!state?.account) console.error("state missing account")
          if(!state?.pioneer?.App?.isPaired) console.error("state missing pioneer App isPaired")
          if(!state?.assetContext) console.error("state missing assetContext")
          if(!state?.status) console.error("state missing status")
          if(!state?.balances) console.error("state missing balances")
          if(!state?.tradeOutput) console.error("state missing tradeOutput")
          if(!state?.pioneer) console.error("state missing pioneer")
          if(!state?.pioneer?.App) console.error("state missing pioneer App")
          console.error("Failed to buildTx")
        }
      },
      [
        // state?.provider,
        // state?.account,
        state?.username,
        state?.status,
        state?.assetContext,
        state?.balances,
        state?.tradeOutput,
        state?.pioneer,
        state?.pioneer?.App,
        state?.pioneer?.App?.isPaired
      ]
  )

  /**
   * temp logging data here for dev use
   */
  const connect = useCallback(async (type: string) => {
    setType(type)

    switch (type) {
      case 'pioneer':
        console.log('Pioneer connect selected!')
        setRoutePath(SUPPORTED_WALLETS[type]?.routes[0]?.path ?? undefined)
        break
      case 'native':
        console.log('Swap connect selected!')
        break
      case 'kepler':
        console.log('Kepler connect selected!')
        break
      case 'keepkey':
        setRoutePath(SUPPORTED_WALLETS[type]?.routes[0]?.path ?? undefined)
        console.log('keepkey connect selected!')
        break
      case 'onboard':
      case 'MetaMask':
        console.log("connect onboard/metamask!")
        dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: false })
        const selected = await state.onboard?.walletSelect()
        if (selected) {
          console.log("selected: ",selected)
          dispatch({ type: WalletActions.SET_WALLET_INFO, payload:{name:'MetaMask', icon:'Pioneer'} })
          const ready = await state.onboard?.walletCheck()
          if (ready) {
            console.log("ready: ",ready)
            dispatch({ type: WalletActions.SET_ACTIVE, payload: true })
            dispatch({ type: WalletActions.SET_ASSET_CONTEXT, payload:'ETH' })
            dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
          } else {
            console.log("not ready: ",ready)
            //dont think I want to do this? keep memory of what used
            // dispatch({ type: WalletActions.SET_ACTIVE, payload: false })
            // window.localStorage.removeItem('selectedWallet')
          }
        }
        break
      case 'xdefi':
        console.log('xdefi connect selected!')
        break
      default:
        throw Error('Wallet not supported: ' + type)
    }
  }, [state?.onboard, state?.pioneer, state?.username])

  const disconnect = useCallback(() => {
    setType(null)
    setRoutePath(undefined)
    dispatch({ type: WalletActions.RESET_STATE })
  }, [])

  const connectPrevious = useCallback(
      async (previous: string) => {
        try {
          const selected = await state.onboard?.walletSelect(previous)
          if (!selected) dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
          if (selected && state?.onboard?.walletCheck) {
            const ready = await state.onboard.walletCheck()
            if (ready && state.isInitPioneer) {

              dispatch({ type: WalletActions.SET_ASSET_CONTEXT, payload:'ETH' })
              dispatch({ type: WalletActions.SET_ACTIVE, payload: true })
              dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
            } else if(ready){
              console.log("ready to start!")
              //starting pioneer!
              console.log("starting pioneer!")
              //start pioneer
              // let initResult = await pioneer.init()
              // console.log("initResult: ",initResult)
            } else {
              dispatch({ type: WalletActions.SET_ACTIVE, payload: false })
              dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
              window.localStorage.removeItem('selectedWallet')
            }
          }
        } catch (error) {
          console.warn(error)
          disconnect()
          window.localStorage.removeItem('selectedWallet')
        }
      },
      [disconnect, state.onboard]
  )

  const setBlockNumber = useCallback(
      (blockNumber: number) => {
        if (state?.provider && blockNumber !== state.blockNumber) {
          dispatch({ type: WalletActions.SET_BLOCK_NUMBER, payload: blockNumber })
        }
      },
      [state.blockNumber, state?.provider]
  )

  useEffect(() => {

    //Start Onboard.js
    let networkId = 1
    //TODO support more networks
    const onboard = initOnboard({
      network: network => {
        setNetwork(network)
      },
      address: address => {
        dispatch({ type: WalletActions.SET_ACCOUNT, payload: address })
      },
      wallet: (wallet: Wallet) => {
        if (wallet.provider) {
          dispatch({ type: WalletActions.SET_WALLET, payload: wallet })
          dispatch({ type: WalletActions.SET_PROVIDER, payload: getLibrary(wallet.provider) })
          window.localStorage.setItem('selectedWallet', wallet.name as string)
        } else {
          disconnect()
        }
      }
    },networkId)

    dispatch({ type: WalletActions.SET_ONBOARD, payload: onboard })

    async function startPioneer(){
      try{
        console.log("onStartPioneer")
        //pioneer
        let initResult = await pioneer.init()
        if(pioneer.App.isPaired){
          //sit init
          dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
          //set context
          dispatch({ type: WalletActions.SET_ASSET_CONTEXT, payload:'ETH' })
          dispatch({ type: WalletActions.SET_EXCHANGE_CONTEXT, payload:'thorchain' })
          if(initResult.balances) dispatch({ type: WalletActions.SET_BALANCES, payload:initResult.balances })
          if(initResult.context) dispatch({ type: WalletActions.SET_CONTEXT, payload:initResult.context })
          if(initResult.username) dispatch({ type: WalletActions.SET_USERNAME, payload:initResult.username })
          if(pioneer) dispatch({ type: WalletActions.SET_PIONEER, payload: pioneer })
          dispatch({ type: WalletActions.SET_WALLET_INFO, payload:{name:'pioneer', icon:'Pioneer'} })
        } else {
          console.log("app is not paired! can not start. please connect a wallet")
        }
        console.log("initResult: ",initResult)

        if(initResult.code) dispatch({ type: WalletActions.SET_PAIRING_CODE, payload: initResult.code })
        //pioneer status
        let status = await pioneer.getStatus()
        if(status) dispatch({ type: WalletActions.SET_STATUS, payload: status })


        pioneer.events.on('message', async (event: any) => {
          console.log('pioneer event: ', event)
          switch (event.type) {
            case 'context':
              console.log("context event! event: ",event)
              break
            case 'pairing':
              console.log('Paired!', event)
              //set context
              dispatch({ type: WalletActions.SET_ASSET_CONTEXT, payload:'ETH' })
              dispatch({ type: WalletActions.SET_EXCHANGE_CONTEXT, payload:'thorchain' })
              if(pioneer.balances) dispatch({ type: WalletActions.SET_BALANCES, payload:pioneer.balances })
              if(pioneer.context) dispatch({ type: WalletActions.SET_CONTEXT, payload:pioneer.context })
              if(pioneer.username) dispatch({ type: WalletActions.SET_USERNAME, payload:pioneer.username })
              if(pioneer) dispatch({ type: WalletActions.SET_PIONEER, payload: pioneer })
              //console.log('pairing event!: ', event.username)
              dispatch({ type: WalletActions.SET_USERNAME, payload: initResult.username })
              dispatch({ type: WalletActions.SET_WALLET_INFO, payload:{name:'pioneer', icon:'Pioneer'} })
              dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: false })
              break
            default:
              console.error(' message unknown type:',event)
          }
        })
      }catch(e){
        console.error(e)
      }
    }
    startPioneer()

    //start keplr
    async function startKeplr(){
      try{
        console.log("onStartKeplr")
        // @ts-ignore
        if (!window.getOfflineSigner || !window.keplr) {
          alert("Please install keplr extension");
        }
        //cosmos info
        let cosmosInfo = {
          rpc: 'https://rpc-cosmoshub.keplr.app',
          rest: 'https://lcd-cosmoshub.keplr.app',
          chainId: 'cosmoshub-4',
          chainName: 'Cosmos Hub',
          coinImageUrl:'https://app.osmosis.zone/public/assets/tokens/cosmos.svg',
        }
        const chainId = cosmosInfo.chainId;

        //TODO if pair process iterate over all chains and register addresses?
        // @ts-ignore
        // await window.keplr.enable(chainId);
        // @ts-ignore
        // const offlineSigner = window.getOfflineSigner(chainId);
        // const accounts = await offlineSigner.getAccounts();
        // console.log("accounts: ",accounts)
        // let pairWalletKeplr:any = {
        //   name:'keplr',
        //   format:'keplr',
        //   wallet:accounts,
        //   chainId:chainId
        // }
        // console.log("pairWalletKeplr: ",pairWalletKeplr)
        // pioneer.pairWallet(pairWalletKeplr)
        // dispatch({ type: WalletActions.SET_KEPLR, payload: offlineSigner })
        // dispatch({ type: WalletActions.SET_KEPLR_CONTEXT, payload: accounts[0].address })
        // dispatch({ type: WalletActions.SET_KEPLR_NETWORK, payload: {icon:cosmosInfo.coinImageUrl,name:chainId} })
      }catch(e){
        console.error(e)
      }
    }
    startKeplr()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // we explicitly only want this to happen once

  useEffect(() => {
    const previouslySelectedWallet = window.localStorage.getItem('selectedWallet')
    if (previouslySelectedWallet && state.onboard && !state.active) {
      void connectPrevious(previouslySelectedWallet)
    } else if (!previouslySelectedWallet && state.onboard) {
      dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
    }
  }, [state.onboard, disconnect, state.active, connectPrevious])

  useEffect(() => {
    if (state.wallet && state.active && state.account && pioneer.isInitialized) {
      //register
      console.log("Register MetaMask Account")
      let pairWalletOnboard:any = {
        name:'MetaMask',
        format:'onboard',
        network:1,
        initialized:true,
        address:state.account
      }
      console.log("pairWalletOnboard: ",pairWalletOnboard)
      pioneer.pairWallet(pairWalletOnboard)

      if(pioneer.username) dispatch({ type: WalletActions.SET_USERNAME, payload:pioneer.username})

      dispatch({ type: WalletActions.SET_IS_CONNECTED, payload: true })
    } else {
      dispatch({ type: WalletActions.SET_IS_CONNECTED, payload: false })
    }
  }, [state.account, state.active, state.wallet, pioneer?.isInitialized])

  useEffect(() => {
    if (network && state.active && state.wallet && !SUPPORTED_NETWORKS.includes(network)) {
      disconnect()
    }
  }, [network, state.active, state.wallet, disconnect])


  //end
  const value: IWalletContext = useMemo(
    () => ({ state, buildTransaction, setRoutePath, username, dispatch, connect, disconnect }),
    [state, buildTransaction, setRoutePath, username, connect, disconnect]
  )

  return (
    <WalletContext.Provider value={value}>
      {children}
      <WalletViewsRouter
        connect={connect}
        modalOpen={state.modal}
        modalSelectOpen={state.modalSelect}
        type={type}
        routePath={routePath}
      />
    </WalletContext.Provider>
  )
}

export const useWallet = (): IWalletContext =>
  useContext(WalletContext as React.Context<IWalletContext>)
