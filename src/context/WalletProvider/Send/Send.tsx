import {ModalBody, ModalHeader, Stack, Button, Image, useClipboard, ModalContent} from '@chakra-ui/react'
import { RawText } from 'components/Text'
import {useWallet, WalletProvider} from 'context/WalletProvider/WalletProvider'
import React, {useEffect} from 'react'
import {MemoryRouter, Route, Routes} from "react-router-dom";
import {Form} from "./Form";

export const entries = ['/send/details', '/send/confirm']

export const Send = ({ }: any) => {
    const { state } = useWallet()
    const { code } = state

    useEffect(() => {
        console.log("code: ",code)
    }, [code])

    return (
        <>
            <ModalHeader>Send Monies</ModalHeader>
            <ModalBody>
                <MemoryRouter initialEntries={entries}>
                    <Routes>
                        <WalletProvider>
                            <Route path='/' component={Form} />
                        </WalletProvider>
                    </Routes>
                </MemoryRouter>
            </ModalBody>
        </>
    )
}
