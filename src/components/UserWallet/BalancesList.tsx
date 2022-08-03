import { Button, HStack, Image, Table, TableCaption, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr, VStack } from "@chakra-ui/react"
import { useWallet } from "context/WalletProvider/WalletProvider"
import { useModal } from "hooks/useModal/useModal"
import { FC } from "react"
import { FiSend } from "react-icons/fi"

export const BalancesList: FC = () => {
    const { state } = useWallet()
    const { sendAsset } = useModal()

    return (
        <TableContainer width="full" px="20px" pb="20px" >
            <Table variant='simple' borderRadius="50px" >
                <Thead bgColor="gray.600">
                    <Tr>
                        <Th>Coin</Th>
                        <Th isNumeric>Available Amount</Th>
                        <Th isNumeric>Value (USD)</Th>
                        <Th isNumeric px={8}>Send</Th>
                    </Tr>
                </Thead>
                <Tbody overflow="scroll">
                    {state.balances && state.balances.sort((a, b) => b.balance - a.balance).map((bal) => <Tr>
                        <Td>
                            <HStack>
                                <Image src={bal.image} maxW="35px" />
                                <VStack justifyContent='left' alignItems='left'>
                                    <Text>{bal.symbol}</Text>
                                    {bal.name && <Text opacity="70%">{bal.name}</Text>}
                                </VStack>
                            </HStack>
                        </Td>
                        <Td isNumeric>{bal.balance}</Td>
                        <Td isNumeric>{bal.valueUsd}</Td>
                        <Td isNumeric><Button onClick={() => { sendAsset.open({ balance: bal }) }} leftIcon={<FiSend />}>Send</Button></Td>
                    </Tr>)}
                </Tbody>
            </Table>
        </TableContainer>
    )
}