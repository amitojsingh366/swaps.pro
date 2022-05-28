import {Box, Divider, Flex, Spinner, Stack} from '@chakra-ui/react'
import { Page } from 'components/Layout/Page'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { InvocationActions } from './Invocation/InvocationActions'
import { useWallet } from "context/WalletProvider/WalletProvider";
import { Route } from 'Routes/helpers'
import { matchPath, useLocation } from 'react-router'
import {Pioneer} from "hooks/usePioneerSdk/usePioneerSdk";
// import { AssetBalance } from './AssetCards/AssetBalance'
// import { Rewards } from './AssetCards/Rewards'
// import { AssetDetails } from './AssetDetails/AssetDetails'
// import { AssetSidebar } from './AssetSidebar'

export interface MatchParams {
  network: string
  address: string
}

export const Invocation = ({ route }: { route?: Route }) => {
  const { state } = useWallet()
  const { username } = state
    console.log("route: ",route)

    const invocationId = matchPath<{ invocationId: string; }>(location.pathname, {
        path: '/invocation/:invocationId',
    })
    console.log("route: ",invocationId)
  return (
    <Page>
      <Flex maxWidth={{ base: 'auto', '2xl': '1464px' }} mx='auto' px={16}>
        <Stack flex={1} spacing={4} justifyContent='center' alignItems='center'>
          <InvocationActions invocationId={invocationId.params.invocationId}/>
        </Stack>
      </Flex>
    </Page>
  )
}
