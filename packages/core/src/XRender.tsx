import { resolveComponent } from './registry'
import type { ComponentConfig, RendererProps } from './types'

/** xtype 省略時の解決 (ExtJS のコンテナ defaultType は 'panel') */
function effectiveXtype(config: ComponentConfig): string {
  if (config.xtype) return config.xtype
  if (
    config.items ||
    config.title !== undefined ||
    config.layout ||
    config.tbar ||
    config.bbar ||
    config.buttons
  ) {
    return 'panel'
  }
  return 'component'
}

/**
 * ComponentConfig 1 つを対応する React コンポーネントで描画する。
 * 未登録の xtype はプレースホルダを表示する(描画は止めない)。
 */
export function XRender({ config }: RendererProps) {
  if (config.hidden) return null
  const xtype = effectiveXtype(config)
  const Comp = resolveComponent(xtype)
  if (!Comp) {
    return (
      <div className="sx-unknown" role="note">
        未対応の xtype: <code>{xtype}</code>
      </div>
    )
  }
  return <Comp config={config} />
}
