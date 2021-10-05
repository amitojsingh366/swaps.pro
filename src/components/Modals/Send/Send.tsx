import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react'
import {ModalProvider, useModal} from 'context/ModalProvider/ModalProvider'
import React, { useRef } from 'react'
import { MemoryRouter, Route, Switch } from 'react-router-dom'
import { WalletProvider } from 'context/WalletProvider/WalletProvider'
import { Form } from './Form'

export const entries = ['/send/details', '/send/confirm']

export const SendModal = () => {
  const initialRef = useRef<HTMLInputElement>(null)
  const modal = useModal()
  return (
    <Modal
      isOpen={modal.send}
      onClose={() => modal.close('send')}
      isCentered
      initialFocusRef={initialRef}
    >
      <ModalOverlay />
      <ModalContent>
        <MemoryRouter initialEntries={entries}>
          <Switch>
            <WalletProvider>
            <Route path='/' component={Form} />
            </WalletProvider>
          </Switch>
        </MemoryRouter>
      </ModalContent>
    </Modal>
  )
}
