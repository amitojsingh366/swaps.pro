import {ModalBody, ModalHeader, Stack, Button, Image, useClipboard, Flex, HStack, Text} from '@chakra-ui/react'
import { RawText } from 'components/Text'
import { useWallet } from 'context/WalletProvider/OnboardWalletProvider'
import React, {useEffect, useState} from 'react'
import PIONEER_ICON from 'assets/png/pioneer.png'

import { NativeSetupProps } from './setup'
import {NativeAdapter, NativeHDWallet} from "@shapeshiftoss/hdwallet-native";
import {useLocalStorage} from "hooks/useLocalStorage/useLocalStorage";
import { EncryptedWallet } from '@shapeshiftoss/hdwallet-native/dist/crypto'
import {shortenAddress} from "../../../utils/helpers";
import {ChevronDownIcon, ChevronRightIcon} from "@chakra-ui/icons";

export const Onboard = ({ history, location }: NativeSetupProps) => {
  const [isSuccessful, setIsSuccessful] = useState<boolean | null>(null)
  const { state, connect, dispatch } = useWallet()
  const { isConnected, wallet, account } = state

  useEffect(() => {
    //console.log("Pair use Affect Called")
    //console.log("state: ",state)
    //console.log("username: ",username)
  }, [])

  return (
    <>
      <ModalHeader>Onboard.js</ModalHeader>
      <ModalBody>
        <Stack my={6} spacing={4}>
            <Flex
                borderRadius='full'
                bg='whiteAlpha.400'
                justifyContent='space-between'
                p={1}
                color='white'
                alignItems='center'
                onClick={connect}
                _hover={{ cursor: 'pointer', bg: 'whiteAlpha.500' }}
            >
                {isConnected ? (
                    <HStack>
                        <Image
                            maxW='28px'
                            maxH='28px'
                            ml={2}
                            src={
                                wallet?.icons?.svg
                                    ? `data:image/svg+xml;base64,${btoa(wallet.icons.svg)}`
                                    : wallet?.icons?.iconSrc
                            }
                        />
                        <Text fontSize='sm'>{account && shortenAddress(account, 4)}</Text>
                        <ChevronDownIcon h={8} w={8} />
                    </HStack>
                ) : (
                    <>
                        <Text fontSize='sm' ml={2}>
                            Connect Wallet
                        </Text>
                        <ChevronRightIcon h={8} w={8} />
                    </>
                )}
            </Flex>
        </Stack>
        <small>
            By connecting to onboard.js you are limited to the following networks.

            <li>Ethereum Mainnet</li>
        </small>
      </ModalBody>
    </>
  )
}
