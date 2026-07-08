# uivolve

ExtJS の画面定義(宣言的 config)に**互換な DSL** で画面モックを描画する、React 製のモックアップライブラリ(POC)。

ExtJS の優れた画面定義スタイルはそのままに、ライセンスフリーで「画面モックを素早く作る → その DSL を AI に渡して任意の UI ライブラリで本実装してもらう」というワークフローを実現することを目的とする。

> **免責事項**: 本プロジェクトは Sencha / Idera とは無関係の独立したプロジェクトであり、
> Ext JS のソースコード・CSS・画像等のアセットを一切含まない。公開ドキュメントを参照して
> config 名などの**規約 (インターフェース) に互換な独自実装**を行ったもの。
> "Ext JS" および "Sencha" は Sencha Inc. (Idera, Inc.) の商標である。

## クイックスタート

```bash
npm install
npm run dev   # Playground (エディタ + ライブプレビュー) が http://localhost:5173 で起動
```

左ペインの DSL を編集すると右ペインのモックが即座に更新される。「AI 用にコピー」ボタンで、AI に実装を依頼するためのプロンプト + **使用コンポーネントのリファレンス** (画面で使っている xtype / layout の説明と主要 config、`itemId` / `handler` の読み方) 付きで DSL をコピーできる。独自拡張の xtype でも AI が意味を取れる。

エディタは Monaco (VS Code と同じエンジン) で、**入力補完**に対応:

- `xtype: ` / `layout: ` の値位置 → 候補一覧 (説明付き)
- オブジェクトのキー位置 → 囲んでいる xtype に応じた config 名の補完
- xtype 名を入力 → **基本プロパティ入りテンプレートを挿入** (Tab で入力箇所を移動)
- 構文エラーはエディタ上に赤線 + ステータスバーに位置付きで表示

## プロジェクト構成

```
packages/core/        — @uivolve/core: DSL パーサー + レンダラー (React)
packages/remark-mock/ — @uivolve/remark-mock: ```uivolve フェンスをモック描画する remark プラグイン
apps/playground/      — エディタ + ビューア (Vite)
apps/mdx-demo/        — Astro + MDX 統合デモ (Markdown 仕様書にモックを埋め込む)
reference/            — リファレンス (components.md は JSDoc から自動生成)
scripts/              — reference 生成スクリプト
.github/workflows/    — GitHub Pages への自動デプロイ (pages.yml)
.claude/skills/       — 開発ワークフロースキル (add-component)
```

## GitHub Pages (オンラインデモ)

main に push すると GitHub Actions (.github/workflows/pages.yml) が自動でビルド・デプロイする。

- **Playground**: https://6in.github.io/uivolve/
- **MDX デモ (画面仕様書の例)**: https://6in.github.io/uivolve/mdx/

```bash
npm run pages   # ローカルで同じビルドを実行 (site/ に出力、gitignore 対象)
```

## ドキュメント

- **[コンポーネント / レイアウト リファレンス](reference/components.md)** — ソースの JSDoc から `npm run docs` で自動生成
- [ExtJS レイアウト一覧と対応状況](reference/extjs-layouts.md)

コンポーネントの追加手順は Claude Code スキル **`/add-component`** にまとまっている
(`.claude/skills/add-component/SKILL.md`)。

## DSL の書き方

**JSON5** と **YAML** の 2 記法に対応し、先頭の文字から自動判別される。

- **JSON5**: ExtJS の config をほぼそのままコピーできる(クォートなしキー / シングルクォート / 末尾カンマ / コメント OK)。ExtJS 互換・AI 引き渡しの正準形式
- **YAML**: 括弧・カンマ不要で手書きしやすい。Playground の「YAML へ変換 / JSON5 へ変換」ボタンで相互変換できる(コメントは保持されない)

```yaml
# YAML 記法の例
xtype: panel
title: 問い合わせフォーム
items:
  - xtype: textfield
    fieldLabel: 件名
  - xtype: textarea
    fieldLabel: 内容
