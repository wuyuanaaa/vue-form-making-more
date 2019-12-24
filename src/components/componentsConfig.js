/**
 * pattern 正则表达式
 */

export const basicComponents = [{
  type: 'input',
  name: '单行文本',
  icon: 'fm-input',
  options: {
    width: '100%',
    defaultValue: '',
    required: false,
    dataType: 'string',
    pattern: '',
    placeholder: '',
    disabled: false
  }
},
{
  type: 'textarea',
  name: '多行文本',
  icon: 'fm-textarea',
  options: {
    width: '100%',
    defaultValue: '',
    required: false,
    disabled: false,
    pattern: '',
    placeholder: ''
  }
},
{
  type: 'number',
  name: '计数器',
  icon: 'fm-number',
  options: {
    width: '',
    required: false,
    defaultValue: 0,
    min: '',
    max: '',
    step: 1,
    unit: '',
    disabled: false,
    controlsPosition: ''
  }
},
{
  type: 'radio',
  name: '单选框组',
  icon: 'fm-radio',
  options: {
    inline: false,
    defaultValue: '',
    showLabel: false,
    options: [{
      value: 'Option 1',
      label: 'Option 1'
    },
    {
      value: 'Option 2',
      label: 'Option 2'
    },
    {
      value: 'Option 3',
      label: 'Option 3'
    }
    ],
    required: false,
    width: '',
    remote: false,
    remoteOptions: [],
    props: {
      value: 'value',
      label: 'label'
    },
    remoteFunc: '',
    disabled: false
  }
},
{
  type: 'checkbox',
  name: '多选框组',
  icon: 'fm-checkbox',
  options: {
    inline: false,
    defaultValue: [],
    showLabel: false,
    options: [{
      value: 'Option 1'
    },
    {
      value: 'Option 2'
    },
    {
      value: 'Option 3'
    }
    ],
    required: false,
    width: '',
    remote: false,
    remoteOptions: [],
    props: {
      value: 'value',
      label: 'label'
    },
    remoteFunc: '',
    disabled: false
  }
},
{
  type: 'time',
  name: '时间选择器',
  icon: 'fm-time',
  options: {
    defaultValue: '21:19:56',
    readonly: false,
    disabled: false,
    editable: true,
    clearable: true,
    placeholder: '',
    startPlaceholder: '',
    endPlaceholder: '',
    isRange: false,
    arrowControl: true,
    format: 'HH:mm:ss',
    required: false,
    width: ''
  }
},
{
  type: 'date',
  name: '日期选择器',
  icon: 'fm-date',
  options: {
    defaultValue: '',
    readonly: false,
    disabled: false,
    editable: true,
    clearable: true,
    placeholder: '',
    startPlaceholder: '',
    endPlaceholder: '',
    type: 'date',
    format: 'yyyy-MM-dd',
    timestamp: false,
    required: false,
    width: ''
  }
},
{
  type: 'rate',
  name: '评分',
  icon: 'fm-rate',
  options: {
    defaultValue: null,
    max: 5,
    disabled: false,
    allowHalf: false,
    required: false
  }
},
{
  type: 'color',
  name: '颜色选择器',
  icon: 'fm-color',
  options: {
    defaultValue: '',
    disabled: false,
    showAlpha: false,
    required: false
  }
},
{
  type: 'select',
  name: '下拉选择框',
  icon: 'fm-select',
  options: {
    defaultValue: '',
    multiple: false,
    disabled: false,
    clearable: false,
    placeholder: '',
    required: false,
    showLabel: false,
    width: '',
    options: [{
      value: 'Option 1'
    },
    {
      value: 'Option 2'
    }, {
      value: 'Option 3'
    }
    ],
    remote: false,
    filterable: false,
    remoteOptions: [],
    props: {
      value: 'value',
      label: 'label'
    },
    remoteFunc: '',
    linkage: {
      open: false,
      model: '',
      key: ''
    }
  }
},
{
  type: 'switch',
  name: '开关',
  icon: 'fm-switch',
  options: {
    defaultValue: false,
    required: false,
    disabled: false
  }
},
{
  type: 'slider',
  name: '滑块',
  icon: 'fm-slider',
  options: {
    defaultValue: 0,
    disabled: false,
    required: false,
    min: 0,
    max: 100,
    step: 1,
    showInput: false,
    range: false,
    width: ''
  }
},
{
  type: 'text',
  name: '文字',
  icon: 'fm-text',
  options: {
    defaultValue: 'This is a text',
    customClass: ''
  }
}
]

export const advanceComponents = [{
  type: 'blank',
  name: '自定义区域',
  icon: 'fm-blank',
  options: {
    defaultType: 'String',
    slotName: ''
  }
},
{
  type: 'editor',
  name: '编辑器',
  icon: 'fm-editor',
  options: {
    defaultValue: '',
    width: ''
  }
},
{
  type: 'cascader',
  name: '级联选择器',
  icon: 'fm-cascader',
  options: {
    defaultValue: [],
    width: '',
    placeholder: '',
    disabled: false,
    clearable: false,
    remote: true,
    remoteOptions: [],
    props: {
      value: 'value',
      label: 'label',
      children: 'children'
    },
    remoteFunc: ''
  }
}
]

export const layoutComponents = [
  {
    type: 'title',
    name: '标题',
    icon: 'fm-title',
    options: {
      style: {
        fontSize: 16,
        bold: true,
        marginTop: 0,
        marginBottom: 10,
        marginLeft: 0
      }
    }
  },
  {
    type: 'grid',
    name: '栅格布局',
    icon: 'fm-grid',
    columns: [{
      span: 12,
      list: []
    },
    {
      span: 12,
      list: []
    }
    ],
    options: {
      gutter: 0,
      justify: 'start',
      align: 'top'
    }
  },
  {
    type: 'custom',
    name: '自定义组件组',
    icon: 'fm-custom',
    list: [],
    options: {}
  }
]
