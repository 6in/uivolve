# uivolve Preview (VSCode 拡張)

ExtJS 互換 DSL (uivolve) の画面モックと、` ```uivolve ` フェンス入りの
Markdown / MDX 仕様書を、エディタ横のパネルに**ライブプレビュー**する拡張。

## 機能 (v0.1 — プレビューのみ)

- コマンド **`uivolve: プレビューを開く`** (コマンドパレット、またはエディタ右上の
  プレビューアイコン) で、アクティブなファイルをエディタ横に描画する
- 編集すると 300ms デバウンスでライブ更新される
- 対応ファイル:
  - `.yaml` / `.yml` / `.json5` / `.uivolve` — DSL 1 画面をそのまま描画
  - `.md` / `.mdx` — ドキュメント全体を描画し、` ```uivolve ` フェンスをモック化
    (テーブル等の GFM 対応、frontmatter は無視、HTML コメントは除去)
- 構文エラー中は最後に成功した内容を表示し続け、エラーメッセージを上部に出す

## インストール

```bash
npm install               # リポジトリルートで (初回のみ)
npm run ext:vsix          # apps/vscode-ext/uivolve-vscode.vsix を生成
code --install-extension apps/vscode-ext/uivolve-vscode.vsix
```

## 開発

```bash
npm run ext:build         # dist/ に extension.cjs + webview.js/css を生成
```

VSCode でこのディレクトリを開いて F5 (Run Extension) でも起動できる。
Webview 側は React + `@uivolve/core` + `@mdx-js/mdx` を esbuild で 1 ファイルに
バンドルしており、フォント込みで自己完結 (オフラインで動く)。

## 今後の候補

- xtype / config の入力補完と JSON Schema 連携 (`reference/dsl.schema.json`)
- カーソル位置のフェンスだけを描画するパーシャルプレビュー
- スクリーンショットの書き出し
