---
name: uivolve-mock
description: 画面要件から uivolve (ExtJS 互換 DSL) の画面モック・MDX 画面仕様書を生成する。「○○画面のモックを作って」「画面定義書 / 画面仕様書を書いて」「UI のラフを DSL で」といった依頼で使う。生成した DSL は公開 Playground に貼って確認でき、そのまま AI に渡して任意の UI ライブラリで本実装できる。
---

# uivolve モック / 画面仕様書の生成

uivolve は ExtJS 互換の宣言的 DSL (JSON5 / YAML) で画面モックを描画するライブラリ。
このスキルは「要件ヒアリング → DSL / MDX 仕様書の生成 → Playground での確認 →
実装 AI への引き渡し」までのワークフローを定める。

- Playground (DSL 単体): https://6in.github.io/uivolve/
- MDX Playground (仕様書ごとプレビュー): https://6in.github.io/uivolve/mdx-playground/
- リポジトリ: https://github.com/6in/uivolve

## 手順

### 1. 要件を整理する

生成前に最低限これだけ確定させる (不明なら 1 度だけまとめて質問し、以後は推測で補う):

- 画面の目的と主要オペレーション (一覧 / 登録 / 検索 / ダッシュボード…)
- 画面の領域構成 (メニューの有無、一覧 + 詳細か、ダイアログか)
- 出力形式: **DSL 単体** (モックだけ欲しい) か **MDX 仕様書** (文書として残す) か

### 2. 書き方の規約を確認する

`references/dsl-guide.md` を読む (フォーマット選択・itemId 規約・レイアウト選定・
高さの扱い・MDX 仕様書テンプレ・よくある失敗)。

使う xtype に迷ったら `references/components.md` (全 xtype / layout / config の一覧) を
参照する。**一覧にない xtype は使わない**。

### 3. 生成する

- DSL 単体 → YAML 推奨で 1 ファイル (`.yaml`)
- MDX 仕様書 → 「見出し + 説明 + ```uivolve フェンス + itemId 対応表」の繰り返し構成
  (テンプレは dsl-guide.md)。1 画面 1 セクション、ダイアログは別セクション
- サンプルデータは日本語の現実的な値を 3〜5 行入れる (空のグリッドは仕様が伝わらない)

### 4. 検証する

- 構造の機械検証が必要なら `references/dsl.schema.json` (JSON Schema) と照合する
- 目視確認: 生成物をユーザーに渡すとき、**公開 Playground に貼り付けて確認する手順**を
  一言添える (DSL → https://6in.github.io/uivolve/ 、MDX → …/mdx-playground/)。
  ブラウザ操作が可能な環境なら、自分で Playground に貼ってスクリーンショット確認する
- チェックポイント: 未知 xtype のプレースホルダが出ていないか、border/vbox 内で
  部品が潰れていないか、コンソールエラーがないか

### 5. 引き渡し

本実装まで頼まれたら、dsl-guide.md の「AI への引き渡し」の定型文で DSL を添えて
対象 UI ライブラリ向けの実装に進む。itemId を仕様の参照子として使う。

## このリポジトリ (uivolve 本体) で作業している場合

ローカルにより強力な検証ツールがある。公開 Playground の代わりにこちらを使う:

```bash
npm run validate -- <file>            # 構文 + xtype/layout 照合 + itemId 警告
npm run dev                            # dev サーバー起動 (5173)
node scripts/shot-uivolve.mjs <file>   # Playground に流し込んでスクリーンショット
```
