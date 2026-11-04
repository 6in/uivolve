// WaveDrom は型定義を同梱していないので、使う範囲だけ宣言する
declare module 'wavedrom' {
  /** onml 形式 (['svg', { attrs }, ...children]) の要素 */
  type Onml = [string, Record<string, unknown>, ...unknown[]]
  export const waveSkin: Record<string, unknown>
  export function renderAny(index: number, source: object, waveSkin: Record<string, unknown>): Onml
  export const onml: { stringify(tree: Onml): string }
}

declare module 'wavedrom/skins/dark.js' {
  const skins: Record<string, unknown>
  export default skins
}
