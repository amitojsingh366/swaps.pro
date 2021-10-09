
import { FormProvider, useForm } from 'react-hook-form'
import { MemoryRouter, Route, Switch } from 'react-router-dom'

import { entries, TradeRoutes } from './TradeRoutes'
import {useWallet} from "../../context/WalletProvider/WalletProvider";

type TTradeInput = {
  fiatAmount?: string
  sellAsset: {
    currency: any
    amount?: string
  }
  buyAsset: {
    currency: any
    amount?: string
  }
}

export const Trade = () => {
  const { state, username } = useWallet()
  const { code, isConnected, pioneer } = state

  const methods = useForm<TTradeInput>({
    mode: 'onChange',
    defaultValues: {
      fiatAmount: undefined,
      sellAsset: {
        currency: undefined,
        amount: undefined
      },
      buyAsset: {
        currency: undefined,
        amount: undefined
      }
    }
  })
  return (
    <FormProvider {...methods}>
      <MemoryRouter initialEntries={entries}>
        <Switch>
          <Route path='/' component={TradeRoutes} />
        </Switch>
      </MemoryRouter>
    </FormProvider>
  )
}
