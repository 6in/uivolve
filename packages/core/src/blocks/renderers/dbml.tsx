import { useEffect, useState } from 'react'
import type { FenceRendererProps } from '../registry'
import { useAsyncError } from '../theme'
import { MermaidSvg } from './mermaid'

// @dbml/parse の rawDb (解析結果の JSON) のうち、ER 図に使う部分だけ
interface DbmlField {
  name: string
  type: { type_name: string }
  pk?: boolean
  unique?: boolean
  not_null?: boolean
  note?: { value: string } | null
}
interface DbmlTable {
  name: string
  /** null は既定スキーマ (public) */
  schemaName: string | null
  fields: DbmlField[]
  /** 複合主キー ([pk] を複数列に付けた場合も含む) / 一意制約は indexes に入る */
  indexes?: Array<{ pk?: boolean; unique?: boolean; columns: Array<{ type: string; value: string }> }>
}
interface DbmlEndpoint {
  schemaName: string | null
  tableName: string
  fieldNames: string[]
  relation: '1' | '*'
}
interface DbmlRawDb {
  tables: DbmlTable[]
  refs: Array<{ endpoints: [DbmlEndpoint, DbmlEndpoint] }>
}

/** mermaid の識別子に使えない文字を _ にする */
const ident = (s: string) => s.replace(/[^A-Za-z0-9_]/g, '_')
/** mermaid の "..." 内に入れる文字列 (" は使えないので ' に) */
const quote = (s: string) => `"${s.replace(/"/g, "'").replace(/\s+/g, ' ')}"`

/** テーブル名 → mermaid のエンティティ (識別子と表示名が違えば別名を付ける) */
function entityRef(schema: string | null | undefined, table: string) {
  const label = schema && schema !== 'public' ? `${schema}.${table}` : table
  return { id: ident(label), label }
}

/** DBML の解析結果を mermaid の erDiagram に変換する */
export function dbmlToMermaid(db: DbmlRawDb): string {
  const lines = ['erDiagram']
  // FK (多側の列) を記録して属性に FK を付ける
  const fks = new Set<string>()
  for (const ref of db.refs) {
    for (const ep of ref.endpoints) {
      if (ep.relation === '*') {
        const { id } = entityRef(ep.schemaName, ep.tableName)
        for (const f of ep.fieldNames) fks.add(`${id}.${f}`)
      }
    }
  }

  for (const t of db.tables) {
    const { id, label } = entityRef(t.schemaName, t.name)
    const indexCols = (pred: (i: NonNullable<DbmlTable['indexes']>[number]) => boolean | undefined) =>
      new Set(
        (t.indexes ?? [])
          .filter(pred)
          .flatMap((i) => i.columns.filter((c) => c.type === 'column').map((c) => c.value)),
      )
    const pkCols = indexCols((i) => i.pk)
    const ukCols = indexCols((i) => i.unique)
    lines.push(`  ${id}${id === label ? '' : `[${quote(label)}]`} {`)
    for (const f of t.fields) {
      const pk = f.pk || pkCols.has(f.name)
      const keys = [pk && 'PK', fks.has(`${id}.${f.name}`) && 'FK', (f.unique || ukCols.has(f.name)) && !pk && 'UK']
        .filter(Boolean)
        .join(', ')
      const notes = [f.not_null && !pk && 'NOT NULL', f.note?.value].filter(Boolean).join(' / ')
      const type = f.type.type_name.replace(/\s+/g, '_').replace(/[^\w()[\]\-,]/g, '_')
      lines.push(`    ${type} ${ident(f.name)}${keys ? ` ${keys}` : ''}${notes ? ` ${quote(notes)}` : ''}`)
    }
    lines.push('  }')
  }

  const left = { '1': '||', '*': '}o' }
  const right = { '1': '||', '*': 'o{' }
  for (const { endpoints: [a, b] } of db.refs) {
    const ea = entityRef(a.schemaName, a.tableName)
    const eb = entityRef(b.schemaName, b.tableName)
    const many = a.relation === '*' ? a : b
    lines.push(
      `  ${ea.id} ${left[a.relation]}--${right[b.relation]} ${eb.id} : ${quote(many.fieldNames.join(', '))}`,
    )
  }
  return lines.join('\n')
}

/** 構文エラー ({ diagnostic, start: 文字位置 }) を「n 行 m 列: 内容」にまとめる */
function dbmlError(source: string, errors: Array<{ diagnostic: string; start: number }>): Error {
  return new Error(
    errors
      .map((e) => {
        const before = source.slice(0, Math.max(0, e.start)).split('\n')
        return `${before.length} 行 ${before[before.length - 1].length + 1} 列: ${e.diagnostic}`
      })
      .join('\n'),
  )
}

/**
 * ```dbml — DBML (dbdiagram.io の記法) のテーブル定義から ER 図を描く。
 * @dbml/parse で解析して mermaid の erDiagram に変換する (列の型・PK / FK / UK・NOT NULL・note を表示)。
 * @dbml/core は SQL 各方言のパーサを含み 15MB あるため、DBML のコンパイラだけを使う
 */
export function DbmlFence({ source }: FenceRendererProps) {
  const throwAsync = useAsyncError()
  const [mermaidSource, setMermaidSource] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    import('@dbml/parse')
      .then(({ Compiler, DEFAULT_ENTRY, MemoryProjectLayout }) => {
        const layout = new MemoryProjectLayout()
        layout.setSource(DEFAULT_ENTRY, source)
        const compiler = new Compiler(layout)
        const errors = compiler.parse.errors(DEFAULT_ENTRY) as unknown as Array<{
          diagnostic: string
          start: number
        }>
        if (errors.length) throw dbmlError(source, errors)
        return dbmlToMermaid(compiler.parse.rawDb(DEFAULT_ENTRY) as unknown as DbmlRawDb)
      })
      .then(
        (m) => alive && setMermaidSource(m),
        (e) => alive && throwAsync(e),
      )
    return () => {
      alive = false
    }
  }, [source, throwAsync])

  return mermaidSource ? <MermaidSvg source={mermaidSource} /> : null
}
