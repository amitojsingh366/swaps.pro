import {Box, Divider, Flex, Spinner, Stack} from '@chakra-ui/react'
import { Page } from 'components/Layout/Page'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SwapActions } from './Swap/SwapActions'
import { useWallet } from "context/WalletProvider/WalletProvider";
import { pioneer } from 'hooks/usePioneerSdk/usePioneerSdk'
// import { AssetBalance } from './AssetCards/AssetBalance'
// import { Rewards } from './AssetCards/Rewards'
// import { AssetDetails } from './AssetDetails/AssetDetails'
// import { AssetSidebar } from './AssetSidebar'

export interface MatchParams {
  network: string
  address: string
}

export const Swap = () => {
  const { state } = useWallet()
  const { username } = state
  const { balances, loading } = pioneer()


  useEffect(() => {
      console.log("balances: ",balances)
      console.log("loading: ",loading)
      //console.log("username: ",username)
  }, [balances, loading])

  if (!username)
    return (
        <Box d='flex' width='full' justifyContent='center' alignItems='center'>
          <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
          />
        </Box>
    )

  return (
    <Page>
      <Flex maxWidth={{ base: 'auto', '2xl': '1464px' }} mx='auto' px={4}>
        <Stack flex={1} spacing={4} justifyContent='center' alignItems='center'>
          <SwapActions />
        </Stack>
      </Flex>
    </Page>
  )
}
