import { Transfer } from '@pioneer-platform/pioneer-types'
import { HDWallet, Keyring } from '@shapeshiftoss/hdwallet-core'
import { Web3Provider } from '@ethersproject/providers'
import { API as OnboardAPI, Wallet } from 'bnc-onboard/dist/src/interfaces'
import { getLibrary, initOnboard } from 'lib/onboard'

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
import { PioneerService } from './Pioneer'
import { WalletViewsRouter } from './WalletViewsRouter'

//TODO expand networks
const SUPPORTED_NETWORKS = [1]

export enum WalletActions {
  SET_ONBOARD = 'SET_ONBOARD',
  SET_BLOCK_NUMBER = 'SET_BLOCK_NUMBER',
  SET_ACCOUNT = 'SET_ACCOUNT',
  SET_PROVIDER = 'SET_PROVIDER',
  SET_WALLET = 'SET_WALLET',
  SET_ACTIVE = 'SET_ACTIVE',
  SET_ADAPTERS = 'SET_ADAPTERS',
  SET_PIONEER = 'SET_PIONEER',
  SET_PAIRING_CODE = 'SET_PAIRING_CODE',
  SET_USERNAME = 'SET_USERNAME',
  SET_WALLET_INFO = 'SET_WALLET_INFO',
  SET_INITIALIZED = 'SET_INITIALIZED',
  SET_IS_CONNECTED = 'SET_IS_CONNECTED',
  SET_WALLET_MODAL = 'SET_WALLET_MODAL',
  SET_ASSET_CONTEXT = 'SET_ASSET_CONTEXT',
  SET_WALLET_CONTEXT = 'SET_WALLET_CONTEXT',
  RESET_STATE = 'RESET_STATE'
}

export interface InitialState {
  onboard: OnboardAPI | null
  account: string | null
  provider: Web3Provider | null
  blockNumber: number | null
  wallet: Wallet | null
  active: boolean
  keyring: Keyring
  adapters: Record<string, unknown> | null
  walletInfo: { name: string; icon: string } | null
  isConnected: boolean
  initialized: boolean
  modal: boolean
  pioneer: any
  code: any // TODO Why this blow up if string?
  username: any
}

const initialState: InitialState = {
  onboard: null,
  blockNumber: null,
  account: null,
  provider: null,
  wallet: null,
  active: false,
  keyring: new Keyring(),
  adapters: null,
  walletInfo: null,
  isConnected: false,
  initialized: false,
  modal: false,
  pioneer: null,
  code: null,
  username: null,
}

export interface IWalletContext {
  state: InitialState
  pioneer: any | null
  username: string | null
  assetContext: string | null
  dispatch: React.Dispatch<ActionTypes>
  connect: (adapter: any, icon: string, name: string) => Promise<void>
  disconnect: () => void
  setAssetContext: any
}

export type ActionTypes =
  | { type: WalletActions.SET_ADAPTERS; payload: Record<string, unknown> }
  | { type: WalletActions.SET_PIONEER; pioneer: any | null }
  | { type: WalletActions.SET_PAIRING_CODE; code: String | null }
  | { type: WalletActions.SET_USERNAME; username: String | null }
  | { type: WalletActions.SET_ASSET_CONTEXT; asset: String | null }
  | { type: WalletActions.SET_WALLET_CONTEXT; context: String | null }
  | { type: WalletActions.SET_WALLET_INFO; payload: { name: string; icon: string } }
  | { type: WalletActions.SET_INITIALIZED; payload: boolean }
  | { type: WalletActions.SET_IS_CONNECTED; payload: boolean }
  | { type: WalletActions.SET_WALLET_MODAL; payload: boolean }
  | { type: WalletActions.RESET_STATE }
  | { type: WalletActions.SET_ONBOARD; payload: OnboardAPI }
  | { type: WalletActions.SET_BLOCK_NUMBER; payload: number | null }
  | { type: WalletActions.SET_ACCOUNT; payload: string }
  | { type: WalletActions.SET_PROVIDER; payload: Web3Provider }
  | { type: WalletActions.SET_WALLET; payload: Wallet }
  | { type: WalletActions.SET_ACTIVE; payload: boolean }

const reducer = (state: InitialState, action: ActionTypes) => {
  switch (action.type) {
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
    case WalletActions.SET_ACTIVE:
      return { ...state, active: action.payload }
    case WalletActions.SET_ADAPTERS:
      return { ...state, adapters: action.payload }
    case WalletActions.SET_PIONEER:
      return { ...state, pioneer: action.pioneer }
    case WalletActions.SET_PAIRING_CODE:
      return { ...state, code: action.code }
    case WalletActions.SET_USERNAME:
      //console.log("Checkpoint SET_USERNAME")
      return { ...state, username: action.username }
    case WalletActions.SET_WALLET_INFO:
      return { ...state, walletInfo: { name: action?.payload?.name, icon: action?.payload?.icon } }
    case WalletActions.SET_INITIALIZED:
      return { ...state, initialized: action.payload }
    case WalletActions.SET_IS_CONNECTED:
      return { ...state, isConnected: action.payload }
    case WalletActions.SET_WALLET_MODAL:
      return { ...state,
        modal: action.payload }
    case WalletActions.RESET_STATE:
      return {
        ...state,
        walletInfo: null,
        isConnected: false,
        username: null,
        setAssetContext: null,
        pioneer: null
      }
    default:
      return state
  }
}

const WalletContext = createContext<IWalletContext | null>(null)
let isPioneerStarted: boolean = false

