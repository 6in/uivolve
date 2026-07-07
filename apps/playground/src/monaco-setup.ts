/**
 * Monaco をローカルバンドルで使うためのセットアップ。
 * (@monaco-editor/react はデフォルトで CDN からロードするため、
 *  loader.config で bundle 済みの monaco を渡す)
 */
import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import { registerDslCompletion } from './dsl-completion'

self.MonacoEnvironment = {
  getWorker(_workerId: string, label: string) {
    if (label === 'typescript' || label === 'javascript') return new tsWorker()
    return new editorWorker()
  },
}

loader.config({ monaco })

// DSL は JS として厳密には不正なので、TS ワーカーの診断は切る
// (構文チェックは parseDsl の結果からマーカーを自前で出す)
monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: true,
  noSuggestionDiagnostics: true,
})
monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
  noLib: true,
  allowNonTsExtensions: true,
})

registerDslCompletion(monaco)

export { monaco }
