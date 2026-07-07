import { registerComponent } from '../registry'
import { Button } from './Button'
import { GridPanel } from './GridPanel'
import { Image } from './Image'
import { Container, Panel, RawComponent } from './Panel'
import { Toolbar } from './Toolbar'
import {
  CheckItem,
  ComboBox,
  DisplayField,
  ListBox,
  TextArea,
  TextField,
} from './fields'

// 組み込み xtype の登録 (ExtJS の xtype 名に合わせる)
registerComponent(['panel', 'form'], Panel)
registerComponent(['container', 'fieldcontainer'], Container)
registerComponent(['component', 'box'], RawComponent)
registerComponent(['toolbar', 'tbar'], Toolbar)
registerComponent('button', Button)
registerComponent(['textfield', 'numberfield', 'datefield'], TextField)
registerComponent(['textarea', 'textareafield'], TextArea)
registerComponent(['checkbox', 'checkboxfield', 'radio', 'radiofield'], CheckItem)
registerComponent(['combobox', 'combo'], ComboBox)
registerComponent(['listbox', 'multiselect'], ListBox)
registerComponent(['displayfield', 'label'], DisplayField)
registerComponent(['grid', 'gridpanel'], GridPanel)
registerComponent(['image', 'imagecomponent'], Image)

export { Container, Panel, PanelShell, RawComponent } from './Panel'
export { Button } from './Button'
export { Toolbar } from './Toolbar'
export { GridPanel } from './GridPanel'
export { Image } from './Image'
export * from './fields'
