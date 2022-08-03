import { ModalCloseButton } from '@chakra-ui/modal'
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    VStack,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useModal } from 'hooks/useModal/useModal'
import { useWallet, WalletActions } from 'context/WalletProvider/WalletProvider'
import { Balance } from 'context/WalletProvider/types'
import { useHistory } from 'react-router-dom'

export type SendAssetModalProps = { balance: Balance }

export const SendAssetModal = ({ balance }: SendAssetModalProps) => {
    const initRef = useRef<HTMLInputElement | null>(null)
    const finalRef = useRef<HTMLDivElement | null>(null)

    const format = (val: number) => val
    const parse = (val: string) => val.replace(/^\$/, '')

    const [sendAddress, setSendAddress] = useState("")
    const [sendAmount, setSendAmount] = useState(0.002)

    const { state, dispatch } = useWallet()

    const {
        sendAsset: { close, isOpen },
    } = useModal()

    const onClose = () => {
        close()
    }

    const history = useHistory()

    const onSubmit = async function () {
        if (!state.keepkeyConnected) {
            console.log("wallet NOT connected!")
            return dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })
        } else {
            console.log("wallet connected!")
        }

        console.log("submited address")


        console.log("sendAmount: ", sendAmount)
        console.log("svalueAddress: ", state.assetContext)

        //validate

        // let send = {
        //     blockchain:'ethereum',
        //     asset:state.assetContext,
        //     address:valueAddress,
        //     amount:sendAmount,
        //     noBroadcast:false
        // }

        let send = {
            blockchain: balance?.blockchain,
            asset: balance?.symbol,
            address: sendAddress,
            amount: sendAmount.toString(),
            noBroadcast: false
        }

        let tx = {
            type: 'sendToAddress',
            payload: send
        }

        console.log("tx: ", tx)

        try {

            if (!state.pioneer) return

            let invocationId = await state.pioneer.build(tx)
            console.log("invocationId: ", invocationId)

            let resultSign = await state.pioneer.sign(invocationId)
            console.log("resultSign: ", resultSign)

            if (resultSign.signedTx) {

                history.push(`/status/${invocationId}`)
                //get txid
                let payload = {
                    noBroadcast: false,
                    sync: true,
                    invocationId
                }
                let resultBroadcast = await state.pioneer.broadcast(payload)
                close()
                console.log("resultBroadcast: ", resultBroadcast)
            }

        } catch (e) {
            console.error("e:", e)
        }
    }

    if (!balance) return (
        <Modal
            initialFocusRef={initRef}
            finalFocusRef={finalRef}
            isCentered
            closeOnOverlayClick
            closeOnEsc
            isOpen={isOpen}
            onClose={onClose}
        >
            Error
        </Modal>
    )


    return (
        <Modal
            initialFocusRef={initRef}
            finalFocusRef={finalRef}
            isCentered
            closeOnOverlayClick
            closeOnEsc
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent justifyContent='center' px={3} pt={3} pb={6} overflow='scroll'>
                <ModalHeader textAlign='center'>
                    <h2>Send {balance.symbol}</h2>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody alignItems='center' justifyContent='center'>
                    <VStack spacing={4}>
                        <Input onChange={(valueString) => setSendAddress(valueString.target.value)} placeholder="Recipient Address" />
                        <NumberInput
                            width="100%"
                            onChange={(valueString) => setSendAmount(Number(parse(valueString)))}
                            value={format(sendAmount)}
                            max={50}
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <Button
                            type='submit'
                            size='lg'
                            width='full'
                            onClick={() => onSubmit()}
                        // isDisabled={isDirty || !isValid}
                        >
                            Send
                        </Button>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}