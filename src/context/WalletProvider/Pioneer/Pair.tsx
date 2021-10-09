import {ModalBody, ModalHeader, Stack, Button, Image, useClipboard} from '@chakra-ui/react'
import { RawText } from 'components/Text'
import { useWallet } from 'context/WalletProvider/WalletProvider'
import React, {useEffect, useState} from 'react'
import PIONEER_ICON from 'assets/png/pioneer.png'
import { NativeSetupProps } from './setup'

export const Pair = ({ history, location }: NativeSetupProps) => {
  const [isSuccessful, setIsSuccessful] = useState<boolean | null>(null)
  const { state } = useWallet()
  const { code } = state
  const { hasCopied, onCopy } = useClipboard(code)

  useEffect(() => {
    //console.log("Pair use Affect Called")
    //console.log("state: ",state)
    console.log("code: ",code)
  }, [code])

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
          {!code ? (
              <div>
                <h3>Waiting on code...</h3>
              </div>
          ) : (
              <h3>Pair: {code}
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
