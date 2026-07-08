import Editor, { DiffEditor } from '@monaco-editor/react'
import type { RendererProps } from '../types'
import { cx, styleOf } from '../utils'

// 'light' / 'dark' の別名を Monaco のテーマ名に読み替える
const THEME_ALIAS: Record<string, string> = {
  light: 'vs',
  dark: 'vs-dark',
  hc: 'hc-black',
}

/**
 * xtype: 'codeeditor' — ソースコードエディタ (ExtJS にはない独自拡張。Monaco Editor)。
 * value に初期コード (YAML 記法なら value: | が書きやすい)、language に Monaco の言語 ID
 * (javascript / typescript / json / yaml / sql / python / html / css など)、
 * theme に 'light' / 'dark' (または Monaco のテーマ名 vs / vs-dark / hc-black) を指定。
 * readOnly / lineNumbers / minimap / fontSize に対応。編集は非制御 (モックとして自由に触れる)。
 * Monaco 本体は既定では CDN から遅延ロードされる (Playground はローカルバンドル設定済み)。
 */
export function CodeEditor({ config }: RendererProps) {
  const themeRaw = (config.theme as string | undefined) ?? 'light'
  return (
    <div className={cx('sx-codeeditor', config.cls)} style={styleOf(config)}>
      <Editor
        height="100%"
        defaultLanguage={(config.language as string | undefined) ?? 'javascript'}
        defaultValue={(config.value as string | undefined) ?? ''}
        theme={THEME_ALIAS[themeRaw] ?? themeRaw}
        options={{
          readOnly: config.readOnly === true,
          minimap: { enabled: config.minimap === true },
          lineNumbers: config.lineNumbers === false ? 'off' : 'on',
          fontSize: (config.fontSize as number | undefined) ?? 13,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
      />
    </div>
  )
}

/**
 * xtype: 'diffeditor' | 'diff' — 差分表示 (ExtJS にはない独自拡張。Monaco Diff Editor)。
 * original (変更前) と value (変更後) のコードを比較表示する。
 * language / theme は codeeditor と同じ指定方法。sideBySide: false で
 * インライン (unified) 表示になる。readOnly は既定 true (右側も編集させたい場合は false)。
 */
export function DiffView({ config }: RendererProps) {
  const themeRaw = (config.theme as string | undefined) ?? 'light'
  return (
    <div className={cx('sx-codeeditor', 'sx-diffeditor', config.cls)} style={styleOf(config)}>
      <DiffEditor
        height="100%"
        language={(config.language as string | undefined) ?? 'javascript'}
        original={(config.original as string | undefined) ?? ''}
        modified={(config.value as string | undefined) ?? ''}
        theme={THEME_ALIAS[themeRaw] ?? themeRaw}
        options={{
          readOnly: config.readOnly !== false,
          renderSideBySide: config.sideBySide !== false,
          // sideBySide 未指定なら幅が狭いときだけ Monaco 判断でインラインに落とす
          useInlineViewWhenSpaceIsLimited: config.sideBySide === undefined,
          minimap: { enabled: config.minimap === true },
          lineNumbers: config.lineNumbers === false ? 'off' : 'on',
          fontSize: (config.fontSize as number | undefined) ?? 13,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  )
}
