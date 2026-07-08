import { registerComponent } from '../registry'
import { Button } from './Button'
import { Chart } from './Chart'
import { ChatPanel } from './ChatPanel'
import { DatePicker } from './DatePicker'
import { Draw } from './Draw'
import { FieldSet } from './FieldSet'
import { GitGraph } from './GitGraph'
import { GridPanel } from './GridPanel'
import { HtmlEditor } from './HtmlEditor'
import { IFrame } from './IFrame'
import { Image } from './Image'
import { Markdown } from './Markdown'
import { Mermaid } from './Mermaid'
import { MessageBox } from './MessageBox'
import { NetworkGraph } from './NetworkGraph'
import { PagingToolbar } from './PagingToolbar'
import { Container, Panel, RawComponent } from './Panel'
import { TabPanel } from './TabPanel'
import { Toast } from './Toast'
import { Toolbar } from './Toolbar'
import { TreePanel } from './TreePanel'
import { Window } from './Window'
import {
  CheckItem,
  ComboBox,
  DisplayField,
  ListBox,
  TextArea,
  TextField,
} from './fields'
import { CheckGroup, Menu, ProgressBar, Slider, SplitButton } from './misc'
// accordion レイアウトの登録 (副作用 import)
import './Accordion'

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
registerComponent('tabpanel', TabPanel)
registerComponent('fieldset', FieldSet)
registerComponent('window', Window)
registerComponent(['treepanel', 'tree'], TreePanel)
registerComponent('menu', Menu)
registerComponent('splitbutton', SplitButton)
registerComponent(['progressbar', 'progress'], ProgressBar)
registerComponent(['slider', 'sliderfield'], Slider)
registerComponent(['radiogroup', 'checkboxgroup'], CheckGroup)
registerComponent('datepicker', DatePicker)
registerComponent('htmleditor', HtmlEditor)
registerComponent('pagingtoolbar', PagingToolbar)
registerComponent(['uxiframe', 'iframe'], IFrame)
registerComponent('markdown', Markdown)
registerComponent('mermaid', Mermaid)
registerComponent('gitgraph', GitGraph)
registerComponent(['networkgraph', 'forcegraph'], NetworkGraph)
registerComponent(['chatpanel', 'chat'], ChatPanel)
registerComponent(['chart', 'cartesian', 'polar'], Chart)
registerComponent('draw', Draw)
registerComponent(['messagebox', 'msgbox'], MessageBox)
registerComponent('toast', Toast)

export { Container, Panel, PanelShell, RawComponent } from './Panel'
export { Button } from './Button'
export { DatePicker } from './DatePicker'
export { Icon } from './Icon'
export { Toolbar } from './Toolbar'
export { GridPanel } from './GridPanel'
export { Chart } from './Chart'
export { ChatPanel } from './ChatPanel'
export { Draw } from './Draw'
export { GitGraph } from './GitGraph'
export { NetworkGraph } from './NetworkGraph'
export { HtmlEditor } from './HtmlEditor'
export { IFrame } from './IFrame'
export { Markdown } from './Markdown'
export { Mermaid } from './Mermaid'
export { MessageBox } from './MessageBox'
export { PagingToolbar } from './PagingToolbar'
export { Toast } from './Toast'
export { Image } from './Image'
export { TabPanel } from './TabPanel'
export { FieldSet } from './FieldSet'
export { Window } from './Window'
export { TreePanel } from './TreePanel'
export * from './fields'
export * from './misc'
