import { debounce } from 'lodash'
import { useCallback, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import {useWallet, WalletActions} from "context/WalletProvider/WalletProvider";
// import { TradeAsset, TradeState } from 'components/Trade/Trade'

const debounceTime = 1000

export enum TradeActions {
    BUY = 'BUY',
    SELL = 'SELL'
}


export const Pioneer = () => {
    const { state, dispatch, WalletActions, setRoutePath } = useWallet()
    const { assetContext, balances, tradeOutput, status, pioneer } = state
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
        update()
    }

    //selectExchange
    const selectExchange = async (exchange:string) => {
        console.log("HOOK: selectExchange: ",exchange)
    }

    const selectInput = async (asset:string) => {
        console.log("HOOK: selectInput: ",asset)
    }

    const selectOutput = async (asset:string) => {
        console.log("HOOK: selectOutput: ",asset)
    }

    const updateAmountInNative = async (value:any) => {
        console.log("HOOK: updateAmountInNative value: ",value)
        // setValue('sellAsset.amount',value)
        update()
        //update amount Out fiat
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

        update()
    }


    const update = async (
    ) => {

        console.log("HOOK: update")
        console.log("HOOK: assetContext: ",assetContext)

        // status
        const currentSellAsset = getValues('sellAsset')
        const currentBuyAsset = getValues('buyAsset')
        console.log("HOOK: currentSellAsset",currentSellAsset)
        console.log("HOOK: currentBuyAsset",currentBuyAsset)

        let symbolIn = currentSellAsset?.currency?.symbol
        let symbolOut = currentBuyAsset?.currency?.symbol

        let blockchainIn = currentSellAsset?.currency?.blockchain
        let blockchainOut = currentBuyAsset?.currency?.blockchain

        //output
        let balanceOutput = balances.filter((balance:any) => balance.symbol === tradeOutput)[0]
        console.log("balanceOutput: ",balanceOutput)
        setValue('buyAsset.currency',balanceOutput)
        setValue('buyAsset.currency.image',balanceOutput?.image)
        setValue('buyAsset.currency.symbol',balanceOutput?.symbol)
        //setValue('fiatAmount',balanceOutput.valueUsd)
        console.log("amountUsd: output (buy) ",balanceOutput?.valueUsd)
        // if(tradeOutput){
        //     //output
        //     let balanceOutput = balances.filter((balance:any) => balance.symbol === tradeOutput)[0]
        //     console.log("balanceOutput: ",balanceOutput)
        //     setValue('buyAsset.currency',balanceOutput)
        //     setValue('buyAsset.currency.image',balanceOutput?.image)
        //     setValue('buyAsset.currency.symbol',balanceOutput?.symbol)
        //     //setValue('fiatAmount',balanceOutput.valueUsd)
        //     console.log("amountUsd: output (buy) ",balanceOutput?.valueUsd)
        // } else {
        //     console.log(' cant update tradeOutput, no tradeOutput ')
        // }

        if(balances){
          if(!currentSellAsset.amount){
              console.log("balances: ",balances)
              let balance = balances.filter((balance:any) => balance.symbol === assetContext)[0]
              console.log("balance: ",balance)
              setValue('sellAsset.currency',balance)
              setValue('sellAsset.amount',balance?.balance - 0.002)
              setValue('sellAsset.currency.image',balance?.image)
              setValue('fiatAmount',1)
              console.log("amountUsd: ",balance?.valueUsd)
          }
        } else {
          console.log(' cant update, no balances ')
        }

        //if input wallet connected
        if(state.walletInput && !state.walletInput.isConnected){
            setValue('isDirty',true)
        }

        if(status){
            console.log("** STATUS: ",status)
            if(!state.invocationId){
                if(symbolIn && symbolOut && blockchainIn && blockchainOut){
                    //build quote
                    let swap:any = {
                        input:{
                            blockchain:blockchainIn,
                            asset:symbolIn,
                        },
                        output:{
                            blockchain:blockchainOut,
                            asset:symbolOut,
                        },
                        amount:currentSellAsset.amount,
                        noBroadcast:true
                    }
                    console.log("HOOK: swap",swap)
                    //TODO
                    console.log("pioneer: ",pioneer)
                    if(pioneer) {
                        let quote = await pioneer.swapQuote(swap)

                        //Set outAmount
                        setValue('buyAsset.amount',quote.amountOut)

                        //set invocationId
                        //SET_INVOCATION_ID
                        dispatch({ type: 'SET_INVOCATION_ID', payload:quote.invocationId })
                        setValue('invocationContext',quote.invocationId)
                        setValue('invocationId',quote.invocationId)

                        let invocation = await state.pioneer.getInvocation(quote.invocationId)
                        dispatch({ type: 'SET_INVOCATION', payload: invocation })

                        console.log("quote.amountOut: ",quote.amountOut)
                        console.log("quote.invocationId: ",quote.invocationId)
                        setValue('buyAsset.amount',quote.amountOut)
                    } else {
                        console.log("Pioneer not set into state!")
                    }
                } else {
                    console.log(' cant update, missing params! ',
                        {symbolIn,symbolOut,blockchainIn,blockchainOut}
                    )
                }
            } else {
                //TODO if edited values then create new?
                setValue('invocationId',state.invocationId)

                let invocation = await state.pioneer.getInvocation(state.invocationId)
                dispatch({ type: 'SET_INVOCATION', payload: invocation })
                console.log("invocation: ",invocation)

                let amountOut = invocation?.invocation?.route?.result?.outputAmount
                console.log("amountOut: ",amountOut)
                setValue('buyAsset.amount',amountOut)

                //swap
                let swapRead = invocation?.invocation?.swap
                console.log("swapRead: ",swapRead)

                //let currencyOut
                let currencyOut = swapRead.output.asset

                //@TODO get from status block (can receive asset with no balance)
                // let currencyInfo = status.tokens.filter((balance:any) => balance.symbol === currencyOut)[0]
                // console.log("currencyInfo: ",currencyInfo)

                //output
                let balanceOutput = balances.filter((balance:any) => balance.symbol === currencyOut)[0]
                console.log("balanceOutput: ",balanceOutput)

                //balanceOutput
                setValue('buyAsset.currency',balanceOutput)
                setValue('buyAsset.currency.image',balanceOutput?.image)
                setValue('buyAsset.currency.symbol',balanceOutput?.symbol)
            }
        } else {
            console.log(' cant update, no market status ')
        }

    }

    const reset = () => {
        setValue('buyAsset.amount', '')
        setValue('sellAsset.amount', '')
        setValue('fiatAmount', '')
    }

    return {
        reset,
        updateAmountInNative,
        getCryptoQuote,
        getFiatQuote,
        setMaxInput,
        selectInput,
        selectOutput,
        switchAssets,
        update,
        selectExchange
    }
}
