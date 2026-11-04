/**
 * RFC 4180 準拠の最小 CSV パーサ (依存なし)。
 * ダブルクォートで囲んだセル内の区切り文字・改行・"" (エスケープ) に対応する。
 * 末尾の空行は捨てる。区切り文字は tsv なら '\t'。
 * 閉じていないダブルクォートは構文エラー (開始行を示す例外) にする。
 * 列数の不一致はエラーにしない (表示はできるので、検出は validate-dsl に任せる)
 */
export function parseCsv(source: string, delimiter = ','): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  let quoteLine = 0
  let line = 1
  const text = source.replace(/\r\n?/g, '\n')

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === '\n') line++
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
      quoteLine = line
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
  if (quoted) {
    throw new Error(`${quoteLine} 行目のダブルクォート (") が閉じていません`)
  }
  if (cell !== '' || row.length) {
    row.push(cell)
    rows.push(row)
  }
  while (rows.length && rows[rows.length - 1].every((c) => c.trim() === '')) rows.pop()
  return rows
}
