// import { useToast } from '@chakra-ui/react'
// import { useModal } from 'context/ModalProvider/ModalProvider'
import { AnimatePresence } from 'framer-motion'
import { FormProvider, useForm } from 'react-hook-form'
import {
  Navigate,
  Route,
  RouteComponentProps,
  Routes,
  useNavigate,
  useLocation
} from 'react-router-dom'

import { Confirm } from './Confirm'
import { Details } from './Details'
import {useWallet} from "../../../context/WalletProvider/WalletProvider";

// @TODO Determine if we should use symbol for display purposes or some other identifier for display
type SendInput = {
  address: string
  asset: string
  fee: string
  crypto: {
    amount: string
    symbol: string
  }
  fiat: {
    amount: string
    symbol: string
  }
}

export const Form = () => {
  const location = useLocation()
  const history = useNavigate()
  // const toast = useToast()
  // const modal = useModal()

  const methods = useForm<SendInput>({
    mode: 'onChange',
    defaultValues: {
      address: '',
      fee: 'Average',
      crypto: {
        amount: '',
        symbol: 'BTC' // @TODO wire up to state
      },
      fiat: {
        amount: '',
        symbol: 'USD' // @TODO wire up to state
      }
    }
  })

  const handleClick = () => {
    console.log("Clicked input asset! input: ")
    history.push('/send/details')
  }

  const handleSubmit = async (data: any) => {
    console.info("submited data: ",data)

    //wait for signed on pioneer

    //wait for confirmation

    // modal.close('send')
    // toast({
    //   title: 'Bitcoin Sent.',
    //   description: 'You have successfully sent 0.005 BTC',
    //   status: 'success',
    //   duration: 9000,
    //   isClosable: true,
    //   position: 'top-right'
    // })
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <AnimatePresence exitBeforeEnter initial={false}>
          <Routes location={location} key={location.key}>
            <Route
              path='/send/select'
              component={(props: RouteComponentProps) => (
                  <div>selected asset: assetContext*</div>
              )}
            />
            <Route path='/send/details' component={Details} />
            <Route path='/send/confirm' component={Confirm} />
            <Navigate exact from='/' to='/send/select' />
          </Routes>
        </AnimatePresence>
      </form>
    </FormProvider>
  )
}
