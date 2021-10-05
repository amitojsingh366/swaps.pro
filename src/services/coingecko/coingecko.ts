import axios from 'axios'
import dayjs from 'dayjs'
import { AssetData, HistoryTimeframe } from 'lib/assets/getAssetData'

const baseUrl = 'https://api.coingecko.com/api/v3'
// TODO:
// tons more parms here: https://www.coingecko.com/en/api/documentation
type CoinGeckoAssetData = {
  id: string
  symbol: string
  name: string
  localization: { [key: string]: string }
  description: { [key: string]: string }
  image: {
    thumb: string
    small: string
    large: string
  }
  market_data: {
    current_price: { [key: string]: string }
    market_cap: { [key: string]: string }
    total_volume: { [key: string]: string }
    high_24h: { [key: string]: string }
    low_24h: { [key: string]: string }
    total_supply: string
    max_supply: string
    price_change_percentage_24h: number
  }
}

export const getCoinGeckoAssetData = async (
  network: string,
  contractAddress?: string
): Promise<AssetData | undefined> => {
  try {
    const isToken = !!contractAddress
    const contractUrl = isToken ? `contract/${contractAddress}` : ''

    const { data }: { data: CoinGeckoAssetData } = await axios.get(
      `${baseUrl}/coins/${network}/${contractUrl}`
    )

    // TODO: get correct localizations
    const currency = 'usd'
    const marketData = data?.market_data
    return {
      price: marketData?.current_price?.[currency],
      symbol: data?.symbol,
      name: data?.name,
      description: data?.description?.en,
      marketCap: marketData?.market_cap?.[currency],
      changePercent24Hr: marketData?.price_change_percentage_24h,
      icon: data?.image?.large,
      volume: marketData?.total_volume?.[currency],
      network,
      contractAddress
    }
  } catch (e) {
    console.warn(e)
    Promise.reject(e)
  }
}

export const getCoinGeckoPriceHistory = async (
  network: string,
  timeframe: HistoryTimeframe,
  contractAddress?: string
) => {
  const end = dayjs().startOf('minute')
  let start
  switch (timeframe) {
    case HistoryTimeframe.HOUR:
      start = end.subtract(1, 'hour')
      break
    case HistoryTimeframe.DAY:
      start = end.subtract(1, 'day')
      break
    case HistoryTimeframe.WEEK:
      start = end.subtract(1, 'week')
      break
    case HistoryTimeframe.MONTH:
      start = end.subtract(1, 'month')
      break
    case HistoryTimeframe.YEAR:
      start = end.subtract(1, 'year')
      break
    default:
      start = end.subtract(20, 'years')
  }
  // TODO: change vs_currency to localized currency
  try {
    const from = start.valueOf() / 1000
    const to = end.valueOf() / 1000
    const contract = contractAddress ? `contract/${contractAddress}` : ''
    const url = `${baseUrl}/coins/${network}/${contract}`
    const { data } = await axios.get(
      `${url}/market_chart/range?id=${network}&vs_currency=usd&from=${from}&to=${to}`
    )
    return data?.prices?.map((data: any) => {
      return {
        date: new Date(data[0]),
        price: data[1]
      }
    })
  } catch (e) {
    console.warn(e)
    Promise.reject(e)
    return []
  }
}
