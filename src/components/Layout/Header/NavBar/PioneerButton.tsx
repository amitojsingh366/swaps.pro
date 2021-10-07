import { FC } from 'react'
import { ChevronRightIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, Text, Image, HStack, FlexProps } from '@chakra-ui/react'
import { shortenAddress } from 'utils/helpers'
import { InitialState, useWallet, WalletActions } from 'context/WalletProvider/WalletProvider'

export const PioneerButton: FC<FlexProps> = props => {
    const { state, pioneer } = useWallet()
    const { isConnected, account } = state

    return (
        <Flex
            borderRadius='full'
            bg='whiteAlpha.400'
            justifyContent='space-between'
            p={1}
            color='white'
            alignItems='center'
            onClick={() => {}}
            _hover={{ cursor: 'pointer', bg: 'whiteAlpha.500' }}
            {...props}
        >
            {pioneer.context ? (
                <HStack>
                    <Image
                        maxW='28px'
                        maxH='28px'
                        ml={2}
                    />
                    <Text fontSize='sm'>{pioneer.context && shortenAddress(pioneer.context, 4)}</Text>
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
