import {Box, Tab, TabList, TabPanel, TabPanels, Tabs} from '@chakra-ui/react'
import { Card } from 'components/Card'
import { Text } from 'components/Text'
import { Trade } from 'components/Trade/Trade'
import {useWallet, WalletActions} from "context/WalletProvider/WalletProvider";


export const SwapActions = () => {
  const { state, dispatch } = useWallet()
  const {  } = state


  let selectExchange = (exchange:string) => {
    console.log("selectExchange: ",exchange)
    dispatch({ type: WalletActions.SET_EXCHANGE_CONTEXT, payload:exchange})
  }

  return (
    <Card maxW="460px" mx="auto" flex={1} justifyContent='center' alignItems='center'>
      <Tabs isFitted variant='soft-rounded' defaultIndex={0}>
        <TabList>
          <Tab onClick={() => selectExchange('thorchain')} >
            <Text translation='assets.exchanges.thorchain' />
          </Tab>
          <Tab onClick={() => selectExchange('osmosis')}>
            <Text translation='assets.exchanges.osmosis' />
          </Tab>
          <Tab onClick={() => selectExchange('0x')}>
            <Text translation='assets.exchanges.0x' />
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Trade exchange='thorchain'/>
          </TabPanel>
          <TabPanel>
            <Trade exchange='osmosis'/>
          </TabPanel>
          <TabPanel>
            <Trade exchange='0x'/>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Card>
  )
}
