import { Keyring } from '@shapeshiftoss/hdwallet-core'
import { NativeAdapter } from '@shapeshiftoss/hdwallet-native'
import METAMASK_ICON from 'assets/png/metamask.png'
import KEEPKEY_ICON from 'assets/png/keepkey.png'
import KEPLR_ICON from 'assets/png/keplr.png'
import ONBOARD_ICON from 'assets/png/blocknative.png'
import { RouteProps } from 'react-router-dom'

import { Onboard } from './Onboard/Onboard'
import { Pair } from './KeepKey/Pair'
import { PinModal } from './KeepKey/PinModal'

export interface SupportedWalletInfo {
  adapter?: any
  icon: string
  name: string
  type: string
  note?: string
  support?: any
  supportIcons?: any
  init?: (keyring: Keyring) => NativeAdapter
  setup: () => any
  routes: RouteProps[]
}

export const SUPPORTED_WALLETS: { [key: string]: SupportedWalletInfo } = {
  keepkey: {
    icon: KEEPKEY_ICON,
    name: 'KeepKey',
    type: 'hardware',
    setup: () => {},
    routes: [
        { path: '/keepkey/pin', component: PinModal },
      { path: '/keepkey/pair', component: Pair }]
  },
  onboard: {
    icon: ONBOARD_ICON,
    name: 'Onboard.js',
    type: 'ethvm',
    support: [{icon:METAMASK_ICON,name:'MetaMask'}],
    setup: () => {},
    routes: [{ path: '/onboard/onboard', component: Onboard }]
  },
  kepler: {
    icon: KEPLR_ICON,
    name: 'Keplr',
    type: 'tendermint',
    setup: () => {},
    routes: [{ path: '/onboard/keplr', component: Onboard }]
  }
}
