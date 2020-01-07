<template>
  <el-container class="fm2-container">
    <el-main class="fm2-main">
      <el-container>
        <el-aside width="250px" class="fm2-components">
          <el-scrollbar tag="div" style="height:100%" wrap-class="components-list">
            <template v-if="!model">
              <!-- 基础字段 -->
              <template v-if="basicFields.length">
                <div class="widget-cate">基础字段</div>
                <draggable
                  tag="ul"
                  :list="basicComponents"
                  :move="handleMove"
                  v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                  @end="handleMoveEnd"
                  @start="handleMoveStart"
                >
                  <template v-for="(item, index) in basicComponents">
                    <li
                      v-if="basicFields.indexOf(item.type)>=0"
                      :key="index"
                      class="form-edit-widget-label"
                    >
                      <a>
                        <!-- <i class="icon iconfont" :class="item.icon" /> -->
                        <svg-icon class="icon" :icon-class="item.icon" />
                        <span>{{ item.name }}</span>
                      </a>
                    </li>
                  </template>
                </draggable>
              </template>
              <!-- 高级字段 -->
              <template v-if="advanceFields.length">
                <div class="widget-cate">高级字段</div>
                <draggable
                  tag="ul"
                  :list="advanceComponents"
                  :move="handleMove"
                  v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                  @end="handleMoveEnd"
                  @start="handleMoveStart"
                >
                  <template v-for="(item, index) in advanceComponents">
                    <li
                      v-if="advanceFields.indexOf(item.type) >= 0"
                      :key="index"
                      class="form-edit-widget-label"
                    >
                      <a>
                        <svg-icon class="icon" :icon-class="item.icon" />
                        <span>{{ item.name }}</span>
                      </a>
                    </li>
                  </template>
                </draggable>
              </template>
              <!-- 布局字段 -->
              <template v-if="layoutFields.length">
                <div class="widget-cate">布局字段</div>
                <draggable
                  tag="ul"
                  :move="handleMove"
                  :list="layoutComponents"
                  v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                  @end="handleMoveEnd"
                  @start="handleMoveStart"
                >
                  <template v-for="(item, index) in layoutComponents">
                    <li
                      v-if="layoutFields.indexOf(item.type) >=0"
                      :key="index"
                      class="form-edit-widget-label"
                    >
                      <a>
                        <svg-icon class="icon" :icon-class="item.icon" />
                        <span>{{ item.name }}</span>
                      </a>
                    </li>
                  </template>
                </draggable>
              </template>
            </template>
            <!-- 自定义组件组 -->
            <template v-if="layoutFields.length">
              <div class="widget-cate">自定义组件组</div>
              <draggable
                tag="ul"
                :move="handleMove"
                :list="customComponents"
                v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                @end="handleMoveEnd"
                @start="handleMoveStart"
              >
                <template v-for="(item, index) in customComponents">
                  <li
                    :key="index"
                    class="form-edit-widget-label"
                  >
                    <a>
                      <svg-icon class="icon" :icon-class="item.icon" />
                      <span>{{ item.name }}</span>
                    </a>
                  </li>
                </template>
              </draggable>
            </template>
          </el-scrollbar>
        </el-aside>
        <!-- 功能操作 -->
        <el-container class="center-container" direction="vertical">
          <el-header class="btn-bar" style="height: 45px;">
            <slot name="action" />
            <el-button v-if="save" type="text" size="medium" icon="el-icon-upload2" @click="getResult">保存组件组</el-button>
            <el-button v-if="upload" type="text" size="medium" icon="el-icon-download" @click="handleUpload">导入JSON</el-button>
            <el-button v-if="clearable" type="text" size="medium" icon="el-icon-delete" @click="handleClear">清空</el-button>
            <el-button v-if="preview" type="text" size="medium" icon="el-icon-view" @click="handlePreview">预览</el-button>
            <el-button v-if="generateJson" type="text" size="medium" icon="el-icon-tickets" @click="handleGenerateJson">生成JSON</el-button>
            <el-button v-if="generateCode" type="text" size="medium" icon="el-icon-document" @click="handleGenerateCode">生成代码</el-button>
          </el-header>
          <el-main :class="{'widget-empty': widgetForm.list.length == 0}">
            <widget-form
              v-if="!resetJson"
              ref="widgetForm"
              :data="widgetForm"
              :select.sync="widgetFormSelect"
              :model="model"
            />
          </el-main>
        </el-container>
        <!-- 属性设置 -->
        <el-aside class="widget-config-container">
          <el-container>
            <el-header height="45px">
              <div v-if="!model" class="config-tab" :class="{active: configTab=='widget'}" @click="handleConfigSelect('widget')">字段属性</div>
              <div class="config-tab" :class="{active: configTab=='form'}" @click="handleConfigSelect('form')">表单属性</div>
            </el-header>
            <el-main>
              <el-scrollbar tag="div" style="height:100%" wrap-class="config-content">
                <widget-config
                  v-if="!model"
                  v-show="configTab=='widget'"
                  :data="widgetFormSelect"
                  :keys="$attrs['keys']"
                />
                <form-config
                  v-show="configTab=='form'"
                  :data="widgetForm.config"
                />
              </el-scrollbar>
            </el-main>
          </el-container>
        </el-aside>

        <cus-dialog
          ref="widgetPreview"
          width="1000px"
          form
          :visible="previewVisible"
          @on-close="previewVisible = false"
        >
          <generate-form
            v-if="previewVisible"
            ref="generateForm"
            insite="true"
            :data="widgetForm"
            :value="widgetModels"
            :remote="remoteFuncs"
            @on-change="handleDataChange"
          >
            <template v-slot:string="{model, label}">
              <div>需在调用 generate-form 时手动写入插槽</div>
              <div>插槽参数调用为 scope.model[scope.label]</div>
              <div>示例：'model[label]' <el-input v-model="model[label]" style="width: 100px" /></div>
            </template>

            <template v-slot:object="{model, label}">
              <div>需在调用 generate-form 时手动写入插槽</div>
              <div>插槽参数调用为 scope.model[scope.label]</div>
              <div>示例：</div>
              <div>
                'model[label].width' <el-input v-model="model[label].width" style="width: 100px" />
                'model[label].height' <el-input v-model="model[label].height" style="width: 100px" />
              </div>
            </template>

            <template v-slot:array="{model, label}">
              <div>需在调用 generate-form 时手动写入插槽</div>
              <div>插槽参数调用为 scope.model[scope.label]</div>
              <div>示例：</div>
              <div>
                'model[label][0]' <el-input v-model="model[label][0]" style="width: 100px" />
                'model[label][1]' <el-input v-model="model[label][1]" style="width: 100px" />
              </div>
            </template>
          </generate-form>

          <template slot="action">
            <el-button type="primary" @click="handleTest">获取数据</el-button>
            <el-button @click="handleReset">重置</el-button>
          </template>
        </cus-dialog>

        <cus-dialog
          ref="uploadJson"
          width="800px"
          form
          :visible="uploadVisible"
          @on-close="uploadVisible = false"
          @on-submit="handleUploadJson"
        >
          <el-alert type="info" :title="'JSON格式如下，直接复制生成的json覆盖此处代码点击确定即可'" />
          <div id="uploadeditor" style="height: 400px;width: 100%;">{{ jsonEg }}</div>
        </cus-dialog>

        <cus-dialog
          ref="jsonPreview"
          width="800px"
          form
          :visible="jsonVisible"
          @on-close="jsonVisible = false"
        >
          <div id="jsoneditor" style="height: 400px;width: 100%;">{{ jsonTemplate }}</div>
          <template slot="action">
            <el-button type="primary" class="json-btn" :data-clipboard-text="jsonCopyValue">复制数据</el-button>
          </template>
        </cus-dialog>

        <cus-dialog
          ref="codePreview"
          width="800px"
          form
          :action="false"
          :visible="codeVisible"
          @on-close="codeVisible = false"
        >
          <div id="codeeditor" style="height: 500px; width: 100%;">{{ htmlTemplate }}</div>
        </cus-dialog>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetConfig from './WidgetConfig'
