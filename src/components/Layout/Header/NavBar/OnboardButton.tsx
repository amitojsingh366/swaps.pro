import { FC } from 'react'
import { ChevronRightIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, Text, Image, HStack, FlexProps } from '@chakra-ui/react'
import { shortenAddress } from 'utils/helpers'
import { InitialState, useWallet, WalletActions } from 'context/WalletProvider/WalletProvider'
import {SUPPORTED_WALLETS} from "../../../../context/WalletProvider/config";

export const OnboardButton: FC<FlexProps> = props => {
    const { state, dispatch, setRoutePath } = useWallet()
    const { isConnected, wallet, account } = state

    const connectOnboard = () => {
        dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })
        setRoutePath(SUPPORTED_WALLETS['onboard']?.routes[0]?.path ?? undefined)
    }

    return (
        <Flex
            borderRadius='full'
            bg='whiteAlpha.400'
            justifyContent='space-between'
            p={1}
            color='white'
            alignItems='center'
            _hover={{ cursor: 'pointer', bg: 'whiteAlpha.500' }}
            {...props}
        >
            {account ? (
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
                <div onClick={connectOnboard}>
                    <Text fontSize='sm' ml={2}>
                        Connect Wallet
                    </Text>
                    {/*<ChevronRightIcon h={8} w={8} />*/}
                </div>
            )}
        </Flex>
    )
}
