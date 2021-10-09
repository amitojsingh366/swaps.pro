import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react'
import {useModal} from 'context/ModalProvider/ModalProvider'
import React, { useRef } from 'react'
import { MemoryRouter, Route, Switch } from 'react-router-dom'
import { WalletProvider } from 'context/WalletProvider/WalletProvider'
import { ViewAddress } from './ViewAddress'

export const entries = ['/send/details', '/send/confirm']

export const ReceiveModal = () => {
  const initialRef = useRef<HTMLInputElement>(null)
  const modal = useModal()
  return (
      <Modal
          isOpen={modal.receive}
          onClose={() => modal.close('receive')}
          isCentered
          initialFocusRef={initialRef}
      >
        <ModalOverlay />
        <ModalContent>
          <MemoryRouter initialEntries={entries}>
            <Switch>
              <WalletProvider>
                <Route path='/' component={ViewAddress} />
              </WalletProvider>
            </Switch>
          </MemoryRouter>
        </ModalContent>
      </Modal>
  )
}
