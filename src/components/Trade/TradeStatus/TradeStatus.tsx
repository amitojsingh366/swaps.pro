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
    const { state } = useWallet()
    const { invocationContext } = state

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
                        <Card.Heading textAlign='center'>Trade Status <small>{invocationContext}</small></Card.Heading>

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
                <Card.Body pb={0} px={0}>
                    <Stack spacing={4}>

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
