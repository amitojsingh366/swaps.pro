import { CopyIcon, ViewIcon } from '@chakra-ui/icons'
import {
    Box,
    Button,
    Circle,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useColorModeValue
} from '@chakra-ui/react'
import { Card } from 'components/Card'
import { QRCode } from 'components/QRCode/QRCode'
import { RawText, Text } from 'components/Text'
import { useModal } from 'context/ModalProvider/ModalProvider'
import { useTranslate } from 'react-polyglot'
import {useWallet, WalletActions} from "../../../context/WalletProvider/WalletProvider";
import { AssetList } from './AssetList'
import {useCallback, useEffect, useMemo, useState} from "react";
import sortBy from "lodash/sortBy";
import {SwapCurrency} from "@shapeshiftoss/market-service";
import {useForm} from "react-hook-form";
import {filterAssetsBySearchTerm} from "./helpers/filterAssetsBySearchTerm/filterAssetsBySearchTerm";
import {AssetIcon} from "../../AssetIcon";

export const Select = () => {
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
    const modal = useModal()

    const searchString = watch('search')
    const searching = useMemo(() => searchString.length > 0, [searchString])

    const onSelectAsset = function(asset:string){
        console.log("onSelectAsset: ",asset)
        dispatch({ type: WalletActions.SET_ASSET_CONTEXT, asset })
        //close modal
        modal.close('select')
    }

    const fetchTokens = useCallback(async () => {
        try {
            let data:any = {}
            console.log("FINAL BALANCES: ",balances)
            data.tokens = balances
            // const sorted = sortBy(data?.tokens, ['name', 'symbol'])
            console.log("exchangeInfo.assets: ",exchangeInfo.assets)
            const sorted = balances.filter((entry: { symbol: any }) => exchangeInfo.assets.indexOf(entry.symbol) > -1);
            console.log("sorted: ",exchangeInfo.assets)
            setSortedAssets(sorted)
        } catch (e) {
            console.warn(e)
        }
    }, [])

    useEffect(() => {
        fetchTokens()
    }, []) // run only once

    useEffect(() => {
        setFilteredAssets(
            searching ? filterAssetsBySearchTerm(searchString, sortedAssets) : sortedAssets
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchString]) // run every time the search is updated

    return (
        <Modal isOpen={modal.select} onClose={() => modal.close('select')} isCentered>
            <ModalOverlay />
            <ModalContent>
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
            </ModalContent>
        </Modal>
    )
}