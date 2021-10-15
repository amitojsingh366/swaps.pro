
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
    const [loading, setLoading] = useState<boolean>(false)
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
    }, [])

    useEffect(() => {
        if (true) {
            ;(async () => {
                try {
                    setLoading(true)
                    const balances = await getBalances()

                } catch (error) {
                    setError(error)
                } finally {
                    setLoading(false)
                }
            })()
        }
        // Here we rely on the deviceId vs the wallet class
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getBalances])

    return {
        onStartSdk,
        balances,
        error,
        loading
    }
}
