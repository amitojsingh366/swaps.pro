import { ArrowBackIcon } from '@chakra-ui/icons'
import {
    Box,
    Button,
    Divider,
    Flex,
    IconButton,
    SimpleGrid,
    Spinner,
    Stack,
    TabList,
    TabPanels,
    Tabs,
    Tab,
    TabPanel,
    Image,
    HStack,
    Center
} from '@chakra-ui/react'
import { Card } from 'components/Card'
import { Row } from 'components/Row'
import { useHistory, useParams } from 'react-router-dom'
import { useWallet, WalletActions } from "../../../context/WalletProvider/WalletProvider";
import React, { useEffect, useState } from 'react'
import { Page } from 'components/Layout/Page'
import ELEPHANT from 'assets/png/elephant.png'
import { StackedProgressBar } from './StackedProgressBar'

export const TradeStatus = () => {
    const history = useHistory()
    const { invocationId } = useParams<{ invocationId: string }>()

    const [tabIndex, setTabIndex] = React.useState(0)
    const { state, updateInvocation, dispatch } = useWallet()
    const [step, setStep] = useState(0)



    useEffect(() => {
        if (!invocationId) return
        let invoId = invocationId
        if (state.invocationId) invoId = state.invocationId
        if (!invoId) return
        if (!state.pioneer) return

        state.pioneer.getInvocation(invoId).then((invocation: any) => {
            dispatch({ type: WalletActions.SET_INVOCATION, payload: invocation })
            dispatch({ type: WalletActions.SET_INVOCATION_ID, payload: invoId })
        })
    }, [dispatch, invocationId, state.invocationId, state.pioneer])

    useEffect(() => {
        return () => {
            dispatch({ type: WalletActions.SET_INVOCATION, payload: null })
            dispatch({ type: WalletActions.SET_INVOCATION_ID, payload: null })
        }
    }, [dispatch])

    const handleTabsChange = (index) => {
        console.log("index: ", index)
        setTabIndex(index)
    }

    if (!state.invocation || !state.invocationId) return (
        <>
            Fetching Invocation
            <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
            /></>
    )

    const { invocationContext, fullfillmentTxid, invocationTxid, tradeStatus } = state
    console.log("invocation: ", state.invocation)

    const onUpdate = async function () {
        //Open Select modal.
        updateInvocation()

        // signedTx/broadcasted/complete/fullfilled
        switch (state.invocation.state) {
            case 'signedTx':
                setStep(1)
                break;
            case 'broadcasted':
                setStep(2)
                break;
            case 'complete':
                setStep(3)
                break;
            case 'fullfilled':
                setStep(4)
                break;

            default:
                break;
        }


        //get txid
        // let payload = {
        //     noBroadcast:false,
        //     sync:true,
        //     invocationId:state.invocationId
        // }
        // try{
        //     let resultBroadcast = await state.pioneer.broadcast(payload)
        //     console.log("resultBroadcast: ",resultBroadcast)
        // }catch(e){
        //     console.error("status page can not broadcast: e: ",e)
        // }



    }

    return (
        <Box d='flex' width='full' justifyContent='center' alignItems='center'>
            <div>
                <Page>
                    <Flex maxWidth={{ base: 'auto', '2xl': '1464px' }} mx='auto' px={16}>
                        <Stack flex={1} spacing={4} justifyContent='center' alignItems='center'>
                            <Card maxW="460px" mx="auto" flex={1} justifyContent='center' alignItems='center'>
                                <Card.Header px={0} pt={0}>
                                    <SimpleGrid gridTemplateColumns='25px 1fr 25px' alignItems='center' mx={-2}>
                                        <IconButton
                                            icon={<ArrowBackIcon />}
                                            aria-label='Back'
                                            variant='ghost'
                                            fontSize='xl'
                                            isRound
                                            onClick={() => history.push('/trade/input')}
                                        />
                                        <Card.Heading textAlign='center'>type: {state.invocation.invocation.type}
                                        </Card.Heading>
                                    </SimpleGrid>
                                </Card.Header>

                                <br />
                                <small>invocation: {state.invocationId}</small>
                                <br />
                                <br />
                                <br />
                                <small>state: {state.invocation.state}</small>
                                <br />
                                <Row>
                                    <Row.Label>network:{state.invocation.invocation.network}</Row.Label>
                                </Row>
                                <br />
                                <br />
                                <Image src={ELEPHANT} />
                                {state.invocation.invocation.type === 'sendToAddress' && <div>
                                    <Tabs align='center' variant='soft' colorScheme='green' index={tabIndex} onChange={handleTabsChange}>
                                        <TabList>
                                            <Tab bg='green.500'>TX built</Tab>
                                            <Tab bg='yellow.500'>TX signed</Tab>
                                            <Tab bg='blue.500'>TX confirmed</Tab>
                                        </TabList>
                                        <TabPanels>
                                            <TabPanel>
                                                <p>one!</p>
                                            </TabPanel>
                                            <TabPanel>
                                                <p>two!</p>
                                            </TabPanel>
                                            <TabPanel>
                                                <p>
                                                    Transaction is confirmed!
                                                    <br />
                                                    You can view your transaction here:
                                                </p>
                                            </TabPanel>
                                        </TabPanels>
                                    </Tabs>
                                </div>}

                                {state.invocation.invocation.type === 'swap' && <div>


                                    {/* <AssetToAsset
                                        buyAsset={{
                                            symbol: buyAsset?.currency?.symbol,
                                            amount: buyAsset.amount,
                                            icon: buyAsset?.currency?.image
                                        }}
                                        sellAsset={{
                                            symbol: sellAsset?.currency?.symbol,
                                            amount: sellAsset.amount,
                                            icon: sellAsset?.currency?.image
                                        }}
                                        mt={6}
                                        /> */}

                                    <StackedProgressBar step={step} />
                                </div>}



                                <Divider />
                                <Button
                                    size='sm'
                                    colorScheme='green'
                                    onClick={() => onUpdate()}
                                >
                                    update
                                </Button>
                                <Card.Body pb={0} px={0}>
                                    <Stack spacing={4}>

                                        {/*    {state.invocation.invocation.route.result.swaps.map((value, i) => {*/}
                                        {/*        return <>*/}
                                        {/*            <HelperToolTip label='protocol used to complete the swap'>*/}
                                        {/*                <Row.Label>swap:{i}</Row.Label>*/}
                                        {/*            </HelperToolTip>*/}
                                        {/*            <HelperToolTip label='protocol used to complete the swap'>*/}
                                        {/*                <Row.Label>swapperId:</Row.Label>*/}
                                        {/*                <Box textAlign='right'>*/}
                                        {/*                    <Text></Text>*/}
                                        {/*                    <Text color='gray.500'>{value.swapperId}</Text>*/}
                                        {/*                </Box>*/}
                                        {/*            </HelperToolTip>*/}
                                        {/*            <HelperToolTip label='protocol used to complete the swap'>*/}
                                        {/*                <Row.Label>time avg:{value.timeStat.avg}</Row.Label>*/}
                                        {/*            </HelperToolTip>*/}
                                        {/*            <HelperToolTip label='protocol used to complete the swap'>*/}
                                        {/*                <Row.Label>time min:{value.timeStat.min}</Row.Label>*/}
                                        {/*            </HelperToolTip>*/}
                                        {/*            <HelperToolTip label='protocol used to complete the swap'>*/}
                                        {/*                <Row.Label>time max:{value.timeStat.max}</Row.Label>*/}
                                        {/*            </HelperToolTip>*/}
                                        {/*        </>*/}
                                        {/*    })}*/}
                                        {/*<small> txid: {state.invocation.signedTx?.txid}</small>*/}
                                        {/*<small>is confirmed: {state.invocation.isConfirmed}</small>*/}
                                        {/*<small>is fullfilled: {state.invocation.isFullfilled}</small>*/}
                                        <br />
                                    </Stack>
                                </Card.Body>
                                <Card.Footer px={0} py={0}>
                                    <Button
                                        colorScheme='blue'
                                        size='lg'
                                        width='full'
                                        mt={6}
                                    // onClick={() => history.push('/trade/input')}
                                    >
                                        Exit
                                    </Button>
                                </Card.Footer>
                            </Card>
                        </Stack>
                    </Flex>
                </Page>
            </div>
        </Box>

    )
}
