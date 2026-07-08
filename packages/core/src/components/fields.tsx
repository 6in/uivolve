import type { ReactNode } from 'react'
import type { ComponentConfig, RendererProps } from '../types'
import { cx, styleOf, toCssSize } from '../utils'

// ---------------------------------------------------------------- 共通

/** fieldLabel 付きフィールドの共通レイアウト。allowBlank: false で必須マーク (*) を表示 */
function FieldRow({ config, children }: { config: ComponentConfig; children: ReactNode }) {
  return (
    <label className={cx('sx-field', config.cls)} style={styleOf(config)}>
      {config.fieldLabel !== undefined && (
        <span
          className="sx-field-label"
          style={{ inlineSize: toCssSize(config.labelWidth) ?? 'var(--sx-label-width)' }}
        >
          {config.fieldLabel}
          {config.allowBlank === false && (
            <span className="sx-field-required" title="必須">
              *
            </span>
          )}
          {config.fieldLabel !== '' && ':'}
        </span>
      )}
      <span className="sx-field-body">{children}</span>
    </label>
  )
}

// vtype (ExtJS の入力種別バリデーション) → HTML の type / pattern への対応
const VTYPES: Record<string, { type?: string; pattern?: string }> = {
  email: { type: 'email' },
  url: { type: 'url' },
  alpha: { pattern: '[a-zA-Z_]+' },
  alphanum: { pattern: '[a-zA-Z0-9_]+' },
}

interface Option {
  value: string
  text: string
}

/** options 配列 / store.data の両形式から選択肢を取り出す */
function optionsOf(config: ComponentConfig): Option[] {
  if (Array.isArray(config.options)) {
    return config.options.map((o) =>
      typeof o === 'object' && o !== null
        ? { value: String(o.value), text: o.text }
        : { value: String(o), text: String(o) },
    )
  }
  const data = Array.isArray(config.store)
    ? config.store
    : config.store?.data ?? config.data ?? []
  const display = (config.displayField as string | undefined) ?? 'text'
  const valueField = (config.valueField as string | undefined) ?? 'value'
  return data.map((row) => {
    const text = String(row[display] ?? row[valueField] ?? Object.values(row)[0] ?? '')
    return { value: String(row[valueField] ?? text), text }
  })
}

// ---------------------------------------------------------------- 各フィールド

/**
 * xtype: 'textfield' | 'numberfield' | 'datefield' — 1 行テキスト入力。
 * numberfield は数値入力 (minValue / maxValue)、datefield は日付ピッカーになる。
 * fieldLabel / value / emptyText / readOnly / disabled / inputType に対応。
 * バリデーション仕様の宣言 (ExtJS 互換): allowBlank: false (必須。ラベルに * 表示)、
 * maxLength / minLength、regex (HTML の pattern として適用)、
 * vtype ('email' | 'url' | 'alpha' | 'alphanum')。
 * ブラウザネイティブ検証にマップされ、違反入力は赤枠になる (モック上の軽い動作)。
 */
export function TextField({ config }: RendererProps) {
  const vtype = VTYPES[(config.vtype as string | undefined) ?? '']
  const isNumber = config.xtype === 'numberfield'
  const inputType = isNumber
    ? 'number'
    : config.xtype === 'datefield'
      ? 'date'
      : vtype?.type ?? (config.inputType as string | undefined) ?? 'text'
  return (
    <FieldRow config={config}>
      <input
        className="sx-input"
        type={inputType}
        defaultValue={config.value as string | number | undefined}
        placeholder={config.emptyText}
        readOnly={config.readOnly}
        disabled={config.disabled}
        required={config.allowBlank === false}
        maxLength={config.maxLength}
        minLength={config.minLength}
        min={isNumber ? config.minValue : undefined}
        max={isNumber ? config.maxValue : undefined}
        pattern={(config.regex as string | undefined) ?? vtype?.pattern}
      />
    </FieldRow>
  )
}

/**
 * xtype: 'textarea' | 'textareafield' — 複数行テキスト入力。rows で行数を指定。
 * allowBlank: false (必須) / maxLength / minLength のバリデーション宣言に対応。
 */
export function TextArea({ config }: RendererProps) {
  return (
    <FieldRow config={config}>
      <textarea
        className="sx-input sx-textarea"
        rows={(config.rows as number | undefined) ?? 4}
        defaultValue={config.value as string | undefined}
        placeholder={config.emptyText}
        readOnly={config.readOnly}
        disabled={config.disabled}
        required={config.allowBlank === false}
        maxLength={config.maxLength}
        minLength={config.minLength}
      />
    </FieldRow>
  )
}

/**
 * xtype: 'checkbox' | 'checkboxfield' | 'radio' | 'radiofield' — 単体のチェックボックス / ラジオボタン。
 * boxLabel / checked / name(ラジオのグループ化)に対応。
 */
export function CheckItem({ config }: RendererProps) {
  const isRadio = config.xtype === 'radio' || config.xtype === 'radiofield'
  return (
    <FieldRow config={config}>
      <span className="sx-checkitem">
        <input
          type={isRadio ? 'radio' : 'checkbox'}
          name={config.name}
          defaultChecked={config.checked}
          disabled={config.disabled}
        />
        {config.boxLabel && <span className="sx-boxlabel">{config.boxLabel}</span>}
      </span>
    </FieldRow>
  )
}

/**
 * xtype: 'combobox' | 'combo' — ドロップダウン選択。options 配列または store.data から選択肢を生成。
 * allowBlank: false で必須 (ラベルに * 表示)。
 */
export function ComboBox({ config }: RendererProps) {
  const options = optionsOf(config)
  return (
    <FieldRow config={config}>
      <select
        className="sx-input sx-select"
        defaultValue={config.value !== undefined ? String(config.value) : undefined}
        disabled={config.disabled}
        required={config.allowBlank === false}
      >
        {config.emptyText && <option value="">{config.emptyText}</option>}
        {options.map((o, i) => (
          <option key={i} value={o.value}>
            {o.text}
          </option>
        ))}
      </select>
    </FieldRow>
  )
}

/** xtype: 'listbox' | 'multiselect' — リストボックス。multiSelect で複数選択、size で表示行数を指定。 */
export function ListBox({ config }: RendererProps) {
  const options = optionsOf(config)
  const multiple = config.xtype === 'multiselect' ? config.multiSelect !== false : !!config.multiSelect
  const defaultValue = config.value === undefined
    ? undefined
    : multiple
      ? (Array.isArray(config.value) ? config.value.map(String) : [String(config.value)])
      : String(config.value)
  return (
    <FieldRow config={config}>
      <select
        className="sx-input sx-listbox"
        multiple={multiple}
        size={(config.size as number | undefined) ?? 5}
        defaultValue={defaultValue}
        disabled={config.disabled}
      >
        {options.map((o, i) => (
          <option key={i} value={o.value}>
            {o.text}
          </option>
        ))}
      </select>
    </FieldRow>
  )
}

/** xtype: 'displayfield' | 'label' — 静的テキスト表示。value / text / html のいずれかを描画。 */
export function DisplayField({ config }: RendererProps) {
  return (
    <FieldRow config={config}>
      <span className="sx-displayfield">
        {(config.value as string | undefined) ?? config.text ?? config.html}
      </span>
    </FieldRow>
  )
}
