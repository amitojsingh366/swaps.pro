import { AssetsIcon } from 'components/Icons/Assets'
import { Layout } from 'components/Layout/Layout'
import { NotFound } from 'pages/NotFound/NotFound'
import { ShapeShift } from 'pages/ShapeShift/ShapeShift'
import { Redirect, Route, Switch } from 'react-router-dom'

import { generateAppRoutes, Route as NestedRoute } from './helpers'

export const routes: Array<NestedRoute> = [
  {
    path: '/shapeshift',
    label: 'navBar.assets',
    main: <ShapeShift />,
    icon: <AssetsIcon color='inherit' />,
    routes: [
      {
        path: '/:network/:address?',
        label: 'Asset Details',
        main: <ShapeShift />
      }
    ]
  }
]

const appRoutes = generateAppRoutes(routes)

export const Routes = () => {
  return (
    <Switch>
      {appRoutes.map((route, index) => {
        return (
          <Route key={index} path={route.path}>
            <Layout route={route} />
          </Route>
        )
      })}
      <Redirect from='/' to='/shapeshift' />
      <Route component={NotFound} />
    </Switch>
  )
}
