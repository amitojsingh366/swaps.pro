import { Box } from '@chakra-ui/react'
import { SlideTransition } from 'components/SlideTransition'
import { RouteProps } from 'react-router-dom'

type SelectAssetProps = { onClick: (asset: any) => void } & RouteProps

export const SelectAsset = ({ onClick }: SelectAssetProps) => {
  return (
    <SlideTransition>
      <Box height='400px' p={0} display='flex' flexDir='column'>
          TODO button to open assetSelect
      </Box>
    </SlideTransition>
  )
}
