import { Keyring } from '@shapeshiftoss/hdwallet-core'
import { NativeAdapter } from '@shapeshiftoss/hdwallet-native'
import METAMASK_ICON from 'assets/png/metamask.png'
import KEEPKEY_ICON from 'assets/png/keepkey.png'
import KEPLR_ICON from 'assets/png/keplr.png'
import ONBOARD_ICON from 'assets/png/blocknative.png'
import PIONEER_ICON from 'assets/png/pioneer.png'
import { RouteProps } from 'react-router-dom'

import { Onboard } from './Onboard/Onboard'
import { Pair } from './KeepKey/Pair'

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
  // pioneer: {
  //   icon: PIONEER_ICON,
  //   type: 'multichain',
  //   name: 'Pioneer',
  //   setup: () => {},
  //   routes: [{ path: '/pioneer/pair', component: Pair }]
  // },
  keepkey: {
    icon: KEEPKEY_ICON,
    name: 'KeepKey',
    type: 'hardware',
    setup: () => {},
    routes: [{ path: '/keepkey/pair', component: Pair }]
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
  },
}
