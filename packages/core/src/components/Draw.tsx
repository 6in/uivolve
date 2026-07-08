import type { RendererProps } from '../types'
import { cx, styleOf } from '../utils'

type Sprite = Record<string, unknown>

const n = (v: unknown, fallback = 0): number => {
  const x = Number(v)
  return Number.isFinite(x) ? x : fallback
}
const s = (v: unknown): string | undefined => (v === undefined ? undefined : String(v))

const ANCHOR: Record<string, 'start' | 'middle' | 'end'> = {
  left: 'start',
  center: 'middle',
  right: 'end',
}

function SpriteEl({ sprite }: { sprite: Sprite }) {
  // ExtJS のスプライト属性名 (fillStyle / strokeStyle / lineWidth) を SVG 属性へ読み替える
  const common = {
    fill: s(sprite.fillStyle) ?? 'none',
    stroke: s(sprite.strokeStyle),
    strokeWidth: sprite.lineWidth === undefined ? undefined : n(sprite.lineWidth),
    opacity: sprite.opacity === undefined ? undefined : n(sprite.opacity, 1),
  }
  switch (sprite.type) {
    case 'rect':
      return (
        <rect
          {...common}
          x={n(sprite.x)}
          y={n(sprite.y)}
          width={n(sprite.width)}
          height={n(sprite.height)}
          rx={sprite.radius === undefined ? undefined : n(sprite.radius)}
        />
      )
    case 'circle':
      return <circle {...common} cx={n(sprite.cx)} cy={n(sprite.cy)} r={n(sprite.r)} />
    case 'ellipse':
      return (
        <ellipse {...common} cx={n(sprite.cx)} cy={n(sprite.cy)} rx={n(sprite.rx)} ry={n(sprite.ry)} />
      )
    case 'line':
      return (
        <line
          {...common}
          stroke={s(sprite.strokeStyle) ?? 'var(--sx-text)'}
          x1={n(sprite.fromX)}
          y1={n(sprite.fromY)}
          x2={n(sprite.toX)}
          y2={n(sprite.toY)}
        />
      )
    case 'path':
      return <path {...common} d={s(sprite.path) ?? ''} />
    case 'text':
      return (
        <text
          x={n(sprite.x)}
          y={n(sprite.y)}
          fill={s(sprite.fillStyle) ?? 'var(--sx-text)'}
          fontSize={sprite.fontSize === undefined ? undefined : n(sprite.fontSize)}
          fontWeight={s(sprite.fontWeight)}
          textAnchor={ANCHOR[s(sprite.textAlign) ?? ''] ?? undefined}
        >
          {s(sprite.text)}
        </text>
      )
    default:
      return null
  }
}

/**
 * xtype: 'draw' — SVG 描画サーフェス (Ext.draw.Container 互換のサブセット)。
 * sprites: [{ type, ...属性 }] を SVG に変換して描画する。対応スプライト:
 * rect (x/y/width/height/radius) / circle (cx/cy/r) / ellipse (cx/cy/rx/ry) /
 * line (fromX/fromY/toX/toY) / path (path) / text (x/y/text/fontSize/textAlign)。
 * 共通属性は ExtJS 同名の fillStyle / strokeStyle / lineWidth / opacity。
 * 生の SVG をそのまま埋め込みたい場合は component の html config でも可。
 */
export function Draw({ config }: RendererProps) {
  const sprites: Sprite[] = Array.isArray(config.sprites) ? (config.sprites as Sprite[]) : []
  return (
    <div className={cx('sx-draw', config.cls)} style={styleOf(config)}>
      <svg width="100%" height="100%">
        {sprites.map((sp, i) => (
          <SpriteEl key={i} sprite={sp} />
        ))}
      </svg>
    </div>
  )
}
