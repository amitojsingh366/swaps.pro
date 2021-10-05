import { Box, Grid, Spinner, Stack, Flex, Image, Progress, SimpleGrid, useColorModeValue } from '@chakra-ui/react'
import { HistoryTimeframe } from '@shapeshiftoss/market-service'
import { Card } from 'components/Card'
import { Graph } from 'components/Graph/Graph'
import { TimeControls } from 'components/Graph/TimeControls'
import { RawText, Text } from 'components/Text'
import { useCallback, useEffect, useState } from 'react'
// import { HistoryTimeframe } from 'lib/assets/getAssetData'
import { useWallet } from 'context/WalletProvider/WalletProvider'
import { Link } from 'react-router-dom'
import { AssetList } from './components/AssetList/AssetList'
import { Button, ButtonGroup } from "@chakra-ui/react"
import {useModal} from "../../context/ModalProvider/ModalProvider";

export const Portfolio = () => {
  const modal = useModal()
  const rowHover = useColorModeValue('gray.100', 'gray.750')
  const { state, username, pioneer, setAssetContext } = useWallet()
  const { code, isConnected } = state

  //on click asset
  const handleClickSend = async (asset:string) => {
    //console.log('handleClickSend! asset: ',asset)
    await setAssetContext(asset)
    modal.open('send')
  }

  const handleClickReceive = async (asset:string) => {
    //console.log('handleClickReceive! asset: ',asset)
    await setAssetContext(asset)
    modal.open('receive',{ asset })
  }

  const forceRefesh = () => {
    //console.log("state: ",state)
    //console.log("username: ",username)
    //console.log("pioneer: ",pioneer)
    //console.log("pioneer.username: ",pioneer.username)
  }

  useEffect(() => {
    //console.log("render: ",state)
    //console.log("username: ",username)
  }, [])

  if (!pioneer?.username)
    return (
      <Box d='flex' width='full' justifyContent='center' alignItems='center'>
        <h2>Connect A wallet!</h2>
        <h4>username: {username}</h4>
        <Spinner />
        <Button
            size="sm"
            colorScheme="yellow"
            variant="outline"
            onClick={() => forceRefesh()}
        >
          refresh app
        </Button>
      </Box>
    )

  return (
    <Stack spacing={6} width='full' p={4}>
      <Card variant='footer-stub'>
        <Card.Header display='flex' justifyContent='space-between' alignItems='center' width='full'>
          <Box>
            <Card.Heading as='div' color='gray.500'>
              <h3>username: {username}</h3>
              <Text translation='dashboard.portfolio.portfolioBalance' />
            </Card.Heading>
            <Card.Heading as='h2' fontSize='4xl'>
              <RawText>{pioneer?.valueUsdContext || "0"}</RawText>
            </Card.Heading>
            <RawText>
            </RawText>
          </Box>
        </Card.Header>
      </Card>
      <Card>
        {pioneer?.wallets?.map(function(wallet:any){
          //console.log("wallet: ",wallet)
          // @ts-ignore
          return <div>
            <Card.Header>
            <Card.Heading>
              <small>WalletID: {wallet.context}</small>
              <Text translation='dashboard.portfolio.yourAssets' />
            </Card.Heading>
          </Card.Header>
          <Card.Body px={2} pt={0}>
            <Stack spacing={0}>
              <Grid
                  templateColumns={{ base: '1fr auto', lg: '2fr repeat(3, 1fr)' }}
                  gap='1rem'
                  py={4}
                  pl={4}
                  pr={4}
              >
                </Grid>

              {Object.keys(wallet?.balances).map((asset:any, index:any) => <SimpleGrid
                  key={index}
                  _hover={{ bg: rowHover }}
                  templateColumns={{ base: '1fr auto', lg: '250px 1fr auto 1fr' }}
                  py={4}
                  pl={4}
                  pr={4}
                  rounded='lg'
                  gridGap={0}
                  alignItems='center'
              >
                <Flex alignItems='left'>
                  <Image src={'https://static.coincap.io/assets/icons/svg/'+asset.toLowerCase()+'.svg' || 'https://static.coincap.io/assets/icons/256/'+asset.toLowerCase()+'.png'} boxSize='10' />
                </Flex>

                <Flex textAlign='right'>
                  <RawText>balance {wallet.balances[asset]}({asset}) {wallet.values[asset]}(usd)</RawText>
                </Flex>

                <Flex>
                  <Button
                      size="sm"
                      colorScheme="green"
                      variant="outline"
                      onClick={() => handleClickSend(asset)}
                  >
                    send
                  </Button>
                  <Button
                      size="sm"
                      colorScheme="green"
                      variant="outline"
                      onClick={() => handleClickReceive(asset)}
                  >
                    receive
                  </Button>
                </Flex>

              </SimpleGrid>)}
            </Stack>
          </Card.Body>
          </div>
        })}
      </Card>
    </Stack>
  )
}
