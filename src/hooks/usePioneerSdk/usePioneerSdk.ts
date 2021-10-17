
import { debounce } from 'lodash'
import { useCallback, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import {useWallet} from "context/WalletProvider/WalletProvider";
// import { TradeAsset, TradeState } from 'components/Trade/Trade'

const debounceTime = 1000

export enum TradeActions {
    BUY = 'BUY',
    SELL = 'SELL'
}


export const Pioneer = () => {
    const { state, dispatch, setRoutePath } = useWallet()
    const { assetContext, balances, tradeOutput } = state
    const {
        setValue,
        getValues,
        formState: { errors, isDirty, isValid }
    } = useFormContext()
    const [quote, trade] = useWatch({ name: ['quote', 'trade'] })
    const [debounceObj, setDebounceObj] = useState<{ cancel: () => void }>()

    const getCryptoQuote = async (
        amount: Pick<any, 'buyAmount' | 'sellAmount'>,
        sellAsset: any,
        buyAsset: any,
        action?: any
    ) => {
        console.log("getFiatQuote: ",{amount,sellAsset,buyAsset,action})
        setValue('quote', 'foobar')
    }

    const getFiatQuote = async (
        fiatAmount: string,
        sellAsset: any,
        buyAsset: any,
        action?: any
    ) => {
        console.log("getFiatQuote: ",{fiatAmount,sellAsset,buyAsset,action})
        setValue('quote', 'foobar')
        // setValue('sellAsset.fiatRate', 'foobar')
        // setValue('buyAsset.fiatRate', 'foobar')
    }

    const setMaxInput = async (
    ) => {
        console.log("HOOK: setMaxInput")
        console.log("onMax called!")
        console.log("balance: ",getValues('sellAsset.currency.balance'))
        let balance = getValues('sellAsset.currency.balance')
        let amount = getValues('sellAsset.balance')
        setValue('sellAsset.amount',balance)
        console.log("amount: ",amount)
        let sellAsset = getValues('sellAsset.currency')
        console.log("sellAsset: ",sellAsset)

        //valueUsd
        let amountUsd = getValues('sellAsset.currency.valueUsd')
        setValue('fiatAmount',amountUsd)
        console.log("amountUsd: ",amountUsd)
        console.log("formState: ",{ errors, isDirty, isValid })
    }

    const selectInput = async (
    ) => {
        console.log("HOOK: selectInput")
    }

    const selectOutput = async (
    ) => {
        console.log("HOOK: selectOutput")
    }

    const switchAssets = async (
    ) => {
        console.log("HOOK: switchAssets")

        const currentSellAsset = getValues('sellAsset')
        const currentBuyAsset = getValues('buyAsset')
        console.log("HOOK: sellAsset: ",currentSellAsset)
        console.log("HOOK: buyAsset",currentBuyAsset)
        setValue('buyAsset', currentSellAsset)
        setValue('sellAsset', currentBuyAsset)

        //TODO get new quote
        // getCryptoQuote(
        //     { sellAmount: currentBuyAsset.amount },
        //     currentBuyAsset,
        //     currentSellAsset,
        //     TradeActions.SELL
        // )
    }


    const update = async (
    ) => {
        console.log("HOOK: update")
        console.log("HOOK: assetContext: ",assetContext)
        if(balances){
          console.log("balances: ",balances)
          let balance = balances.filter((balance:any) => balance.symbol === assetContext)[0]
          console.log("balance: ",balance)
          setValue('sellAsset.currency',balance)
          setValue('sellAsset.amount',balance?.balance)
          setValue('fiatAmount',balance?.valueUsd)
          console.log("amountUsd: ",balance?.valueUsd)

          //output
          let balanceOutput = balances.filter((balance:any) => balance.symbol === tradeOutput)[0]
          console.log("balanceOutput: ",balanceOutput)
          setValue('buyAsset.currency',balanceOutput)
          setValue('buyAsset.currency.image',balanceOutput?.image)
          setValue('buyAsset.currency.symbol',balanceOutput?.symbol)
          setValue('buyAsset.amount',balanceOutput?.balance)
          //setValue('fiatAmount',balanceOutput.valueUsd)
          console.log("amountUsd: output (buy) ",balanceOutput?.valueUsd)


        } else {
          console.log(' cant update, no balances ')
        }
    }

    const reset = () => {
        setValue('buyAsset.amount', '')
        setValue('sellAsset.amount', '')
        setValue('fiatAmount', '')
    }

    return {
        reset,
        getCryptoQuote,
        getFiatQuote,
        setMaxInput,
        selectInput,
        selectOutput,
        switchAssets,
        update
    }
}
