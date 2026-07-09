import { createContext, useContext, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/**
 * オーバーレイ (messagebox / toast / modal window) の描画先。
 * ExtMockup が .sx-viewport の要素を提供する。
 */
export const OverlayTargetContext = createContext<HTMLElement | null>(null)

/**
 * children を .sx-viewport 直下へポータル描画するラッパー。
 * パネル body や border リージョンなど途中の position: relative に捕まらず、
 * DSL のどこに書いてもモック全体を基準にオーバーレイできる。
 * viewport が未提供 (SSR や XRender 単体利用) のときはその場に描画する。
 */
export function Overlay({ children }: { children: ReactNode }) {
  const target = useContext(OverlayTargetContext)
  return target ? createPortal(children, target) : <>{children}</>
}
