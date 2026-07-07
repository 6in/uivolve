import { useRef, useState } from 'react'
import type { RendererProps } from '../types'
import { cx, styleOf, toCssSize } from '../utils'
import { Icon } from './Icon'

interface EditorCommand {
  // document.execCommand に渡すコマンド名
  cmd: string
  iconCls: string
  title: string
  // createLink など引数が必要なコマンドは実行時に取得する
  promptArg?: string
}

const FORMAT_CMDS: EditorCommand[] = [
  { cmd: 'bold', iconCls: 'fa fa-bold', title: '太字' },
  { cmd: 'italic', iconCls: 'fa fa-italic', title: '斜体' },
  { cmd: 'underline', iconCls: 'fa fa-underline', title: '下線' },
]

const ALIGN_CMDS: EditorCommand[] = [
  { cmd: 'justifyLeft', iconCls: 'fa fa-align-left', title: '左揃え' },
  { cmd: 'justifyCenter', iconCls: 'fa fa-align-center', title: '中央揃え' },
  { cmd: 'justifyRight', iconCls: 'fa fa-align-right', title: '右揃え' },
]

const LIST_CMDS: EditorCommand[] = [
  { cmd: 'insertUnorderedList', iconCls: 'fa fa-list-ul', title: '箇条書き' },
  { cmd: 'insertOrderedList', iconCls: 'fa fa-list-ol', title: '番号付きリスト' },
]

const LINK_CMD: EditorCommand = {
  cmd: 'createLink',
  iconCls: 'fa fa-link',
  title: 'リンクの挿入',
  promptArg: 'リンク先の URL:',
}

function CmdButton({ c, exec }: { c: EditorCommand; exec: (c: EditorCommand) => void }) {
  return (
    <button
      type="button"
      className="sx-htmled-btn"
      title={c.title}
      // フォーカス移動で本文の選択範囲が失われないようにする
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => exec(c)}
    >
      <Icon iconCls={c.iconCls} />
    </button>
  )
}

/**
 * xtype: 'htmleditor' — リッチテキストエディタ。
 * 書式ツールバー + 編集領域 (contentEditable) で構成し、太字・斜体・下線・
 * 文字揃え・リスト・リンク挿入が実際に操作できる。value に初期 HTML を指定。
 * 機能スイッチは ExtJS 互換: enableFormat / enableAlignments / enableLists /
 * enableLinks / enableSourceEdit (すべて既定 true。ソース編集は HTML を直接編集)。
 * enableFont / enableFontSize / enableColors は未対応 (モックでは省略)。
 */
export function HtmlEditor({ config }: RendererProps) {
  const [sourceEdit, setSourceEdit] = useState(false)
  const [html, setHtml] = useState((config.value as string | undefined) ?? '')
  const bodyRef = useRef<HTMLDivElement>(null)

  const exec = (c: EditorCommand) => {
    const arg = c.promptArg ? window.prompt(c.promptArg, 'https://') : undefined
    if (c.promptArg && !arg) return
    bodyRef.current?.focus()
    document.execCommand(c.cmd, false, arg ?? undefined)
  }

  const toggleSource = () => {
    if (!sourceEdit && bodyRef.current) setHtml(bodyRef.current.innerHTML)
    setSourceEdit((s) => !s)
  }

  const groups: EditorCommand[][] = []
  if (config.enableFormat !== false) groups.push(FORMAT_CMDS)
  if (config.enableAlignments !== false) groups.push(ALIGN_CMDS)
  if (config.enableLists !== false) groups.push(LIST_CMDS)
  if (config.enableLinks !== false) groups.push([LINK_CMD])

  return (
    <div className={cx('sx-field', 'sx-htmleditor-field', config.cls)} style={styleOf(config)}>
      {config.fieldLabel !== undefined && (
        <span
          className="sx-field-label"
          style={{ inlineSize: toCssSize(config.labelWidth) ?? 'var(--sx-label-width)' }}
        >
          {config.fieldLabel}
          {config.fieldLabel !== '' && ':'}
        </span>
      )}
      <span className="sx-field-body">
        <div className="sx-htmleditor">
          <div className="sx-htmled-toolbar" role="toolbar">
            {groups.map((cmds, g) => (
              <span key={g} className="sx-htmled-group">
                {g > 0 && <span className="sx-htmled-sep" />}
                {cmds.map((c) => (
                  <CmdButton key={c.cmd} c={c} exec={exec} />
                ))}
              </span>
            ))}
            <span className="sx-tb-fill" />
            {config.enableSourceEdit !== false && (
              <button
                type="button"
                className={cx('sx-htmled-btn', sourceEdit && 'sx-active')}
                title="ソース編集"
                onClick={toggleSource}
              >
                <Icon iconCls="fa fa-code" />
              </button>
            )}
          </div>
          {sourceEdit ? (
            <textarea
              className="sx-htmled-source"
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              disabled={config.disabled}
            />
          ) : (
            <div
              ref={bodyRef}
              className="sx-htmled-body"
              contentEditable={!config.readOnly && !config.disabled}
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      </span>
    </div>
  )
}
