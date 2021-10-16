
import {useCallback, useEffect, useReducer, useState} from 'react'

type PioneerReturnType = {
    balances: any
    error?: Error | unknown
    loading: boolean
    onStartSdk: any
    onRegister: any
}

export const pioneer = (): PioneerReturnType => {
    const [error, setError] = useState<Error | unknown>()
    const [loading, setLoading] = useState<boolean>(true)

    let balances = [
        {
            foo:"bar"
        }
    ]
    const onRegister = useCallback(async () => {
        console.log("onRegister: ")

    }, [])

    const onStartSdk = useCallback(async () => {
        console.log("SDK onStart")

        // let initResult = await pioneer.init()
        // setLoading(false)
        // console.log("initResult: ",initResult)
        // if (initResult && initResult.code) {
        //     //set code to state
        // }


    }, []) //this should only run once on startup

    useEffect(() => {
        if (true) {
            ;(async () => {
                try {
                    setLoading(true)
                    console.log("SDK onStart")

                    // let initResult = await Pioneer.init()
                    // console.log("initResult: ",initResult)
                    // if (initResult && initResult.code) {
                    //     //set code to state
                    //     console.log("SDK need to pair")
                    //     // dispatch({ type: WalletActions.SET_PAIRING_CODE, payload: initResult.code })
                    // } else {
                    //     console.log("SDK already paired")
                    //     setLoading(false)
                    // }

                } catch (error) {
                    setError(error)
                } finally {
                    setLoading(false)
                }
            })()
        }
    }, []) // only run once

    return {
        onStartSdk,
        onRegister,
        balances,
        error,
        loading
    }
}


// const onStartPioneer = async function(){
//   try{
//
//     console.log("state init: ",state.isInitPioneer)
//     if(!state.isInitPioneer){
//       console.log("CHECKPOINT PIONEER")
//       dispatch({ type: WalletActions.INIT_PIONEER, payload: true })
//       console.log("state init2: ",state.isInitPioneer)
//       //onboard
//       let lastConnect = window.localStorage.getItem('selectedWallet')
//       console.log('lastConnect: ', lastConnect)
//       //only start once!
//       isPioneerStarted = true
//       pioneer = new PioneerService()
//       let initResult = await pioneer.init()
//
//       //pioneer status
//       let status = await pioneer.getStatus()
//       console.log("status: ",status)
//       dispatch({ type: WalletActions.SET_STATUS, payload: status?.thorchain })
//       dispatch({ type: WalletActions.SET_EXCHANGE_INFO, payload: status?.exchanges })
//       console.log('status: ', status)
//
//       console.log('Pioneer initResult: ', initResult)
//       dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
//       //pairing code
//       if (initResult && initResult.code) {
//         console.log('wallet not paired! code: ', initResult.code)
//         //set code
//         dispatch({ type: WalletActions.SET_PAIRING_CODE, payload: initResult.code })
//
//         //open modal
//         const previouslySelectedWallet = window.localStorage.getItem('selectedWallet')
//         console.log("previouslySelectedWallet: ",previouslySelectedWallet)
//         if (previouslySelectedWallet && onboard) {
//           console.log("previouslySelectedWallet: CHECKPOINT1")
//           //connectPrevious(previouslySelectedWallet)
//         } else {
//           console.log("previouslySelectedWallet: CHECKPOINT1 fail")
//         }
//       } else if (initResult) {
//         //get user info
//         //let userInfo = await pioneer.refresh()
//         // console.log('userInfo: ', userInfo)
//         username = initResult.username
//         let context:any = initResult.context
//         assetContext = initResult.assetContext
//         setUsername(initResult.username)
//
//         dispatch({ type: WalletActions.SET_ASSET_CONTEXT, asset:'ETH' })
//
//         //TODO use remote context asset
//         //get first ETH symbol in balances
//         console.log("initResult.balances: ",initResult)
//         if(initResult.balances){
//           let ETHbalance = initResult.balances.filter((balance:any) => balance.symbol === 'ETH')[0]
//           console.log("ETHbalance: ",ETHbalance)
//         }
//
//
//         dispatch({ type: WalletActions.SET_EXCHANGE_CONTEXT, payload:'thorchain' })
//         dispatch({ type: WalletActions.SET_CONTEXT, payload:context })
//         dispatch({ type: WalletActions.SET_USERNAME, username })
//         dispatch({ type: WalletActions.SET_PIONEER, pioneer: initResult })
//         dispatch({ type: WalletActions.SET_WALLET_INFO, payload:{name:'pioneer', icon:'Pioneer'} })
//       }
//       /*
//         Pioneer events
//       * */
//       pioneer.events.on('message', async (event: any) => {
//         //console.log('pioneer event: ', event)
//         switch (event.type) {
//           case 'context':
//             // code block
//             break
//           case 'pairing':
//             //console.log('pairing event!: ', event.username)
//             dispatch({ type: WalletActions.SET_USERNAME, username: initResult.username })
//             dispatch({ type: WalletActions.SET_PIONEER, pioneer: initResult })
//             dispatch({ type: WalletActions.SET_WALLET_INFO, payload:{name:'pioneer', icon:'Pioneer'} })
//             dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: false })
//             break
//           default:
//             console.error(' message unknown type:',event)
//         }
//       })
//     } else {
//       console.log("ALREADY INIT PIONEER!")
//     }
//   }catch(e){
//     console.error(e)
//   }
// }
//
// const onStartOnboard = async function(){
//   try{
//     if(!pioneer.isInitialized){
//       await onStartPioneer()
//     }
//     console.log("CHECKPOINT ONBOARD")
//     console.log("state init: ",state.isInitPioneer)
//     if(!state.isInitOnboard){
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
//             // let resultRegister = await pioneer.registerWallet(pairWalletOnboard)
//             // console.log("&&& resultRegister: ", resultRegister)
//             // if (pioneer.balances) {
//             //   //TODO dispatch balances
//             //   console.log("** pioneer.balances: ", pioneer.balances)
//             //   dispatch({type: WalletActions.SET_BALANCES, payload: pioneer.balances})
//             // }
//             // if (pioneer.username) {
//             //   dispatch({type: WalletActions.SET_USERNAME, username: 'metamask'})
//             // }
//             //
//             // dispatch({type: WalletActions.SET_PIONEER, pioneer: pioneer})
//             // dispatch({type: WalletActions.SET_WALLET_INFO, payload: {name: 'pioneer', icon: 'Pioneer'}})
//             //
//             // //console.log("Onboard state: ",state.onboard.getState())
//             // //console.log("Onboard state: ",state)
//             // dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
//             // dispatch({type: WalletActions.SET_ACTIVE, payload: true})
//             // dispatch({type: WalletActions.SET_IS_CONNECTED, payload: true})
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