import FormConfig from './FormConfig'
import WidgetForm from './WidgetForm'
import CusDialog from './CusDialog'
import GenerateForm from './GenerateForm'
import Clipboard from 'clipboard'
import { basicComponents, layoutComponents, advanceComponents } from './componentsConfig.js'
// import { getCstomComponents } from '@/api/formMaking'
import generateCode from './generateCode.js'

export default {
  name: 'FmMakingForm',
  components: {
    Draggable,
    WidgetConfig,
    FormConfig,
    WidgetForm,
    CusDialog,
    GenerateForm
  },
  props: {
    save: {
      type: Boolean,
      default: false
    },
    preview: {
      type: Boolean,
      default: false
    },
    generateCode: {
      type: Boolean,
      default: false
    },
    generateJson: {
      type: Boolean,
      default: false
    },
    upload: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    model: {
      type: Boolean,
      default: false
    },
    basicFields: {
      type: Array,
      default: () => ['input', 'textarea', 'number', 'radio', 'checkbox', 'time', 'date', 'rate', 'color', 'select', 'switch', 'slider', 'text']
    },
    advanceFields: {
      type: Array,
      default: () => ['blank', 'imgupload', 'editor', 'cascader']
    },
    layoutFields: {
      type: Array,
      default: () => ['grid', 'title', 'custom']
    }
  },
  data() {
    return {
      basicComponents,
      layoutComponents,
      advanceComponents,
      customComponents: [],
      resetJson: false,
      widgetForm: {
        list: [],
        config: {
          labelauto: true,
          labelWidth: 100,
          labelPosition: 'right',
          size: 'small'
        }
      },
      configTab: undefined,
      widgetFormSelect: null,
      previewVisible: false,
      jsonVisible: false,
      codeVisible: false,
      uploadVisible: false,
      remoteFuncs: {},
      widgetModels: {},
      blank: '',
      htmlTemplate: '',
      jsonTemplate: '',
      uploadEditor: null,
      jsonCopyValue: '',
      jsonClipboard: null,
      jsonEg: `{
        "list": [],
        "config": {
          "labelauto": true,
          "labelWidth": 100,
          "labelPosition": "right",
          "size": "small"
        }
      }`
    }
  },
  mounted() {
    this.setDefaultConfigTab()
    // this.fetchCstomComponents()
  },
  methods: {
    setDefaultConfigTab() {
      this.configTab = this.model ? 'form' : 'widget'
    },
    /* // 获取自定义组件组
    fetchCstomComponents() {
      getCstomComponents().then(res => {
        const list = res.data
        this.customComponents = this.formatCustomComponents(list)
      }).catch(e => {
        console.log('getCstomComponents err', e)
      })
    }, */
    // 配置 Tab 选择
    handleConfigSelect(value) {
      this.configTab = value
    },
    handleMoveEnd(evt) {
      // console.log('end', evt)
    },
    handleMoveStart({ oldIndex }) {
      // console.log('start', oldIndex, this.basicComponents)
    },
    handleMove() {
      return true
    },
    // 预览
    handlePreview() {
      console.log(this.widgetForm)
      this.previewVisible = true
    },
    // 预览 获取数据
    handleTest() {
      this.$refs.generateForm.getData().then(data => {
        this.$alert(data, '').catch(e => {})
        this.$refs.widgetPreview.end()
      }).catch(e => {
        this.$refs.widgetPreview.end()
      })
    },
    // 预览 重置
    handleReset() {
      this.$refs.generateForm.reset()
    },
    // 生成 JSON
    handleGenerateJson() {
      this.jsonVisible = true
      this.jsonTemplate = this.widgetForm
      console.log(JSON.stringify(this.widgetForm))
      this.$nextTick(() => {
        // eslint-disable-next-line
        const editor = ace.edit('jsoneditor')
        editor.session.setMode('ace/mode/json')

        if (!this.jsonClipboard) {
          this.jsonClipboard = new Clipboard('.json-btn')
          this.jsonClipboard.on('success', (e) => {
            this.$message.success('复制成功')
          })
        }
        this.jsonCopyValue = JSON.stringify(this.widgetForm)
      })
    },
    // 生成代码
    handleGenerateCode() {
      this.codeVisible = true
      this.htmlTemplate = generateCode(JSON.stringify(this.widgetForm))
      this.$nextTick(() => {
        // eslint-disable-next-line
        const editor = ace.edit('codeeditor')
        editor.session.setMode('ace/mode/html')
      })
    },
    handleUpload() {
      this.uploadVisible = true
      this.$nextTick(() => {
        // eslint-disable-next-line
        this.uploadEditor = ace.edit('uploadeditor')
        this.uploadEditor.session.setMode('ace/mode/json')
      })
    },
    handleUploadJson() {
      try {
        console.log('uploadEditor', this.uploadEditor.getValue())
        this.setJSON(JSON.parse(this.uploadEditor.getValue()))
        this.uploadVisible = false
      } catch (e) {
        this.$message.error(e.message)
        this.$refs.uploadJson.end()
      }
    },
    handleClear() {
      this.widgetForm = {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'right',
          size: 'small',
          customClass: ''
        }
      }

      this.widgetFormSelect = {}
    },
    getResult() {
      if (!this.widgetForm.list.length) {
        return false
      }
      const widigetForm = JSON.parse(JSON.stringify(this.widgetForm))
      let list = widigetForm.list
      this.formatWidigetListValue(list)
      list = this.formatWidigetList(list)
      const componentJson = JSON.stringify(list[0])
      const formJson = JSON.stringify(widigetForm)
      console.log(list)
      const keys = list[0].list.map(item => {
        return { name: item.name, code: item.model }
      })
      return { componentJson, keys, formJson }
    },
    getModelIdList() {
      if (!this.widgetForm.list.length) {
        return false
      }
      const idList = this.widgetForm.list.map(item => item.id)
      return idList
    },
    getHtml() {
      return generateCode(JSON.stringify(this.widgetForm))
    },
    setJSON(json) {
      console.log('json', json)
      this.widgetForm = json

      if (json.list.length > 0) {
        this.widgetFormSelect = json.list[0]
      }
    },
    handleDataChange(field, value, data) {
      console.log(field, value, data)
    },
    // 格式化保存JSON的属性
    formatWidigetListValue(list) {
      list.forEach((item) => {
        delete (item.key)
        /* delete (item.model)
        delete (item.options.remoteFunc) */
        if (item.type === 'custom') {
          this.formatWidigetListValue(item.list)
        }
        if (item.type === 'grid') {
          item.columns.forEach((colItem) => {
            this.formatWidigetListValue(colItem.list)
          })
        }
      })
    },
    // 格式化保存JSON的层次 去除内层 custom 外层包裹 custom
    formatWidigetList(list) {
      let customIndex = list.findIndex(item => item.type === 'custom')
      while (customIndex >= 0) {
        const customList = list[customIndex].list
        list.splice(customIndex, 1, ...customList)
        customIndex = list.findIndex(item => item.type === 'custom')
      }
      list = [
        {
          type: 'custom',
          name: '自定义组件组',
          icon: 'fm-custom',
          list: [...list],
          options: {}
        }
      ]
      return list
    },
    // 格式化请求到的自定义组件组 修改名称
    formatCustomComponents(list) {
      const hasJsonComponents = list.filter(item => item.formJson)
      return hasJsonComponents.map(({ id, name, formJson }) => {
        const newNameStr = JSON.stringify({ name }).replace(/[{}]/g, '')
        const newJson = formJson.replace('"name":"自定义组件组"', newNameStr)
        const result = JSON.parse(newJson)
        result.id = id
        return result
      })
    }
  }
}
</script>

<style lang="scss">
.widget-empty{
  background-position: 50%;
}

</style>