```

```json5
{
  xtype: 'panel',
  title: 'ユーザー登録',
  layout: 'border',
  items: [
    {
      region: 'north',
      xtype: 'toolbar',
      items: [{ text: '保存', ui: 'primary' }, '-', { text: 'キャンセル' }, '->', 'ステータス: 編集中'],
    },
    {
      region: 'center',
      xtype: 'form',
      items: [
        { xtype: 'textfield', fieldLabel: '氏名' },
        { xtype: 'checkbox', boxLabel: '有効' },
      ],
    },
  ],
}
```

### 対応レイアウト (`layout`)

| type | 説明 |
|---|---|
| `border` | north / south / east / west / center の 5 領域。`region` / west・east の `width` に対応。`split: true` でスプリットバーが付き、ドラッグでリージョンをリサイズ可能 |
| `fit` | 最初の子をコンテナ全面に拡大 |
| `grid` | CSS Grid ベースの独自レイアウト。`{ type: 'grid', columns: 3, gap: 12 }`、子の `colspan` / `rowspan` 対応 (`table` も同じエンジン) |
| `hbox` / `vbox` | Flexbox。`align` / `pack`、子の `flex` に対応 |
| `card` | activeItem の 1 枚だけを表示 (tabpanel の基盤) |
| `accordion` | 縦積みで一度に 1 つだけ展開 |
| `center` | 単一の子を中央配置 |
| `column` | `columnWidth`(0〜1 の割合)/ 固定 `width` の横並び・折り返し |
| `absolute` | 子の `x` / `y` による絶対位置指定 |
| `auto` / `anchor` / `form` | 縦フロー(デフォルト) |

ExtJS の全レイアウト一覧と対応状況は [reference/extjs-layouts.md](reference/extjs-layouts.md) を参照。

### 対応コンポーネント (`xtype`)

| xtype | 説明 |
|---|---|
| `panel` / `form` | タイトルバー、`collapsible` / `collapsed`(折りたたみ・展開)、`tbar` / `bbar`、`bodyPadding`、`html` |
| `container` / `fieldcontainer` | ヘッダーなしの汎用コンテナ |
| `toolbar` | ショートハンド対応: `'->'`(右寄せ) / `'-'`(区切り) / 文字列(ラベル)。items の defaultType は button |
| `button` | `text` / `ui: 'primary'` / `disabled` / `iconCls` / `menu`(ドロップダウン) |
| `textfield` / `numberfield` / `datefield` | `fieldLabel` / `value` / `emptyText` / `readOnly` |
| `textarea` | 上記 + `rows` |
| `checkbox` / `radio` | `boxLabel` / `checked` / `name` |
| `combobox` | ドロップダウン。`options` または `store.data` |
| `listbox` / `multiselect` | リストボックス。`multiSelect` / `size` |
| `grid` / `gridpanel` | データグリッド。`columns`(`text` / `dataIndex` / `width` / `flex` / `align`)+ `store.data`。行選択・ストライプ表示 |
| `image` | `src` / `alt`。src 省略時はプレースホルダ表示 |
| `displayfield` / `label` | 静的テキスト |
| `component` / `box` | `html` / `text` をそのまま描画 |
| `tabpanel` | タブ切替。`activeTab` / タブの `closable`(見た目) |
| `fieldset` | グループ枠。`title` / `collapsible` / `checkboxToggle` |
| `window` | ダイアログ。ルートに置くとモーダル風に中央表示。`closable` |
| `treepanel` / `tree` | 階層ツリー。`root.children` のノード(`text` / `leaf` / `expanded` / `children`)、展開・折りたたみ可。`columns`(`treecolumn` が階層列)指定で**ツリーグリッド** |
| `menu` | メニューリスト。button / splitbutton の `menu` config で Popover API によるドロップダウン表示 |
| `splitbutton` | 本体と矢印部が分かれたボタン |
| `progressbar` | 進捗バー。`value`(0〜1)/ `text` |
| `slider` / `sliderfield` | スライダー。`value` / `minValue` / `maxValue` / `increment` |
| `datepicker` | インラインカレンダー。`value` / `showToday` / `todayText`、月移動・日付選択可 |
| `radiogroup` / `checkboxgroup` | `boxLabel` 付き項目を `columns` 列に並べる |
| `htmleditor` | リッチテキストエディタ。太字・斜体・下線・文字揃え・リスト・リンク・ソース編集が操作可。`enableFormat` 等の機能スイッチ対応 |
| `pagingtoolbar` | ページングツールバー。`total` / `pageSize` / `displayInfo` / `displayMsg`。グリッドの `bbar: { xtype: 'pagingtoolbar', ... }` で使用 |
| `uxiframe` / `iframe` | インラインフレーム (Ext.ux.IFrame 互換)。`src` の URL を埋め込み表示 |
| `markdown` | Markdown 描画 (**独自拡張**、ExtJS にはない)。`value` に Markdown テキスト。仕様メモや説明文の埋め込みに |
| `chatpanel` / `chat` | チャット画面 (**独自拡張**)。`messages: [{ from, name, text, time }]` の会話バルーン表示。`from: 'user'` は右寄せ、`text` は Markdown 描画、`typing` で入力中表示 |
| `chart` / `cartesian` / `polar` | 簡易チャート (SVG 自前描画)。`series: [{ type: 'bar'\|'line'\|'area'\|'pie', xField, yField }]` + `store.data`。`yField` 配列で複数系列 + 凡例。最初の series のみ・`axes` は無視 |
| `draw` | SVG 描画サーフェス (Ext.draw.Container 互換サブセット)。`sprites: [{ type: 'rect'\|'circle'\|'ellipse'\|'line'\|'path'\|'text', fillStyle, strokeStyle, ... }]` |
| `messagebox` / `msgbox` | シンプルダイアログ (Ext.Msg 互換)。`message` / `buttons: 'ok'\|'okcancel'\|'yesno'\|'yesnocancel'` / `icon: 'info'\|'question'\|'warning'\|'error'` / `prompt`。どこに置いてもバックドロップ + 中央表示 |
| `toast` | トースト通知 (Ext.toast 互換)。`html` / `message` / `title` / `align: 'tr'\|'tl'\|'br'\|'bl'\|'t'\|'b'`。プレビュー隅に重ねて表示、× で消せる |
| `mermaid` | Mermaid.js ダイアグラム (**独自拡張**)。`value` に Mermaid 記法 (YAML の `value: \|` が書きやすい)。mermaid 本体は初回描画時に動的ロード |
| `gitgraph` | Git マージツリー (**独自拡張**)。`branches` + `commits: [{ id, branch, parents, message, tag }]` を gitk 風にレーン + マージ曲線 + メッセージ一覧で描画 |
| `networkgraph` / `forcegraph` | ノード・エッジグラフ (**独自拡張**)。`nodes: [{ id, text, group, r }]` + `edges: [{ from, to }]` を d3-force で自動レイアウト。group 自動配色、ノードはドラッグ可 |
| `terminal` / `console` | コンソールログ風アニメーション (**独自拡張**)。`lines` を `speed` ms 間隔 (±ランダム揺らぎ) でサイクリックに流す。`$`/`✓`/`✗`/`⚠` 自動ハイライト、macOS 風ウィンドウバー |
| `video` | 動画プレイヤー (Ext.Video 互換)。`url` / `posterUrl` / `loop` / `muted` / `autoplay` / `controls` |
| `codeeditor` / `code` | ソースコードエディタ (**独自拡張**、Monaco Editor)。`language` (Monaco の言語 ID) / `theme: 'light'\|'dark'` / `readOnly` / `lineNumbers` / `minimap` / `fontSize`。Monaco 本体は CDN から遅延ロード (ローカルバンドルは `loader.config` で設定可) |
| `diffeditor` / `diff` | 差分表示 (**独自拡張**、Monaco Diff Editor)。`original` (変更前) ⇔ `value` (変更後) を比較。`sideBySide: false` でインライン表示。`language` / `theme` は codeeditor と同じ |

共通 config: `width` / `height` / `flex` / `margin` / `padding` / `hidden` / `disabled` / `style` / `cls`

### イベントの宣言 (`handler` / `listeners`)

イベントは**宣言のみ**対応 (モックでは実行されない):

```json5
{ xtype: 'button', itemId: 'btnSave', text: '保存', handler: 'onSaveClick' }
{ xtype: 'grid', itemId: 'orderGrid', listeners: { select: 'onOrderSelect' }, /* ... */ }
```

ハンドラは**参照名 (文字列)** で書く。AI へ実装を引き渡すときに「どの操作で何が起きるか」の
動線情報として使う (ボタンでは `handler: ...` がツールチップに表示される)。
ExtJS の function リテラルは JSON5 として解析できないため、コピペ時は文字列参照に書き換えること。

### アイコン (`iconCls`) — Font Awesome 対応

button / splitbutton / menu / panel タイトル / tabpanel のタブで `iconCls` に Font Awesome のクラスを指定できる。ExtJS の `'x-fa fa-plus'` 形式はそのまま `fa` に読み替えられるため ExtJS の config をコピペ可能。

```json5
{ xtype: 'button', text: '新規作成', iconCls: 'x-fa fa-plus' }   // ExtJS 形式
{ xtype: 'button', text: '保存', iconCls: 'fa-solid fa-floppy-disk' } // FA 標準形式
```

Font Awesome の CSS はホストアプリ側で読み込む(Playground には同梱済み):

```ts
import '@fortawesome/fontawesome-free/css/all.min.css'
```

### テーマ

`neptune`(既定)/ `classic` / `gray` / `dark` の 4 テーマを同梱。
テーマは CSS カスタムプロパティ(`--sx-*`)の上書きだけで実現しているので、独自テーマも
`.sx-root.sx-theme-mytheme { --sx-accent: ...; }` を定義して `theme="mytheme"` で使える。

- Playground: ツールバーの「テーマ」セレクタで切替
- React: `<ExtMockup theme="dark" ... />`
- MDX: フェンスの meta で ` ```uivolve height=380 theme=dark `

