
import { Card } from "./Card";
import {
    Box,
    Button,
    Divider,
    Flex,
    SimpleGrid,
    Spinner,
    Stack,
    TabPanel,
    TabPanels,
    Tabs
} from "@chakra-ui/react";
import { useWallet } from "context/WalletProvider/WalletProvider";
import { Page } from "./Layout/Page";

export const UserWallet = () => {

    const { state } = useWallet()

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
    console.log('balances', state.pioneer.balances)
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

                            <Card.Body pb={0} px={0}>
                                <Stack spacing={4}>
                                    <br />
                                    <small>balances: {state.pioneer.balances.toString()}</small>
                                    <br />
                                </Stack>
                            </Card.Body>

                        </Card>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div >
    )


}
