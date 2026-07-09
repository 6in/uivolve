# コンポーネント / レイアウト リファレンス

> ⚠️ このファイルは `npm run docs` により packages/core のソースコード (JSDoc と
> registerComponent / registerLayout の登録) から**自動生成**されます。直接編集しないでください。
> 説明を変更したい場合は、実装ファイルの JSDoc を編集して再生成してください。

## コンポーネント (xtype)

| xtype | 実装 | 説明 |
|---|---|---|
| `panel` / `form` | Panel | タイトルバー付きの基本パネル。 collapsible / collapsed(折りたたみ)、tbar / bbar(ツールバー)、 bodyPadding / html / iconCls に対応。form は body がフォームスタイルになる。 |
| `container` / `fieldcontainer` | Container | ヘッダーなしの汎用コンテナ。layout と items で子を配置する。 パネル同様 tbar / bbar も置ける (ExtJS では Panel の config だが、ヘッダー不要の ツールバー領域を container + tbar だけで書けるよう緩和した独自拡張)。 |
| `component` / `box` | RawComponent | html / text をそのまま描画 |
| `toolbar` / `tbar` | Toolbar | ExtJS のショートハンドに対応: '->' = 右寄せ / '-' = セパレーター / ' ' = スペーサー / 文字列 = ラベル items の defaultType は button。 |
| `button` | Button | menu 指定でドロップダウンメニュー付きになる。 handler ('onSaveClick' のような参照名) は実行はせずツールチップに表示する (モックの動線を AI・レビュアーへ伝えるための宣言)。 clipboard (独自拡張のユーティリティ): true でクリック時に自分の iconCls 定義 (iconCls: 'x-fa fa-plus' 形式) を、文字列なら任意のテキストをクリップボードへコピーする。 アイコンカタログやデザイントークン一覧のサンプル向け。 |
| `textfield` / `numberfield` / `datefield` | TextField | 1 行テキスト入力。 numberfield は数値入力 (minValue / maxValue)、datefield は日付ピッカーになる。 fieldLabel / value / emptyText / readOnly / disabled / inputType に対応。 バリデーション仕様の宣言 (ExtJS 互換): allowBlank: false (必須。ラベルに * 表示)、 maxLength / minLength、regex (HTML の pattern として適用)、 vtype ('email' \| 'url' \| 'alpha' \| 'alphanum')。 ブラウザネイティブ検証にマップされ、違反入力は赤枠になる (モック上の軽い動作)。 |
| `textarea` / `textareafield` | TextArea | 複数行テキスト入力。rows で行数を指定。 allowBlank: false (必須) / maxLength / minLength のバリデーション宣言に対応。 |
| `checkbox` / `checkboxfield` / `radio` / `radiofield` | CheckItem | 単体のチェックボックス / ラジオボタン。 boxLabel / checked / name(ラジオのグループ化)に対応。 |
| `combobox` / `combo` | ComboBox | ドロップダウン選択。options 配列または store.data から選択肢を生成。 allowBlank: false で必須 (ラベルに * 表示)。 |
| `listbox` / `multiselect` | ListBox | リストボックス。multiSelect で複数選択、size で表示行数を指定。 |
| `displayfield` / `label` | DisplayField | 静的テキスト表示。value / text / html のいずれかを描画。 |
| `grid` / `gridpanel` | GridPanel | データグリッド。 columns / store(または data)から表を描画する。 columnLines: true でカラム区切り線を表示 (ExtJS 互換)。 列の xtype で checkcolumn (チェックボックス) / actioncolumn (アイコンボタン。items で複数) / widgetcolumn (widget: { xtype: 'progressbar' } 等を埋め込み) が使える。 通常列に editor: true (textfield) や editor: { xtype: 'numberfield' \| 'combobox' } を 指定するとセル内で入力できる (モックとして常時編集表示)。 CSS Grid + subgrid で列揃え・行ホバー・行選択を実現。 |
| `image` / `imagecomponent` | Image | src 未指定時はプレースホルダを表示 |
| `tabpanel` | TabPanel | タブ切替パネル。 各 item の title がタブ名になる。activeTab / closable に対応。 |
| `fieldset` | FieldSet | フォームのグループ枠。 title が legend になる。collapsible / checkboxToggle に対応。 |
| `window` | Window | ダイアログ風ウィンドウ。 モックなのでフロートはせず、ルートに置くと viewport 中央に配置される (.sx-viewport:has(> .sx-window) の CSS で実現)。閉じるボタンは見た目のみ。 modal: true を指定するとツリー内のどこに置いても半透明バックドロップ + 中央表示のオーバーレイになる (一覧画面 + 編集ダイアログを 1 つの DSL で表現できる)。 |
| `treepanel` / `tree` | TreePanel | 階層ツリー。 ExtJS の TreeStore 同様、root: { children: [...] } 形式のノードを描画する。 ノード: { text, leaf, expanded, children } columns (先頭または xtype: 'treecolumn' の列が階層表示になる) を指定すると **ツリーグリッド**になり、各ノードの任意のフィールドを列として表示できる。 columnLines はグリッド同様にカラム区切り線を表示する。 |
| `menu` | Menu | メニューリスト。 items: { text, iconCls, menu(サブメニューは矢印表示のみ) } または '-'(区切り線)。 |
| `splitbutton` | SplitButton | 本体と矢印部が分かれたボタン。menu でドロップダウンを表示。 |
| `progressbar` / `progress` | ProgressBar | 進捗バー。value(0〜1)で進捗、text でラベルを上書き。 |
| `slider` / `sliderfield` | Slider | スライダー。value / minValue / maxValue / increment に対応。 |
| `radiogroup` / `checkboxgroup` | CheckGroup | items の boxLabel を columns 列に並べる。 |
| `datepicker` | DatePicker | インラインのカレンダー (Ext.picker.Date 互換)。 value(初期選択日)/ showToday(「今日」ボタンの表示)/ todayText に対応。 月の移動と日付クリックによる選択ができる。 |
| `htmleditor` | HtmlEditor | リッチテキストエディタ。 書式ツールバー + 編集領域 (contentEditable) で構成し、太字・斜体・下線・ 文字揃え・リスト・リンク挿入が実際に操作できる。value に初期 HTML を指定。 機能スイッチは ExtJS 互換: enableFormat / enableAlignments / enableLists / enableLinks / enableSourceEdit (すべて既定 true。ソース編集は HTML を直接編集)。 enableFont / enableFontSize / enableColors は未対応 (モックでは省略)。 |
| `pagingtoolbar` | PagingToolbar | ページングツールバー。 モックのため store とは連動せず、total / pageSize (既定 25) からページ数を計算して ページ移動のインタラクションを再現する。displayInfo: true で右端に件数を表示し、 文言は displayMsg ('{0} - {1} 件目 / 全 {2} 件') / emptyMsg で変更できる。 beforePageText / afterPageText でページ番号まわりの文言も変更可能。 グリッドの下部に置くときは bbar: { xtype: 'pagingtoolbar', total: 200 } と書く。 |
| `uxiframe` / `iframe` | IFrame | インラインフレーム (Ext.ux.IFrame 互換)。 src の URL を埋め込み表示する。src 省略時はプレースホルダを表示。 高さは height / flex で指定する (既定 200px)。 |
| `markdown` | Markdown | Markdown を描画する (ExtJS にはない独自拡張)。 value に Markdown テキストを指定 (YAML 記法ならブロックスカラー `value: \|` が書きやすい)。 見出し・リスト・表・コードブロック・引用などに対応 (marked で HTML 化)。 画面内の説明文や、モックに仕様メモを添える用途を想定。 |
| `mermaid` | Mermaid | Mermaid.js ダイアグラム描画 (ExtJS にはない独自拡張)。 value にフローチャート・シーケンス図・ER 図などの Mermaid 記法を指定する (YAML 記法ならブロックスカラー value: \| が書きやすい)。 mermaid 本体は初回描画時に動的 import するため、未使用時のバンドルコストはない。 構文エラー時はエラーメッセージを表示する。 |
| `gitgraph` | GitGraph | Git のマージツリー描画 (ExtJS にはない独自拡張)。 commits: [{ id, branch, parents: [親id], message, tag }] を上から古い順に並べ、 ブランチごとのレーン + マージ曲線 + コミットメッセージの一覧を gitk 風に表示する。 レーンの並びは branches: ['main', 'develop', ...] で指定 (省略時は登場順)。 ブランチ名のチップとタグ (tag) も表示する。 |
| `networkgraph` / `forcegraph` | NetworkGraph | 力学レイアウトのノード・エッジグラフ (ExtJS にはない独自拡張)。 nodes: [{ id, text, group, color, r }] と edges: [{ from, to }] から d3-force で自動レイアウトする。GraphDB のスキーマ図や依存関係の表現向け。 group ごとに自動配色し、シミュレーションは常時ゆるく動き続ける。 ノードはドラッグで引っ張れる (掴んでいる間は再加熱される)。 |
| `chatpanel` / `chat` | ChatPanel | チャット画面 (ExtJS にはない独自拡張)。 messages: [{ from: 'user' \| 'bot', name, text, time }] の会話バルーンを表示する。 from: 'user' は右寄せ・アクセント色、それ以外は左寄せで、text は Markdown として描画。 typing: true で末尾に入力中インジケーター (・・・) を表示。 入力欄が必要なら bbar に textfield + button を置いて組み合わせる。 |
| `chart` / `cartesian` / `polar` | Chart | 簡易チャート (SVG 自前描画)。 ExtJS の Ext.chart と同じ形の series: [{ type, xField, yField }] + store.data から描画する。 type: 'bar' \| 'line' \| 'area' \| 'pie' (xtype: 'polar' の既定は pie)。 yField は配列でグループ棒 / 複数系列に対応し、複数系列と pie は凡例を自動表示 (凡例名は series[0].title で上書き可)。 モックの簡易版につき最初の series のみ使用し、axes などの詳細 config は無視する。 |
| `draw` | Draw | SVG 描画サーフェス (Ext.draw.Container 互換のサブセット)。 sprites: [{ type, ...属性 }] を SVG に変換して描画する。対応スプライト: rect (x/y/width/height/radius) / circle (cx/cy/r) / ellipse (cx/cy/rx/ry) / line (fromX/fromY/toX/toY) / path (path) / text (x/y/text/fontSize/textAlign)。 共通属性は ExtJS 同名の fillStyle / strokeStyle / lineWidth / opacity。 生の SVG をそのまま埋め込みたい場合は component の html config でも可。 |
| `messagebox` / `msgbox` | MessageBox | シンプルダイアログ (Ext.Msg 互換)。 alert / confirm / prompt のモックを宣言的に書く。 title / message (msg も可) / buttons ('ok' \| 'okcancel' \| 'yesno' \| 'yesnocancel' または任意のラベル配列) / icon ('info' \| 'question' \| 'warning' \| 'error') / prompt: true (入力欄。初期値は value) に対応。 どこに置いても画面全体に半透明バックドロップ + 中央のダイアログを重ねて表示する。 ボタンは見た目のみ (先頭ボタンが primary)。 |
| `toast` | Toast | トースト通知 (Ext.toast 互換)。 html (または message) をプレビュー領域の隅に重ねて表示する。 align: 'tr' (既定) / 'tl' / 'br' / 'bl' / 't' / 'b'。title / iconCls 付きも可。 closable (既定 true) の × で消せる。モックなので自動では消えない (timeout は無視)。 |
| `terminal` / `console` | Terminal | コンソールログ風アニメーション (ExtJS にはない独自拡張)。 lines のテキストを speed ms 間隔 (±ランダムな揺らぎ付き) で 1 行ずつ流し、 末尾まで行ったら先頭からサイクリックに繰り返す。maxLines (既定 100) で 保持行数を制限し、常に最下部へ自動スクロールする。 '$' / '>' 始まりはプロンプト色、✓ / ✗ / ⚠ / WARN / ERROR は意味色で自動ハイライト。 title を指定すると macOS 風のウィンドウバーを表示する。 |
| `video` | Video | 動画プレイヤー (Ext.Video 互換)。 url (src も可) の動画を HTML5 video で再生する。posterUrl (poster も可) / loop / muted / autoplay / controls (既定 true) に対応。url 省略時はプレースホルダを表示。 YouTube などの埋め込みプレイヤーは video ではなく iframe を使うこと。 |
| `codeeditor` / `code` | CodeEditor | ソースコードエディタ (ExtJS にはない独自拡張。Monaco Editor)。 value に初期コード (YAML 記法なら value: \| が書きやすい)、language に Monaco の言語 ID (javascript / typescript / json / yaml / sql / python / html / css など)、 theme に 'light' / 'dark' (または Monaco のテーマ名 vs / vs-dark / hc-black) を指定。 readOnly / lineNumbers / minimap / fontSize に対応。編集は非制御 (モックとして自由に触れる)。 Monaco 本体は既定では CDN から遅延ロードされる (Playground はローカルバンドル設定済み)。 |
| `diffeditor` / `diff` | DiffView | 差分表示 (ExtJS にはない独自拡張。Monaco Diff Editor)。 original (変更前) と value (変更後) のコードを比較表示する。 language / theme は codeeditor と同じ指定方法。sideBySide: false で インライン (unified) 表示になる。readOnly は既定 true (右側も編集させたい場合は false)。 |

## レイアウト (layout type)

| type | 実装 | 説明 |
|---|---|---|
| `accordion` | AccordionLayout | accordion レイアウト: 子パネルを縦に積み、一度に 1 つだけ展開する。 ExtJS 同様、展開中のパネルが残り高さを占有する。 treepanel / grid などパネル派生の子は、ヘッダーを剥がして body に埋め込む。 |
| `auto` / `anchor` / `form` | AutoLayout | 通常のブロックフローで順に並べる |
| `fit` | FitLayout | 最初の子をコンテナいっぱいに広げる |
| `border` | BorderLayout | north/south/east/west/center の 5 領域レイアウト (CSS Grid で実現)。 split: true のリージョンは ExtJS 同様、スプリットバーのドラッグでリサイズできる。 toast / messagebox / modal window はリージョン外で config を変えずに描画する (リージョン子の width 除去の影響を受けない)。 |
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
