# サンプル索引

Playground の全サンプルを 1 ファイル 1 画面で収録したもの。生成したい画面に近い
サンプルを 1〜2 本読んでから DSL を書くこと。各ファイルは MDX Playground に
そのまま貼り付けてプレビューできる。

> このディレクトリは `scripts/sync-skill-refs.mjs` が apps/playground/src/samples.ts と
> apps/mdx-demo から自動生成する。直接編集しない。

## 基本

| ファイル | 画面 | layout | 使用 xtype |
|---|---|---|---|
| [basic-01.md](basic-01.md) | Border レイアウト | border | container, grid, listbox, panel, textfield, toolbar |
| [basic-02.md](basic-02.md) | YAML 記法 |  | checkbox, combobox, panel, textarea, textfield |
| [basic-03.md](basic-03.md) | フォーム |  | checkbox, combobox, datefield, displayfield, form, listbox, panel, radio, textarea, textfield |
| [basic-04.md](basic-04.md) | Grid レイアウト | grid | chart, draw, panel, polar |
| [basic-05.md](basic-05.md) | Fit + Box レイアウト | fit, hbox, vbox | button, container, panel, textarea, textfield |
| [basic-06.md](basic-06.md) | タブ + アコーディオン + ツリー | accordion, border | button, combobox, container, form, grid, panel, tabpanel, textarea, textfield, treepanel |
| [basic-07.md](basic-07.md) | ウィンドウ (ダイアログ) |  | checkbox, textfield, window |

## 業務画面

| ファイル | 画面 | layout | 使用 xtype |
|---|---|---|---|
| [business-01.md](business-01.md) | マスタメンテ (CRUD) | border, column | actioncolumn, checkbox, checkcolumn, combobox, form, grid, numberfield, pagingtoolbar, panel, textareafield, … |
| [business-02.md](business-02.md) | 承認ワークフロー (YAML) | border, column, vbox | displayfield, form, grid, mermaid, panel, textareafield, textfield, toast |
| [business-03.md](business-03.md) | 在庫・倉庫管理 | border, vbox | chart, grid, panel, textfield, toast, treepanel |
| [business-04.md](business-04.md) | 監視ダッシュボード | grid | chart, combobox, grid, panel, progressbar, terminal, toast |
| [business-05.md](business-05.md) | コールセンター / CRM | border | chatpanel, combobox, displayfield, form, grid, panel, textareafield, textfield |
| [business-06.md](business-06.md) | 勤怠管理 | border | chart, combobox, datepicker, displayfield, grid, panel, progressbar |
| [business-07.md](business-07.md) | 帳票 / 月次レポート | grid | chart, combobox, grid, panel, polar |
| [business-08.md](business-08.md) | ログイン + メインメニュー (card) | card, center, grid | checkbox, container, displayfield, panel, textfield, window |
| [business-09.md](business-09.md) | 設定画面 | fit | checkbox, checkboxgroup, combobox, displayfield, fieldset, messagebox, panel, radiogroup, slider, tabpanel, … |
| [business-10.md](business-10.md) | 問い合わせ管理 (ツリーグリッド) | border | form, grid, htmleditor, pagingtoolbar, panel, treecolumn, treepanel |
| [business-11.md](business-11.md) | チャットボット |  | chatpanel, textfield |

## コンポーネントカタログ

| ファイル | 画面 | layout | 使用 xtype |
|---|---|---|---|
| [catalog-01.md](catalog-01.md) | 小物カタログ (column) | center, column | button, checkboxgroup, datepicker, displayfield, fieldset, iframe, markdown, panel, progressbar, radiogroup, … |
| [catalog-02.md](catalog-02.md) | ダイアログとトースト | fit | combobox, form, messagebox, numberfield, panel, textfield, toast |
| [catalog-03.md](catalog-03.md) | Mermaid ダイアグラム (YAML) | grid | mermaid, panel |
| [catalog-04.md](catalog-04.md) | グラフ表示 (Git / ネットワーク) | vbox | gitgraph, networkgraph, panel |
| [catalog-05.md](catalog-05.md) | ターミナルと動画 | vbox | panel, terminal, video |
| [catalog-06.md](catalog-06.md) | コードエディタ (YAML) | fit | codeeditor, diffeditor, tabpanel |
| [catalog-07.md](catalog-07.md) | 編集グリッド (セル部品) |  | actioncolumn, checkcolumn, grid, widgetcolumn |
| [catalog-08.md](catalog-08.md) | Font Awesome アイコン | grid | fieldset, panel, splitbutton, tabpanel, toolbar |

