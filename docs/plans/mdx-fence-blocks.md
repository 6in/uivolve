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
    dbml.tsx          @dbml/core で解析 → mermaid erDiagram 文字列に変換 → mermaid renderer へ
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
| `@dbml/core` | Apache-2.0 | dbml 解析 |
| `echarts` | Apache-2.0 | echarts |
| `vega` / `vega-lite` / `vega-embed` | BSD-3-Clause | vega-lite |
| `wavedrom` | MIT | wavedrom |

着手時に各最新版の実ライセンスとブラウザ動作 (Node 専用 API への依存がないか) を確認する。
特に `@dbml/core` はサイズが大きいので、バンドル後の分割チャンクのサイズを記録する。

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

## 5. 検証

各コミットで:
- `npm run typecheck && npm run build`

まとめて:
- `npm run mdx:build` (Astro の静的ビルドで remark 変換と SSR が通ること。部品は SSR で window に触れない)
- `npm run dev` + `node scripts/shot-uivolve.mjs apps/mdx-demo/src/pages/blocks.mdx <out> [--bottom]` で
  全フェンスをスクリーンショット**目視確認** (ライト / ダーク両方)
- エラー系: 各フェンスにわざと構文エラーを入れたサンプルで、エラー文 + ソースが出て他ブロックが無事なこと
- コンソールエラーがないこと
- `npm run validate -- apps/mdx-demo/src/pages/blocks.mdx` (正常系 0 件、壊したサンプルで検出)
- `npm run ext:vsix` → VSCode で MDX プレビューを開き全フェンスが描けること (オフライン)、VSIX サイズを記録
- 未使用ページで追加ライブラリのチャンクが読まれないこと (Playground の Network タブで確認)

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
