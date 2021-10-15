import {Box, Tab, TabList, TabPanel, TabPanels, Tabs} from '@chakra-ui/react'
import { Card } from 'components/Card'
import { Text } from 'components/Text'
import { Trade } from 'components/Trade/Trade'
import {useWallet} from "../../../context/WalletProvider/WalletProvider";

export const SwapActions = () => {
  const { state } = useWallet()
  const {  } = state

  return (
    <Card maxW="460px" mx="auto" flex={1} justifyContent='center' alignItems='center'>
      <Tabs isFitted variant='soft-rounded' defaultIndex={0}>
        <TabList>
          <Tab>
            <Text translation='assets.exchanges.thorchain' />
          </Tab>
          <Tab>
            <Text translation='assets.exchanges.osmosis' />
          </Tab>
          <Tab>
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
