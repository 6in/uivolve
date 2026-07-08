#!/usr/bin/env node --experimental-strip-types
/**
 * reference/dsl.schema.json を packages/core/src/meta.ts から生成する。
 *
 * 用途:
 * - AI が生成した DSL (JSON) の検証
 * - VS Code などの JSON エディタでの補完 ($schema 指定)
 *
 * 使い方: npm run schema
 * (meta.ts は React 非依存の純データなので Node の --experimental-strip-types で直接 import する)
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  COMMON_PROPS,
  CONTAINER_PROPS,
  FIELD_PROPS,
  LAYOUT_META,
  XTYPE_META,
  allLayoutNames,
  allXtypeNames,
} from '../packages/core/src/meta.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outFile = path.join(root, 'reference/dsl.schema.json')

const sizeType = { type: ['number', 'string'] }
const componentRef = { $ref: '#/$defs/component' }
const itemsType = {
  type: 'array',
  items: { anyOf: [componentRef, { type: 'string', description: "ツールバーのショートハンド ('->' / '-' / ラベル)" }] },
}

// 既知の config に緩い型を割り当てる (未知のキーも additionalProperties で許容)
const KNOWN_PROP_TYPES = {
  xtype: { enum: allXtypeNames() },
  layout: {
    anyOf: [
      { enum: allLayoutNames() },
      {
        type: 'object',
        properties: {
          type: { enum: allLayoutNames() },
          columns: { type: 'number' },
          gap: sizeType,
          align: { type: 'string' },
          pack: { type: 'string' },
          activeItem: { type: 'number' },
        },
        required: ['type'],
      },
    ],
  },
  items: itemsType,
  tbar: itemsType,
  bbar: itemsType,
  defaults: { type: 'object' },
  region: { enum: ['north', 'south', 'east', 'west', 'center'] },
  width: sizeType,
  height: sizeType,
  minWidth: sizeType,
  minHeight: sizeType,
  flex: { type: 'number' },
  margin: sizeType,
  padding: sizeType,
  bodyPadding: sizeType,
  hidden: { type: 'boolean' },
  disabled: { type: 'boolean' },
  readOnly: { type: 'boolean' },
  split: { type: 'boolean' },
  collapsible: { type: 'boolean' },
  collapsed: { type: 'boolean' },
  columnLines: { type: 'boolean' },
  checked: { type: 'boolean' },
  multiSelect: { type: 'boolean' },
  showToday: { type: 'boolean' },
  closable: { type: 'boolean' },
  rootVisible: { type: 'boolean' },
  header: { type: 'boolean' },
  frame: { type: 'boolean' },
  checkboxToggle: { type: 'boolean' },
  columns: {
    anyOf: [
      { type: 'number', description: 'grid レイアウト / radiogroup の列数' },
      {
        type: 'array',
        description: 'データグリッドの列定義',
        items: {
          type: 'object',
          properties: {
            text: { type: 'string' },
            dataIndex: { type: 'string' },
            width: sizeType,
            flex: { type: 'number' },
            align: { enum: ['left', 'center', 'right'] },
          },
        },
      },
    ],
  },
  store: {
    anyOf: [
      { type: 'object', properties: { data: { type: 'array', items: { type: 'object' } } } },
      { type: 'array', items: { type: 'object' } },
    ],
  },
  options: {
    type: 'array',
    items: {
      anyOf: [
        { type: 'string' },
        { type: 'object', properties: { value: {}, text: { type: 'string' } } },
      ],
    },
  },
  menu: { anyOf: [itemsType, componentRef] },
  src: { type: 'string' },
  messages: {
    type: 'array',
    description: "チャットの会話。from: 'user' は右寄せ、text は Markdown 描画",
    items: {
      type: 'object',
      properties: {
        from: { type: 'string' },
        name: { type: 'string' },
        text: { type: 'string' },
        time: { type: 'string' },
      },
    },
  },
  typing: { type: 'boolean', description: 'チャット末尾に入力中インジケーターを表示' },
  message: { type: 'string' },
  buttons: {
    description: "messagebox のボタンセットまたは任意のラベル配列",
    anyOf: [
      { enum: ['ok', 'okcancel', 'yesno', 'yesnocancel'] },
      { type: 'array', items: { type: 'string' } },
    ],
  },
  icon: { enum: ['info', 'question', 'warning', 'error'] },
  prompt: { type: 'boolean', description: 'messagebox に入力欄を付ける (Ext.Msg.prompt 相当)' },
  align: { enum: ['tr', 'tl', 'br', 'bl', 't', 'b'], description: 'toast の表示位置' },
  series: {
    description: "チャート系列。最初の 1 つだけ使用 ({ type: 'bar'|'line'|'area'|'pie', xField, yField })",
    type: ['array', 'object'],
    items: {
      type: 'object',
      properties: {
        type: { enum: ['bar', 'line', 'area', 'pie'] },
        xField: { type: 'string' },
        yField: { type: ['string', 'array'] },
        title: { type: ['string', 'array'] },
      },
    },
  },
  sprites: {
    description: 'draw のスプライト定義 (Ext.draw 互換の fillStyle / strokeStyle / lineWidth など)',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        type: { enum: ['rect', 'circle', 'ellipse', 'line', 'path', 'text'] },
      },
    },
  },
  handler: {
    type: 'string',
    description:
      "クリック時ハンドラの参照名 ('onSaveClick' など)。モックでは実行されない。AI への仕様引き渡し用",
  },
  listeners: {
    type: 'object',
    additionalProperties: { type: 'string' },
    description:
      "イベント名 → ハンドラ参照名のマップ ({ select: 'onRowSelect' } など)。モックでは実行されない",
  },
  root: { type: 'object' },
  rows: { type: 'number' },
  size: { type: 'number' },
  value: {},
  minValue: { type: 'number' },
  maxValue: { type: 'number' },
  increment: { type: 'number' },
  labelWidth: { type: 'number' },
  activeTab: { type: 'number' },
  colspan: { type: 'number' },
  rowspan: { type: 'number' },
  columnWidth: { type: 'number' },
  x: sizeType,
  y: sizeType,
}

/** メタから全 config 名を集めて properties を組み立てる */
function buildProperties() {
  const names = new Set([...COMMON_PROPS, ...CONTAINER_PROPS, ...FIELD_PROPS])
  for (const meta of Object.values(XTYPE_META)) {
    for (const p of meta.props ?? []) names.add(p)
  }
  const properties = {}
  for (const name of [...names].sort()) {
    properties[name] = KNOWN_PROP_TYPES[name] ?? {}
  }
  return properties
}

const schema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://github.com/uivolve/dsl.schema.json',
  title: 'uivolve DSL',
  description:
    'ExtJS 互換の画面モック DSL。xtype / layout の一覧は reference/components.md を参照。' +
    'このスキーマは packages/core/src/meta.ts から自動生成される (npm run schema)。',
  $ref: '#/$defs/component',
  $defs: {
    component: {
      type: 'object',
      properties: buildProperties(),
      additionalProperties: true,
    },
  },
}

fs.writeFileSync(outFile, `${JSON.stringify(schema, null, 2)}\n`)
console.log(
  `generated ${path.relative(root, outFile)}: ${allXtypeNames().length} xtypes, ${allLayoutNames().length} layouts, ${Object.keys(schema.$defs.component.properties).length} props`,
)
