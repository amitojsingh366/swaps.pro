import { AssetsIcon } from 'components/Icons/Assets'
import { Earn } from 'components/Icons/Earn'
import { Layout } from 'components/Layout/Layout'
import { NotFound } from 'pages/NotFound/NotFound'
import { Swap } from 'pages/Swap/Swap'
import { User } from 'pages/User/User'
import { Invocation } from 'pages/Invocation/Invocation'
import { RepeatIcon } from '@chakra-ui/icons'
import { Redirect, Route, Switch } from 'react-router-dom'
import { FaWallet, FaCog } from 'react-icons/fa'
//RepeatIcon

import { generateAppRoutes, Route as NestedRoute } from './helpers'
import { TradeStatus } from 'components/Trade/TradeStatus/TradeStatus'
import { Wallet } from 'pages/Wallet/Wallet'
import { Custom } from 'pages/Custom/Custom'

export const routes: Array<NestedRoute> = [
  {
    path: '/dashboard',
    label: 'navBar.dashboard',
    main: <User />,
    icon: <AssetsIcon color='inherit' />
  },
  {
    path: '/wallet',
    label: 'navBar.wallet',
    main: <Wallet />,
    icon: <FaWallet color='inherit' />
  },
  {
    path: '/swap',
    label: 'navBar.swap',
    main: <Swap />,
    icon: <RepeatIcon color='inherit' />
  },
  // {
  //   path: '/custom',
  //   label: 'navBar.custom',
  //   main: <Custom />,
  //   icon: <FaCog color='inherit' />
  // },
  {
    path: '/status/:invocationId',
    label: 'navBar.status',
    main: <TradeStatus />,
    hidden: true
  }
]

const appRoutes = generateAppRoutes(routes)

export const Routes = () => {

  //TODO loading?
  return (
    <Switch>
      {appRoutes.map((route, index) => {
        return (
          <Route key={index} path={route.path}>
            <Layout route={route} />
          </Route>
        )
      })}
      <Redirect from='/' to='/dashboard' />
      <Route component={NotFound} />
    </Switch>
  )
}
