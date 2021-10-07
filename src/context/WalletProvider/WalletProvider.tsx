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

export const WalletProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [type, setType] = useState<string | null>(null)
  let [username, setUsername] = useState<string | null>(null)
  const [network, setNetwork] = useState<number | null>(null)
  const [routePath, setRoutePath] = useState<string | readonly string[] | undefined>()
  let pioneer = new PioneerService()
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
          pioneer.assetContext = ASSET
          // pioneer.setAssetContext(ASSET)
          //dispatch?
          return true
        } catch (error) {
          console.warn(error)
        }
      },
      [state.keyring]
  )

  // /**
  //  * temp logging data here for dev use
  //  */
  // const connect = useCallback(async (type: string) => {
  //   setType(type)
  //   console.log("type: ",type)
  //   switch (type) {
  //     case 'pioneer':
  //       console.log('Pioneer connect selected!')
  //       setRoutePath(SUPPORTED_WALLETS[type]?.routes[0]?.path ?? undefined)
  //       //onStartPioneer()
  //       break
  //     case 'native':
  //       console.log('ShapeShift connect selected!')
  //       break
  //     case 'kepler':
  //       console.log('Kepler connect selected!')
  //       break
  //     case 'keepkey':
  //       console.log('keepkey connect selected!')
  //       break
  //     case 'onboard':
  //       dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: false })
  //       console.log('OnBoard.js connect selected!')
  //       const onboard = initOnboard({
  //         network: network => {
  //           setNetwork(network)
  //         },
  //         address: address => {
  //           dispatch({ type: WalletActions.SET_ACCOUNT, payload: address })
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
  //       console.log("initOnboard: ",onboard)
  //       const selected = await onboard.walletSelect()
  //       console.log('selected: ',selected)
  //       if (selected) {
  //         const ready = await onboard?.walletCheck()
  //         console.log('ready: ',ready)
  //         console.log('onboard: ',onboard)
  //         if (ready) {
  //           // let pairWalletOnboard:any = {
  //           //   name:type,
  //           //   network:1,
  //           //   initialized:true,
  //           //   address:onboard.address
  //           // }
  //           // console.log("Onboard state: FINAL ",pairWalletOnboard)
  //           // pioneer.registerWallet(pairWalletOnboard)
  //
  //           setRoutePath(SUPPORTED_WALLETS[type]?.routes[0]?.path ?? undefined)
  //           let state = onboard?.getState()
  //           console.log("Onboard state: ",onboard?.getState())
  //           let pairWalletOnboard:any = {
  //             name:type,
  //             network:1,
  //             initialized:true,
  //             address:state.address
  //           }
  //           console.log("Onboard state: FINAL ",pairWalletOnboard)
  //           pioneer.registerWallet(pairWalletOnboard)
  //           dispatch({ type: WalletActions.SET_ACTIVE, payload: true })
  //
  //           //if username
  //           console.log("username: ",pioneer.username)
  //
  //           //console.log("username: ",username)
  //           //console.log("assetContext: ",assetContext)
  //           //init wallet button
  //           dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
  //           if(pioneer.username){
  //             dispatch({ type: WalletActions.SET_USERNAME, username })
  //           }
  //           //console.log("username: ",username)
  //           dispatch({ type: WalletActions.SET_WALLET_INFO, payload:{name:type, icon:'Metamask'} })
  //           //SET_IS_CONNECTED
  //           // dispatch({ type: WalletActions.SET_WALLET, payload: {} })
  //           // dispatch({ type: WalletActions.SET_IS_CONNECTED, payload: true })
  //         } else {
  //           dispatch({ type: WalletActions.SET_ACTIVE, payload: false })
  //           window.localStorage.removeItem('selectedWallet')
  //         }
  //       } else {
  //         console.log("No Onboard Wallet selected!")
  //         if (!selected) dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
  //       }
  //       break
  //     case 'xdefi':
  //       console.log('xdefi connect selected!')
  //       break
  //     default:
  //       throw Error('Wallet not supported: ' + type)
  //   }
  // }, [])

  const connect = useCallback(async () => {
    try {
      console.log("connect called")

      dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: false })
      // dispatch({ type: WalletActions.SET_USERNAME, username: 'metamask' })
      // dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
      // dispatch({ type: WalletActions.SET_ACTIVE, payload: true })
      // dispatch({ type: WalletActions.SET_IS_CONNECTED, payload: true })

      const selected = await state.onboard?.walletSelect()
      if (selected) {
        console.log("selected: ",selected)
        dispatch({ type: WalletActions.SET_WALLET_INFO, payload:{name:'MetaMask', icon:'Pioneer'} })
        const ready = await state.onboard?.walletCheck()
        if (ready) {
          console.log("ready: ",ready)
          dispatch({ type: WalletActions.SET_ACTIVE, payload: true })

        } else {
          console.log("not ready: ",ready)
          // dispatch({ type: WalletActions.SET_ACTIVE, payload: false })
          // window.localStorage.removeItem('selectedWallet')
        }
      }

      //pioneer

    } catch (error) {
      console.log(error)
    }
  }, [state?.onboard])

  const disconnect = useCallback(() => {
    setType(null)
    setRoutePath(undefined)
    dispatch({ type: WalletActions.RESET_STATE })
  }, [])

  const connectPrevious = useCallback(
      async (previous: string) => {
        try {
          console.log("CHECKPOINT *** connectPrevious")
          const selected = await state.onboard?.walletSelect(previous)
          if (!selected) {
            console.log("CHECKOINT 1 NOT SELECTED")
            dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
          }
          dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: false })
          dispatch({ type: WalletActions.SET_USERNAME, username: 'metamask' })
          dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
          dispatch({ type: WalletActions.SET_ACTIVE, payload: true })
          dispatch({ type: WalletActions.SET_WALLET_INFO, payload:{name:'pioneer', icon:'Pioneer'} })
          dispatch({ type: WalletActions.SET_IS_CONNECTED, payload: true })
          // if (selected && state?.onboard?.walletCheck) {
          //   const ready = await state.onboard.walletCheck()
          //   if (ready) {
          //     let stateOnboard = state?.onboard?.getState()
          //     console.log("stateOnboard ",stateOnboard)
          //
          //     let pairWalletOnboard:any = {
          //       name:stateOnboard?.wallet?.name,
          //       network:1,
          //       initialized:true,
          //       address:stateOnboard?.address
          //     }
          //     // console.log("Onboard state: FINAL ",pairWalletOnboard)
          //     // let initResult = await pioneer.init()
          //     // let resultRegister = await pioneer.registerWallet(pairWalletOnboard)
          //     console.log("resultRegister: ",pairWalletOnboard)
          //     if(pioneer.balances){
          //       //TODO dispatch balances
          //       console.log("pioneer.balances: ",pioneer.balances)
          //     }
          //     if(pioneer.username){
          //       dispatch({ type: WalletActions.SET_USERNAME, username: 'metamask' })
          //     }
          //
          //     dispatch({ type: WalletActions.SET_PIONEER, pioneer: pioneer })
          //     dispatch({ type: WalletActions.SET_WALLET_INFO, payload:{name:'pioneer', icon:'Pioneer'} })
          //
          //     //console.log("Onboard state: ",state.onboard.getState())
          //     //console.log("Onboard state: ",state)
          //     dispatch({ type: WalletActions.SET_ACTIVE, payload: true })
          //     dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
          //     dispatch({ type: WalletActions.SET_IS_CONNECTED, payload: true })
          //   } else {
          //     dispatch({ type: WalletActions.SET_ACTIVE, payload: false })
          //     dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
          //     window.localStorage.removeItem('selectedWallet')
          //   }
          // }
        } catch (error) {
          console.warn(error)
          dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
          disconnect()
          window.localStorage.removeItem('selectedWallet')
        }
      },
      [disconnect, state.onboard]
  )

  useEffect(() => {
    console.log("start onboard!")
    onboard = initOnboard({
      network: network => {
        setNetwork(network)
      },
      address: address => {
        console.log("ADDRESS SET! ",address)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // we explicitly only want this to happen once

  useEffect(() => {
    const previouslySelectedWallet = window.localStorage.getItem('selectedWallet')
    console.log("previouslySelectedWallet: ",previouslySelectedWallet)
    if (previouslySelectedWallet && state.onboard && !state.active) {
      console.log("CHECKOINT 2 NOT SELECTED and not active, previouslySelectedWallet")
      void connectPrevious(previouslySelectedWallet)
    } else if (!previouslySelectedWallet && state.onboard) {
      console.log("CHECKOINT 2 NOT SELECTED")
      dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
    }
  }, [state.onboard, disconnect, state.active, connectPrevious])

  const setBlockNumber = useCallback(
      (blockNumber: number) => {
        if (state?.provider && blockNumber !== state.blockNumber) {
          dispatch({ type: WalletActions.SET_BLOCK_NUMBER, payload: blockNumber })
        }
      },
      [state.blockNumber, state?.provider]
  )

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
      console.log("Account set ready to login!")
      onStartPioneer()
      dispatch({ type: WalletActions.SET_USERNAME, username: 'metamask' })
      dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
      dispatch({ type: WalletActions.SET_WALLET_INFO, payload:{name:'pioneer', icon:'Pioneer'} })
      dispatch({ type: WalletActions.SET_IS_CONNECTED, payload: true })
    } else {
      console.log("Account NOT set")
      dispatch({ type: WalletActions.SET_IS_CONNECTED, payload: false })
    }
  }, [state.account, state.active, state.wallet])

  // useEffect(() => {
  //   if (network && state.active && state.wallet && !SUPPORTED_NETWORKS.includes(network)) {
  //     disconnect()
  //   }
  // }, [network, state.active, state.wallet, disconnect])

  const onStartPioneer = async function(){
    try{
        //onboard
        let lastConnect = window.localStorage.getItem('selectedWallet')
        console.log('lastConnect: ', lastConnect)
        //only start once!
        isPioneerStarted = true
        pioneer = new PioneerService()
        // let initResult = await pioneer.init()
        // console.log('Pioneer initResult: ', initResult)
        // //pairing code
        // if (initResult && initResult.code) {
        //   //console.log('wallet not paired! code: ', initResult)
        //   //set code
        //   dispatch({ type: WalletActions.SET_PAIRING_CODE, code: initResult.code })
        //   //open modal
        //   dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })
        // } else if (initResult) {
        //   //get user info
        //   let userInfo = await pioneer.refresh()
        //   console.log('userInfo: ', userInfo)
        //
        //   //dispatch({ type: WalletActions.SET_LOADING, payload: false })
        //   //console.log('Paired!')
        //   //console.log('Pioneer User: ', initResult)
        //   //console.log('Pioneer pioneer: ', pioneer)
        //   //console.log('Pioneer pioneer user: ', initResult.username)
        //   //console.log('Pioneer context user: ', initResult.context)
        //   //console.log('Pioneer asset context user: ', initResult.assetContext)
        //   username = initResult.username
        //   assetContext = initResult.assetContext
        //   setUsername(initResult.username)
        //
        //   //console.log("username: ",username)
        //   //console.log("assetContext: ",assetContext)
        //   //init wallet button
        //   dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
        //   dispatch({ type: WalletActions.SET_USERNAME, username })
        //   //console.log("username: ",username)
        //   dispatch({ type: WalletActions.SET_PIONEER, pioneer: initResult })
        //   dispatch({ type: WalletActions.SET_WALLET_INFO, payload:{name:'pioneer', icon:'Pioneer'} })
        //   //SET_IS_CONNECTED
        //   // dispatch({ type: WalletActions.SET_WALLET, payload: {} })
        //   // dispatch({ type: WalletActions.SET_IS_CONNECTED, payload: true })
        // }
        // /*
        //   Pioneer events
        // * */
        // pioneer.events.on('message', async (event: any) => {
        //   //console.log('pioneer event: ', event)
        //   switch (event.type) {
        //     case 'context':
        //       // code block
        //       break
        //     case 'pairing':
        //       //console.log('pairing event!: ', event.username)
        //       dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
        //       dispatch({ type: WalletActions.SET_USERNAME, username: initResult.username })
        //       dispatch({ type: WalletActions.SET_PIONEER, pioneer: initResult })
        //       dispatch({ type: WalletActions.SET_WALLET_INFO, payload:{name:'pioneer', icon:'Pioneer'} })
        //       dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: false })
        //       break
        //     default:
        //       console.error(' message unknown type:',event)
        //   }
        // })
    }catch(e){
      console.error(e)
    }
  }
  //onStartPioneer()


  //end
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
