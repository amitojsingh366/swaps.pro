import {Box, Tab, TabList, TabPanel, TabPanels, Tabs} from '@chakra-ui/react'
import { Card } from 'components/Card'
import { Text } from 'components/Text'
import { Trade } from 'components/Trade/Trade'
import {useWallet} from "../../../context/WalletProvider/WalletProvider";

export const ShapeShiftActions = () => {
  const { state } = useWallet()
  const {  } = state

  return (
    <Card maxW="460px" mx="auto" flex={1} justifyContent='center' alignItems='center'>
      <Tabs isFitted variant='soft-rounded' defaultIndex={0}>
        <TabList>
          <Tab>
            <Text translation='assets.assetCards.assetActions.trade' />
          </Tab>
          <Tab>
            <Text translation='assets.assetCards.assetActions.lp' />
          </Tab>
          <Tab>
            <Text translation='assets.assetCards.assetActions.ibc' />
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Trade />
          </TabPanel>
          <TabPanel>
            <p>Join Liquidity Pool</p>
          </TabPanel>
          <TabPanel>
            <p>IBC channels</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Card>
  )
}
