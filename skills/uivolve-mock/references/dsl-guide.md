# uivolve DSL 書き方ガイド

uivolve は ExtJS の宣言的 config と互換な DSL で画面モックを描画するライブラリ。
このガイドは「要件 → DSL / MDX 仕様書」を生成するときの規約をまとめたもの。
使える xtype / layout / config の一覧は同じディレクトリの `components.md`、
機械検証用の JSON Schema は `dsl.schema.json` を参照。

## フォーマット

JSON5 と YAML の両方が使える (先頭の文字から自動判別)。

- **YAML**: 括弧・カンマ不要で手書き・生成しやすい。新規生成はこちらを推奨
- **JSON5**: ExtJS の config をコピペしたいとき、ネストが深く構造を強調したいとき

```yaml
xtype: panel
title: 顧客一覧
layout: fit
items:
  - xtype: grid
    itemId: customerGrid
    columns:
      - { text: '顧客名', dataIndex: 'name', flex: 1 }
    store:
      data:
        - { name: '山田商事' }
```

## 必須規約

1. **itemId を全部品に付与する** (camelCase)。仕様書の記述や AI への実装指示で
   「`orderGrid` に列を追加」のように部品をピンポイント参照するための鍵。
   ツールバーの `'-'` `'->'` や文字列アイテムには不要。
2. **xtype / config 名は ExtJS 7.9 の公称に合わせる**。独自に発明しない。
   一覧にない xtype は使わない (未知の xtype はプレースホルダ表示になる)。
3. **データは store.data に表示用サンプルを 3〜5 行**。通信や実挙動は書かない
   (uivolve はモック: 見た目 + 折りたたみ/タブ切替などの軽い操作のみ)。

## レイアウト選定の目安

| 用途 | layout |
|---|---|
| アプリ全体 (ヘッダー / サイドメニュー / メイン) | `border` (region: north/west/center/south/east) |
| 子 1 つをぴったり埋める | `fit` |
| 縦 / 横に並べる (flex 可) | `vbox` / `hbox` |
| フォームの段組み | `grid` (独自拡張) / `column` / `table` |
| 切替表示 | `tabpanel` (xtype) / `card` |
| 折りたたみ縦積み | `accordion` |

- border の west/east には `split: true` (幅調整) と `collapsible: true` を付けると
  モックとして操作できて仕様が伝わりやすい。
- 主要な操作ボタンは `tbar` (上) / `bbar` (下) に。`'->'` で右寄せ、`'-'` で区切り。
- アイコンは `iconCls: 'x-fa fa-plus'` (Font Awesome)。主ボタンは `ui: 'primary'`。

## 高さの扱い

- トップレベルの高さは**外側が決める** (MDX ならフェンス meta の `height=440`、
  React なら `<ExtMockup height={440}>`)。DSL 側のルートには height を書かない。
- チャートやグラフ系をリージョン内に置くときは `height: '100%'` を指定する。
- 数値は px 扱い。`'100%'` や `'20em'` など CSS 長さは文字列で。

## MDX 仕様書のパターン

Markdown / MDX の ` ```uivolve ` コードフェンスに DSL を書くと、その場にモックが
描画される (言語名は `extjs` / `sx` も可)。フェンス meta:

- `height=440` — 表示高さ (省略時 360px)
- `theme=dark` — テーマ (`neptune` 既定 / `classic` / `gray` / `dark`)

仕様書は「モック + itemId 対応表」をセットにするのが基本形:

````mdx
# ○○画面 仕様書

## 1. メイン画面

画面の目的・操作フローの説明。

```uivolve height=440
xtype: panel
itemId: mainScreen
title: ○○管理
layout: border
items:
  - { region: west, itemId: menuPanel, title: 'メニュー', width: 180, split: true }
  - { region: center, xtype: grid, itemId: dataGrid, title: '一覧', columns: [...] }
```

### 画面仕様

| itemId | 項目 | 内容 |
|---|---|---|
| `menuPanel` | メニュー | 幅 180px、リサイズ・折りたたみ可 |
| `dataGrid` | 一覧 | 行クリックで選択。○○順にソート |
````

- 画面モック以外も埋め込める: `chart` (グラフ)、`mermaid` (ダイアグラム)、
  `terminal` (ログ再生)、`codeeditor` / `diffeditor` (コード・差分)、
  `networkgraph` (依存グラフ) など — 報告書・ランブック用途。
- HTML コメント `<!-- -->` は MDX 本来は不可だが、uivolve の MDX Playground は
  除去してくれる。配布物として残す MDX には書かないのが安全。

## AI への引き渡し

モック確定後、DSL をそのまま実装 AI に渡す:

> 以下は ExtJS 互換 DSL (uivolve) で記述した画面モックの定義です。
> この画面を <対象 UI ライブラリ> で実装してください。
> `itemId` は仕様書の部品参照子です。
>
> ```yaml
> (DSL)
> ```

## よくある失敗

- フェンス内の DSL に ` ``` ` を含めてしまい途中で閉じる → フェンスを 4 連 ` ```` ` にする
- 未知の xtype (`datagrid` など) → 正しくは `grid`。必ず components.md で確認
- vbox の子全部に `flex: 1` → 表・フォームなど内容依存の高さは flex を付けない
- ルートに `width` / `height` の決め打ち → 埋め込み先の幅に追随しなくなる
