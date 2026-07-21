# 勤怠管理

- カテゴリ: 業務画面
- 使用 layout: `border`
- 使用 xtype: `chart`, `combobox`, `datepicker`, `displayfield`, `grid`, `panel`, `progressbar`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
// 業務画面: 勤怠管理
// カレンダー (datepicker) + 週次の勤怠グリッド (セル編集可) + 残業集計チャート
{
  xtype: 'panel',
  itemId: 'attendanceScreen',
  title: '勤怠管理 — 2026 年 7 月 (佐藤 花子)',
  layout: 'border',
  tbar: [
    { xtype: 'combobox', itemId: 'monthCombo', fieldLabel: '対象月', labelWidth: 50, width: 170, options: ['2026/05', '2026/06', '2026/07'], value: '2026/07' },
    '->',
    { itemId: 'btnSubmit', text: '上長へ申請', ui: 'primary', iconCls: 'x-fa fa-paper-plane', handler: 'onSubmitTimesheet' },
  ],
  items: [
    {
      region: 'west',
      xtype: 'panel',
      itemId: 'calendarPane',
      title: 'カレンダー',
      width: 260,
      bodyPadding: 8,
      items: [
        { xtype: 'datepicker', itemId: 'datePick', value: '2026-07-15' },
        { xtype: 'displayfield', itemId: 'fldWorkDays', fieldLabel: '出勤日数', value: '10 / 22 日', labelWidth: 80, margin: '8 0 0 0' },
        { xtype: 'displayfield', itemId: 'fldOvertime', fieldLabel: '残業時間', value: '12.5 h (上限 45h)', labelWidth: 80 },
        { xtype: 'progressbar', itemId: 'overtimeBar', value: 0.28, text: '残業 28%', margin: '4 0 0 0' },
      ],
    },
    {
      region: 'center',
      xtype: 'grid',
      itemId: 'timesheetGrid',
      title: '今週の勤怠 (7/13 週) — セルを直接編集できます',
      columnLines: true,
      columns: [
        { text: '日付', dataIndex: 'date', width: 90 },
        { text: '曜日', dataIndex: 'dow', width: 50 },
        { text: '区分', dataIndex: 'kind', width: 110, editor: { xtype: 'combobox', options: ['出勤', '在宅', '休暇', '出張'] } },
        { text: '出勤', dataIndex: 'start', width: 80, editor: true },
        { text: '退勤', dataIndex: 'end', width: 80, editor: true },
        { text: '休憩', dataIndex: 'rest', width: 70, editor: true },
        { text: '実働', dataIndex: 'actual', width: 70, align: 'right' },
        { text: '残業', dataIndex: 'overtime', width: 70, align: 'right' },
        { text: '備考', dataIndex: 'note', flex: 1, editor: true },
      ],
      store: {
        data: [
          { date: '07/13', dow: '月', kind: '出勤', start: '09:00', end: '19:30', rest: '1:00', actual: '9:30', overtime: '1:30', note: '' },
          { date: '07/14', dow: '火', kind: '在宅', start: '09:30', end: '18:00', rest: '1:00', actual: '7:30', overtime: '0:00', note: '' },
          { date: '07/15', dow: '水', kind: '出勤', start: '09:00', end: '18:00', rest: '1:00', actual: '8:00', overtime: '0:00', note: '' },
          { date: '07/16', dow: '木', kind: '出張', start: '08:00', end: '20:00', rest: '1:00', actual: '11:00', overtime: '3:00', note: '大阪 (○○商事)' },
          { date: '07/17', dow: '金', kind: '休暇', start: '', end: '', rest: '', actual: '', overtime: '', note: '有給' },
        ],
      },
    },
    {
      region: 'south',
      xtype: 'panel',
      itemId: 'overtimePanel',
      title: '週別の実働 / 残業 (7 月)',
      height: 200,
      split: true,
      bodyPadding: 8,
      items: [
        {
          xtype: 'chart',
          itemId: 'overtimeChart',
          height: 150,
          series: [{ type: 'bar', xField: 'week', yField: ['actual', 'overtime'], title: ['実働', '残業'] }],
          store: {
            data: [
              { week: '6/29 週', actual: 40, overtime: 4.5 },
              { week: '7/6 週', actual: 38, overtime: 2.0 },
              { week: '7/13 週', actual: 36, overtime: 4.5 },
              { week: '7/20 週', actual: 0, overtime: 0 },
            ],
          },
        },
      ],
    },
  ],
}
```
