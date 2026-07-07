# コンポーネント / レイアウト リファレンス

> ⚠️ このファイルは `npm run docs` により packages/core のソースコード (JSDoc と
> registerComponent / registerLayout の登録) から**自動生成**されます。直接編集しないでください。
> 説明を変更したい場合は、実装ファイルの JSDoc を編集して再生成してください。

## コンポーネント (xtype)

| xtype | 実装 | 説明 |
|---|---|---|
| `panel` / `form` | Panel | タイトルバー付きの基本パネル。 collapsible / collapsed(折りたたみ)、tbar / bbar(ツールバー)、 bodyPadding / html / iconCls に対応。form は body がフォームスタイルになる。 |
| `container` / `fieldcontainer` | Container | ヘッダーなしの汎用コンテナ。layout と items で子を配置する。 |
| `component` / `box` | RawComponent | html / text をそのまま描画 |
| `toolbar` / `tbar` | Toolbar | ExtJS のショートハンドに対応: '->' = 右寄せ / '-' = セパレーター / ' ' = スペーサー / 文字列 = ラベル items の defaultType は button。 |
| `button` | Button | menu 指定でドロップダウンメニュー付きになる |
| `textfield` / `numberfield` / `datefield` | TextField | 1 行テキスト入力。 numberfield は数値入力、datefield は日付ピッカーになる。 fieldLabel / value / emptyText / readOnly / disabled / inputType に対応。 |
| `textarea` / `textareafield` | TextArea | 複数行テキスト入力。rows で行数を指定。 |
| `checkbox` / `checkboxfield` / `radio` / `radiofield` | CheckItem | 単体のチェックボックス / ラジオボタン。 boxLabel / checked / name(ラジオのグループ化)に対応。 |
| `combobox` / `combo` | ComboBox | ドロップダウン選択。options 配列または store.data から選択肢を生成。 |
| `listbox` / `multiselect` | ListBox | リストボックス。multiSelect で複数選択、size で表示行数を指定。 |
| `displayfield` / `label` | DisplayField | 静的テキスト表示。value / text / html のいずれかを描画。 |
| `grid` / `gridpanel` | GridPanel | データグリッド。 columns / store(または data)から表を描画する。 CSS Grid + subgrid で列揃え・行ホバー・行選択を実現。 |
| `image` / `imagecomponent` | Image | src 未指定時はプレースホルダを表示 |
| `tabpanel` | TabPanel | タブ切替パネル。 各 item の title がタブ名になる。activeTab / closable に対応。 |
| `fieldset` | FieldSet | フォームのグループ枠。 title が legend になる。collapsible / checkboxToggle に対応。 |
| `window` | Window | ダイアログ風ウィンドウ。 モックなのでフロートはせず、ルートに置くと viewport 中央に配置される (.sx-viewport:has(> .sx-window) の CSS で実現)。閉じるボタンは見た目のみ。 |
| `treepanel` / `tree` | TreePanel | 階層ツリー。 ExtJS の TreeStore 同様、root: { children: [...] } 形式のノードを描画する。 ノード: { text, leaf, expanded, children } |
| `menu` | Menu | メニューリスト。 items: { text, iconCls, menu(サブメニューは矢印表示のみ) } または '-'(区切り線)。 |
| `splitbutton` | SplitButton | 本体と矢印部が分かれたボタン。menu でドロップダウンを表示。 |
| `progressbar` / `progress` | ProgressBar | 進捗バー。value(0〜1)で進捗、text でラベルを上書き。 |
| `slider` / `sliderfield` | Slider | スライダー。value / minValue / maxValue / increment に対応。 |
| `radiogroup` / `checkboxgroup` | CheckGroup | items の boxLabel を columns 列に並べる。 |
| `datepicker` | DatePicker | インラインのカレンダー (Ext.picker.Date 互換)。 value(初期選択日)/ showToday(「今日」ボタンの表示)/ todayText に対応。 月の移動と日付クリックによる選択ができる。 |

## レイアウト (layout type)

| type | 実装 | 説明 |
|---|---|---|
| `accordion` | AccordionLayout | accordion レイアウト: 子パネルを縦に積み、一度に 1 つだけ展開する。 ExtJS 同様、展開中のパネルが残り高さを占有する。 treepanel / grid などパネル派生の子は、ヘッダーを剥がして body に埋め込む。 |
| `auto` / `anchor` / `form` | AutoLayout | 通常のブロックフローで順に並べる |
| `fit` | FitLayout | 最初の子をコンテナいっぱいに広げる |
| `border` | BorderLayout | north/south/east/west/center の 5 領域レイアウト (CSS Grid で実現)。 split: true のリージョンは ExtJS 同様、スプリットバーのドラッグでリサイズできる。 |
| `grid` / `table` | GridLayout | CSS Grid による均等グリッド。layout: { type: 'grid', columns: 3 } |
| `hbox` | HBoxLayout | 子を水平方向に並べる Flexbox。align / pack、子の flex による比率分配に対応 |
| `vbox` | VBoxLayout | 子を垂直方向に並べる Flexbox。align / pack、子の flex による比率分配に対応 |
| `card` | CardLayout | activeItem の 1 枚だけを表示する (tabpanel / ウィザードの基盤) |
| `center` | CenterLayout | 単一の子をコンテナ中央に配置 |
| `column` | ColumnLayout | columnWidth (0〜1 の割合) または固定 width で横並び・折り返し |
| `absolute` | AbsoluteLayout | x / y 座標による絶対位置指定 |

## 共通 config

すべてのコンポーネントで利用できる config:

| config | 説明 |
|---|---|
| `width` / `height` | サイズ (数値は px) |
| `minWidth` / `minHeight` | 最小サイズ |
| `flex` | hbox / vbox / border center などでの比率分配 |
| `margin` / `padding` | 余白。ExtJS 形式のスペース区切り (`'5 10 5 10'`) に対応 |
| `hidden` | 非表示 |
| `disabled` | 無効化 (入力系・ボタン系) |
| `cls` | 追加 CSS クラス |
| `style` | インラインスタイル (オブジェクト形式) |
| `iconCls` | アイコン。Font Awesome クラス対応 (`'x-fa fa-plus'` は ExtJS 互換で読み替え) |
| `id` / `itemId` | 識別子 (React の key にも利用) |

コンテナ系はさらに `layout` / `items` / `defaults` / `tbar` / `bbar` / `bodyPadding` / `html` が使える。

関連資料: [ExtJS レイアウト一覧と対応状況](extjs-layouts.md) / [README の DSL リファレンス](../README.md)
