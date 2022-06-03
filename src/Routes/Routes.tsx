import { AssetsIcon } from 'components/Icons/Assets'
import { Earn } from 'components/Icons/Earn'
import { Layout } from 'components/Layout/Layout'
import { NotFound } from 'pages/NotFound/NotFound'
import { Swap } from 'pages/Swap/Swap'
import { User } from 'pages/User/User'
import { Invocation } from 'pages/Invocation/Invocation'
import { RepeatIcon } from '@chakra-ui/icons'
import { Redirect, Route, Switch } from 'react-router-dom'
//RepeatIcon

import { generateAppRoutes, Route as NestedRoute } from './helpers'

export const routes: Array<NestedRoute> = [
  {
    path: '/user',
    label: 'navBar.assets',
    main: <User />,
    icon: <AssetsIcon color='inherit' />,
    routes: [
      {
        path: '/:network/:address?',
        label: 'User Details',
        main: <User />
      }
    ]
  },
  {
    path: '/swap',
    label: 'navBar.assets',
    main: <Swap />,
    icon: <RepeatIcon color='inherit' />,
    routes: [
      {
        path: '/:network/:address?',
        label: 'Asset Details',
        main: <Swap />
      }
    ]
  },
  // {
  //   path: '/invocation/:invocationId',
  //   label: 'navBar.assets',
  //   main: <Invocation />,
  //   icon: <RepeatIcon color='inherit' />,
  //   routes: [
  //     {
  //       path: '/:network/:address?',
  //       label: 'Asset Details',
  //       main: <Invocation />
  //     }
  //   ]
  // }
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
      <Redirect from='/' to='/user' />
      <Route component={NotFound} />
    </Switch>
  )
}
