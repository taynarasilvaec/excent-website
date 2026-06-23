import { ExcentStaticIconShape, ExcentStaticIconType } from '../excent-static-icon/excent-static-icon.types'

export type ExcentSymbolCardVariant = 'compact' | 'detailed'

export type ExcentSymbolCardTrend = 'up' | 'down' | 'flat'

export interface ExcentSymbolCardData {
  iconName?: string
  iconSrc?: string
  iconType?: ExcentStaticIconType
  iconShape?: ExcentStaticIconShape
  symbol: string
  category?: string
  value?: string
  change?: string
  trend?: ExcentSymbolCardTrend
  chartData?: number[]
}
