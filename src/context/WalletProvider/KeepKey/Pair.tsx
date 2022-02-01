import {ModalBody, ModalHeader, Stack, Button, Image, useClipboard} from '@chakra-ui/react'
import { RawText } from 'components/Text'
import { useWallet } from 'context/WalletProvider/WalletProvider'
import React, {useEffect} from 'react'
import KEEPKEY_ICON from 'assets/png/keepkey.png'
import { NativeSetupProps } from './setup'

export const Pair = ({ }: NativeSetupProps) => {
  const { state } = useWallet()
  const { keepkey, keepkeyState, keepkeyStatus } = state

  useEffect(() => {
    console.log("code: ",)
  }, [])

  return (
    <>
      <ModalHeader><Image
          boxSize='24px'
          loading='lazy'
          // showBorder={false}
          objectFit='contain'
          bg='transparent'
          src={KEEPKEY_ICON}
      />Pair KeepKey</ModalHeader>
      <ModalBody>
        <RawText mb={4} color='gray.500'>
          Dont have pioneer installed? download it
          <a
            style={{ display: 'table-cell' }}
            href='https://github.com/keepkey/keepkey-client/releases/latest'
            target='_blank'
            rel='noreferrer'
          >
            <Button colorScheme="white"><div>Install KeepKey Bridge</div></Button>
          </a>
        </RawText>
        <Stack my={6} spacing={4}>
          {!keepkey ? (
              <div>
                <h3>Failed to connect...</h3>
              </div>
          ) : (
            <div>
              state: {keepkeyState}
              <br/>
              keepkeyStatus: {keepkeyStatus}
            </div>
          )}
        </Stack>
      </ModalBody>
    </>
  )
}
