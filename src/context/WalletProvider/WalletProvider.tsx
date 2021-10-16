import { Transfer } from '@pioneer-platform/pioneer-types'
import { Keyring } from '@shapeshiftoss/hdwallet-core'
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
import { WalletViewsRouter } from './WalletViewsRouter'

import { pioneer } from 'hooks/usePioneerSdk/usePioneerSdk'

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
  assetContext: string | null
  invocationContext: string | null
  context: string | null
  exchangeContext: string | null
  totalValueUsd: string | null
  tradeInputBalance: any
  tradeOutputBalance: any
  exchangeInfo: any
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
  pioneer: null,
  code: null,
  username: null,
  assetContext: null,
  exchangeContext: null,
  invocationContext: null,
  context: null,
  totalValueUsd: null,
  tradeInputBalance: null,
  tradeOutputBalance: null,
  exchangeInfo:null
}

export interface IWalletContext {
  state: InitialState
  username: string | null
  assetContext: string | null
  dispatch: React.Dispatch<ActionTypes>
  connect: (adapter: any, icon: string, name: string) => Promise<void>
  disconnect: () => void
  setAssetContext: any
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
  | { type: WalletActions.SET_ASSET_CONTEXT; asset: String | null }
  | { type: WalletActions.SET_WALLET_CONTEXT; context: String | null }
  | { type: WalletActions.SET_WALLET_INFO; payload: { name: string; icon: string } }
  | { type: WalletActions.SET_EXCHANGE_INFO; payload: any }
  | { type: WalletActions.SET_INITIALIZED; payload: boolean }
  | { type: WalletActions.SET_IS_CONNECTED; payload: boolean }
  | { type: WalletActions.SET_WALLET_MODAL; payload: boolean }
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
    case WalletActions.SET_WALLET_MODAL:
      return { ...state, modal: action.payload }
    case WalletActions.SET_TRADE_INPUT:
      return { ...state, tradeInputBalance: action.payload }
    case WalletActions.SET_TRADE_OUTPUT:
      return { ...state, tradeOutputBalance: action.payload }
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

export const WalletProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const { onStartSdk, balances, loading } = pioneer()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [type, setType] = useState<string | null>(null)
  let [username, setUsername] = useState<string | null>(null)
  const [network, setNetwork] = useState<number | null>(null)
  const [routePath, setRoutePath] = useState<string | readonly string[] | undefined>()
  let assetContext: string = "ETH"
  let onboard: OnboardAPI
  useEffect(() => {
    //console.log("Use Effect Called! state: ",state)
    dispatch({ type: WalletActions.SET_USERNAME, username })
  }, [])

  const setAssetContext = useCallback(
      async (ASSET:string) => {
        //dispatch({ type: WalletActions.SELECT_MODAL, payload: false })
        try {
          //set asset context

          // pioneer.setAssetContext(ASSET)
          //dispatch?
          return true
        } catch (error) {
          console.warn(error)
        }
      },
      []
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


  const disconnect = useCallback(() => {
    setType(null)
    setRoutePath(undefined)
    //dispatch({ type: WalletActions.RESET_STATE })
  }, [])

  useEffect(() => {
  }, []) // we explicitly only want this to happen once

  //end
  const value: IWalletContext = useMemo(
    () => ({ state, username, assetContext, dispatch, connect, disconnect, setAssetContext }),
    [state, username, assetContext, connect, disconnect, setAssetContext]
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
