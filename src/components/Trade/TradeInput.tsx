import { ArrowDownIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  IconButton,
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
import {useWallet, WalletActions} from "context/WalletProvider/WalletProvider";
import {useEffect} from "react";

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
  const { state, dispatch, setRoutePath } = useWallet()
  const { assetContext, balances, tradeOutput, exchangeContext } = state
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

  const onSelectModalInput = () => {
    //Open Select modal.
    console.log("onSelectModal called!")
    //open('select')
    setRoutePath('/AssetSelect/Select')
    dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })
    dispatch({ type: WalletActions.SET_SELECT_MODAL_TYPE, payload: 'input' })
    //set balance input

  }

  const onTextChangeFiat = () => {
    //Open Select modal.
    console.log("onTextChangeFiat called! (Fiat input)")
  }

  const onSelectModalOutput = () => {
    //Open Select modal.
    console.log("onSelectModalOutput called!")
    setRoutePath('/AssetSelect/Select')
    dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })
    dispatch({ type: WalletActions.SET_SELECT_MODAL_TYPE, payload: 'output' })
  }

  useEffect(() => {
    update()
  }, [balances, assetContext, tradeOutput]) // we explicitly only want this to happen once

  return (
    <SlideTransition>
      <Box as='form' onSubmit={handleSubmit(onSubmit)}>
        <div>
          protocal: {exchangeContext}
        </div>
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
                logo={getValues('sellAsset.currency.image')}
                symbol={getValues('sellAsset.currency.symbol')}
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
                logo={getValues('buyAsset.currency.image')}
                symbol={getValues('buyAsset.currency.symbol')}
              />
            }
          />
        </FormControl>
        <Button
          type='submit'
          size='lg'
          width='full'
          colorScheme='green'
          // isDisabled={!isDirty || !isValid}
        >
          Preview Trade
        </Button>
      </Box>
    </SlideTransition>
  )
}
