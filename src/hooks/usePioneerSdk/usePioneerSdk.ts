
import { useCallback, useEffect, useState } from 'react'
import { useWallet } from 'context/WalletProvider/WalletProvider'

type UseBalancesReturnType = {
    balances: any
    error?: Error | unknown
    loading: boolean
}

export const useBalances = (): UseBalancesReturnType => {
    const [error, setError] = useState<Error | unknown>()
    const [loading, setLoading] = useState<boolean>(false)
    const {
        state: { wallet, walletInfo }
    } = useWallet()
    let balances = [
        {
            foo:"bar"
        }
    ]
    const getBalances = useCallback(async () => {
        if (wallet) {
            //register?
            console.log("getBalances: ")
        } else {
            console.log("Missing Wallet ")
        }
    }, [walletInfo])

    useEffect(() => {
        if (wallet) {
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
    }, [walletInfo, getBalances])

    return {
        balances,
        error,
        loading
    }
}
