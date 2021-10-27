import {FC, useReducer, useState} from 'react'
import { ChevronRightIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, Text, Image, HStack, FlexProps } from '@chakra-ui/react'
import { shortenAddress } from 'utils/helpers'
import { InitialState, useWallet, WalletActions } from 'context/WalletProvider/WalletProvider'
import {SUPPORTED_WALLETS} from "../../../../context/WalletProvider/config";

export const PioneerButton: FC<FlexProps> = props => {
    let { state, connect, dispatch } = useWallet()
    const { pioneer, context, walletInfo } = state
    const [routePath, setRoutePath] = useState<string | readonly string[] | undefined>()

    const clickPioneer = () => {
        dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })
        setRoutePath(SUPPORTED_WALLETS['pioneer']?.routes[0]?.path ?? undefined)
    }

    return (
        <Flex
            borderRadius='full'
            bg='whiteAlpha.400'
            justifyContent='space-between'
            p={1}
            color='white'
            alignItems='center'
            onClick={clickPioneer}
            _hover={{ cursor: 'pointer', bg: 'whiteAlpha.500' }}
            {...props}
        >
            {walletInfo ? (
                <HStack>
                    <Image
                        maxW='28px'
                        maxH='28px'
                        ml={2}
                        src={walletInfo?.icon}
                    />
                    <Text fontSize='sm'>{context && shortenAddress(context, 4)}</Text>
                    <ChevronDownIcon h={8} w={8} />
                </HStack>
            ) : (
                <>
                    <Text fontSize='sm' ml={2}>
                        Connect Pioneer
                    </Text>
                    <ChevronRightIcon h={8} w={8} />
                </>
            )}
        </Flex>
    )
}