## ライブラリとしての利用

```tsx
import { ExtMockup } from '@uivolve/core'
import '@uivolve/core/styles.css'

<ExtMockup code={dslSource} height={480} theme="dark" />
// または <ExtMockup config={parsedConfig} />
```

### 拡張ポイント

xtype・レイアウトはどちらもレジストリ方式で、後から追加・上書きできる:

```tsx
import { registerComponent, registerLayout } from '@uivolve/core'

registerComponent('tabpanel', MyTabPanel)
registerLayout('accordion', MyAccordionLayout)
```

## Markdown / MDX 統合 (Astro)

Mermaid.js と同じ感覚で、Markdown 内のコードフェンスに DSL を書くとその場にモックが描画される。
「画面仕様書 (Markdown) とモック定義 (DSL) を同一ソースで管理し、そのまま AI に渡す」という
このプロジェクトの本命ユースケース。

### デモの起動

```bash
npm run mdx:dev     # デモサイト (画面仕様書の例) を http://localhost:4321 で起動
npm run mdx:build   # 静的ビルド (apps/mdx-demo/dist/ に出力)
```

Playground (5173) とはポートが別なので同時起動できる。
デモの実体は `apps/mdx-demo/src/pages/index.mdx`。編集すればホットリロードで反映される。

### 書き方

