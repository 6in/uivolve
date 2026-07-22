import type { ComponentConfig, RendererProps } from '../types'
import { Overlay } from '../overlay'
import { cx } from '../utils'
import { Icon } from './Icon'
import { PanelShell } from './Panel'

// Ext.Msg.OK / OKCANCEL / YESNO / YESNOCANCEL 相当のボタンセット (文字列で指定)
const BUTTON_SETS: Record<string, string[]> = {
  ok: ['OK'],
  okcancel: ['OK', 'キャンセル'],
  yesno: ['はい', 'いいえ'],
  yesnocancel: ['はい', 'いいえ', 'キャンセル'],
}

// Ext.Msg.INFO / QUESTION / WARNING / ERROR 相当のアイコン (文字列で指定)
const ICONS: Record<string, string> = {
  info: 'fa fa-circle-info',
  question: 'fa fa-circle-question',
  warning: 'fa fa-triangle-exclamation',
  error: 'fa fa-circle-xmark',
}

/**
 * xtype: 'messagebox' | 'msgbox' — シンプルダイアログ (Ext.Msg 互換)。
 * alert / confirm / prompt のモックを宣言的に書く。
 * title / message (msg も可) / buttons ('ok' | 'okcancel' | 'yesno' | 'yesnocancel'
 * または任意のラベル配列) / icon ('info' | 'question' | 'warning' | 'error') /
 * prompt: true (入力欄。初期値は value) に対応。
 * どこに置いても画面全体に半透明バックドロップ + 中央のダイアログを重ねて表示する。
 * ボタンは見た目のみ (先頭ボタンが primary)。
 */
export function MessageBox({ config }: RendererProps) {
  const labels =
    typeof config.buttons === 'string'
      ? BUTTON_SETS[config.buttons] ?? [config.buttons]
      : Array.isArray(config.buttons)
        ? config.buttons.map(String)
        : BUTTON_SETS.ok
  const iconCls = ICONS[(config.icon as string) ?? '']
  const message = config.message ?? (config.msg as string | undefined)

  const shell: ComponentConfig = {
    ...config,
    header: true,
    width: config.width ?? 380,
    height: undefined,
    // buttons はこの場でラベルに解釈して bbar に展開済み (PanelShell での二重描画を防ぐ)
    buttons: undefined,
    bbar: [
      '->',
      ...labels.map((text, i) => ({ text, ui: i === 0 ? 'primary' : undefined })),
    ],
  }

  return (
    <Overlay>
      <div className="sx-msgbox-overlay">
        <PanelShell config={shell} className="sx-window sx-msgbox" bodyClassName="sx-msgbox-body">
          {iconCls && (
            <Icon iconCls={iconCls} className={cx('sx-msgbox-icon', `sx-msgbox-${config.icon}`)} />
          )}
          <div className="sx-msgbox-content">
            {message && <div className="sx-msgbox-message">{message}</div>}
            {config.prompt === true && (
              <input
                className="sx-input"
                type="text"
                defaultValue={config.value as string | undefined}
              />
            )}
          </div>
        </PanelShell>
      </div>
    </Overlay>
  )
}
