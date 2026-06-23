import { ExcentSymbolCardData } from '../../../components/excent-symbol-card/excent-symbol-card.types'

export interface BlogAuthor {
  name: string
  avatar: string
}

export interface BlogPost {
  id: string
  category: string
  date: string
  title: string
  description: string
  image?: string
  author: BlogAuthor
  url: string
  isLatest?: boolean
}

export interface TopMover extends ExcentSymbolCardData {
  iconName: string
  ticker: string
}

export interface KLineData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

export interface LiveTick {
  price: number
  timestamp: number
}

export type OfficeKey = 'mexico' | 'brazil'

export interface OfficeData {
  ceoName: string
  photo: string
  image: string
  labelKey: string
  descriptionKey: string
}

export interface Review {
  id: string
  initials: string
  name: string
  rating: number
  content: string
  date: string
  verifyUrl: string
}

export interface TrustpilotData {
  score: number
}

export type StarType = 'filled' | 'half' | 'empty'
