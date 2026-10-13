# uivolve Preview (VSCode 拡張)

ExtJS 互換 DSL (uivolve) の画面モックと、` ```uivolve ` フェンス入りの
Markdown / MDX 仕様書を、エディタ横のパネルに**ライブプレビュー**する拡張。

## 機能 (v0.1 — プレビューのみ)

- コマンド **`uivolve: プレビューを開く`** (コマンドパレット、エディタ右上のプレビューアイコン、
  またはショートカット `Ctrl+Shift+V` / `Ctrl+K U`) で、アクティブなファイルをエディタ横に描画する
  (`.md` では `Ctrl+Shift+V` を組み込みの Markdown プレビューに譲るので `Ctrl+K U` を使う)
- 一度開けば、別の対応ファイルに切り替えたときプレビューも追従する
  (設定 `uivolve.preview.followActiveEditor`、既定 on)
- 設定 `uivolve.preview.autoOpen` を on にすると、対応ファイルを開くだけでプレビューが自動で開く
- 編集すると 300ms デバウンスでライブ更新される
- 対応ファイル:
  - `.yaml` / `.yml` / `.json5` / `.uivolve` — DSL 1 画面をそのまま描画
  - `.md` / `.mdx` — ドキュメント全体を描画し、` ```uivolve ` フェンスをモック化
    (テーブル等の GFM 対応、frontmatter は無視、HTML コメントは除去)
  - `<uivolve src="./dsl/foo.yaml" />` の外部 DSL 参照は MDX ファイル相対で読んで展開する
    (参照先をエディタで編集中なら未保存の内容を反映。参照先の変更でも再描画)
  - ` ```mermaid ` フェンスは Mermaid.js でダイアグラム描画 (高さは図に合わせて自動)
- 構文エラー中は最後に成功した内容を表示し続け、エラーメッセージを上部に出す

## インストール

[GitHub Releases](https://github.com/6in/uivolve/releases) の `uivolve-vscode-<version>.vsix` をダウンロードして:

```bash
code --install-extension uivolve-vscode-<version>.vsix
```

(VSCode の拡張ビュー右上の「…」→「VSIX からのインストール」でも可)

ソースからビルドする場合:

```bash
npm install               # リポジトリルートで (初回のみ)
npm run ext:vsix          # apps/vscode-ext/uivolve-vscode.vsix を生成
code --install-extension apps/vscode-ext/uivolve-vscode.vsix
```

## リリース (メンテナ向け)

`package.json` の `version` を上げてコミットし、同じバージョンのタグを push する:

```bash
git tag vscode-ext-v0.2.0 && git push origin vscode-ext-v0.2.0
```

`.github/workflows/release-vscode-ext.yml` が VSIX をビルドし、Release `vscode-ext-v0.2.0` に
`uivolve-vscode-0.2.0.vsix` を添付する (タグと version が不一致なら失敗する)。
手元で同じファイルを作るには `npm -w apps/vscode-ext run vsix:release`。

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
