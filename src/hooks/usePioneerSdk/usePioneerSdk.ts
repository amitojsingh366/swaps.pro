
import { useCallback, useEffect, useState } from 'react'
import { useWallet } from 'context/WalletProvider/WalletProvider'
import { PioneerService } from './Pioneer'

type PioneerReturnType = {
    balances: any
    error?: Error | unknown
    loading: boolean
    onStartSdk: any
}

export const pioneer = (): PioneerReturnType => {
    const [error, setError] = useState<Error | unknown>()
    const [loading, setLoading] = useState<boolean>(true)
    const pioneer = new PioneerService()
    // const {
    //     state: { wallet, walletInfo }
    // } = useWallet()
    let balances = [
        {
            foo:"bar"
        }
    ]
    const getBalances = useCallback(async () => {
        if (true) {
            //register?
            console.log("getBalances: ")
        } else {
            console.log("Missing Wallet ")
        }
    }, [])

    const onStartSdk = useCallback(async () => {
        console.log("SDK onStart")

        let initResult = await pioneer.init()
        setLoading(false)
        console.log("initResult: ",initResult)
        if (initResult && initResult.code) {
            //set code to state
        }


    }, []) //this should only run once on startup

    useEffect(() => {
        if (true) {
            ;(async () => {
                try {
                    setLoading(true)
                    // const initResult = await pioneer.init()
                    // console.log("initResult: ",initResult)
                } catch (error) {
                    setError(error)
                } finally {
                    setLoading(false)
                }
            })()
        }
        // Here we rely on the deviceId vs the wallet class
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onStartSdk])

    return {
        onStartSdk,
        balances,
        error,
        loading
    }
}
