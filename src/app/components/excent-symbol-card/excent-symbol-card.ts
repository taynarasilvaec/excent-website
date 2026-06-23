import { Component, computed, input } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { ExcentStaticIcon } from '../excent-static-icon/excent-static-icon'
import { ExcentText } from '../excent-text/excent-text'
import {
  ExcentSymbolCardData,
  ExcentSymbolCardTrend,
  ExcentSymbolCardVariant,
} from './excent-symbol-card.types'

@Component({
  selector: 'excent-symbol-card',
  standalone: true,
  imports: [ExcentStaticIcon, ExcentText, TranslateModule],
  templateUrl: './excent-symbol-card.html',
  styleUrl: './excent-symbol-card.scss',
})
export class ExcentSymbolCard {
  public data = input.required<ExcentSymbolCardData>()
  public variant = input<ExcentSymbolCardVariant>('compact')
  public iconSize = input<number>(40)

  protected readonly trend = computed<ExcentSymbolCardTrend>(
    () => this.data().trend ?? 'flat'
  )

  protected readonly sparklineWidth = 84
  protected readonly sparklineHeight = 28

  private readonly sparklinePoints = computed<{ x: number; y: number }[]>(() => {
    const data = this.data().chartData
    if (!data || data.length < 2) {
      const t = this.trend()
      const fallback =
        t === 'up'
          ? [22, 18, 20, 14, 16, 8, 10, 4]
          : t === 'down'
          ? [6, 9, 5, 14, 12, 18, 17, 22]
          : [14, 12, 15, 13, 14, 12, 14, 13]
      return fallback.map((y, i) => ({ x: i * 12, y }))
    }

    const w = this.sparklineWidth
    const h = this.sparklineHeight
    const padding = 2
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const stepX = (w - padding * 2) / (data.length - 1)

    return data.map((v, i) => ({
      x: padding + i * stepX,
      y: padding + (h - padding * 2) * (1 - (v - min) / range),
    }))
  })

  protected readonly sparklinePath = computed(() =>
    this.smoothPath(this.sparklinePoints())
  )

  protected readonly sparklineAreaPath = computed(() => {
    const points = this.sparklinePoints()
    if (points.length === 0) return ''
    const h = this.sparklineHeight
    const linePath = this.smoothPath(points)
    const lastX = points[points.length - 1].x
    const firstX = points[0].x
    return `${linePath} L${lastX.toFixed(2)} ${h} L${firstX.toFixed(2)} ${h} Z`
  })

  private smoothPath(points: { x: number; y: number }[]): string {
    if (points.length < 2) return ''
    if (points.length === 2) {
      return `M${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)} L${points[1].x.toFixed(2)} ${points[1].y.toFixed(2)}`
    }

    let path = `M${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] ?? points[i]
      const p1 = points[i]
      const p2 = points[i + 1]
      const p3 = points[i + 2] ?? points[i + 1]

      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6

      path += ` C${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
    }
    return path
  }
}
