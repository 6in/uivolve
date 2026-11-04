# MDX フェンスブロック拡張 — 実装計画 (第 1 段)

- ブランチ: `feat/mdx-fence-blocks` (main = origin/main `4bf24dc` から分岐)
- 作成日: 2026-11-04
- ゴール: MDX 内で ` ```mermaid ` のように**言語名 + その言語の DSL だけ**を書けば図・チャート・表が描画される。
  uivolve YAML で包む必要はない。

## 1. 決定事項 (ディスカッション結果)

| 項目 | 決定 |
|---|---|
| 変換 | **remark-mock を拡張**。フェンス言語名 → 描画種別の対応表を持たせる (`uivolve` も対応表の 1 項目) |
| 部品の置き場 | **@uivolve/core**。各ライブラリは部品内で動的 import (未使用ページでは読まない) |
| 描画時点 | **ブラウザ** (ライブプレビューと同一実装) |
| テキスト DSL 型 | `mermaid`, `dot` / `graphviz`, `math` (KaTeX), `dbml` (→ mermaid erDiagram に変換) |
| データ型 (JSON5/YAML) | `echarts`, `vega-lite`, `table`, `csv` / `tsv`, `wavedrom` |
| フェンス名 | **言語名で常に描画** (ソースとして見せたいときは ` ```text ` 等で回避) |
| オプション | **メタ文字列** (` ```echarts height=320 theme=dark `)。既存 ` ```uivolve height=420 ` と同じ |
| 外部ファイル参照 | 第 1 段では**対応しない** |
| テーマ | **`--sx-*` に追従** (ダーク含む) |
| table | CSV/TSV と YAML/JSON 配列 (列定義付き)。**並べ替え + 絞り込み**付き |
| math | **フェンスのみ** (`$` / `$$` は非対応 — 金額表記との衝突回避) |
| VSCode 拡張 | 全ライブラリを**分割チャンクで同梱** (オフライン可、使うときだけ読む) |
| エラー表示 | ブロック内に**エラー文 + 元ソース**。他ブロックへ波及させない |
| validate-dsl | **データ型の構文のみ**検証 (JSON5/YAML 構文、csv/tsv の列数) |
| 対応範囲 | mdx-demo (Astro) / MDX Playground / VSCode 拡張 / uivolve-mock スキル / validate-dsl |

既存リポジトリ内に上記言語名のフェンスは無い (grep 済み) ため、既存ページの表示は変わらない。

## 2. 設計

### 2.1 出力する JSX は 1 種類に集約する

フェンスごとに別コンポーネント (`<Mermaid>`, `<ECharts>`…) を出すと、`injectImport: false` で
`components` prop を渡している MDX Playground / VSCode 拡張側で、フェンスを増やすたびに対応表の追記が要る。
そこで **ディスパッチ用の 1 コンポーネント** に集約する:

```mdx
<FenceBlock lang="mermaid" code="graph LR; A-->B" height="320px" client:load />
```

- remark-mock: 対応表にある lang のフェンスを `<FenceBlock lang code [height] [theme] [その他メタ]>` に変換。
  `uivolve` 系は従来どおり `<ExtMockup>`。import は使われたものだけ注入 (`FenceBlock` / `ExtMockup`)。
- core: `FenceBlock` が lang → 描画部品を引いて描く。表示先は `components` に `FenceBlock` を 1 つ足すだけ。
- 新オプション `fenceLangs` (既定: 第 1 段の全言語) で対象を絞れる。`false` で無効化 (= 従来動作)。

### 2.2 core の構成

```
packages/core/src/blocks/
  FenceBlock.tsx      lang → renderer のディスパッチ、ErrorBoundary、エラー表示 (エラー文 + ソース)、
                      height/theme の適用、--sx-* 色の取得 (getComputedStyle) フック
  registry.ts         registerFence(lang, { kind: 'text' | 'data', render }) / 別名 (dot=graphviz, tsv→csv)
  meta.ts             parseFenceMeta('height=320 theme=dark key=value') — remark 側と共有せず core 側で解釈
  theme.ts            useSxPalette(): --sx-* から前景/背景/罫線/系列色を取得 (ダーク切替も追従)
  renderers/
    mermaid.tsx       既存 components/Mermaid.tsx の描画ロジックを関数に抽出して共用 (theme を --sx-* から)
    graphviz.tsx      @hpcc-js/wasm-graphviz (wasm を JS に内包 — 別ファイル配信不要)
    math.tsx          katex.renderToString(code, { displayMode: true, output: 'mathml' })
    dbml.tsx          @dbml/parse で解析 → mermaid erDiagram 文字列に変換 → mermaid renderer へ
    echarts.tsx       echarts.init(el, テーマ) + setOption(data)。ResizeObserver で追従
    vegaLite.tsx      vega-embed (actions: false)。config に --sx-* 由来の色を差し込む
    table.tsx         CSV/TSV/配列 → 表。見出しクリックで昇降順、上部に絞り込み入力
    wavedrom.tsx      wavedrom.renderAny → onml.stringify で SVG
  csv.ts              RFC 4180 準拠の最小 CSV パーサ (依存なし。引用符・改行入りセル対応)
```

- データ型は既存 `parseDsl` (JSON5/YAML 自動判別) で解釈してから renderer に渡す。
- **math は MathML 出力**にする: KaTeX の CSS / フォントが不要になり、Vite・esbuild・Astro のどこでも
  追加設定なしで描ける (Chromium 109+ / Safari / Firefox が MathML Core 対応)。見た目が不十分なら
  第 2 段で HTML 出力 + CSS に切り替える。
- 既存 xtype `mermaid` は `renderers/mermaid.tsx` を呼ぶ形にリファクタ (挙動は同じ、テーマ追従だけ改善)。
- `index.ts` から `FenceBlock`, `registerFence`, `registeredFences` を export。
- スタイルは `styles.css` の `@layer sx` に `.sx-fence` 系を追加 (ネスト記法、色は `--sx-*`)。

### 2.3 table の入力形式

````md
```csv sortable filter
コード,名称,有効
A01,東京,true
```

```table
columns:
  - { dataIndex: code, text: コード, width: 80 }
  - { dataIndex: name, text: 名称, flex: 1 }
  - { dataIndex: price, text: 単価, align: right }
data:
  - { code: A01, name: 東京, price: 1200 }
```
````

- `table` は `columns` 省略可 (data のキーから自動生成)。トップレベルが配列なら data とみなす。
- 列定義の名前は uivolve の grid (ExtJS 互換) に合わせる: `dataIndex` / `text` / `width` / `flex` / `align`。
- 並べ替え・絞り込みは既定で ON。メタ `sort=false` / `filter=false` で無効化。

### 2.4 依存の追加 (すべて @uivolve/core の dependencies)

| パッケージ | ライセンス | 用途 |
|---|---|---|
| `@hpcc-js/wasm-graphviz` | Apache-2.0 | dot / graphviz |
| `katex` | MIT | math |
| `@dbml/parse` | Apache-2.0 | dbml 解析 (当初案の `@dbml/core` は SQL 各方言のパーサ込みで 15MB あったため、DBML コンパイラ単体に変更。439KB) |
| `echarts` | Apache-2.0 | echarts |
| `vega` / `vega-lite` / `vega-embed` | BSD-3-Clause | vega-lite |
| `wavedrom` | MIT | wavedrom |

着手時に各最新版の実ライセンスとブラウザ動作 (Node 専用 API への依存がないか) を確認する。
dbml のパーサはサイズが大きいので、バンドル後の分割チャンクのサイズを記録する
(実測: `@dbml/core` 15MB / gzip 2.6MB → `@dbml/parse` 439KB / gzip 111KB)。

## 3. 表示先ごとの作業

| 表示先 | 作業 |
|---|---|
| **remark-mock** | 対応表 + `<FenceBlock>` 出力、`fenceLangs` オプション、`index.d.ts` 更新、JSDoc 更新 |
| **mdx-demo (Astro)** | 設定変更なし (import 自動注入)。サンプルページ `pages/blocks.mdx` を追加し index から導線 |
| **MDX Playground** | `MDX_COMPONENTS` に `FenceBlock` を追加。サンプルに blocks.mdx を ?raw で追加 |
| **VSCode 拡張** | `MDX_COMPONENTS` に追加。**build.mjs の webview を `format: 'esm'` + `splitting: true` に変更** (現状 `iife` は動的 import を 1 本にインライン化するため分割されない)。webview HTML の script を `type="module"` に、CSP の nonce を維持したままチャンク読込を許可 (`script-src` に webview の cspSource を追加)。vega の式評価は既存の `'unsafe-eval'` で動く想定 — 実機確認する。VSIX サイズ増分を記録 |
| **validate-dsl** | 対象フェンスを拡張。データ型 (echarts/vega-lite/table/wavedrom) は parseDsl で構文検証、csv/tsv は列数の不一致を警告。テキスト型はスキップ (件数だけ表示) |
| **uivolve-mock スキル** | `skills/uivolve-mock/references/dsl-guide.md` に「MDX 仕様書で使える図・表フェンス」節を追加 (どの場面で何を使うか: 画面遷移=mermaid、テーブル定義=dbml、コード値一覧=csv、KPI=echarts 等)。サンプル MDX を `npm run docs` の同期対象に追加 |
| **CLAUDE.md** | 構成欄の remark-mock / core の説明に FenceBlock を追記 |

## 4. 実装順序 (コミット単位)

1. `feat(core): FenceBlock とフェンス描画レジストリを追加` — 骨格 + エラー表示 + テーマフック + mermaid renderer (既存 xtype もこれを使うよう整理)
2. `feat(remark-mock): 言語名フェンスを FenceBlock に変換` — 対応表 / fenceLangs / 型定義
3. `feat(playground): MDX Playground で FenceBlock を描画` — この時点で mermaid がエンドツーエンドで動くことを確認
4. `feat(core): table / csv / tsv フェンス` (依存なし)
5. `feat(core): math / graphviz / wavedrom フェンス`
6. `feat(core): echarts / vega-lite フェンス`
7. `feat(core): dbml フェンス (mermaid erDiagram へ変換)`
8. `feat(mdx-demo): 図・表フェンスのサンプルページ`
9. `feat(vscode-ext): FenceBlock 対応と webview の分割バンドル化`
10. `feat(scripts): validate-dsl でデータ型フェンスを検証`
11. `docs(skills): uivolve-mock ガイドに図・表フェンスを追記` + CLAUDE.md 更新

## 5. 終了判定

### 5.1 基準値 (着手前に計測、2026-11-04 / main `4bf24dc` 相当)

| 対象 | 値 |
|---|---|
| DSL Playground 入口 `main-*.js` | 29KB (gzip) |
| MDX Playground 入口 `mdx-playground-*.js` | 155KB (gzip) |
| VSCode webview `dist/webview.js` / `webview.css` | 4.2MB / 1.1MB (minify 済み) |

### 5.2 各手順 (コミット) の完了条件

すべて満たしたらコミットしてよい。満たせない場合はコミットせず、原因と対処案を報告して相談する。

1. `npm run typecheck && npm run build` が成功する
2. その手順で追加したフェンスを **MDX Playground でスクリーンショットし、画像を見て**描画を確認している
   (手順 1〜3 は mermaid、手順 4 以降はそのフェンス)
3. 既存のサンプル (`apps/mdx-demo/src/pages/index.mdx`) のスクリーンショットが着手前と同じ見た目である (回帰なし)
4. ブラウザのコンソールにエラーが出ていない

### 5.3 第 1 段全体の完了条件 (Definition of Done)

**A. 機能**
- [ ] 9 種のフェンス (`mermaid` `dot`/`graphviz` `math` `dbml` `echarts` `vega-lite` `table` `csv`/`tsv` `wavedrom`) が
      サンプルページ `blocks.mdx` で描画される — **3 つの表示先すべて**で確認:
      mdx-demo (`npm run mdx:build` の成果物をプレビュー)、MDX Playground、VSCode 拡張のプレビュー
- [ ] メタ `height=` が全フェンスで効き、`theme=dark` と uivolve のダークテーマで背景・文字・罫線が
      周囲と馴染む (ライト / ダーク両方のスクリーンショットで確認)
- [ ] table / csv / tsv: 見出しクリックで昇順 → 降順が切り替わり、絞り込み入力で行が減る (実操作で確認)
- [ ] `fenceLangs: false` を渡すと従来どおり ` ```mermaid ` がコードブロックとして表示される

**B. エラー処理**
- [ ] 9 種それぞれに構文エラーを入れたサンプル (`blocks-error.mdx`) で、各ブロックに **エラー文 + 元ソース**が出る
- [ ] エラーのブロックがあっても、同じページの他のブロックは正常に描画される
- [ ] 例外がページ全体 (MDX Playground の PreviewBoundary) まで伝わらない

**C. 回帰なし**
- [ ] 既存の `index.mdx` / `runbook.mdx` / `external.mdx` の見た目が着手前と変わらない (スクリーンショット比較)
- [ ] ` ```uivolve ` フェンスと `<uivolve src>` が従来どおり動く
- [ ] 既存の xtype `mermaid` (uivolve YAML 内) が従来どおり描ける

**D. 読み込みの分割**
- [ ] 追加ライブラリ (graphviz / katex / dbml / echarts / vega / wavedrom) は、Vite のビルド結果で
      それぞれ**入口とは別のチャンク**になっている
- [ ] 入口のサイズ増加が基準値比 **+10KB (gzip) 以内** (DSL Playground 入口・MDX Playground 入口とも)
- [ ] 図・表フェンスを含まないページを開いたとき、追加ライブラリのチャンクが通信に出ない
      (headless Chromium で通信を記録して確認)
- [ ] VSCode webview の初期読み込み `webview.js` の増加が基準値比 **+200KB 以内**
      (ライブラリ本体は分割チャンクとして `dist/` に同梱)

**E. VSCode 拡張**
- [ ] `npm run ext:vsix` が成功し、VSIX サイズを記録している
- [ ] ネットワークを切った状態でも 9 種すべてがプレビューで描ける (外部への通信なし)
- [ ] CSP 違反がコンソールに出ない

**F. 検証スクリプト**
- [ ] `npm run validate -- apps/mdx-demo/src/pages/blocks.mdx` がエラー 0 件で終了コード 0
- [ ] `blocks-error.mdx` に対して、echarts / vega-lite / table / wavedrom の構文エラーと csv / tsv の列数不一致を
      **それぞれ 1 件ずつ検出**し、終了コードが 0 以外

**G. ビルド**
- [ ] `npm run typecheck` / `npm run build` / `npm run mdx:build` / `npm run ext:build` がすべて成功

**H. ドキュメント**
- [ ] 追加した部品すべてに JSDoc があり、`npm run docs` / `npm run schema` 実行後に差分が残らない
- [ ] `skills/uivolve-mock/references/dsl-guide.md` に図・表フェンスの節がある
- [ ] CLAUDE.md の構成欄を更新している
- [ ] 追加した依存のライセンスを実パッケージで確認し、この計画書の 2.4 の表と一致している

### 5.4 確認手順

- スクリーンショット: `npm run dev` を起動し `node scripts/shot-uivolve.mjs <file> [out.png] [--bottom]`。
  playwright-core はルートの devDependencies に入っている (Chromium は ms-playwright キャッシュから自動検出)
- mdx-demo: `npm run mdx:build` 後に成果物をプレビューして撮影
- 通信の記録・ダークテーマ切替・table の操作は headless Chromium の使い捨てスクリプトで行う
  (両 Playground の `window.__uivolve.setCode(code)` を利用)

### 5.5 途中で止めて相談する条件

- vega / @dbml/core がブラウザで動かず、代替が必要になったとき
- VSCode webview の分割読み込みが CSP の調整で解決せず、分割なしに切り替える必要があるとき
- D の容量基準を満たせないとき
- 既存ページの見た目が変わる (C を満たせない) とき

## 6. リスクと対処

| リスク | 対処 |
|---|---|
| vega / dbml がブラウザで Node API を要求する | 着手時に単体で動作確認。だめなら代替 (dbml は自前の簡易パーサ) を検討して相談 |
| VSCode webview の ESM 分割で CSP に阻まれる | cspSource を script-src に追加。最悪 iife のまま全同梱 (分割なし) にフォールバック |
| mermaid の initialize がグローバルでテーマが混ざる | 描画ごとに initialize し直す (現行と同じ) + テーマ値は呼び出し時に渡す |
| ECharts の高さ 0 問題 (Astro の hydration 前) | height 未指定時は既定 320px を必ず付ける。ResizeObserver で再レイアウト |
| MathML の見た目が粗い | 第 2 段で HTML 出力 + KaTeX CSS へ切替 |

## 7. 第 2 段以降の候補 (今回は対象外)

- 外部ファイル参照 (`<mermaid src>`, `<table src="./codes.csv">`)
- d2 / nomnoml / markmap / svgbob / chartjs / gantt / jsontree
- ビルド時 SVG 化 (静的サイト高速化)
- 描画ライブラリの依存の持ち方 (code-review 指摘 8、2026-11-04 に保留と決定):
  現状 echarts / vega / @hpcc-js/wasm-graphviz / katex / @dbml/parse / wavedrom は @uivolve/core の
  通常の dependencies で、画面モックだけ使う場合も npm install される (描画時の読み込みは動的 import 済み)。
  core を npm に公開すると決めた時点で、optional peerDependencies 化か @uivolve/blocks への分離を検討する
