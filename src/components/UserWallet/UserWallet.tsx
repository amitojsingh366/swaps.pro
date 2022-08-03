
import { Card } from "../Card";
import {
    Box,
    Button,
    Divider,
    Flex, FormControl, FormErrorMessage, IconButton, Image, Input, InputProps,
    SimpleGrid,
    Spinner,
    Stack,
    Editable,
    EditableInput,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    EditablePreview,
    TabPanel,
    TabPanels,
    Tabs, Text, Tooltip, HStack, VStack
} from "@chakra-ui/react";
import { useWallet, WalletActions } from "context/WalletProvider/WalletProvider";
import { Page } from "../Layout/Page";
import { useEffect, useState } from 'react'
import { Controller, useFormContext } from "react-hook-form";
import NumberFormat from "react-number-format";
import { TokenRow } from "../TokenRow/TokenRow";
import { TokenButton } from "../TokenRow/TokenButton";
import { ArrowDownIcon, InfoIcon } from "@chakra-ui/icons";
import { HelperToolTip } from "../HelperTooltip";
import { useLocaleFormatter } from "../../hooks/useLocaleFormatter/useLocaleFormatter";
import { useHistory } from "react-router-dom";
import { useModal } from "hooks/useModal/useModal";
import { Balance } from "context/WalletProvider/types";
import { BalancesChart } from "./BalancesChart";
import { BalancesList } from "./BalancesList";

const FiatInput = (props: InputProps) => (
    <Input
        variant='unstyled'
        size='xl'
        textAlign='center'
        fontSize='3xl'
        mb={4}
        placeholder='$0.00'
        {...props}
    />
)

export const UserWallet = () => {
    const [amountSend, setAmountSend] = useState(0.011)
    const { state, dispatch, setRoutePath } = useWallet()
    const format = (val: number) => val
    const parse = (val: string) => val.replace(/^\$/, '')
    const [selectedAsset, setSelectedAsset] = useState<Balance>()
    const [sendAddress, setSendAddress] = useState<string>()

    const { selectAsset } = useModal()

    const {
        number: { localeParts }
    } = useLocaleFormatter({ fiatType: 'USD' })

    const onTextChangeFiat = () => {
        //Open Select modal.
        console.log("onTextChangeFiat called! (Fiat input)")
    }

    useEffect(() => {
        if (!state.balances || !state.assetContext) return
        const newAsset = state.balances?.find((bal: any) => bal.symbol === state.assetContext)
        setSelectedAsset(newAsset)
        setSendAddress(newAsset?.address)
    }, [state.balances, state.assetContext])




    if (!state.pioneer) return (
        <Box d='flex' width='full' justifyContent='center' alignItems='center'>
            <div>
                <Page>
                    <Flex maxWidth={{ base: 'auto', '2xl': '1464px' }} mx='auto' px={16}>
                        <Stack flex={1} spacing={4} justifyContent='center' alignItems='center'>
                            <Card maxW="460px" mx="auto" flex={1} justifyContent='center' alignItems='center'>
                                <Tabs isFitted variant='soft-rounded' defaultIndex={0}>
                                    <TabPanels>
                                        <TabPanel>
                                            loading user...
                                            <Spinner
                                                thickness="4px"
                                                speed="0.65s"
                                                emptyColor="gray.200"
                                                color="blue.500"
                                                size="xl"
                                            />
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>
                            </Card>
                        </Stack>
                    </Flex>
                </Page>
            </div>
        </Box>
    )
    return (
        <Card width="80em" mx="auto" justifyContent='center' alignItems='center' p='5px'>
            <Card.Header px={0} pt={2}>
                <Card.Heading textAlign='center'>Wallet</Card.Heading>
            </Card.Header>
            <Divider />
            <VStack justifyContent='center' alignItems='center'>
                <BalancesChart />
                <BalancesList />
            </VStack>
        </Card>
    )
}
