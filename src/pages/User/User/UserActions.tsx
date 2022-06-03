import {Box, Tab, TabList, TabPanel, TabPanels, Tabs} from '@chakra-ui/react'
import { Card } from 'components/Card'
import { Text } from 'components/Text'
import { User } from 'components/User/User'
import {useWallet, WalletActions} from "context/WalletProvider/WalletProvider";


export const UserActions = () => {
    const { state, dispatch } = useWallet()
    const {  } = state


    let selectExchange = (exchange:string) => {
        console.log("selectExchange: ",exchange)
        dispatch({ type: WalletActions.SET_EXCHANGE_CONTEXT, payload:exchange})
    }

    return (
        <Card maxW="460px" mx="auto" flex={1} justifyContent='center' alignItems='center'>
            <Tabs isFitted variant='soft-rounded' defaultIndex={0}>
                <TabPanels>
                    <TabPanel>
                        <User exchange='thorchain'/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Card>
    )
}
