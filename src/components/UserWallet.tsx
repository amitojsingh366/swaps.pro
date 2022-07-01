
import { Card } from "./Card";
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
    Tabs, Text
} from "@chakra-ui/react";
import { useWallet, WalletActions } from "context/WalletProvider/WalletProvider";
import { Page } from "./Layout/Page";
import { useState } from 'react'
import { Controller, useFormContext } from "react-hook-form";
import NumberFormat from "react-number-format";
import { TokenRow } from "./TokenRow/TokenRow";
import { TokenButton } from "./TokenRow/TokenButton";
import { ArrowDownIcon } from "@chakra-ui/icons";
import { HelperToolTip } from "./HelperTooltip";
import { useLocaleFormatter } from "../hooks/useLocaleFormatter/useLocaleFormatter";
import { useHistory } from "react-router-dom";

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
    const [valueAddress, setValueAddress] = useState("thor1pf....")
    const { state, dispatch, setRoutePath } = useWallet()
    const history = useHistory()
    const format = (val: number) => val
    const parse = (val: string) => val.replace(/^\$/, '')

    const {
        number: { localeParts }
    } = useLocaleFormatter({ fiatType: 'USD' })

    const onTextChangeFiat = () => {
        //Open Select modal.
        console.log("onTextChangeFiat called! (Fiat input)")
    }

    const onSubmit = async function () {
        if (!state.isConnected) return dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })
        console.log("submited address")


        console.log("amountSend: ", amountSend)
        console.log("svalueAddress: ", valueAddress)
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
            blockchain: "thorchain",
            asset: "RUNE",
            address: valueAddress,
            amount: amountSend,
            noBroadcast: false
        }

        let tx = {
            type: 'sendToAddress',
            payload: send
        }

        console.log("tx: ", tx)
        let invocationId
        try {
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

                            <small>context: {state.context}</small>
                            <br />
                            <small>asset Selected: RUNE</small>
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
                                onChange={(valueAddress) => setValueAddress(valueAddress)}
                                defaultValue='Take some chakra'
                                value={valueAddress}
                            >
                                <EditablePreview />
                                <EditableInput />
                            </Editable>

                            <br />
                            <h2>amount:</h2>
                            <NumberInput
                                onChange={(valueString) => setAmountSend(parse(valueString))}
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
