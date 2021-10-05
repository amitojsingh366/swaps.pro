import { getCoinGeckoAssetData, getCoinGeckoPriceHistory } from 'services/coingecko/coingecko'

export enum HistoryTimeframe {
  HOUR = '1H',
  DAY = '24H',
  WEEK = '1W',
  MONTH = '1M',
  YEAR = '1Y',
  ALL = 'All'
}

export type HistoryData = {
  price: number
  date: string
}

export type AssetData = {
  name: string
  symbol: string
  network: string
  price: string
  marketCap: string
  volume: string
  icon: string
  changePercent24Hr: number
  description?: string
  contractAddress?: string
}

export const getPriceHistory = async (
  network: string,
  timeframe: HistoryTimeframe,
  contractAddress?: string
): Promise<HistoryData[]> => {
  return getCoinGeckoPriceHistory(network, timeframe, contractAddress)
}

export const getAssetData = async (
  network: string,
  contractAddress?: string
): Promise<AssetData | undefined> => {
  return getCoinGeckoAssetData(network, contractAddress)
}
