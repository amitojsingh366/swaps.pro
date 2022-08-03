
import {FormProvider, useForm, useFormContext} from 'react-hook-form'
import { useWallet } from "../../context/WalletProvider/WalletProvider";
import {Card} from "../Card";
import {Button, Divider, IconButton, SimpleGrid, Stack} from "@chakra-ui/react";
import {ArrowBackIcon} from "@chakra-ui/icons";
import {AssetToAsset} from "../Trade/TradeStatus/AssetToAsset";

export const Invocation = (invocationId:any) => {
    const { } = useWallet()
    console.log("invocationId: ",invocationId.invocationId.invocationId)
    return (
        <div>
            <Card variant='unstyled'>
                <Card.Header px={0} pt={0}>
                    <SimpleGrid gridTemplateColumns='25px 1fr 25px' alignItems='center' mx={-2}>
                        <IconButton
                            icon={<ArrowBackIcon />}
                            aria-label='Back'
                            variant='ghost'
                            fontSize='xl'
                            isRound
                            // onClick={() => history.push('/trade/input')}
                        />
                        <Card.Heading textAlign='center'>Trade Status: id: {invocationId.invocationId.invocationId}<small></small></Card.Heading>

                    </SimpleGrid>

                </Card.Header>
                <Divider />
                <Card.Body pb={0} px={0}>
                    <Stack spacing={4}>
                        <br/>
                        <small>deposit txid: </small>
                        <br/>
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
        </div>
    )
}
