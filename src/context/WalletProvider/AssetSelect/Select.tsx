import {
    ModalBody,
    ModalHeader,
    Stack,
    Button,
    Image,
    useClipboard,
    ModalCloseButton,
    Input,
    Box, ModalFooter, ModalContent
} from '@chakra-ui/react'
import { useWallet, WalletActions } from 'context/WalletProvider/WalletProvider'
import React, { useCallback, useEffect, useMemo, useState, FC } from 'react'
import { Card } from "../../../components/Card";
import { AssetIcon } from "../../../components/AssetIcon";
import { SwapCurrency } from "@shapeshiftoss/market-service";
import { useForm } from "react-hook-form";
import { useTranslate } from "react-polyglot";
import axios from 'axios';

export const Select: FC<{ liveOnly?: boolean, walletSend?: boolean }> = ({ liveOnly = true, walletSend = false }) => {
    const { state, dispatch } = useWallet()
    const { balances, exchangeContext, exchangeInfo, status, selectType, assetContext } = state
    const [sortedAssets, setSortedAssets] = useState<SwapCurrency[]>([])
    const [filteredAssets, setFilteredAssets] = useState<SwapCurrency[]>([])
    const [liveChains, setLiveChains] = useState<Array<string>>()


    const { register, watch } = useForm<{ search: string }>({
        mode: 'onChange',
        defaultValues: {
            search: ''
        }
    })
    const translate = useTranslate()
    let selectOptions: any = []

    const searchString = watch('search')
    const searching = useMemo(() => searchString.length > 0, [searchString])

    const onSelectAsset = function (asset: string) {
        console.log("onSelectAsset: ", asset)
        if (walletSend) return dispatch({ type: WalletActions.SET_ASSET_CONTEXT, payload: asset })
        if (selectType === 'input') {
            dispatch({ type: WalletActions.SET_ASSET_CONTEXT, payload: asset })
            dispatch({ type: WalletActions.SET_TRADE_INPUT, payload: asset })
            // update()
        } else {
            dispatch({ type: WalletActions.SET_TRADE_OUTPUT, payload: asset })
            // update()
        }
        dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: false })
    }

    const fetchTokens = useCallback(async () => {
        try {
            selectOptions = balances
        } catch (e) {
            console.warn(e)
        }
    }, [])

    // useEffect(() => {
    //     fetchTokens()
    //     axios.get('https://pioneers.dev/api/v1/blockchains').then((resp) => {
    //         setLiveChains(Object.values(resp.data.live))
    //     })
    // }, []) // run only once

    useEffect(() => {
        if (!state.pioneer || !liveOnly) return
        state.pioneer.pioneer.instance.Blockchains().then((chains: any) => {
            setLiveChains(Object.values(chains.data.live))
        })
    }, [state.pioneer])

    //@TODO add search
    // useEffect(() => {
    //     setFilteredAssets(
    //         searching ? filterAssetsBySearchTerm(searchString, sortedAssets) : sortedAssets
    //     )
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [searchString]) // run every time the search is updated

    return (
        <>
            <ModalHeader textAlign='center'>
                <h2>Select an  {selectType} currency</h2>
            </ModalHeader>
            <ModalBody alignItems='center' justifyContent='center'>
                <Card variant='inverted' width='auto' borderRadius='xl'>
                    <Input placeholder="Search name or paste contract" />
                </Card>
                <Box flex={1} height='15em'>
                    {balances?.filter((bal: any) => liveOnly ? liveChains?.includes(bal.blockchain) : true).map((bal: any) => (
                        <div>
                            <button onClick={() => onSelectAsset(bal.symbol)}>
                                <AssetIcon src={bal?.image} boxSize='24px' mr={4} />
                                {bal.symbol} balance: {bal.balance}
                            </button>
                        </div>
                    ))}
                </Box>
            </ModalBody>
            <ModalFooter flexDir='column'>
                <small>Manage Token lists</small>
            </ModalFooter>
        </>
    )
}
