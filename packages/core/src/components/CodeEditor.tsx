import Editor from '@monaco-editor/react'
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
