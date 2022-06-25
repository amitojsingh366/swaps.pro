import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, Button, Divider, IconButton, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { Card } from 'components/Card'
import { HelperToolTip } from 'components/HelperTooltip'
import { Row } from 'components/Row'
import { SlideTransition } from 'components/SlideTransition'
import { useFormContext } from 'react-hook-form'
import { RouterProps } from 'react-router-dom'
import { AssetToAsset } from './AssetToAsset'
import {useWallet} from "../../../context/WalletProvider/WalletProvider";

export const TradeStatus = ({ history }: RouterProps) => {
    const { getValues } = useFormContext()
    const { sellAsset, buyAsset } = getValues()
    const { state, updateInvocation } = useWallet()
    const { invocationContext, fullfillmentTxid, invocationTxid, tradeStatus } = state
    console.log("invocation: ",state.invocation)

    const onUpdate = () => {
        //Open Select modal.
        updateInvocation()
    }

    return (
        <SlideTransition>
            <Card variant='unstyled'>
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
                        <Card.Heading textAlign='center'>Trade Status {tradeStatus}<small>{invocationContext}</small></Card.Heading>

                    </SimpleGrid>
                    <AssetToAsset
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
                    />
                </Card.Header>
                <Divider />
                <Button
                    size='lg'
                    width='full'
                    colorScheme='green'
                    onClick={() => onUpdate()}
                >
                    update
                </Button>
                <Card.Body pb={0} px={0}>
                    <Stack spacing={4}>
                    <br/>
                    <small>invocation: {state.invocationId}</small>
                    <br/>
                    <small>state: {state.invocation.state}</small>
                    <br/>
                    <Row>
                        <Row.Label>type:{state.invocation.invocation.type}</Row.Label>
                    </Row>
                    <Row>
                        <Row.Label>network:{state.invocation.invocation.network}</Row.Label>
                    </Row>
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
                    <small>deposit txid: {state.invocation.signedTx.txid}</small>
                    {/*<small>is confirmed: {state.invocation.isConfirmed}</small>*/}
                    {/*<small>is fullfilled: {state.invocation.isFullfilled}</small>*/}
                    <small>fullfillmentTxid: {state.invocation.fullfillmentTxid}</small>
                    <br/>
                        {fullfillmentTxid &&
                        <small>fullfillment txid: {fullfillmentTxid}</small>
                        }
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
        </SlideTransition>
    )
}
