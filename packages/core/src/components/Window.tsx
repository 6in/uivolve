import type { RendererProps } from '../types'
import { Overlay } from '../overlay'
import { PanelShell } from './Panel'

/**
 * xtype: 'window' — ダイアログ風ウィンドウ。
 * モックなのでフロートはせず、ルートに置くと viewport 中央に配置される
 * (.sx-viewport:has(> .sx-window) の CSS で実現)。閉じるボタンは見た目のみ。
 * modal: true を指定するとツリー内のどこに置いても半透明バックドロップ +
 * 中央表示のオーバーレイになる (一覧画面 + 編集ダイアログを 1 つの DSL で表現できる)。
 */
export function Window({ config }: RendererProps) {
  const shell = (
    <PanelShell
      config={{ ...config, header: true, ...(config.modal === true ? { height: undefined } : undefined) }}
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
  if (config.modal === true) {
    return (
      <Overlay>
        <div className="sx-msgbox-overlay">{shell}</div>
      </Overlay>
    )
  }
  return shell
}
