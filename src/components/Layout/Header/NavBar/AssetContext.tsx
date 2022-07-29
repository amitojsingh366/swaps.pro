
import {
    Button,
    FlexProps,
    Image,
    Menu,
    MenuButton,
    MenuGroup,
    MenuItem,
    MenuList,
} from '@chakra-ui/react'
import { InitialState, useWallet } from 'context/WalletProvider/WalletProvider'
import {FC, useEffect} from 'react'

type WalletImageProps = {
    isConnected: Boolean
} & Pick<InitialState, 'walletInfo'>

const WalletImage: React.FC<WalletImageProps> = ({ isConnected, walletInfo }) =>
    isConnected ? (
        <Image
            boxSize='24px'
            loading='lazy'
            objectFit='contain'
            bg='transparent'
            src={walletInfo?.icon}
        />
    ) : null

export const AssetButton: FC<FlexProps> = props => {
    const { state, dispatch, disconnect } = useWallet()
    const { isConnected, walletInfo } = state

    let assetContext

    const onSelect = (type: any, payload:any) => {
        //console.log('onSelect! type: ',type)
        //console.log('onSelect! payload: ',payload)
        // setAssetContext(payload.ASSET)
        assetContext = payload.ASSET
    }

    useEffect(() => {
        //console.log("Use Effect Called! state: ",state)
        // assetContext = pioneer.assetContext
    }, [])

    return !isConnected ? (
        <small></small>
    ) : (
        <Menu >
            <MenuButton
                as={Button}
            >
                {/*{pioneer?.assetContext} {pioneer?.assetBalanceNativeContext} ({parseInt(pioneer?.assetBalanceUsdValueContext)}$)*/}
            </MenuButton>
            <MenuList>
                <MenuGroup title='asset selection'>
                    {/*{Object.keys(pioneer?.balances).map((key)=>(*/}
                    {/*    <MenuItem*/}
                    {/*        onClick={() => onSelect('ASSET_CONTEXT', {ASSET:key})}*/}
                    {/*    >*/}
                    {/*        {key} balance: {pioneer?.balances[key]} {pioneer?.balances[key]?.valueUsd[key]}*/}
                    {/*    </MenuItem>*/}
                    {/*))}*/}
                </MenuGroup>
            </MenuList>
        </Menu>
    )
}
