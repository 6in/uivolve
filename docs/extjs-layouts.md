# Ext JS コンテナレイアウト一覧(参照ドキュメント)

similar-extjs(ExtJS 互換 DSL による画面モック描画 React ライブラリ)の将来拡張のための参照資料。
Sencha 公式ドキュメント **Ext JS 7.9.0**(Classic / Modern 両 Toolkit)の API リファレンスを調査してまとめたもの。

- 調査日: 2026-07-07
- 対象バージョン: Ext JS 7.9.0(7.x 系最新)

> **注意: `grid` レイアウトについて**
> ExtJS 本体には Classic / Modern いずれにも `layout: 'grid'` というコンテナレイアウトは存在しない
> (`Ext.grid.Grid` / `Ext.grid.Panel` はデータグリッド **コンポーネント** であり、レイアウトではない)。
> 本ライブラリの POC で実装する `grid` レイアウトは similar-extjs 独自の type であり、
> ExtJS で最も近い概念は Classic の `table` レイアウト(HTML テーブル状のセル配置)、
> あるいは CSS Grid ベースの独自拡張に相当する。

---

## 1. Classic Toolkit のレイアウト一覧(`Ext.layout.container.*`)

`Ext.layout.container.Container` を頂点とするクラス階層に属する全レイアウト。

| type 値 | クラス名 | 概要 | 本ライブラリ対応状況 |
|---|---|---|---|
| `auto` | `Ext.layout.container.Auto` | デフォルトレイアウト。特別な配置・サイズ制御を行わず、子要素を通常の HTML フローで配置する | 対応済み(縦フロー) |
| `absolute` | `Ext.layout.container.Absolute` | 子アイテムを `x` / `y` 座標で絶対位置指定する(Anchor のサブクラス) | 未対応 |
| `accordion` | `Ext.layout.container.Accordion` | 複数パネルを縦に積み、一度に 1 つ(設定により複数)だけ展開するアコーディオン(VBox のサブクラス) | 未対応 |
| `anchor` | `Ext.layout.container.Anchor` | コンテナの寸法に対する相対値(% やオフセット)で子アイテムをサイズ調整する | 簡易対応(auto と同等) |
| `border` | `Ext.layout.container.Border` | 画面を north / south / east / west / center の 5 リージョンに分割する、アプリケーション向けマルチペインレイアウト。リージョン間のスプリッタや折りたたみを内蔵 | **POC対応済み** |
| `box` | `Ext.layout.container.Box` | hbox / vbox の共通基底クラス。`vertical` 設定で方向を切替可能(通常は hbox / vbox を直接使う) | 未対応 |
| `card` | `Ext.layout.container.Card` | 複数の子アイテムのうち 1 つ(アクティブカード)だけを表示する。タブパネルやウィザードの基盤(Fit のサブクラス) | 未対応 |
| `center` | `Ext.layout.container.Center` | 単一の子アイテムをコンテナの中央に配置する(Fit のサブクラス) | 未対応 |
| `checkboxgroup` | `Ext.layout.container.CheckboxGroup` | CheckboxGroup / RadioGroup 内部でチェックボックスを複数カラムに配置する専用レイアウト | 未対応 |
| `column` | `Ext.layout.container.Column` | 子アイテムを複数カラムとして横並びに配置。`columnWidth`(割合)または固定 `width` で幅を指定 | 未対応 |
| `container` | `Ext.layout.container.Container` | 全コンテナレイアウトの基底クラス(直接使用ではなく継承用) | 未対応 |
| `dashboard` | `Ext.layout.container.Dashboard` | `Ext.dashboard.Dashboard` 用のカラムレイアウト(Column のサブクラス) | 未対応 |
| `editor` | `Ext.layout.container.Editor` | `Ext.Editor` コンポーネント内部専用のレイアウト | 未対応 |
| `fit` | `Ext.layout.container.Fit` | 単一の子アイテムをコンテナ全面に自動拡大して表示する | **POC対応済み** |
| `form` | `Ext.layout.container.Form` | フォームフィールドを縦 1 列・幅 100% で並べるフォーム専用レイアウト(Auto のサブクラス) | 簡易対応(auto と同等) |
| `hbox` | `Ext.layout.container.HBox` | 子アイテムを水平方向に並べる。`flex` による比率分配が可能 | 対応済み(align / pack / flex) |
| `segmentedbutton` | `Ext.layout.container.SegmentedButton` | `Ext.button.Segmented` 内部専用のレイアウト | 未対応 |
| `table` | `Ext.layout.container.Table` | 子アイテムを HTML の `<table>` として行列配置する。`colspan` / `rowspan` によるセル結合が可能 | 簡易対応(grid エンジンの別名) |
| `vbox` | `Ext.layout.container.VBox` | 子アイテムを垂直方向に並べる。`flex` による比率分配が可能 | 対応済み(align / pack / flex) |
| `responsivecolumn` | `Ext.ux.layout.ResponsiveColumn` | (ux パッケージ)画面幅に応じてカラム数が変わるレスポンシブカラムレイアウト | 未対応 |

