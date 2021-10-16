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
import NumberFormat from 'react-number-format'
import { RouterProps } from 'react-router-dom'
import {useWallet, WalletActions} from "../../context/WalletProvider/WalletProvider";
import { useModal } from 'context/ModalProvider/ModalProvider'
import {SUPPORTED_WALLETS} from "../../context/WalletProvider/config";
import {useState} from "react";

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
  const { status } = state
  const { open } = useModal()

  const {
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
    history.push('/AssetSelect/Select')
  }

  const onMax = () => {
    console.log("onMax called!")
    console.log("balance: ",getValues('sellAsset.currency.balance'))
    let balance = getValues('sellAsset.currency.balance')
    let amount = getValues('sellAsset.balance')
    setValue('sellAsset.amount',balance)
    console.log("amount: ",amount)
    let sellAsset = getValues('sellAsset.currency')
    console.log("sellAsset: ",sellAsset)
    //sellAsset.currency.balance

  }

  const onSelectModalInput = () => {
    //Open Select modal.
    console.log("onSelectModal called!")
    //open('select')
    setRoutePath('/AssetSelect/Select')
    dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })
    //dispatch({ type: WalletActions.SET_SELECT_MODAL, payload: true })
  }

  const onSelectModalOutput = () => {
    //Open Select modal.
    console.log("onSelectModalOutput called!")
    dispatch({ type: WalletActions.SET_SELECT_MODAL, payload: true })
  }

  return (
    <SlideTransition>
      <Box as='form' onSubmit={handleSubmit(onSubmit)}>
        <div>
          {/*<h5>Thorchain Status: </h5>*/}
          {/*{status.map((key:any)=>(*/}
          {/*    <div>*/}
          {/*      {key.blockchain} status: {key.online.toString()}*/}
          {/*    </div>*/}
          {/*))}*/}
        </div>
        <FormControl isInvalid={!!errors.fiatAmount}>
          <Controller
            render={({ field: { onChange, value } }) => (
              <NumberFormat
                inputMode='decimal'
                thousandSeparator={localeParts.group}
                decimalSeparator={localeParts.decimal}
                prefix={localeParts.prefix}
                suffix={localeParts.postfix}
                value={value}
                customInput={FiatInput}
                onValueChange={e => onChange(e.value)}
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
                onClick={onMax}
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
          <IconButton aria-label='Switch' isRound icon={<ArrowDownIcon />} />
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
                onClick={() => history.push('/trade/select/buy')}
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
          isDisabled={!isDirty || !isValid}
        >
          Preview Trade
        </Button>
      </Box>
    </SlideTransition>
  )
}
