import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react'
import React, { useRef } from 'react'
import { MemoryRouter, Route, Switch } from 'react-router-dom'
import { WalletProvider } from 'context/WalletProvider/WalletProvider'
import { Select } from './Select'

export const entries = ['/select/select']

export const SelectModal = () => {
    const initialRef = useRef<HTMLInputElement>(null)
    return (
        <Modal
            isOpen={true}
            onClose={() => {}}
            isCentered
            initialFocusRef={initialRef}
        >
            <ModalOverlay />
            <ModalContent>
                <MemoryRouter initialEntries={entries}>
                    <Switch>
                        <WalletProvider>
                            <Route path='/' component={Select} />
                        </WalletProvider>
                    </Switch>
                </MemoryRouter>
            </ModalContent>
        </Modal>
    )
}
