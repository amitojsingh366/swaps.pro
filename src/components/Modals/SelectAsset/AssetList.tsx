import { ListProps } from '@chakra-ui/react'
import { Text } from 'components/Text'
import { useRouteMatch } from 'react-router-dom'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'

import { AssetRow } from './AssetRow'

type AssetListProps = {
  handleClick: (asset: any) => void
  assets: any[]
} & ListProps

export const AssetList = ({ assets, handleClick }: AssetListProps) => {
  const match = useRouteMatch<{ address: string }>()
  console.log("assets: ",assets)
  return (
    <AutoSizer disableWidth className='auto-sizered'>
      {({ height }) =>
        assets?.length === 0 ? (
          <Text translation='common.noResultsFound' />
        ) : (
          <FixedSizeList
            itemSize={60}
            height={height}
            width='100%'
            itemData={{
              items: assets,
              handleClick
            }}
            itemCount={assets.length}
            className='token-list scroll-container'
            overscanCount={6}
          >
            {AssetRow}
          </FixedSizeList>
        )
      }
    </AutoSizer>
  )
}
