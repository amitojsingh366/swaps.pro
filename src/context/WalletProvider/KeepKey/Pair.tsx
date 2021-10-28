import {ModalBody, ModalHeader, Stack, Button, Image, useClipboard} from '@chakra-ui/react'
import { RawText } from 'components/Text'
import { useWallet } from 'context/WalletProvider/WalletProvider'
import React, {useEffect} from 'react'
import KEEPKEY_ICON from 'assets/png/keepkey.png'
import { NativeSetupProps } from './setup'

export const Pair = ({ }: NativeSetupProps) => {
  const { state } = useWallet()
  const { code } = state
  const { hasCopied, onCopy } = useClipboard(code)

  useEffect(() => {
    console.log("code: ",code)
  }, [code])

  return (
    <>
      <ModalHeader>Pair KeepKey</ModalHeader>
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
                src={KEEPKEY_ICON}
            /><div>Install KeepKey Bridge</div></Button>
          </a>
        </RawText>
        <Stack my={6} spacing={4}>
          {!code ? (
              <div>
                <h3>Waiting on pairing...</h3>
              </div>
          ) : (
              <h3>not paired
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