※ `box` / `container` / `checkboxgroup` / `editor` / `segmentedbutton` は基底クラスまたはフレームワーク内部用であり、アプリケーションコードで `layout` config に直接指定することは通常ない。

---

## 2. Modern Toolkit のレイアウト一覧(`Ext.layout.*`)

Modern Toolkit のレイアウトは `Ext.layout.Auto` を頂点とするフラットな階層。
Classic と異なり **border / anchor / absolute / column / table / accordion / dashboard は存在しない**(CSS Flexbox ベース)。

| type 値 | クラス名 | 概要 | 本ライブラリ対応状況 |
|---|---|---|---|
| `auto`(別名 `default`) | `Ext.layout.Auto` | デフォルトレイアウト。特別な配置制御を行わない全レイアウトの基底 | 未対応 |
| `box` | `Ext.layout.Box` | hbox / vbox の基底。CSS Flexbox で子を一方向に並べる(`vertical` で方向切替) | 未対応 |
| `card` | `Ext.layout.Card` | 一度に 1 つの子アイテムのみ表示。slide / fade / flip / pop / reveal / cover / cube / scroll のアニメーション遷移をサポート | 未対応 |
| `carousel` | `Ext.layout.Carousel` | 複数のカード的ビューをスワイプで切り替えるカルーセルレイアウト | 未対応 |
| `center` | `Ext.layout.Center` | 単一の子アイテムをコンテナ中央に配置する | 未対応 |
| `fit` | `Ext.layout.Fit` | 単一の子アイテムをコンテナ全面に拡大して表示する | 未対応 |
| `float` | `Ext.layout.Float` | CSS float ベースで子コンポーネントを自由配置する | 未対応 |
| `form` | `Ext.layout.Form` | フォームフィールドとラベルをカラム状に整列させるフォーム専用レイアウト | 未対応 |
| `hbox` | `Ext.layout.HBox` | 子アイテムを水平に配置。固定幅または利用可能幅の比率(flex)でサイズ指定 | 未対応 |
| `vbox` | `Ext.layout.VBox` | 子アイテムを垂直に配置。固定高または利用可能高の比率(flex)でサイズ指定 | 未対応 |

※ 本ライブラリの POC 対応レイアウト(border / fit / grid)のうち、Modern Toolkit に存在するのは `fit` のみ。border は Classic 専用、grid は similar-extjs 独自。

---

## 3. 主要レイアウトの代表的な config オプション

### 3.1 border(Classic)— POC対応済み

レイアウト側の config:

| config | 説明 |
|---|---|
| `padding` | 全子アイテムに適用する余白 |
| `regionWeights` | 各リージョンのデフォルト weight(値が大きいリージョンが先にスペースを確保する) |
| `split` | リージョン間にドラッグ可能なスプリッタを挿入(boolean または BorderSplitter 設定オブジェクト) |
| `splitterResize` | スプリッタのドラッグによるリサイズ可否(デフォルト true) |

子アイテム側の config:

| config | 説明 |
|---|---|
| `region` | 配置リージョン。`'north'` / `'south'` / `'east'` / `'west'` / `'center'`。**center リージョンの子は必須**(残り全スペースを占有) |
| `split` | そのリージョン境界にスプリッタを表示 |
| `collapsible` | リージョンを折りたたみ可能にする |
| `weight` | 同種リージョン間のレイアウト優先度 |
| `width` / `height` | 水平リージョン(east/west)は width、垂直リージョン(north/south)は height を指定 |
| `flex` | 固定寸法の代わりに比率でサイズ指定 |

### 3.2 fit(Classic / Modern)— POC対応済み

| config | 説明 |
|---|---|
| (レイアウト自体にほぼ config なし) | 単一の子アイテムをコンテナいっぱいに拡大する。複数の子を入れた場合は最初の 1 つのみ表示対象。子アイテムの `margin` は考慮される |

### 3.3 hbox / vbox(Classic)

