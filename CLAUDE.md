# CLAUDE.md

## プロジェクトの目的

**uivolve** は、ExtJS の画面定義 (宣言的 config) に**互換な DSL** で画面モックを描画する、
ライセンスフリーの React 製ライブラリ。

ワークフロー: **DSL でモックを素早く作成 → その DSL を AI に渡す → 任意の UI ライブラリで本実装**。
Mermaid.js のように Markdown/MDX 内のコードフェンスでモックを埋め込むこともできる (Astro MDX 統合済み)。

UI ライブラリを本気で作るのではなく「モック + AI への仕様引き渡し」が目的。
データ通信や本物の振る舞いは実装しない (見た目 + 折りたたみ/タブ切替/ドラッグ等の軽いインタラクションまで)。

## 構成 (npm workspaces モノレポ)

```
packages/core/          @uivolve/core — DSL パーサー + レンダラー本体
  src/parser.ts           JSON5 / YAML パーサー (detectFormat で自動判別、stringifyDsl で相互変換)
  src/meta.ts             xtype/layout のメタデータ (エディタ補完・JSON Schema 生成の単一ソース。
                          React 非依存の純データのみ — schema スクリプトが strip-types で直接 import)
  src/registry.ts         xtype → React コンポーネントのレジストリ (registerComponent)
  src/XRender.tsx          config 1 つを描画するディスパッチャ (未知の xtype はプレースホルダ)
  src/ExtMockup.tsx        トップレベル API (<ExtMockup code={dsl} />、ErrorBoundary 内蔵)
  src/types.ts             ComponentConfig (ExtJS 互換 config の型)
  src/layouts/index.tsx    レイアウトエンジン + レジストリ (registerLayout)
  src/components/          各 xtype の実装 (Panel, GridPanel, fields, misc など)
  src/styles.css           テーマ (@layer sx、CSS カスタムプロパティ --sx-*)
packages/remark-mock/   ```uivolve フェンスを <ExtMockup/> に変換する remark プラグイン (依存ゼロ)
apps/playground/        エディタ + ライブプレビュー (Vite + Monaco)
  src/monaco-setup.ts     Monaco のローカルバンドル設定 (worker / 診断オフ)
  src/dsl-completion.ts   xtype/layout/プロパティの入力補完とスニペット (meta.ts から生成)
  mdx-playground/         MDX Playground の第 2 エントリ (vite.config.ts のマルチページ設定)
  src/mdx/                MDX Playground 本体 — MDX を貼るとブラウザ内で @mdx-js/mdx の
                          evaluate + remark-mock (injectImport: false) でその場プレビュー。
                          サンプルは mdx-demo の実ファイルを ?raw import して共有
apps/mdx-demo/          Astro + MDX 統合デモ (Markdown 仕様書にモック埋め込み)
reference/components.md      コンポーネント/レイアウトのリファレンス — JSDoc から自動生成。直接編集禁止
reference/extjs-layouts.md   ExtJS 7.9 全レイアウトの調査資料と対応状況
skills/uivolve-mock/         配布用の生成スキル (他プロジェクトで画面仕様書を書く用)。
                             references/ の components.md と dsl.schema.json は
                             npm run docs / schema が自動同期する — 直接編集禁止
