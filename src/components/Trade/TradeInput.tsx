import { ArrowDownIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  IconButton, Image,
  Input,
  InputProps, MenuGroup, MenuItem,
  Text
} from '@chakra-ui/react'
import { HelperToolTip } from 'components/HelperTooltip'
import { SlideTransition } from 'components/SlideTransition'
import { TokenButton } from 'components/TokenRow/TokenButton'
import { TokenRow } from 'components/TokenRow/TokenRow'
import { useLocaleFormatter } from 'hooks/useLocaleFormatter/useLocaleFormatter'
import { Controller, useFormContext } from 'react-hook-form'
import { Pioneer } from 'hooks/usePioneerSdk/usePioneerSdk'
import NumberFormat from 'react-number-format'
import { RouterProps } from 'react-router-dom'
import { useWallet, WalletActions } from "context/WalletProvider/WalletProvider";
import { useEffect } from "react";
import KEEPKEY_ICON from "../../assets/png/keepkey.png";
import { useModal } from 'hooks/useModal/useModal'

const FiatInput = (props: InputProps) => (
  <Input
    variant='unstyled'
    size='xl'
    textAlign='center'
    fontSize='3xl'
    mb={4}
    placeholder='$0.00'
    {...props}
  />
)

export const TradeInput = ({ history }: RouterProps) => {
  const { state, dispatch, setRoutePath, updateInvocation } = useWallet()
  const { assetContext, balances, tradeOutput, exchangeContext, pioneer } = state
  const { getCryptoQuote, getFiatQuote, reset, switchAssets, update, setMaxInput } = Pioneer()
  let {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isDirty, isValid }
  } = useFormContext()
  const {
    number: { localeParts }
  } = useLocaleFormatter({ fiatType: 'USD' })

  const onSubmit = () => {
    history.push('/trade/confirm')
  }

  const { selectAsset } = useModal()

  const onSelectModalInput = () => {
    //Open Select modal.
    console.log("onSelectModal called!")
    if (!state.keepkeyConnected) {
      console.log("wallet NOT connected!")
      return dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })
    }
    selectAsset.open({ selectType: 'trade:input' })
    //set balance input

  }

  const onTextChangeFiat = () => {
    //Open Select modal.
    console.log("onTextChangeFiat called! (Fiat input)")
  }

  const onSelectModalOutput = () => {
    //Open Select modal.
    console.log("onSelectModalOutput called!")
    if (!state.keepkeyConnected) {
      console.log("wallet NOT connected!")
      return dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })
    }
    selectAsset.open({ selectType: 'trade:output' })
  }

  const onClear = () => {
    //Open Select modal.
    reset()
    //RESET_STATE
    // @ts-ignore
    dispatch({ type: WalletActions.RESET_STATE, payload: true })
  }

  const onUpdate = () => {
    //Open Select modal.
    updateInvocation()
    update()
    if (state?.invocation?.state === 'created') {
      history.push('/trade/confirm')
    }
    if (state?.invocation?.state === 'broadcasted') {
      history.push('/trade/status')
    }
  }

  useEffect(() => {
    onUpdate()
    update()
  }, [balances, assetContext, tradeOutput])

  useEffect(() => {
    console.log('Trade Input: ', state.tradeInput)
    console.log('Trade Output: ', state.tradeOutput)
  }, [state.tradeInput, state.tradeOutput])

  return (
    <SlideTransition>
      <div>
        <small>invocation: {state.invocationId}</small>
      </div>
      <div>
        <small>status: {state?.invocation?.state}</small>
      </div>
      <div>
        <small>walletIn: {state.walletInput.name} connected: {state.walletInput.isConnected}</small>
      </div>
      <div>
        <small>walletOut: {state.walletOutput.name} connected: {state.walletOutput.isConnected}</small>
      </div>
      <div>
        <small>sellAsset: {getValues('sellAsset.currency.symbol')} amount: {getValues('sellAsset.amount')}</small>
      </div>
      <div>
        <small>buyAsset: {getValues('buyAsset.currency.symbol')} amount: {getValues('buyAsset.amount')}</small>
      </div>
      {/*<Button*/}
      {/*    size='lg'*/}
      {/*    width='full'*/}
      {/*    colorScheme='green'*/}
      {/*    onClick={() => onClear()}*/}
      {/*>*/}
      {/*  Clear*/}
      {/*</Button>*/}
      <Button
        // size='lg'
        // width='full'
        colorScheme='yellow'
        onClick={() => onUpdate()}
      >
        update
      </Button>
      <Box as='form' onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.fiatAmount}>
          <Controller
            render={({ field: { value } }) => (
              <NumberFormat
                inputMode='decimal'
                thousandSeparator={localeParts.group}
                decimalSeparator={localeParts.decimal}
                prefix={localeParts.prefix}
                suffix={localeParts.postfix}
                value={value}
                customInput={FiatInput}
                onValueChange={onTextChangeFiat}
              />
            )}
            name='fiatAmount'
            control={control}
            rules={{
              validate: {
                validNumber: value => !isNaN(Number(value)) || 'Amount must be a number',
                greaterThanZero: value => Number(value) > 0 || 'Amount must be greater than 0'
              }
            }}
          />
          <Image maxH={10} maxW={20} src={state.walletInput.icon} />
          <FormErrorMessage>{errors.fiatAmount && errors.fiatAmount.message}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <TokenRow
            control={control}
            fieldName='sellAsset.amount'
            rules={{ required: true }}
            inputLeftElement={
              <TokenButton
                onClick={onSelectModalInput}
                logo={state.tradeInput?.image ?? ""}
                symbol={state.tradeInput?.symbol ?? ""}
              />
            }
            inputRightElement={
              <Button
                h='1.75rem'
                size='sm'
                variant='ghost'
                colorScheme='blue'
                onClick={setMaxInput}
              >
                Max
              </Button>
            }
          />
          <small>balance: {getValues('sellAsset.currency.symbol')}: {Number(getValues('sellAsset.currency.balance'))?.toFixed(6)} {Number(getValues('sellAsset.currency.valueUsd'))?.toFixed(2)}(USD)</small>
        </FormControl>
        <FormControl
          rounded=''
          my={6}
          pl={6}
          pr={2}
          display='flex'
          alignItems='center'
          justifyContent='space-between'
        >
          <IconButton onClick={switchAssets} aria-label='Switch' isRound icon={<ArrowDownIcon />} />
          <Box display='flex' alignItems='center' color='gray.500'>
            <Text fontSize='sm'>{getValues('sellAsset.currency.priceUsd')}</Text>
            <HelperToolTip label='The price is ' />
          </Box>
        </FormControl>
        <FormControl mb={6}>
          <TokenRow
            control={control}
            fieldName='buyAsset.amount'
            rules={{ required: true }}
            inputLeftElement={
              <TokenButton
                onClick={onSelectModalOutput}
                logo={state.tradeOutput?.image ?? ""}
                symbol={state.tradeOutput?.symbol ?? ""}
              />
            }
          />
          <Image maxH={10} maxW={20} src={state.walletOutput.icon} />
        </FormControl>
        <Button
          type='submit'
          size='lg'
          width='full'
          colorScheme='green'
        // isDisabled={isDirty || !isValid}
        >
          Preview Trade
        </Button>
      </Box>
    </SlideTransition>
  )
}
