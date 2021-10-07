import {Box, Divider, Flex, Spinner, Stack} from '@chakra-ui/react'
import { Page } from 'components/Layout/Page'
import { AssetData, getAssetData } from 'lib/assets/getAssetData'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShapeShiftActions } from './ShapeShiftCards/ShapeShiftActions'
import {useWallet} from "../../context/WalletProvider/WalletProvider";
// import { AssetBalance } from './AssetCards/AssetBalance'
// import { Rewards } from './AssetCards/Rewards'
// import { AssetDetails } from './AssetDetails/AssetDetails'
// import { AssetSidebar } from './AssetSidebar'

export interface MatchParams {
  network: string
  address: string
}

export const ShapeShift = () => {
  const { state, pioneer } = useWallet()
  const { code, isConnected, username } = state
  const [asset, setAsset] = useState<AssetData>()
  // const [loading, setLoading] = useState<boolean>(false)
  let { network, address } = useParams<MatchParams>()
  let loading = true


  useEffect(() => {
      //console.log("render: ",state)
      //console.log("username: ",username)
  }, [network, address])

  if (!username)
    return (
        <Box d='flex' width='full' justifyContent='center' alignItems='center'>
          <h2>Connect A wallet!</h2>
        </Box>
    )

  return (
    <Page>
      <Flex maxWidth={{ base: 'auto', '2xl': '1464px' }} mx='auto' px={4}>
        <Stack flex={1} spacing={4} justifyContent='center' alignItems='center'>
          <ShapeShiftActions />
        </Stack>
      </Flex>
    </Page>
  )
}