.github/workflows/pages.yml  main への push で Playground + MDX デモを GitHub Pages へ自動デプロイ
scripts/gen-component-docs.mjs  reference/components.md の生成スクリプト
scripts/validate-dsl.mjs     DSL / MDX の検証 (構文 + xtype/layout 照合)。npm run validate
scripts/shot-uivolve.mjs     DSL / MDX を Playground に流し込みスクリーンショットを撮る
```

公開 URL: https://6in.github.io/uivolve/ (Playground)、/mdx-playground/ (MDX Playground)、
/mdx/ (MDX デモ)。

## コマンド

```bash
npm run dev         # playground を http://localhost:5173 で起動
npm run build       # tsc --noEmit + vite build (playground 経由で core も検証される)
npm run typecheck   # 型チェックのみ
npm run docs        # JSDoc から reference/components.md を再生成 (スキルの references/ へも同期)
npm run schema      # meta.ts から reference/dsl.schema.json を再生成 (同上)
npm run validate -- <file>  # DSL / MDX の検証 (構文 + 未知 xtype/layout + itemId 警告)
npm run mdx:dev     # MDX デモを http://localhost:4321 で起動
npm run mdx:build   # MDX デモの静的ビルド (remark プラグインの検証を兼ねる)
npm run pages       # Pages 用ビルドをローカル実行 (site/ へ出力。公開は main への push で Actions が自動実行)
```

core はビルド不要 (exports が src/index.ts を直接指す。Vite が処理する)。

## 開発規約

1. **ExtJS 互換を最優先**: xtype 名・config 名は ExtJS 本家 (docs.sencha.com/extjs/7.9.0) に合わせる。
   ExtJS の config をコピペしたら動くのが理想。独自拡張 (例: `grid` レイアウト) は docs に明記する。
   **ライセンス上の原則**: ExtJS のソースコード・CSS・アセットは見ない/コピーしない。
   参照してよいのは公開ドキュメントの API 名・config 名 (= 規約) のみ。ドキュメント本文の
   逐語コピーも不可 (自分の言葉で要約する)。
2. **JSDoc 必須**: 実装関数直前の JSDoc から reference/components.md が自動生成される。
   1 行目は `xtype: 'foo' — 説明` 形式 (レイアウトは `foo: 説明`)。変更後は `npm run docs`。
3. **meta.ts の更新**: xtype / layout を追加したら src/meta.ts にもメタデータ
   (description / defaults / props) を追加し、`npm run schema` を実行する。
   これがエディタ補完とスニペットの供給源。
4. **モダン CSS**: styles.css の `@layer sx` 内にネスト記法で書く。色は `--sx-*` カスタムプロパティ
   経由 (テーマ変更可能に保つ)。color-mix() / subgrid / :has() / Popover API を積極活用。
5. **入力は非制御** (defaultValue / defaultChecked): モックとして触れるようにするため。
6. コンポーネント/レイアウトの追加は **`/add-component` スキル**の手順に従う
   (.claude/skills/add-component/SKILL.md)。実装パターン (PanelShell / FieldRow / Icon / MenuTrigger
   の再利用、高さ連鎖の注意点) もそこに記載。
   画面モック / MDX 仕様書の生成依頼は **`/uivolve-mock` スキル**の手順に従う
   (書き方規約は skills/uivolve-mock/references/dsl-guide.md が単一ソース)。
7. 会話・コミットメッセージは日本語。コミットは `feat(core): ...` / `feat(playground): ...` 形式で
   機能単位にまとめる。

## 検証の流れ

1. `npm run typecheck && npm run build`
2. DSL / MDX 単体の確認は `npm run dev` を起動して
   `node scripts/shot-uivolve.mjs <file> [out.png] [--bottom]` でスクリーンショットを撮り
   **目視確認**する (.yaml/.json5 → Playground、.md/.mdx → MDX Playground に自動で流し込む。
   playwright-core と Chromium は ms-playwright キャッシュから自動検出、
   $PLAYWRIGHT_CORE / $UIVOLVE_CHROME で上書き可)。
   それ以外のページ確認は headless Chromium の自作スクリプトで撮る
   (両 Playground は `window.__uivolve.setCode(code)` フックを公開している)。
3. コンソールエラーがないこと、レイアウト内 (border リージョン / fit / vbox) での伸縮も確認する。

## 実装上の要注意ポイント

- **高さの連鎖**: コンテナを埋めるレイアウトは `block-size: 100%` + 子側の `min-block-size: 0` が必要。
  安易に `.sx-container { block-size: 100% }` のような広い指定を足すと vbox 内の auto 高さが壊れる (前科あり)。
- **オーバーフローとポップアップ**: パネル body は overflow するので、ドロップダウン類は
  Popover API (top layer) で描画する (components/misc.tsx の MenuTrigger 参照)。
- **PanelShell**: タイトルバー付きコンポーネントの共通ガワ。折りたたみは外部制御も可能
  (collapsed / onToggleCollapse — accordion レイアウトが使用)。
- **循環 import**: layouts → components 方向の依存は不可。PanelShell に依存するレイアウトは
  components/ 側に置いて registerLayout する (例: components/Accordion.tsx)。