MDX ファイル内に ` ```uivolve ` のコードフェンスで DSL を書くだけ
(言語名は `extjs` / `sx` もエイリアスとして使える)。
import は remark プラグインが自動注入するので不要。

````mdx
---
layout: ../layouts/DocLayout.astro
title: ○○画面 仕様書
---

# ○○画面 仕様書

ここは普通の Markdown。見出し・表・リストが書ける。

```uivolve height=420
{
  xtype: 'panel',
  title: '受注管理システム',
  layout: 'border',
  items: [ ... ],
}
```
````

フェンスの meta (言語名の後ろ) にオプションを指定できる:

| meta | 説明 |
|---|---|
| `height=420` | 表示領域の高さ (数値は px、`height=60vh` など CSS 長さも可)。省略時 360px |
| `theme=dark` | テーマ (`neptune` / `classic` / `gray` / `dark`) |

例: ` ```uivolve height=380 theme=dark `

フェンスではなく React コンポーネントとして直接使うこともできる (props で細かく制御したい場合):

```mdx
import { ExtMockup } from '@uivolve/core'

<ExtMockup client:load height={300} theme="gray" code={`{ xtype: 'panel', title: 'Hello' }`} />
```

### ページの追加

`apps/mdx-demo/src/pages/` に `.mdx` ファイルを置くとそのままルートになる
(例: `pages/orders.mdx` → `/orders`)。frontmatter で `layout: ../layouts/DocLayout.astro` を
指定すると、仕様書スタイル (タイポグラフィ + モックの枠) が適用される。

### 自分の Astro プロジェクトへの組み込み

仕組みは `@uivolve/remark-mock` (remark プラグイン) が ` ```uivolve ` フェンスを
`<ExtMockup client:load />` に変換 + import を自動注入するだけなので、
Astro に限らず MDX パイプラインなら組み込める。

セットアップ (Astro):

```js
// astro.config.mjs
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import remarkUivolve from '@uivolve/remark-mock'

export default defineConfig({
  integrations: [react(), mdx({ remarkPlugins: [remarkUivolve] })],
})
```

レイアウト側で `@uivolve/core/styles.css` (と必要なら Font Awesome) を読み込む。

## JSON Schema

`reference/dsl.schema.json` に DSL の JSON Schema がある (`npm run schema` で
`packages/core/src/meta.ts` から自動生成)。AI が生成した DSL の検証や、
VS Code の JSON エディタでの補完 (`$schema` 指定) に使える。

## 今後の構想

- DSL⇄Figma ブリッジなどの外部ツール連携
- VS Code 拡張やドキュメントサイトへの組み込み
