import { SwapCurrency } from '@shapeshiftoss/market-service'
import { AnimatePresence } from 'framer-motion'
import { useFormContext } from 'react-hook-form'
import { Navigate, Route, RouteProps, Routes, useNavigate, useLocation } from 'react-router-dom'

import { TradeStatus } from './TradeStatus/TradeStatus'
import { TradeConfirm } from './TradeConfirm/TradeConfirm'
import { TradeInput } from './TradeInput'
import { SelectAsset } from './SelectAsset'

export const entries = ['/send/details', '/send/confirm']

export const TradeRoutes = () => {
  const location = useLocation()
  const history = useNavigate()
  const { setValue } = useFormContext()
  const handleSellClick = (asset: SwapCurrency) => {
    console.log("handleSellClick: ")
    setValue('sellAsset.currency', asset)
    history.push('/trade/input')
  }
  const handleBuyClick = (asset: SwapCurrency) => {
    console.log("handleBuyClick: ")
    setValue('buyAsset.currency', asset)
    history.push('/trade/input')
  }
  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      <Routes location={location} key={location.key}>
        <Route
          path='/trade/select/sell'
          component={(props: RouteProps) => <SelectAsset onClick={handleSellClick} {...props} />}
        />
        <Route
          path='/trade/select/buy'
          component={(props: RouteProps) => <SelectAsset onClick={handleBuyClick} {...props} />}
        />
        <Route path='/trade/input' component={TradeInput} />
        <Route path='/trade/confirm' component={TradeConfirm} />
        <Route path='/trade/status' component={TradeStatus} />
        <Navigate from='/' to='/trade/input' />
      </Routes>
    </AnimatePresence>
  )
}
