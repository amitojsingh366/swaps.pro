import { AssetsIcon } from 'components/Icons/Assets'
import { Layout } from 'components/Layout/Layout'
import { NotFound } from 'pages/NotFound/NotFound'
import { Swap } from 'pages/Swap/Swap'
import { Redirect, Route, Switch } from 'react-router-dom'

import { generateAppRoutes, Route as NestedRoute } from './helpers'

export const routes: Array<NestedRoute> = [
  {
    path: '/swap',
    label: 'navBar.assets',
    main: <Swap />,
    icon: <AssetsIcon color='inherit' />,
    routes: [
      {
        path: '/:network/:address?',
        label: 'Asset Details',
        main: <Swap />
      }
    ]
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
      <Redirect from='/' to='/swap' />
      <Route component={NotFound} />
    </Switch>
  )
}
