import { useToast } from '@chakra-ui/toast'
import { Event, Events } from '@shapeshiftoss/hdwallet-core'
import { Dispatch, useEffect } from 'react'
import { useTranslate } from 'react-polyglot'
import { ActionTypes, DeviceState, InitialState, WalletActions } from 'context/WalletProvider/WalletProvider'

import { ButtonRequestType, FailureType, MessageType } from '../KeepKeyTypes'


export const useKeepKeyEventHandler = (
    state: InitialState,
    dispatch: Dispatch<ActionTypes>,
    connectWallet: (type: string) => Promise<void>,
    setDeviceState: (deviceState: Partial<DeviceState>) => void,
) => {
    const {
        keyring,
        modal,
        deviceState: { disposition },
    } = state

    const toast = useToast()
    const translate = useTranslate()

    useEffect(() => {
        const handleEvent = (e: [deviceId: string, message: Event]) => {
            console.log('KEEPKEY EVENT', e)
            const [deviceId, event] = e
            const { message_enum, message, from_wallet } = event

            switch (message_enum) {
                case MessageType.PINMATRIXREQUEST:
                    setDeviceState({ awaitingDeviceInteraction: false })
                    dispatch({
                        type: WalletActions.OPEN_KEEPKEY_PIN,
                        payload: {
                            deviceId,
                            pinRequestType: message?.type,
                            showBackButton: disposition !== 'initialized',
                        },
                    })
                    break
                // ACK just means we sent it, doesn't mean it was successful
                case MessageType.PINMATRIXACK:
                    if (modal) dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: false })
                    break
                // @TODO: What do we want to do with these events?
                case MessageType.FAILURE:
                    switch (message?.code) {
                        case FailureType.PINCANCELLED:
                            break
                        case FailureType.ACTIONCANCELLED:
                            setDeviceState({ awaitingDeviceInteraction: false })
                            break

                        default:
                            setDeviceState({ lastDeviceInteractionStatus: 'error' })
                            break
                    }
                    break
                case MessageType.SUCCESS:
                    setDeviceState({
                        awaitingDeviceInteraction: false,
                        lastDeviceInteractionStatus: 'success',
                    })
                    connectWallet('keepkey')
                    break

                default:
                // Ignore unhandled events
            }
        }

        // Handle all KeepKey events
        keyring.on(['KeepKey', '*', '*'], handleEvent)
        keyring.on(['*', '*', Events.CONNECT], () => connectWallet('keepkey'))

        return () => {
            keyring.off(['KeepKey', '*', '*'], handleEvent)
            keyring.off(['*', '*', Events.CONNECT], () => connectWallet('keepkey'))
        }
    }, [
        dispatch,
        keyring,
        modal,
        state.walletInfo,
        setDeviceState,
        disposition,
        toast,
        translate,
    ])
}
