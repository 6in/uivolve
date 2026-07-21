/**
 * MDX Playground のサンプル。
 * 「画面仕様書」「障害対応報告書」は apps/mdx-demo の実ファイルを ?raw で
 * そのまま読み込む (デモと Playground でサンプルがずれないように)。
 */
import specDoc from '../../../mdx-demo/src/pages/index.mdx?raw'
import runbookDoc from '../../../mdx-demo/src/pages/runbook.mdx?raw'

const starter = `---
title: ログイン画面 仕様書
---

# ログイン画面 仕様書

<!-- HTML コメントも書ける (プレビューには表示されない) -->

Markdown の中に \`\`\`uivolve フェンスで ExtJS 互換 DSL を書くと、
その場に**操作できる画面モック**が描画される。フェンスの meta で
\`height=<高さ>\` と \`theme=<neptune|classic|gray|dark>\` を指定できる。

\`\`\`uivolve height=300
{
  xtype: 'window',
  itemId: 'loginDialog',
  title: 'ログイン',
  width: 360,
  bodyPadding: 14,
  items: [
    { xtype: 'textfield', itemId: 'userField', fieldLabel: 'ユーザー ID', emptyText: 'user@example.com' },
    { xtype: 'textfield', itemId: 'passField', fieldLabel: 'パスワード', inputType: 'password' },
    { xtype: 'checkbox', itemId: 'keepLogin', boxLabel: 'ログイン状態を保持する' },
  ],
  bbar: [
    '->',
    { itemId: 'btnLogin', text: 'ログイン', ui: 'primary', iconCls: 'x-fa fa-right-to-bracket' },
  ],
}
\`\`\`

## 入力仕様

| itemId | 項目 | 仕様 |
|---|---|---|
| \`userField\` | ユーザー ID | 必須。メールアドレス形式 |
| \`passField\` | パスワード | 必須。8 文字以上 |
| \`btnLogin\` | ログイン | 認証成功でメイン画面へ遷移 |

> 左のエディタを書き換えると右のプレビューに反映される。
> 手元の MDX ファイルを丸ごと貼り付けても OK (frontmatter は無視される)。
`

export interface MdxSample {
  name: string
  code: string
}

export const mdxSamples: MdxSample[] = [
  { name: 'はじめての MDX モック', code: starter },
  { name: '画面仕様書 (MDX デモと同じもの)', code: specDoc },
  { name: '障害対応報告書 (リッチドキュメント)', code: runbookDoc },
]
