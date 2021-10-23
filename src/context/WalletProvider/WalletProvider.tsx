import { Transfer } from '@pioneer-platform/pioneer-types'
let {
  supportedBlockchains,
  baseAmountToNative,
  nativeToBaseAmount,
  COIN_MAP_LONG,
} = require("@pioneer-platform/pioneer-coins")
let BigNumber = require('@ethersproject/bignumber')
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
const Datastore = require('nedb-promises')

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
  SET_TOTAL_VALUE_USD = 'SET_TOTAL_VALUE_USD',
  SET_EXCHANGE_INFO = 'SET_EXCHANGE_INFO',
  RESET_STATE = 'RESET_STATE'
}

export interface InitialState {
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
  keyring: Keyring
  adapters: Record<string, unknown> | null
  walletInfo: { name: string; icon: string } | null
  isConnected: boolean
  initialized: boolean
  modal: boolean
  modalSelect: boolean
  pioneer: any
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
}

const initialState: InitialState = {
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
  keyring: new Keyring(),
  adapters: null,
  walletInfo: null,
  isConnected: false,
  initialized: false,
  modal: false,
  modalSelect: false,
  selectType: null,
  pioneer: null,
  code: null,
  username: null,
  assetContext: null,
  exchangeContext: null,
  invocationContext: null,
  context: null,
  totalValueUsd: null,
  tradeOutput: null,
  exchangeInfo:null
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
  | { type: WalletActions.SET_PIONEER; pioneer: any | null }
  | { type: WalletActions.SET_PAIRING_CODE; payload: String | null }
  | { type: WalletActions.SET_USERNAME; username: String | null }
  | { type: WalletActions.SET_TRADE_INPUT; payload: any }
  | { type: WalletActions.SET_TRADE_OUTPUT; payload: any }
  | { type: WalletActions.SET_ASSET_CONTEXT; payload: String | null }
  | { type: WalletActions.SET_WALLET_CONTEXT; context: String | null }
  | { type: WalletActions.SET_WALLET_INFO; payload: { name: string; icon: string } }
  | { type: WalletActions.SET_EXCHANGE_INFO; payload: any }
  | { type: WalletActions.SET_INITIALIZED; payload: boolean }
  | { type: WalletActions.SET_IS_CONNECTED; payload: boolean }
  | { type: WalletActions.SET_WALLET_MODAL; payload: boolean }
  | { type: WalletActions.SET_SELECT_MODAL_TYPE; payload: string }
  | { type: WalletActions.SET_SELECT_MODAL; payload: boolean }
  | { type: WalletActions.RESET_STATE }
  | { type: WalletActions.SET_ONBOARD; payload: OnboardAPI }
  | { type: WalletActions.SET_BLOCK_NUMBER; payload: number | null }
  | { type: WalletActions.SET_ACCOUNT; payload: string }
  | { type: WalletActions.SET_PROVIDER; payload: Web3Provider }
  | { type: WalletActions.SET_WALLET; payload: Wallet }
  | { type: WalletActions.SET_BALANCES; payload: any }
  | { type: WalletActions.SET_ACTIVE; payload: boolean }
  | { type: WalletActions.SET_TOTAL_VALUE_USD; payload: string }
  | { type: WalletActions.SET_INVOCATION_CONTEXT; payload: string }
  | { type: WalletActions.SET_CONTEXT; payload: string }
  | { type: WalletActions.SET_EXCHANGE_CONTEXT; payload: string }

const reducer = (state: InitialState, action: ActionTypes) => {
  switch (action.type) {
    case WalletActions.SET_STATUS:
      return { ...state, status: action.payload }
    case WalletActions.INIT_ONBOARD:
      return { ...state, isInitOnboard: action.payload }
    case WalletActions.SET_ONBOARD:
      return { ...state, onboard: action.payload }
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
      return { ...state, pioneer: action.pioneer }
    case WalletActions.SET_PAIRING_CODE:
      return { ...state, code: action.payload }
    case WalletActions.SET_USERNAME:
      return { ...state, username: action.username }
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
      Pioneer SDK transaction protocal

   */


  const buildTransaction = useCallback(
      async (currentSellAsset:any,currentBuyAsset:any) => {
        if (state?.provider && state?.account && state?.assetContext && state?.status && state?.balances && state?.tradeOutput) {
          console.log("Build TX~!")
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
          //get pool address
          let thorVault = state.status.exchanges.pools.filter((e:any) => e.chain === state.assetContext)
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

          //TODO get contextType from walletDescripts, filter by context of input
          let contextType = 'MetaMask'
          if(contextType === 'MetaMask'){
            console.log("Build Transaction with onBoard: MetaMask")
            //if(state.wallet && state.wallet.provider && state.account){
            if(state.onboard && state.wallet) {
              //build swap
              let swap: any = {
                inboundAddress: thorVault,
                addressFrom: currentSellAsset.currency.address,
                coin: "ETH",
                asset: "ETH",
                memo,
                amount: amountBase
              }
              let options: any = {
                verbose: true,
                txidOnResp: false, // txidOnResp is the output format
              }

              let responseSwap = await pioneer.App.buildSwap(swap, options)
              console.log("responseSwap: ", responseSwap)

              /*

                swap

               */
              console.log("state.wallet: ",swap)
              console.log("state.wallet.getSigner: ",swap)
              console.log("currentSellAsset.currency.address: ",currentSellAsset.currency.address)
              console.log("wallet.account: ",state.account)


              let txPayload:any = {
                from:state.account,
                to: responseSwap.HDwalletPayload.to,
                data: responseSwap.HDwalletPayload.data,
                value: responseSwap.HDwalletPayload.value,
                gasLimit: responseSwap.HDwalletPayload.gasLimit,
                gasPrice: responseSwap.HDwalletPayload.gasPrice,
                nonce: responseSwap.HDwalletPayload.nonce,
                chainId: 1
              }
              console.log("txPayload: ",txPayload)
              const signedTx = await state.provider.getSigner().sendTransaction(txPayload)
              console.log("signedTx:",signedTx)
            }
          }
        } else {
          //state?.provider && state?.account && state?.assetContext && state?.status
          if(!state?.provider) console.error("Wallet not initialized")
          if(!state?.account) console.error("state missing account")
          if(!state?.assetContext) console.error("state missing assetContext")
          if(!state?.status) console.error("state missing status")
          if(!state?.balances) console.error("state missing balances")
          if(!state?.tradeOutput) console.error("state missing tradeOutput")
        }
      },
      [state?.provider, state?.account, state?.status, state?.assetContext, state?.balances, state?.tradeOutput]
  )

  /**
   * temp logging data here for dev use
   */
  const connect = useCallback(async (type: string) => {
    setType(type)
    console.log("type: ",type)
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
            // onStartOnboard()
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
  }, [state?.onboard])

  const onStartPioneer = async function(){
    try{

      console.log("state init: ",state.isInitPioneer)
      if(!state.isInitPioneer){
        console.log("CHECKPOINT PIONEER")
        dispatch({ type: WalletActions.INIT_PIONEER, payload: true })
        console.log("state init2: ",state.isInitPioneer)
        //onboard
        let lastConnect = window.localStorage.getItem('selectedWallet')
        console.log('lastConnect: ', lastConnect)
        //only start once!
        isPioneerStarted = true
        let initResult = await pioneer.init()
        console.log("initResult: ",initResult)
        if(initResult.code){
          //set code
          dispatch({ type: WalletActions.SET_PAIRING_CODE, payload: initResult.code })
        }

        //pioneer status
        let status = await pioneer.getStatus()
        console.log("status: ",status)
        dispatch({ type: WalletActions.SET_STATUS, payload: status })
        console.log('status: ', status)

        console.log('Pioneer initResult: ', initResult)
        dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
        //pairing code
        if (initResult) {
          //get user info
          //let userInfo = await pioneer.refresh()
          // console.log('userInfo: ', userInfo)
          username = initResult.username
          let context:any = initResult.context
          setUsername(initResult.username)

          dispatch({ type: WalletActions.SET_ASSET_CONTEXT, payload:'ETH' })

          //TODO use remote context asset
          //get first ETH symbol in balances
          console.log("initResult.balances: ",initResult)
          if(initResult.balances){
            let ETHbalance = initResult.balances.filter((balance:any) => balance.symbol === 'ETH')[0]
            console.log("ETHbalance: ",ETHbalance)
            dispatch({ type: WalletActions.SET_BALANCES, payload:initResult.balances })
          }


          dispatch({ type: WalletActions.SET_EXCHANGE_CONTEXT, payload:'thorchain' })
          dispatch({ type: WalletActions.SET_CONTEXT, payload:context })
          dispatch({ type: WalletActions.SET_USERNAME, username })
          dispatch({ type: WalletActions.SET_PIONEER, pioneer: initResult })
          dispatch({ type: WalletActions.SET_WALLET_INFO, payload:{name:'pioneer', icon:'Pioneer'} })
        }
        /*
          Pioneer events
        * */
        pioneer.events.on('message', async (event: any) => {
          //console.log('pioneer event: ', event)
          switch (event.type) {
            case 'context':
              // code block
              break
            case 'pairing':
              //console.log('pairing event!: ', event.username)
              dispatch({ type: WalletActions.SET_USERNAME, username: initResult.username })
              dispatch({ type: WalletActions.SET_PIONEER, pioneer: initResult })
              dispatch({ type: WalletActions.SET_WALLET_INFO, payload:{name:'pioneer', icon:'Pioneer'} })
              dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: false })
              break
            default:
              console.error(' message unknown type:',event)
          }
        })
      } else {
        console.log("ALREADY INIT PIONEER!")
      }
    }catch(e){
      console.error(e)
    }
  }

  // const onStartOnboard = async function(){
  //   try{
  //     console.log("CHECKPOINT ONBOARD")
  //     console.log("state init: ",state.isInitPioneer)
  //     if(!state.isInitOnboard || true){
  //       dispatch({ type: WalletActions.INIT_ONBOARD, payload: true })
  //
  //       console.log("start onboard!")
  //       onboard = initOnboard({
  //         network: network => {
  //           setNetwork(network)
  //         },
  //         address: address => {
  //           if(address){
  //             console.log("ADDRESS SET! ",address)
  //             dispatch({ type: WalletActions.SET_ACCOUNT, payload: address })
  //           }
  //         },
  //         wallet: (wallet: Wallet) => {
  //           if (wallet.provider) {
  //             dispatch({ type: WalletActions.SET_WALLET, payload: wallet })
  //             dispatch({ type: WalletActions.SET_PROVIDER, payload: getLibrary(wallet.provider) })
  //             window.localStorage.setItem('selectedWallet', wallet.name as string)
  //           } else {
  //             disconnect()
  //           }
  //         }
  //       })
  //       dispatch({ type: WalletActions.SET_ONBOARD, payload: onboard })
  //
  //       const previouslySelectedWallet = window.localStorage.getItem('selectedWallet')
  //       console.log("previouslySelectedWallet: ",previouslySelectedWallet)
  //       if(previouslySelectedWallet && onboard.walletSelect){
  //         const selected = await onboard.walletSelect(previouslySelectedWallet)
  //         console.log("selected ", selected)
  //
  //         const ready = await onboard.walletCheck()
  //         if (ready && selected) {
  //           let stateOnboard = onboard.getState()
  //           console.log("stateOnboard ", stateOnboard)
  //
  //           let pairWalletOnboard: any = {
  //             name: stateOnboard.wallet.name,
  //             network: 1,
  //             initialized: true,
  //             address: stateOnboard.address
  //           }
  //           console.log("Onboard state: FINAL ", pairWalletOnboard)
  //           if (pairWalletOnboard.name && pairWalletOnboard.address) {
  //             console.log("&&& CHECKPOINT register wallet: ")
  //             let resultRegister = await pioneer.registerWallet(pairWalletOnboard)
  //             console.log("&&& resultRegister: ", resultRegister)
  //             if (pioneer.balances) {
  //               //TODO dispatch balances
  //               console.log("** pioneer.balances: ", pioneer.balances)
  //               dispatch({type: WalletActions.SET_BALANCES, payload: pioneer.balances})
  //
  //               //set context balance
  //               let ETHbalance = pioneer.balances.filter((balance:any) => balance.symbol === 'ETH')[0]
  //               console.log("ETHbalance: ",ETHbalance)
  //             }
  //             if (pioneer.username) {
  //               dispatch({type: WalletActions.SET_USERNAME, username: 'metamask'})
  //             }
  //             dispatch({ type: WalletActions.SET_ASSET_CONTEXT, payload:'ETH' })
  //             dispatch({type: WalletActions.SET_PIONEER, pioneer: pioneer})
  //             dispatch({type: WalletActions.SET_WALLET_INFO, payload: {name: 'pioneer', icon: 'Pioneer'}})
  //
  //             //console.log("Onboard state: ",state.onboard.getState())
  //             //console.log("Onboard state: ",state)
  //             dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
  //             dispatch({type: WalletActions.SET_ACTIVE, payload: true})
  //             dispatch({type: WalletActions.SET_IS_CONNECTED, payload: true})
  //           } else {
  //             console.error("Failed to start onboard! bad wallet info! info: ",pairWalletOnboard)
  //           }
  //         } else {
  //           console.error("Failed to start onboard! not ready!")
  //         }
  //       } else {
  //         console.error("Failed to start onboard! missing: ",state?.onboard)
  //       }
  //     } else {
  //       console.log("ALREADY INIT ONBOARD!")
  //     }
  //   }catch(e){
  //     console.error(e)
  //   }
  // }

  const disconnect = useCallback(() => {
    setType(null)
    setRoutePath(undefined)
    dispatch({ type: WalletActions.RESET_STATE })
  }, [])

  // const onStart = async function (){
  //   try{
  //     console.log("ON START!!!! isStarted: ")
  //
  //     //TODO persistance
  //     // let currentDb = await db.find()
  //     // console.log("currentDb: ",currentDb)
  //     //
  //     // if(currentDb){
  //     //   console.log("db found! loading pubkeys")
  //     // }
  //     //isStarted = true
  //     // await onStartPioneer()
  //     // await onStartOnboard()
  //   }catch(e){
  //     console.error(e)
  //   }
  // }
  //
  // useEffect(() => {
  //   onStart()
  // }, []) // we explicitly only want this to happen once

  //import
  // const connect = useCallback(async () => {
  //   try {
  //     const selected = await state.onboard?.walletSelect()
  //     if (selected) {
  //       const ready = await state.onboard?.walletCheck()
  //       if (ready) {
  //         dispatch({ type: WalletActions.SET_ACTIVE, payload: true })
  //       } else {
  //         dispatch({ type: WalletActions.SET_ACTIVE, payload: false })
  //         window.localStorage.removeItem('selectedWallet')
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }, [state?.onboard])
  //
  // const disconnect = useCallback(() => {
  //   if (state.onboard) {
  //     state.onboard?.walletReset()
  //   }
  //   dispatch({ type: WalletActions.RESET_STATE })
  //   window.localStorage.removeItem('selectedWallet')
  // }, [state?.onboard])

  const connectPrevious = useCallback(
      async (previous: string) => {
        try {
          const selected = await state.onboard?.walletSelect(previous)
          if (!selected) dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
          if (selected && state?.onboard?.walletCheck) {
            const ready = await state.onboard.walletCheck()
            if (ready) {
              dispatch({ type: WalletActions.SET_ASSET_CONTEXT, payload:'ETH' })
              dispatch({ type: WalletActions.SET_ACTIVE, payload: true })
              dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
            } else {
              dispatch({ type: WalletActions.SET_ACTIVE, payload: false })
              dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
              window.localStorage.removeItem('selectedWallet')
            }
          }
        } catch (error) {
          console.warn(error)
          dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
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
    })
    dispatch({ type: WalletActions.SET_ONBOARD, payload: onboard })
    onStartPioneer()
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
    if (state.wallet && state.active && state.account) {
      dispatch({ type: WalletActions.SET_IS_CONNECTED, payload: true })
    } else {
      dispatch({ type: WalletActions.SET_IS_CONNECTED, payload: false })
    }
  }, [state.account, state.active, state.wallet])

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
