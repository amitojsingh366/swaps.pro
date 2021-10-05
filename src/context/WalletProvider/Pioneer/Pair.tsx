import {ModalBody, ModalHeader, Stack, Button, Image, useClipboard} from '@chakra-ui/react'
import { RawText } from 'components/Text'
import {useWallet, WalletActions} from 'context/WalletProvider/WalletProvider'
import React, {useEffect, useState} from 'react'
import PIONEER_ICON from 'assets/png/pioneer.png'

import { NativeSetupProps } from './setup'
import {NativeAdapter, NativeHDWallet} from "@shapeshiftoss/hdwallet-native";
import {useLocalStorage} from "hooks/useLocalStorage/useLocalStorage";
import { EncryptedWallet } from '@shapeshiftoss/hdwallet-native/dist/crypto'

export const Pair = ({ history, location }: NativeSetupProps) => {
  const [isSuccessful, setIsSuccessful] = useState<boolean | null>(null)
  const { state, dispatch, username, pioneer } = useWallet()
  const { hasCopied, onCopy } = useClipboard(pioneer.pairingCode)
  const { } = state

  useEffect(() => {
    //console.log("Pair use Affect Called")
    //console.log("state: ",state)
    //console.log("username: ",username)
  }, [username])

  return (
    <>
      <ModalHeader>Pair Pioneer</ModalHeader>
      <ModalBody>
        <RawText mb={4} color='gray.500'>
          Dont have pioneer installed? download it
          <a
            style={{ display: 'table-cell' }}
            href='https://github.com/BitHighlander/pioneer-desktop/releases/latest'
            target='_blank'
            rel='noreferrer'
          >
            <Button colorScheme="white"><Image
                boxSize='24px'
                loading='lazy'
                // showBorder={false}
                objectFit='contain'
                bg='transparent'
                src={PIONEER_ICON}
            /><div>Install Pioneer Desktop</div></Button>
          </a>
        </RawText>
        <Stack my={6} spacing={4}>
          {pioneer.username ? (
              <div>
                <h3>username: {username}</h3>
                <small>Already logged in. continue</small>
              </div>
          ) : (
              <h3>Pair: {pioneer.pairingCode}
              <Button onClick={onCopy} ml={2}>
                {hasCopied ? "Copied" : "Copy"}
              </Button>
              </h3>
          )}
        </Stack>
      </ModalBody>
    </>
  )
}
