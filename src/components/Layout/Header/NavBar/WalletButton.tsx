import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronRightIcon,
  CloseIcon,
  CopyIcon,
  RepeatIcon,
  TriangleDownIcon
} from '@chakra-ui/icons'
import {
  Box,
  Button,
  Circle,
  FlexProps,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Tooltip,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import { shortenAddress } from 'utils/helpers'
import { InitialState, useWallet, WalletActions } from 'context/WalletProvider/WalletProvider'
import { FC } from 'react'
import { OnboardButton } from './OnboardButton'
import { KeplrButton } from './KeplrButton'
import { PioneerButton } from './PioneerButton'
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
  const { state, dispatch, disconnect } = useWallet()
  const { isConnected, walletInfo, username, context } = state

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
                    OnBoard: <OnboardButton />
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <MenuItem
                  icon={
                    <Circle bg='whiteAlpha.200' size={8}>
                      <RepeatIcon />
                    </Circle>
                  }
                  onClick={() => dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })}
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
                *keplr wallet info
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
                *pioneer wallet info
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