| config | 説明 |
|---|---|
| `align` | 交差軸方向の揃え。`begin`(上/左)/ `middle`(中央)/ `end`(下/右)/ `stretch`(引き伸ばし)/ `stretchmax`(最大アイテムに揃える) |
| `pack` | 主軸方向の詰め方。`start` / `center` / `end` |
| `padding` | 全子アイテム周囲の余白(CSS 形式 `'5 10'` など) |
| `enableSplitters` | 子アイテム間のスプリッタバーを許可(デフォルト true) |
| `overflowHandler` | はみ出し時の処理。`scroller`(スクロールボタン)/ `menu`(ドロップダウンメニュー) |
| 子: `flex` | 残りスペースの比率分配 |

### 3.4 hbox / vbox(Modern)

| config | 説明 |
|---|---|
| `align` | 交差軸の揃え。`start` / `center` / `end` / `stretch`(デフォルト `stretch`) |
| `pack` | 主軸の分配。`start` / `center` / `end` / `space-between` / `space-around` / `justify`(デフォルト `start`) |
| `wrap` | 折り返し。`true` / `false` / `'nowrap'` / `'wrap'` / `'wrap-reverse'` |
| `reverse` | 並び順の反転(右→左、下→上) |
| `constrainAlign` | 揃え対象の子サイズをコンテナ寸法内に制限 |
| 子: `flex` | 残りスペースの比率分配 |

### 3.5 card(Classic / Modern)

| config | 説明 |
|---|---|
| `activeItem` | 初期表示するカード(インデックスまたは itemId) |
| `deferredRender`(Classic) | アクティブになるまでカードの描画を遅延する |
| `animation`(Modern) | カード切替アニメーション。`slide` / `fade` / `flip` / `pop` / `reveal` / `cover` / `cube` / `scroll` |

### 3.6 table(Classic)

| config | 説明 |
|---|---|
| `columns` | テーブルのカラム数。子アイテムは左→右、行が埋まると次の行へ自動配置 |
| `tableAttrs` / `trAttrs` / `tdAttrs` | 生成される `<table>` / `<tr>` / `<td>` 要素への属性指定 |
| 子: `colspan` / `rowspan` | セルの結合(HTML テーブルと同じ意味) |

### 3.7 anchor / absolute(Classic)

| config | 説明 |
|---|---|
| 子: `anchor` | コンテナに対する相対サイズ。パーセント(`'100% 50%'`)またはオフセット(`'-100'`)で指定 |
| `anchorSize` | 実寸法と独立してアンカー計算に使う仮想コンテナ寸法 |
| `defaultAnchor` | 子コンテナアイテムのデフォルト anchor(デフォルト `'100%'`) |
| 子: `x` / `y`(absolute) | コンテナ内の絶対座標 |

### 3.8 column(Classic)

| config | 説明 |
|---|---|
| 子: `columnWidth` | 0〜1 の割合でカラム幅を指定。割合指定分の合計は 1(100%)にする必要がある |
| 子: `width` | 固定ピクセル幅(columnWidth と混在可。固定幅を差し引いた残りが割合分配される) |

### 3.9 accordion(Classic)

| config | 説明 |
|---|---|
| `fill` | 展開したパネルをコンテナの残り高さいっぱいに広げる(デフォルト true) |
| `multi` | 複数パネルの同時展開を許可 |
| `titleCollapse` | タイトルバークリックで折りたたみ切替 |
| `animate` | 展開/折りたたみのアニメーション |

---

## 4. 出典

すべて Sencha 公式ドキュメント(Ext JS 7.9.0)。

- レイアウトガイド: https://docs.sencha.com/extjs/7.9.0/guides/core_concepts/layouts.html
- Classic 基底クラス(サブクラス一覧): https://docs.sencha.com/extjs/7.9.0/classic/Ext.layout.container.Container.html
- Classic 各クラス(URL パターン): `https://docs.sencha.com/extjs/7.9.0/classic/Ext.layout.container.<ClassName>.html`
  - 例: https://docs.sencha.com/extjs/7.9.0/classic/Ext.layout.container.Border.html
  - 例: https://docs.sencha.com/extjs/7.9.0/classic/Ext.layout.container.Fit.html
  - 例: https://docs.sencha.com/extjs/7.9.0/classic/Ext.layout.container.Box.html
  - 例: https://docs.sencha.com/extjs/7.9.0/classic/Ext.layout.container.Column.html
- Modern 基底クラス(サブクラス一覧): https://docs.sencha.com/extjs/7.9.0/modern/Ext.layout.Auto.html
- Modern 各クラス(URL パターン): `https://docs.sencha.com/extjs/7.9.0/modern/Ext.layout.<ClassName>.html`
  - 例: https://docs.sencha.com/extjs/7.9.0/modern/Ext.layout.Box.html
