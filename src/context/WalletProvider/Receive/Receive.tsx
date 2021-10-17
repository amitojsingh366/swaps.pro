import {ModalBody, ModalHeader, Stack, Button, Image, useClipboard, ModalContent} from '@chakra-ui/react'
import { RawText } from 'components/Text'
import {useWallet, WalletProvider} from 'context/WalletProvider/WalletProvider'
import React, {useEffect} from 'react'
import {MemoryRouter, Route, Switch} from "react-router-dom";
import {ViewAddress} from "./ViewAddress";

export const entries = ['/send/details', '/send/confirm']

export const Receive = ({ }: any) => {

    return (
        <>
            <ModalHeader>Receive</ModalHeader>
            <ModalBody>
                <MemoryRouter initialEntries={entries}>
                    <Switch>
                        <WalletProvider>
                            <Route path='/' component={ViewAddress} />
                        </WalletProvider>
                    </Switch>
                </MemoryRouter>
            </ModalBody>
        </>
    )
}
