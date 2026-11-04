/**
 * RFC 4180 準拠の最小 CSV パーサ (依存なし)。
 * ダブルクォートで囲んだセル内の区切り文字・改行・"" (エスケープ) に対応する。
 * 末尾の空行は捨てる。区切り文字は tsv なら '\t'
 */
export function parseCsv(source: string, delimiter = ','): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  const text = source.replace(/\r\n?/g, '\n')

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"'
          i++
        } else {
          quoted = false
        }
      } else {
        cell += ch
      }
    } else if (ch === '"' && cell === '') {
      quoted = true
    } else if (ch === delimiter) {
      row.push(cell)
      cell = ''
    } else if (ch === '\n') {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else {
      cell += ch
    }
  }
  if (cell !== '' || row.length) {
    row.push(cell)
    rows.push(row)
  }
  while (rows.length && rows[rows.length - 1].every((c) => c.trim() === '')) rows.pop()
  return rows
}