let pioneer: any
let assetContext: string

export const WalletProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [type, setType] = useState<string | null>(null)
  let [username, setUsername] = useState<string | null>(null)
  const [routePath, setRoutePath] = useState<string | readonly string[] | undefined>()



  //TODO move to module?
  const onStartPioneer = async function(){
    try{
      // does the user have pioneer?
      if(!isPioneerStarted){
        //only start once!
        isPioneerStarted = true
        pioneer = new PioneerService()
        let initResult = await pioneer.init()
        //console.log('Pioneer initResult: ', initResult)
        //pairing code
        if (initResult && initResult.code) {
          //console.log('wallet not paired! code: ', initResult)
          //set code
          dispatch({ type: WalletActions.SET_PAIRING_CODE, code: initResult.code })
          //open modal
          dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })
        } else if (initResult) {
          //dispatch({ type: WalletActions.SET_LOADING, payload: false })
          //console.log('Paired!')
          //console.log('Pioneer User: ', initResult)
          //console.log('Pioneer pioneer: ', pioneer)
          //console.log('Pioneer pioneer user: ', initResult.username)
          //console.log('Pioneer context user: ', initResult.context)
          //console.log('Pioneer asset context user: ', initResult.assetContext)
          username = initResult.username
          assetContext = initResult.assetContext
          setUsername(initResult.username)

          //console.log("username: ",username)
          //console.log("assetContext: ",assetContext)
          //init wallet button
          dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
          dispatch({ type: WalletActions.SET_USERNAME, username })
          //console.log("username: ",username)
          dispatch({ type: WalletActions.SET_PIONEER, pioneer: initResult })
          dispatch({ type: WalletActions.SET_WALLET_INFO, payload:{name:'pioneer', icon:'Pioneer'} })
          //SET_IS_CONNECTED
          // dispatch({ type: WalletActions.SET_WALLET, payload: {} })
          dispatch({ type: WalletActions.SET_IS_CONNECTED, payload: true })
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
              dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
              dispatch({ type: WalletActions.SET_USERNAME, username: initResult.username })
              dispatch({ type: WalletActions.SET_PIONEER, pioneer: initResult })
              dispatch({ type: WalletActions.SET_WALLET_INFO, payload:{name:'pioneer', icon:'Pioneer'} })
              dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: false })
              break
            default:
              console.error(' message unknown type:',event)
          }
        })
      }
    }catch(e){
      console.error(e)
    }
  }
  onStartPioneer()

  useEffect(() => {
    //console.log("Use Effect Called! state: ",state)
    dispatch({ type: WalletActions.SET_USERNAME, username })
  }, [])

  const setAssetContext = useCallback(
      async (ASSET:string) => {
        //dispatch({ type: WalletActions.SELECT_MODAL, payload: false })
        try {
          //console.log("setting asset context!",{ASSET})

          //
          //console.log("pioneer.context: ",pioneer.context)
          //console.log("pioneer?.wallets: ",pioneer?.wallets)

          //set asset context
          pioneer.assetContext = ASSET

          //let thorVault = poolInfo.filter((e:any) => e.chain === 'BCH')
          let walletContext = pioneer?.wallets.filter((e:any) => e.context === pioneer.context)
          walletContext = walletContext[0]
          //console.log("walletContext: ",walletContext)

          pioneer.assetBalanceNativeContext = walletContext?.balances[pioneer.assetContext]
          pioneer.assetBalanceUsdValueContext = walletContext?.values[pioneer.assetContext]

          // pioneer.assetBalanceNativeContext = pioneer?.wallets[pioneer.context]?.balances[pioneer.assetContext]
          // pioneer.assetBalanceUsdValueContext = pioneer?.wallets[pioneer.context]?.values[pioneer.assetContext]

          //console.log("pioneer.assetBalanceNativeContext: ",pioneer.assetBalanceNativeContext)
          //console.log("pioneer.assetBalanceUsdValueContext: ",pioneer.assetBalanceUsdValueContext)

          pioneer.setAssetContext(ASSET)
          //dispatch?
          return true
        } catch (error) {
          console.warn(error)
        }
      },
      [state.keyring]
  )

  /**
   * temp logging data here for dev use
   */
  const connect = useCallback(async () => {
    try {
      const selected = await state.onboard?.walletSelect()
      if (selected) {
        const ready = await state.onboard?.walletCheck()
        if (ready) {
          //console.log("Onboard state: ",state.onboard?.getState())
          dispatch({ type: WalletActions.SET_ACTIVE, payload: true })
        } else {
          dispatch({ type: WalletActions.SET_ACTIVE, payload: false })
          window.localStorage.removeItem('selectedWallet')
        }
      }
    } catch (error) {
      //console.log(error)
    }
  }, [state?.onboard])

  const disconnect = useCallback(() => {
    setType(null)
    setRoutePath(undefined)
    dispatch({ type: WalletActions.RESET_STATE })
  }, [])

  const value: IWalletContext = useMemo(
    () => ({ state, pioneer, username, assetContext, dispatch, connect, disconnect, setAssetContext }),
    [state, pioneer, username, assetContext, connect, disconnect, setAssetContext]
  )

  return (
    <WalletContext.Provider value={value}>
      {children}
      <WalletViewsRouter
        connect={connect}
        modalOpen={state.modal}
        type={type}
        routePath={routePath}
      />
    </WalletContext.Provider>
  )
}

export const useWallet = (): IWalletContext =>
  useContext(WalletContext as React.Context<IWalletContext>)
