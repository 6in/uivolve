import type { RendererProps } from '../types'
import { PanelShell } from './Panel'

/**
 * xtype: 'window' — ダイアログ風ウィンドウ。
 * モックなのでフロートはせず、ルートに置くと viewport 中央に配置される
 * (.sx-viewport:has(> .sx-window) の CSS で実現)。閉じるボタンは見た目のみ。
 */
export function Window({ config }: RendererProps) {
  return (
    <PanelShell
      config={{ ...config, header: true }}
      className="sx-window"
      headerExtra={
        config.closable !== false ? (
          <button type="button" className="sx-window-close" aria-label="閉じる">
            ×
          </button>
        ) : undefined
      }
    />
  )
}
