# CLAUDE.md

## プロジェクトの目的

**similar-extjs** は、ExtJS の画面定義 (宣言的 config) に**互換な DSL** で画面モックを描画する、
ライセンスフリーの React 製ライブラリ。

ワークフロー: **DSL でモックを素早く作成 → その DSL を AI に渡す → 任意の UI ライブラリで本実装**。
Mermaid.js のように Markdown/MDX 内のコードフェンスでモックを埋め込むこともできる (Astro MDX 統合済み)。

UI ライブラリを本気で作るのではなく「モック + AI への仕様引き渡し」が目的。
データ通信や本物の振る舞いは実装しない (見た目 + 折りたたみ/タブ切替/ドラッグ等の軽いインタラクションまで)。

## 構成 (npm workspaces モノレポ)

```
packages/core/          @similar-extjs/core — DSL パーサー + レンダラー本体
  src/parser.ts           JSON5 パーサー (ExtJS config をコピペ可能にするため JSON5)
  src/registry.ts         xtype → React コンポーネントのレジストリ (registerComponent)
  src/XRender.tsx          config 1 つを描画するディスパッチャ (未知の xtype はプレースホルダ)
  src/ExtMockup.tsx        トップレベル API (<ExtMockup code={dsl} />、ErrorBoundary 内蔵)
  src/types.ts             ComponentConfig (ExtJS 互換 config の型)
  src/layouts/index.tsx    レイアウトエンジン + レジストリ (registerLayout)
  src/components/          各 xtype の実装 (Panel, GridPanel, fields, misc など)
  src/styles.css           テーマ (@layer sx、CSS カスタムプロパティ --sx-*)
packages/remark-mock/   ```extjs フェンスを <ExtMockup/> に変換する remark プラグイン (依存ゼロ)
apps/playground/        エディタ + ライブプレビュー (Vite + CodeMirror)
apps/mdx-demo/          Astro + MDX 統合デモ (Markdown 仕様書にモック埋め込み)
docs/components.md      コンポーネント/レイアウトのリファレンス — JSDoc から自動生成。直接編集禁止
docs/extjs-layouts.md   ExtJS 7.9 全レイアウトの調査資料と対応状況
scripts/gen-component-docs.mjs  docs/components.md の生成スクリプト
```

## コマンド

```bash
npm run dev         # playground を http://localhost:5173 で起動
npm run build       # tsc --noEmit + vite build (playground 経由で core も検証される)
npm run typecheck   # 型チェックのみ
npm run docs        # JSDoc から docs/components.md を再生成
npm run mdx:dev     # MDX デモを http://localhost:4321 で起動
npm run mdx:build   # MDX デモの静的ビルド (remark プラグインの検証を兼ねる)
```

core はビルド不要 (exports が src/index.ts を直接指す。Vite が処理する)。

## 開発規約

1. **ExtJS 互換を最優先**: xtype 名・config 名は ExtJS 本家 (docs.sencha.com/extjs/7.9.0) に合わせる。
   ExtJS の config をコピペしたら動くのが理想。独自拡張 (例: `grid` レイアウト) は docs に明記する。
2. **JSDoc 必須**: 実装関数直前の JSDoc から docs/components.md が自動生成される。
   1 行目は `xtype: 'foo' — 説明` 形式 (レイアウトは `foo: 説明`)。変更後は `npm run docs`。
3. **モダン CSS**: styles.css の `@layer sx` 内にネスト記法で書く。色は `--sx-*` カスタムプロパティ
   経由 (テーマ変更可能に保つ)。color-mix() / subgrid / :has() / Popover API を積極活用。
4. **入力は非制御** (defaultValue / defaultChecked): モックとして触れるようにするため。
5. コンポーネント/レイアウトの追加は **`/add-component` スキル**の手順に従う
   (.claude/skills/add-component/SKILL.md)。実装パターン (PanelShell / FieldRow / Icon / MenuTrigger
   の再利用、高さ連鎖の注意点) もそこに記載。
6. 会話・コミットメッセージは日本語。コミットは `feat(core): ...` / `feat(playground): ...` 形式で
   機能単位にまとめる。

## 検証の流れ

1. `npm run typecheck && npm run build`
2. dev サーバーに対して headless Chromium でスクリーンショットを撮り**目視確認**する。
   playwright-core は scratchpad に導入済みの想定で、executablePath に
   `~/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-mac-arm64/chrome-headless-shell`
   を指定する (過去の検証スクリプト例が scratchpad の shot*.mjs / *check.mjs にある)。
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
