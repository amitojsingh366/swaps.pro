import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronRightIcon,
  CloseIcon,
  RepeatIcon,
  TriangleDownIcon
} from '@chakra-ui/icons'
import {
  Box,
  Button,
  Circle,
  FlexProps,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import { InitialState, useWallet, WalletActions } from 'context/WalletProvider/WalletProvider'
import { FC } from 'react'
import { OnboardButton } from './OnboardButton'
import { KeplrButton } from './KeplrButton'
import { PioneerButton } from './PioneerButton'
import { KeepKeyButton } from './KeepKeyButton'
type WalletImageProps = {
  isConnected: Boolean
} & Pick<InitialState, 'walletInfo'>

const WalletImage: React.FC<WalletImageProps> = ({ isConnected, walletInfo }) =>
  isConnected ? (
    <Image
      boxSize='24px'
      loading='lazy'
      // showBorder={false}
      objectFit='contain'
      bg='transparent'
      src={walletInfo?.icon}
    />
  ) : null

export const WalletButton: FC<FlexProps> = () => {
  const { state, dispatch, disconnect, setRoutePath } = useWallet()
  const { isConnected, walletInfo, username, context } = state

  const openWalletConnect = function(){
    setRoutePath('/')
    dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })
  }

  const openSend = function(wallet:string){
    console.log("wallet: ",wallet)
    setRoutePath('/Send/Send')
    dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })
  }

  const openReceive = function(wallet:string){
    console.log("wallet: ",wallet)
    setRoutePath('/Receive/Receive')
    dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })
  }

  return !username ? (
    <Button
      onClick={() => dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })}
      rightIcon={<ChevronRightIcon h={6} w={6} />}
      mr={6}
    >
      Connect Wallet
    </Button>
  ) : (
    <Menu gutter={4}>
      <MenuButton
        as={Button}
        // leftIcon={<WalletImage isConnected={isConnected} walletInfo={pioneer.walletInfo} />}
        rightIcon={<TriangleDownIcon h={3} w={3} />}
        mr={6}
      >
        {username.substring(0, 28)}...
      </MenuButton>
      <MenuList minW='300px'>
        <MenuGroup title='Wallet Overview'>
          context: {context?.substring(0, 28)}
          <Accordion>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    KeepKey: <KeepKeyButton />
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <MenuItem
                    icon={
                      <Circle bg='whiteAlpha.200' size={8}>
                        <ArrowUpIcon />
                      </Circle>
                    }
                    onClick={ () => openSend('keepkey')}
                >
                  Send
                </MenuItem>
                <MenuItem
                    icon={
                      <Circle bg='whiteAlpha.200' size={8}>
                        <ArrowDownIcon />
                      </Circle>
                    }
                    onClick={ () => openReceive('keepkey')}
                >
                  Receive
                </MenuItem>
                <MenuItem
                    icon={
                      <Circle bg='whiteAlpha.200' size={8}>
                        <CloseIcon />
                      </Circle>
                    }
                    onClick={disconnect}
                >
                  Disconnect
                </MenuItem>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    OnBoard: <OnboardButton />
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <MenuItem
                    icon={
                      <Circle bg='whiteAlpha.200' size={8}>
                        <ArrowUpIcon />
                      </Circle>
                    }
                    onClick={ () => openSend('onboard')}
                >
                  Send
                </MenuItem>
                <MenuItem
                    icon={
                      <Circle bg='whiteAlpha.200' size={8}>
                        <ArrowDownIcon />
                      </Circle>
                    }
                    onClick={ () => openReceive('onboard')}
                >
                  Receive
                </MenuItem>
                <MenuItem
                  icon={
                    <Circle bg='whiteAlpha.200' size={8}>
                      <RepeatIcon />
                    </Circle>
                  }
                  onClick={ () => openReceive('onboard')}
                >
                  Switch Wallet Provider
                </MenuItem>
                <MenuItem
                    icon={
                      <Circle bg='whiteAlpha.200' size={8}>
                        <CloseIcon />
                      </Circle>
                    }
                    onClick={disconnect}
                >
                  Disconnect
                </MenuItem>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    keplr: <KeplrButton />
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <MenuItem
                    icon={
                      <Circle bg='whiteAlpha.200' size={8}>
                        <ArrowUpIcon />
                      </Circle>
                    }
                    onClick={ () => openSend('keplr')}
                >
                  Send
                </MenuItem>
                <MenuItem
                    icon={
                      <Circle bg='whiteAlpha.200' size={8}>
                        <ArrowDownIcon />
                      </Circle>
                    }
                    onClick={ () => openReceive('keplr')}
                >
                  Receive
                </MenuItem>
                <MenuItem
                    icon={
                      <Circle bg='whiteAlpha.200' size={8}>
                        <CloseIcon />
                      </Circle>
                    }
                    onClick={disconnect}
                >
                  Disconnect
                </MenuItem>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    pioneer: <PioneerButton />
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <MenuItem
                    icon={
                      <Circle bg='whiteAlpha.200' size={8}>
                        <ArrowUpIcon />
                      </Circle>
                    }
                    onClick={ () => openSend('pioneer')}
                >
                  Send
                </MenuItem>
                <MenuItem
                    icon={
                      <Circle bg='whiteAlpha.200' size={8}>
                        <ArrowDownIcon />
                      </Circle>
                    }
                    onClick={ () => openReceive('pioneer')}
                >
                  Receive
                </MenuItem>
                <MenuItem
                    icon={
                      <Circle bg='whiteAlpha.200' size={8}>
                        <CloseIcon />
                      </Circle>
                    }
                    onClick={disconnect}
                >
                  Disconnect
                </MenuItem>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
          {/*<Box*/}
          {/*  borderRadius={0}*/}
          {/*  justifyContent='space-between'*/}
          {/*  flexDir='row'*/}
          {/*  alignItems='center'*/}
          {/*  px={4}*/}
          {/*  py={2}*/}
          {/*  display='flex'*/}
          {/*  flexWrap='nowrap'*/}
          {/*  icon={<WalletImage isConnected={true} walletInfo={pioneer.walletInfo} />}*/}
          {/*>*/}
          {/*  <Button*/}
          {/*    bg='whiteAlpha.200'*/}
          {/*    borderRadius='lg'*/}
          {/*    px={3}*/}
          {/*  >*/}
          {/*    <div><small>total value: {JSON.stringify(pioneer?.totalValueUsd)}</small></div>*/}
          {/*  </Button>*/}
          {/*  <HStack ml={4}>*/}

          {/*  </HStack>*/}
          {/*</Box>*/}
        </MenuGroup>
        <MenuDivider />
        {/*<MenuItem>*/}
        {/*  OnBoard: <OnboardButton />*/}
        {/*</MenuItem>*/}
        {/*<MenuItem>*/}
        {/*  keplr: <KeplrButton />*/}
        {/*</MenuItem>*/}
        {/*<MenuItem*/}
        {/*  icon={*/}
        {/*    <Circle bg='whiteAlpha.200' size={8}>*/}
        {/*      <RepeatIcon />*/}
        {/*    </Circle>*/}
        {/*  }*/}
        {/*  onClick={() => dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })}*/}
        {/*>*/}
        {/*  Switch Wallet Provider*/}
        {/*</MenuItem>*/}
        {/*<MenuItem*/}
        {/*  icon={*/}
        {/*    <Circle bg='whiteAlpha.200' size={8}>*/}
        {/*      <CloseIcon />*/}
        {/*    </Circle>*/}
        {/*  }*/}
        {/*  onClick={pioneer.forget}*/}
        {/*>*/}
        {/*  forget*/}
        {/*</MenuItem>*/}
        {/*<MenuItem*/}
        {/*    icon={*/}
        {/*      <Circle bg='whiteAlpha.200' size={8}>*/}
        {/*        <CloseIcon />*/}
        {/*      </Circle>*/}
        {/*    }*/}
        {/*    onClick={disconnect}*/}
        {/*>*/}
        {/*  Disconnect*/}
        {/*</MenuItem>*/}
      </MenuList>
    </Menu>
  )
}
