---
name: uivolve-mock
description: 画面要件から uivolve DSL の画面モック・MDX 画面仕様書を生成する手順 (このリポジトリ用)。「○○画面のモックを作って」「画面仕様書 / 画面定義書を書いて」「サンプルを追加して」といった依頼で使う。要件整理 → DSL/MDX 生成 → validate → スクリーンショット目視までのワークフロー。
---

# uivolve モック / 画面仕様書の生成 (リポジトリ内)

要件から DSL / MDX 仕様書を生成するワークフロー。書き方の規約・テンプレ・
よくある失敗は **`skills/uivolve-mock/references/dsl-guide.md`** (配布用スキルと共通の
ガイド) にまとまっているので必ず先に読む。

## 手順

### 1. 要件整理と出力先の確認

- 画面の目的 / 領域構成 / 出力形式 (DSL 単体 or MDX 仕様書) を確定する
- 出力先の指定がなければ執筆用の `work/` (gitignore 済み) に置く。
  Playground のサンプル追加なら `apps/playground/src/samples.ts`、
  MDX デモへの追加なら `apps/mdx-demo/src/pages/*.mdx`

### 2. サンプルと部品の確認

- **`skills/uivolve-mock/references/samples/INDEX.md`** で近い画面のサンプルを探して
  1〜2 本読む (カテゴリ別一覧 + xtype / layout 逆引き。実体は Playground のサンプルと
  MDX デモを自動展開したもの)
- xtype / layout / config は `reference/components.md` で確認する (推測で書かない)
- 足りない xtype が要る場合は生成を止めて `/add-component` の手順でまず部品を追加する

### 3. 生成

`skills/uivolve-mock/references/dsl-guide.md` の規約に従う。要点:

- YAML 推奨、全部品に camelCase の itemId、store.data に現実的なサンプル 3〜5 行
- ルートに height を書かない (フェンス meta / ExtMockup の height で決める)
- MDX はフェンス meta で `height=` `theme=` を指定し、itemId 対応表をセットで書く

### 4. 機械検証

```bash
npm run validate -- <file>
```

構文 + 未知 xtype/layout の検出 + itemId 付与漏れの警告。MDX を渡すと
```uivolve フェンスを抽出して個別に検証する。エラー 0 になるまで直す。

### 5. スクリーンショット目視

```bash
npm run dev   # 起動していなければ (バックグラウンド)
node scripts/shot-uivolve.mjs <file> [out.png] [--bottom]
```

- `.yaml` / `.json5` → DSL Playground、`.md` / `.mdx` → MDX Playground に自動で流し込む
- ステータスバーが `✓ OK` で exit 0。スクリーンショットを**必ず目視**する:
  未知 xtype のプレースホルダ、border / vbox 内での潰れ、オーバーフロー、
  コンソールエラー (出力の problems) がないこと
- 長い MDX は `--bottom` で後半も確認する

### 6. 仕上げ

- サンプル/デモとして追加した場合は `npm run typecheck && npm run build` も通す
- ユーザーへの提示時は、公開 Playground への貼り付け確認方法と
  「AI への引き渡し」定型文 (dsl-guide.md 参照) を添える
- コミットする場合: `feat(playground): サンプル○○を追加` 等の既存規約に従う
