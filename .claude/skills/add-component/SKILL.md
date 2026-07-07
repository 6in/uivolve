---
name: add-component
description: similar-extjs に新しい xtype コンポーネントまたはレイアウトを追加する手順。ExtJS 互換の命名調査、実装、レジストリ登録、CSS、サンプル、ドキュメント自動生成、スクリーンショット検証、コミットまでの一連のワークフロー。
---

# コンポーネント / レイアウトの追加手順

このリポジトリは ExtJS 互換 DSL の画面モックライブラリ。新しい xtype やレイアウトは
**レジストリ方式**で追加する。アーキテクチャの変更は不要。

## 設計原則 (必読)

1. **ExtJS 互換を最優先**: xtype 名・config 名は ExtJS 本家に合わせる。ExtJS の config を
   コピペしたら動くのが理想。命名は Sencha 公式ドキュメント (docs.sencha.com/extjs/7.9.0) で
   確認する。レイアウトの一覧は `docs/extjs-layouts.md` にまとめ済み。
2. **モックであること**: データ通信や本物の振る舞いは実装しない。見た目と、モックとして
   意味のある軽いインタラクション (折りたたみ、タブ切替、ドラッグ等) だけ。
3. **JSDoc は必須**: 実装関数の直前の JSDoc から `docs/components.md` が自動生成される。
   1 行目は `xtype: 'foo' — 説明` の形式で書く (レイアウトは `foo: 説明`)。
4. **モダン CSS**: `@layer sx` 内にネスト記法で書く。テーマは CSS カスタムプロパティ
   (`--sx-accent` 等) を使う。color-mix() / subgrid / :has() / Popover API など積極活用。

## コンポーネント追加の手順

### 1. 実装ファイルを作成

`packages/core/src/components/Foo.tsx`:

```tsx
import type { RendererProps } from '../types'
import { cx, styleOf } from '../utils'

/** xtype: 'foo' — 説明文 (docs/components.md にこのまま載る)。対応 config も書く。 */
export function Foo({ config }: RendererProps) {
  return (
    <div className={cx('sx-foo', config.cls)} style={styleOf(config)}>
      ...
    </div>
  )
}
```

- ルート要素には必ず `styleOf(config)` (width/height/flex/margin 等の共通処理) と
  `config.cls` を適用する。
- パネル系 (タイトルバー付き) は `PanelShell` を再利用する (`GridPanel.tsx` が参考例)。
- フィールド系 (fieldLabel 付き) は `fields.tsx` の `FieldRow` パターンを踏襲する。
- アイコンは `<Icon iconCls={config.iconCls} />` (`components/Icon.tsx`、Font Awesome 対応)。
- ドロップダウンが必要なら `MenuTrigger` (`components/misc.tsx`、Popover API) を使う。
- 値は `defaultValue` / `defaultChecked` で非制御にする (モックとして触れるように)。

### 2. config の型を追加

新しい config キーを使う場合は `packages/core/src/types.ts` の `ComponentConfig` に追記する。
(index signature があるので必須ではないが、主要な config は型を付ける)

### 3. レジストリに登録

`packages/core/src/components/index.ts`:

```ts
import { Foo } from './Foo'
registerComponent(['foo', 'fooalias'], Foo)  // ExtJS の xtype 別名も一緒に
export { Foo } from './Foo'
```

### 4. CSS を追加

`packages/core/src/styles.css` の `@layer sx` 内にセクションコメント付きで追加:

```css
/* ------------------------------------------------------------ フー */
.sx-foo {
  border: 1px solid var(--sx-border);
  border-radius: var(--sx-radius);
  /* ネスト記法・テーマ変数を使う */
}
```

### 5. サンプルに反映

`apps/playground/src/samples.ts` の既存サンプルに組み込むか、新サンプルを追加する。
新サンプルは `samples` 配列の末尾に `{ name: '...', code: ... }` を足す。

### 6. ドキュメントを再生成

```bash
npm run docs   # JSDoc から docs/components.md を再生成
```

README.md の対応コンポーネント表にも 1 行追加する。

### 7. 検証

```bash
npm run typecheck && npm run build
```

さらに dev サーバー (`npm run dev`、ポート 5173) に対して headless Chromium で
スクリーンショットを撮り、**目視で確認する**。Playwright は scratchpad に
`playwright-core` を入れ、`~/Library/Caches/ms-playwright/chromium_headless_shell-*/`
配下の chrome-headless-shell を executablePath に指定して使う (過去の検証スクリプト例:
scratchpad の shot*.mjs)。確認ポイント:

- コンポーネント単体の描画
- パネル body / border リージョン / hbox・vbox 内に置いたときの伸縮
- コンソールエラーがないこと

### 8. コミット

`feat(core): xtype 'foo' を追加` の形式で、変更一式 (実装 + CSS + サンプル + docs) を
まとめて 1 コミットにする。

## レイアウト追加の場合

手順はほぼ同じで、以下が異なる:

- 実装先: `packages/core/src/layouts/index.tsx` に `LayoutProps` を受ける関数を追加
  (PanelShell に依存する場合は循環 import 回避のため `components/` 側に置く。
  例: `components/Accordion.tsx`)
- 登録: 同ファイル末尾の `registerLayout('foo', FooLayout)`
- JSDoc 1 行目は `foo: 説明` 形式
- 高さの連鎖に注意: コンテナを埋めるレイアウトは `.sx-layout-foo { block-size: 100% }` と
  子側の `min-block-size: 0` が必要 (既存レイアウトの CSS を参照)
- `docs/extjs-layouts.md` の対応状況列を「対応済み」に更新する