## MDX 仕様書のフル例 (文書構成の参考)

| ファイル | 内容 | 補足 |
|---|---|---|
| [doc-order-spec.md](doc-order-spec.md) | 受注管理システム 画面仕様書 | 画面モック + itemId 対応表で構成する仕様書のフル例 |
| [doc-incident-runbook.md](doc-incident-runbook.md) | 障害対応報告書 | chart / mermaid / terminal / diffeditor / networkgraph を使うリッチドキュメント例 |

## xtype 逆引き (この xtype の実例が見たい)

| xtype | サンプル |
|---|---|
| `actioncolumn` | business-01, catalog-07 |
| `button` | basic-05, basic-06, catalog-01 |
| `chart` | basic-04, business-03, business-04, business-06, business-07 |
| `chatpanel` | business-05, business-11 |
| `checkbox` | basic-02, basic-03, basic-07, business-01, business-08, business-09 |
| `checkboxgroup` | business-09, catalog-01 |
| `checkcolumn` | business-01, catalog-07 |
| `codeeditor` | catalog-06 |
| `combobox` | basic-02, basic-03, basic-06, business-01, business-04, business-05, business-06, business-07, business-09, catalog-02 |
| `container` | basic-01, basic-05, basic-06, business-08 |
| `datefield` | basic-03 |
| `datepicker` | business-06, catalog-01 |
| `diffeditor` | catalog-06 |
| `displayfield` | basic-03, business-02, business-05, business-06, business-08, business-09, catalog-01 |
| `draw` | basic-04 |
| `fieldset` | business-09, catalog-01, catalog-08 |
| `form` | basic-03, basic-06, business-01, business-02, business-05, business-10, catalog-02 |
| `gitgraph` | catalog-04 |
| `grid` | basic-01, basic-06, business-01, business-02, business-03, business-04, business-05, business-06, business-07, business-10, catalog-07 |
| `htmleditor` | business-10 |
| `iframe` | catalog-01 |
| `listbox` | basic-01, basic-03 |
| `markdown` | catalog-01 |
| `mermaid` | business-02, catalog-03 |
| `messagebox` | business-09, catalog-02 |
| `networkgraph` | catalog-04 |
| `numberfield` | business-01, catalog-02 |
| `pagingtoolbar` | business-01, business-10 |
| `panel` | basic-01, basic-02, basic-03, basic-04, basic-05, basic-06, business-01, business-02, business-03, business-04, business-05, business-06, business-07, business-08, business-09, business-10, catalog-01, catalog-02, catalog-03, catalog-04, catalog-05, catalog-08 |
| `polar` | basic-04, business-07 |
| `progressbar` | business-04, business-06, catalog-01 |
| `radio` | basic-03 |
| `radiogroup` | business-09, catalog-01 |
| `slider` | business-09, catalog-01 |
| `splitbutton` | catalog-01, catalog-08 |
| `tabpanel` | basic-06, business-09, catalog-06, catalog-08 |
| `terminal` | business-04, catalog-05 |
| `textarea` | basic-02, basic-03, basic-05, basic-06 |
| `textareafield` | business-01, business-02, business-05 |
| `textfield` | basic-01, basic-02, basic-03, basic-05, basic-06, basic-07, business-01, business-02, business-03, business-05, business-08, business-09, business-11, catalog-02 |
| `toast` | business-01, business-02, business-03, business-04, catalog-02 |
| `toolbar` | basic-01, catalog-01, catalog-08 |
| `treecolumn` | business-10 |
| `treepanel` | basic-06, business-03, business-10 |
| `video` | catalog-05 |
| `widgetcolumn` | catalog-07 |
| `window` | basic-07, business-01, business-08 |

## layout 逆引き

| layout | サンプル |
|---|---|
| `accordion` | basic-06 |
| `border` | basic-01, basic-06, business-01, business-02, business-03, business-05, business-06, business-10 |
| `card` | business-08 |
| `center` | business-08, catalog-01 |
| `column` | business-01, business-02, catalog-01 |
| `fit` | basic-05, business-09, catalog-02, catalog-06 |
| `grid` | basic-04, business-04, business-07, business-08, catalog-03, catalog-08 |
| `hbox` | basic-05 |
| `vbox` | basic-05, business-02, business-03, catalog-04, catalog-05 |
