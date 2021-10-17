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
import {useWallet, WalletActions} from 'context/WalletProvider/WalletProvider'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {Card} from "../../../components/Card";
import {AssetIcon} from "../../../components/AssetIcon";
import {SwapCurrency} from "@shapeshiftoss/market-service";
import {useForm} from "react-hook-form";
import {useTranslate} from "react-polyglot";

export const Select = ({ }: any) => {
    const { state, dispatch } = useWallet()
    const { balances, exchangeContext, exchangeInfo, status } = state
    const [sortedAssets, setSortedAssets] = useState<SwapCurrency[]>([])
    const [filteredAssets, setFilteredAssets] = useState<SwapCurrency[]>([])
    const { register, watch } = useForm<{ search: string }>({
        mode: 'onChange',
        defaultValues: {
            search: ''
        }
    })
    const translate = useTranslate()

    const searchString = watch('search')
    const searching = useMemo(() => searchString.length > 0, [searchString])

    const onSelectAsset = function(asset:string){
        console.log("onSelectAsset: ",asset)
        dispatch({ type: WalletActions.SET_ASSET_CONTEXT, payload:asset })
        dispatch({ type: WalletActions.SET_WALLET_MODAL, payload:false })
        // //close modal
        // modal.close('select')
    }

    const fetchTokens = useCallback(async () => {
        try {
            let data:any = {}
            console.log("FINAL BALANCES: ",balances)
            data.tokens = balances
            // const sorted = sortBy(data?.tokens, ['name', 'symbol'])
            console.log("exchangeInfo.assets: ",exchangeInfo?.assets)
            const sorted = balances?.filter((entry: { symbol: any }) => exchangeInfo?.assets.indexOf(entry?.symbol) > -1);
            console.log("sorted: ",exchangeInfo?.assets)
            setSortedAssets(sorted)
        } catch (e) {
            console.warn(e)
        }
    }, [])

    useEffect(() => {
        fetchTokens()
    }, []) // run only once

    // useEffect(() => {
    //     setFilteredAssets(
    //         searching ? filterAssetsBySearchTerm(searchString, sortedAssets) : sortedAssets
    //     )
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [searchString]) // run every time the search is updated

  return (
    <>
        <ModalHeader textAlign='center'>
            <h2>Select an  </h2>
            <small>exchange: {exchangeContext}</small>
            <small>exchangeInfo: {JSON.stringify(exchangeInfo)}</small>
            <small>status: {JSON.stringify(status)}</small>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody alignItems='center' justifyContent='center'>
            <Card variant='inverted' width='auto' borderRadius='xl'>
                <Input placeholder="Search name or paste contract" />
            </Card>
            <Box flex={1}>
                {balances?.map((key:any)=>(
                    <div>
                        <button onClick={() => onSelectAsset(key.symbol)}>
                            <AssetIcon src={key?.image} boxSize='24px' mr={4} />
                            {key.symbol} status: {key.balance}
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
