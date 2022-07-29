
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
    Tabs, Text, Tooltip
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
import BalancesChart from "./BalancesChart";

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
    const history = useHistory()
    const format = (val: number) => val
    const parse = (val: string) => val.replace(/^\$/, '')
    const [selectedAsset, setSelectedAsset] = useState<Balance>()
    const [sendAddress, setSendAddress] = useState<string>()
    const [portfolioValue, setPortfolioValue] = useState(0)

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

    useEffect(() => {
        if (!state.balances) return;
        let val = 0;
        state.balances.map((bal) => val += Number(bal.valueUsd))
        setPortfolioValue(val)
    }, [state.balances])

    const onSubmit = async function () {
        if (!state.keepkeyConnected) {
            console.log("wallet NOT connected!")
            return dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })
        } else {
            console.log("wallet connected!")
        }

        console.log("submited address")


        console.log("amountSend: ", amountSend)
        console.log("svalueAddress: ", state.assetContext)

        //validate

        // let send = {
        //     blockchain:'ethereum',
        //     asset:state.assetContext,
        //     address:valueAddress,
        //     amount:amountSend,
        //     noBroadcast:false
        // }

        let send = {
            blockchain: selectedAsset?.blockchain,
            asset: selectedAsset?.symbol,
            address: sendAddress,
            amount: amountSend.toString(),
            noBroadcast: false
        }

        let tx = {
            type: 'sendToAddress',
            payload: send
        }

        console.log("tx: ", tx)

        let invocationId
        try {

            if (!state.pioneer) return

            let invocationId = await state.pioneer.build(tx)
            console.log("invocationId: ", invocationId)

            let resultSign = await state.pioneer.sign(invocationId)
            console.log("resultSign: ", resultSign)

            if (resultSign.signedTx) {

                history.push(`/status/${invocationId}`)
                //get txid
                let payload = {
                    noBroadcast: false,
                    sync: true,
                    invocationId
                }
                let resultBroadcast = await state.pioneer.broadcast(payload)
                console.log("resultBroadcast: ", resultBroadcast)
            }

        } catch (e) {
            console.error("e:", e)
        }
    }

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
        <div>
            <Tabs isFitted variant='soft-rounded' defaultIndex={0}>
                <TabPanels>
                    <TabPanel>
                        <Card maxW="460px" mx="auto" flex={1} justifyContent='center' alignItems='center'>
                            <Card.Header px={0} pt={0}>
                                <SimpleGrid alignItems='center' mx={-2}>
                                    <Card.Heading textAlign='center'>Username: {state.pioneer.username}<small></small></Card.Heading>
                                </SimpleGrid>
                            </Card.Header>
                            <Divider />
                            <Text>
                                Portfolio Value: ${portfolioValue}
                            </Text>
                            <BalancesChart />
                            <small>context: {state.context}</small>
                            <br />
                            <small>asset Selected: {state.assetContext}</small>
                            <Tooltip label={selectedAsset?.address} fontSize='md'>
                                <InfoIcon />
                            </Tooltip> <br />
                            <Button onClick={() => { selectAsset.open({ walletSend: true }) }} >Select</Button>
                            <br />

                            {/* <Button onClick={ }>Change Asset</Button> */}

                            <Card.Body pb={0} px={0}>
                                <Stack spacing={4}>
                                    <br />
                                    {/*<small>balance: {state.balances.filter((e:any) => e.symbol === state.assetContext)[0].balance}</small>*/}

                                    <br />
                                </Stack>
                            </Card.Body>



                            <h2>Address:</h2>
                            <Editable
                                onChange={(newAddy) => setSendAddress(newAddy)}
                                defaultValue='Loading...'
                                value={sendAddress}
                            >
                                <EditablePreview />
                                <EditableInput />
                            </Editable>

                            <br />
                            <h2>amount:</h2>
                            <NumberInput
                                onChange={(valueString) => setAmountSend(Number(parse(valueString)))}
                                value={format(amountSend)}
                                max={50}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>

                            <Button
                                type='submit'
                                size='lg'
                                width='full'
                                colorScheme='green'
                                onClick={() => onSubmit()}
                            // isDisabled={isDirty || !isValid}
                            >
                                Send
                            </Button>


                        </Card>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div >
    )


}
