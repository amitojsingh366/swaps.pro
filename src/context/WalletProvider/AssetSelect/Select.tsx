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
    const { balances, exchangeContext, exchangeInfo, status, selectType, assetContext } = state
    const [sortedAssets, setSortedAssets] = useState<SwapCurrency[]>([])
    const [filteredAssets, setFilteredAssets] = useState<SwapCurrency[]>([])
    const { register, watch } = useForm<{ search: string }>({
        mode: 'onChange',
        defaultValues: {
            search: ''
        }
    })
    const translate = useTranslate()
    let selectOptions:any = []

    const searchString = watch('search')
    const searching = useMemo(() => searchString.length > 0, [searchString])

    const onSelectAsset = function(asset:string){
        console.log("onSelectAsset: ",asset)
        if(selectType === 'input'){
            dispatch({ type: WalletActions.SET_ASSET_CONTEXT, payload:asset })
        }else{
            dispatch({ type: WalletActions.SET_TRADE_OUTPUT, payload:asset })
        }
        dispatch({ type: WalletActions.SET_WALLET_MODAL, payload:false })
    }

    const fetchTokens = useCallback(async () => {
        try {
            selectOptions = balances
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
            <h2>Select an  {selectType} currency</h2>
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
                            {key.symbol} balance: {key.balance}
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
