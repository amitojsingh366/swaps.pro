import { ArrowBackIcon } from '@chakra-ui/icons'
import {
  Flex,
  IconButton,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay
} from '@chakra-ui/react'
import { SlideTransition } from 'components/SlideTransition'
import { AnimatePresence } from 'framer-motion'
import React, { useEffect } from 'react'
import { Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router-dom'

import { SUPPORTED_WALLETS } from './config'
import { WalletSelectModal } from './WalletSelectModal'
import { useWallet, WalletActions } from './WalletProvider'
import { WalletViewProps } from './WalletViewsRouter'

//Select
import { Select } from './AssetSelect/Select'

export const WalletViewsSwitch = (props: WalletViewProps) => {
  const history = useHistory()
  const location = useLocation()
  const match = useRouteMatch('/')
  const { dispatch, setRoutePath } = useWallet()

  const onClose = () => {
    //history.replace('/')
    setRoutePath('/')
    dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: false })
  }

  const handleBack = () => {
    history.goBack()
  }

  useEffect(() => {
    if (props.routePath) {
      history.push(props.routePath as string)
    }
  }, [history, props.routePath, dispatch])

  return (
    <>
      <Modal isOpen={props.modalOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent justifyContent='center' px={3} pt={3} pb={6}>
          <Flex justifyContent='space-between' alignItems='center' position='relative'>
            {!match?.isExact && (
              <IconButton
                icon={<ArrowBackIcon />}
                aria-label='Back'
                variant='ghost'
                fontSize='xl'
                size='sm'
                isRound
                onClick={handleBack}
              />
            )}
            <ModalCloseButton ml='auto' borderRadius='full' position='static' />
          </Flex>
          <AnimatePresence exitBeforeEnter initial={false}>
            <SlideTransition key={location.key}>
              <Switch key={location.pathname} location={location}>
                {props?.type &&
                  SUPPORTED_WALLETS[props.type].routes.map((route, index) => {
                    const Component = route.component
                    return !Component ? null : (
                      <Route
                        exact
                        key={index}
                        path={route.path}
                        render={routeProps => <Component {...props} {...routeProps} />}
                        {...props}
                      />
                    )
                  })}
                  <Route
                      exact
                      key='selectAsset'
                      path='/AssetSelect/Select'
                      render={routeProps => <Select {...props} {...routeProps} />}
                      {...props}
                  />
                <Route {...props} children={() => <WalletSelectModal connect={props?.connect} />} />
              </Switch>
            </SlideTransition>
          </AnimatePresence>
        </ModalContent>
      </Modal>
    </>
  )
}
