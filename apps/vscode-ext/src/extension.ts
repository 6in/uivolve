/**
 * uivolve Preview — VSCode 拡張のエントリポイント (extension host 側)。
 *
 * アクティブエディタの uivolve DSL (.yaml / .json5 / .uivolve) または
 * Markdown / MDX 仕様書を Webview パネルにライブプレビューする。
 * 描画は dist/webview.js (React + @uivolve/core + @mdx-js/mdx のバンドル) が行い、
 * こちらはドキュメントの内容を postMessage で送るだけ。
 */
import * as path from 'node:path'
import * as vscode from 'vscode'

type PreviewMode = 'dsl' | 'mdx'

const MDX_LANGS = new Set(['markdown', 'mdx'])

function modeFor(doc: vscode.TextDocument): PreviewMode {
  return MDX_LANGS.has(doc.languageId) || /\.(md|mdx|markdown)$/i.test(doc.fileName)
    ? 'mdx'
    : 'dsl'
}

export function activate(context: vscode.ExtensionContext) {
  let panel: vscode.WebviewPanel | undefined
  let tracked: vscode.TextDocument | undefined
  let timer: ReturnType<typeof setTimeout> | undefined

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

  const showPreview = () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      void vscode.window.showWarningMessage(
        'uivolve: プレビューする DSL / Markdown ファイルを開いてから実行してください',
      )
      return
    }
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
    // Webview 側の準備完了 (ready) を待ってから初回の内容を送る
    panel.webview.onDidReceiveMessage((msg: { type?: string }) => {
      if (msg?.type === 'ready' && tracked) post(tracked)
    })
  }

  context.subscriptions.push(
    vscode.commands.registerCommand('uivolve.showPreview', showPreview),
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (!panel || !tracked || e.document.uri.toString() !== tracked.uri.toString()) return
      tracked = e.document
      clearTimeout(timer)
      timer = setTimeout(() => tracked && post(tracked), 300)
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
