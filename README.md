# similar-extjs

ExtJS の画面定義(宣言的 config)に**互換な DSL** で画面モックを描画する、React 製のモックアップライブラリ(POC)。

ExtJS の優れた画面定義スタイルはそのままに、ライセンスフリーで「画面モックを素早く作る → その DSL を AI に渡して任意の UI ライブラリで本実装してもらう」というワークフローを実現することを目的とする。

## クイックスタート

```bash
npm install
npm run dev   # Playground (エディタ + ライブプレビュー) が http://localhost:5173 で起動
```

左ペインの DSL を編集すると右ペインのモックが即座に更新される。「AI 用にコピー」ボタンで、AI に実装を依頼するためのプロンプト付きで DSL をコピーできる。

## プロジェクト構成

```
packages/core/     — @similar-extjs/core: DSL パーサー + レンダラー (React)
apps/playground/   — エディタ + ビューア (Vite)
docs/              — リファレンス (components.md は JSDoc から自動生成)
scripts/           — docs 生成スクリプト
.claude/skills/    — 開発ワークフロースキル (add-component)
```

## ドキュメント

- **[コンポーネント / レイアウト リファレンス](docs/components.md)** — ソースの JSDoc から `npm run docs` で自動生成
- [ExtJS レイアウト一覧と対応状況](docs/extjs-layouts.md)

コンポーネントの追加手順は Claude Code スキル **`/add-component`** にまとまっている
(`.claude/skills/add-component/SKILL.md`)。

## DSL の書き方

JSON5 として解釈されるため、ExtJS の config をほぼそのままコピーできる(クォートなしキー / シングルクォート / 末尾カンマ / コメント OK)。

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

ExtJS の全レイアウト一覧と対応状況は [docs/extjs-layouts.md](docs/extjs-layouts.md) を参照。

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
| `treepanel` / `tree` | 階層ツリー。`root.children` のノード(`text` / `leaf` / `expanded` / `children`)、展開・折りたたみ可 |
| `menu` | メニューリスト。button / splitbutton の `menu` config で Popover API によるドロップダウン表示 |
| `splitbutton` | 本体と矢印部が分かれたボタン |
| `progressbar` | 進捗バー。`value`(0〜1)/ `text` |
| `slider` / `sliderfield` | スライダー。`value` / `minValue` / `maxValue` / `increment` |
| `radiogroup` / `checkboxgroup` | `boxLabel` 付き項目を `columns` 列に並べる |

共通 config: `width` / `height` / `flex` / `margin` / `padding` / `hidden` / `disabled` / `style` / `cls`

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

## ライブラリとしての利用

```tsx
import { ExtMockup } from '@similar-extjs/core'
import '@similar-extjs/core/styles.css'

<ExtMockup code={dslSource} height={480} />
// または <ExtMockup config={parsedConfig} />
```

### 拡張ポイント

xtype・レイアウトはどちらもレジストリ方式で、後から追加・上書きできる:

```tsx
import { registerComponent, registerLayout } from '@similar-extjs/core'

registerComponent('tabpanel', MyTabPanel)
registerLayout('accordion', MyAccordionLayout)
```

## 今後の構想

- Mermaid.js のように Markdown / MDX (Astro など) 内の DSL ブロックをモック描画するインテグレーション
- ドラッグでのリージョンリサイズ、タブの実クローズなどインタラクションの強化
- datepicker / htmleditor / pagingtoolbar / ツリーグリッドなどのコンポーネント追加
