import {ModalBody, ModalHeader, Stack, Button, Image, useClipboard} from '@chakra-ui/react'
import { useWallet } from 'context/WalletProvider/WalletProvider'
import React, {useEffect} from 'react'

export const Select = ({ }: any) => {
  const { state } = useWallet()
  const { code } = state

  useEffect(() => {
    console.log("code: ",code)
  }, [code])

  return (
    <>
      <ModalHeader>Asset Select</ModalHeader>
      <ModalBody>
        hi
      </ModalBody>
    </>
  )
}
