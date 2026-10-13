/**
 * uivolve Preview — VSCode 拡張のエントリポイント (extension host 側)。
 *
 * アクティブエディタの uivolve DSL (.yaml / .json5 / .uivolve) または
 * Markdown / MDX 仕様書を Webview パネルにライブプレビューする。
 * 描画は dist/webview.js (React + @uivolve/core + @mdx-js/mdx のバンドル) が行い、
 * こちらはドキュメントの内容を postMessage で送る。加えて MDX 内の
 * <uivolve src="./dsl/foo.yaml"> (外部 DSL 参照) は Webview がファイルを読めないので、
 * readFile 要求を受けて MDX ファイル相対で解決して返す (参照先の変更も再描画に反映)。
 */
import * as path from 'node:path'
import * as vscode from 'vscode'

type PreviewMode = 'dsl' | 'mdx'

const MDX_LANGS = new Set(['markdown', 'mdx'])
const SUPPORTED_EXT = /\.(md|mdx|markdown|yaml|yml|json5|uivolve)$/i

function modeFor(doc: vscode.TextDocument): PreviewMode {
  return MDX_LANGS.has(doc.languageId) || /\.(md|mdx|markdown)$/i.test(doc.fileName)
    ? 'mdx'
    : 'dsl'
}

/** プレビュー対象にできるドキュメントか (エディタ以外の output / git などは除外) */
function isPreviewable(doc: vscode.TextDocument): boolean {
  return (
    (doc.uri.scheme === 'file' || doc.uri.scheme === 'untitled') &&
    (MDX_LANGS.has(doc.languageId) || SUPPORTED_EXT.test(doc.fileName))
  )
}

function setting<T>(key: string, fallback: T): T {
  return vscode.workspace.getConfiguration('uivolve.preview').get<T>(key, fallback)
}

export function activate(context: vscode.ExtensionContext) {
  let panel: vscode.WebviewPanel | undefined
  let tracked: vscode.TextDocument | undefined
  let timer: ReturnType<typeof setTimeout> | undefined
  // 直前のプレビューが <uivolve src> で参照したファイル (変更を検知して再描画する)
  const referenced = new Set<string>()

  const post = (doc: vscode.TextDocument) => {
    if (!panel) return
    panel.title = `uivolve: ${path.basename(doc.fileName)}`
    void panel.webview.postMessage({
      type: 'update',
      mode: modeFor(doc),
      code: doc.getText(),
      fileName: path.basename(doc.fileName),
    })
  }

  const schedule = () => {
    clearTimeout(timer)
    timer = setTimeout(() => tracked && post(tracked), 300)
  }

  /**
   * Webview からの <uivolve src> 読み込み要求。http(s) は fetch、それ以外は
   * プレビュー中の MDX ファイル相対で解決する。エディタで開いていれば未保存の内容を返す
   */
  const readSrc = async (src: string): Promise<string> => {
    if (/^https?:\/\//.test(src)) {
      const res = await fetch(src)
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
      return res.text()
    }
    if (!tracked) throw new Error('プレビュー対象のドキュメントがありません')
    if (tracked.uri.scheme === 'untitled') {
      throw new Error('未保存のファイルからは相対パスを解決できません (先に保存してください)')
    }
    const uri = path.isAbsolute(src)
      ? vscode.Uri.file(src)
      : vscode.Uri.joinPath(tracked.uri, '..', src)
    referenced.add(uri.toString())
    const open = vscode.workspace.textDocuments.find((d) => d.uri.toString() === uri.toString())
    if (open) return open.getText()
    return new TextDecoder().decode(await vscode.workspace.fs.readFile(uri))
  }

  const showPreview = () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      void vscode.window.showWarningMessage(
        'uivolve: プレビューする DSL / Markdown ファイルを開いてから実行してください',
      )
      return
    }
    if (tracked?.uri.toString() !== editor.document.uri.toString()) referenced.clear()
    tracked = editor.document

    if (panel) {
      panel.reveal(undefined, true)
      post(tracked)
      return
    }

    panel = vscode.window.createWebviewPanel(
      'uivolvePreview',
      'uivolve プレビュー',
      { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'dist')],
      },
    )
    panel.webview.html = buildHtml(panel.webview, context.extensionUri)
    panel.onDidDispose(() => {
      panel = undefined
    })
    // Webview 側の準備完了 (ready) を待ってから初回の内容を送る。
    // readFile は <uivolve src> の参照先を読んで返す (id で要求と応答を対応付ける)
    panel.webview.onDidReceiveMessage(
      async (msg: { type?: string; id?: number; src?: string }) => {
        if (msg?.type === 'ready' && tracked) post(tracked)
        if (msg?.type === 'readFile' && typeof msg.src === 'string') {
          const reply: Record<string, unknown> = { type: 'readFileResult', id: msg.id }
          try {
            reply.text = await readSrc(msg.src)
          } catch (e) {
            reply.error = e instanceof Error ? e.message : String(e)
          }
          void panel?.webview.postMessage(reply)
        }
      },
    )
  }

  // 参照先 DSL がエディタ外 (git checkout や別ツール) で変わった場合の再描画用
  const watcher = vscode.workspace.createFileSystemWatcher('**/*.{yaml,yml,json5,json,uivolve}')
  watcher.onDidChange((uri) => {
    if (panel && referenced.has(uri.toString())) schedule()
  })

  context.subscriptions.push(
    watcher,
    vscode.commands.registerCommand('uivolve.showPreview', showPreview),
    // 対応ファイルに切り替えたらプレビューを追従させる (設定 followActiveEditor)。
    // プレビューが未表示でも autoOpen が有効なら自動で開く
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (!editor || !isPreviewable(editor.document)) return
      if (panel) {
        if (!setting('followActiveEditor', true)) return
        if (tracked?.uri.toString() === editor.document.uri.toString()) return
        referenced.clear()
        tracked = editor.document
        post(tracked)
      } else if (setting('autoOpen', false)) {
        showPreview()
      }
    }),
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (!panel || !tracked) return
      const uri = e.document.uri.toString()
      const isTracked = uri === tracked.uri.toString()
      if (!isTracked && !referenced.has(uri)) return
      if (isTracked) tracked = e.document
      schedule()
    }),
    vscode.workspace.onDidCloseTextDocument((doc) => {
      if (tracked && doc.uri.toString() === tracked.uri.toString()) tracked = undefined
    }),
  )
}

function buildHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist/webview.js'))
  const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist/webview.css'))
  const nonce = Array.from({ length: 32 }, () =>
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(
      Math.floor(Math.random() * 62),
    ),
  ).join('')
  // 'unsafe-eval' は MDX のブラウザ内コンパイル (@mdx-js/mdx の evaluate) に必要
  const csp = [
    "default-src 'none'",
    `img-src ${webview.cspSource} data:`,
    `style-src ${webview.cspSource} 'unsafe-inline'`,
    `font-src ${webview.cspSource} data:`,
    `script-src 'nonce-${nonce}' 'unsafe-eval'`,
  ].join('; ')

  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="${csp}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="${styleUri}" />
  </head>
  <body>
    <div id="root"></div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
  </body>
</html>`
}

export function deactivate() {}
