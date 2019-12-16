<template>
  <el-container class="fm2-container">
    <el-main class="fm2-main">
      <el-container>
        <el-aside width="250px">
          <div class="components-list">
            <!-- 基础字段 -->
            <template v-if="basicFields.length">
              <div class="widget-cate">基础字段</div>
              <draggable tag="ul" :list="basicComponents" 
                v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                @end="handleMoveEnd"
                @start="handleMoveStart"
                :move="handleMove"
              >
                <template v-for="(item, index) in basicComponents" >
                  <li class="form-edit-widget-label" :class="{'no-put': item.type == 'divider'}" v-if="basicFields.indexOf(item.type)>=0" :key="index">
                    <a>
                      <i class="icon iconfont" :class="item.icon"></i>
                      <span>{{item.name}}</span>
                    </a>
                  </li>
                </template>
              </draggable>
            </template>
            <!-- 高级字段 -->
            <template v-if="advanceFields.length">
              <div class="widget-cate">高级字段</div>
              <draggable tag="ul" :list="advanceComponents" 
                v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                @end="handleMoveEnd"
                @start="handleMoveStart"
                :move="handleMove"
              >
                <template v-for="(item, index) in advanceComponents" >
                  <li class="form-edit-widget-label" :class="{'no-put': item.type == 'table'}" v-if="advanceFields.indexOf(item.type) >= 0" :key="index">
                    <a>
                      <i class="icon iconfont" :class="item.icon"></i>
                      <span>{{item.name}}</span>
                    </a>
                  </li>
                </template>
                
              </draggable>
            </template>

            <!-- 布局字段 -->
            <template v-if="layoutFields.length">
              <div class="widget-cate">布局字段</div>
              <draggable tag="ul" :list="layoutComponents" 
                v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                @end="handleMoveEnd"
                @start="handleMoveStart"
                :move="handleMove"
              >
                <template v-for="(item, index) in layoutComponents">
                  <li v-if="layoutFields.indexOf(item.type) >=0" class="form-edit-widget-label no-put" :key="index">
                    <a>
                      <i class="icon iconfont" :class="item.icon"></i>
                      <span>{{item.name}}</span>
                    </a>
                  </li>
                </template>
                
              </draggable>
            </template>
            
          </div>
          
        </el-aside>
        <!-- 功能操作 -->
        <el-container class="center-container" direction="vertical">
          <el-header class="btn-bar" style="height: 45px;">
            <slot name="action">
            </slot>
            <el-button v-if="save" type="text" size="medium" icon="el-icon-upload2" @click="handleSave">保存组件组</el-button>
            <el-button v-if="upload" type="text" size="medium" icon="el-icon-download" @click="handleUpload">导入JSON</el-button>
            <el-button v-if="clearable" type="text" size="medium" icon="el-icon-delete" @click="handleClear">清空</el-button>
            <el-button v-if="preview" type="text" size="medium" icon="el-icon-view" @click="handlePreview">预览</el-button>
            <el-button v-if="generateJson" type="text" size="medium" icon="el-icon-tickets" @click="handleGenerateJson">生成JSON</el-button>
            <el-button v-if="generateCode" type="text" size="medium" icon="el-icon-document" @click="handleGenerateCode">生成代码</el-button>
          </el-header>
          <el-main :class="{'widget-empty': widgetForm.list.length == 0}">
            
            <widget-form v-if="!resetJson"  ref="widgetForm" :data="widgetForm" :select.sync="widgetFormSelect"></widget-form>
          </el-main>
        </el-container>
        <!-- 属性设置 -->
        <el-aside class="widget-config-container">
          <el-container>
            <el-header height="45px">
              <div class="config-tab" :class="{active: configTab=='widget'}" @click="handleConfigSelect('widget')">字段属性</div>
              <div class="config-tab" :class="{active: configTab=='form'}" @click="handleConfigSelect('form')">表单属性</div>
            </el-header>
            <el-main class="config-content">
              <widget-config v-show="configTab=='widget'" :data="widgetFormSelect"></widget-config>
              <form-config v-show="configTab=='form'" :data="widgetForm.config"></form-config>
            </el-main>
          </el-container>
        </el-aside>

        <cus-dialog
          :visible="previewVisible"
          @on-close="previewVisible = false"
          ref="widgetPreview"
          width="1000px"
          form
        >
          <generate-form insite="true" @on-change="handleDataChange" v-if="previewVisible" :data="widgetForm" :value="widgetModels" :remote="remoteFuncs" ref="generateForm">
            <template v-slot:widthAndHeight="{model, label}">
              Width <el-input v-model="model[label].width" style="width: 100px"></el-input>
              Height <el-input v-model="model[label].height" style="width: 100px"></el-input>
            </template>
          </generate-form>

          <template slot="action">
            <el-button type="primary" @click="handleTest">获取数据</el-button>
            <el-button @click="handleReset">重置</el-button>
          </template>
        </cus-dialog>

        <cus-dialog
          :visible="uploadVisible"
          @on-close="uploadVisible = false"
          @on-submit="handleUploadJson"
          ref="uploadJson"
          width="800px"
          form
        >
          <el-alert type="info" :title="'JSON格式如下，直接复制生成的json覆盖此处代码点击确定即可'"></el-alert>
          <div id="uploadeditor" style="height: 400px;width: 100%;">{{jsonEg}}</div>
        </cus-dialog>

        <cus-dialog
          :visible="jsonVisible"
          @on-close="jsonVisible = false"
          ref="jsonPreview"
          width="800px"
          form
        >
          
          <div id="jsoneditor" style="height: 400px;width: 100%;">{{jsonTemplate}}</div>
          
          <template slot="action">
            <el-button type="primary" class="json-btn" :data-clipboard-text="jsonCopyValue">复制数据</el-button>
          </template>
        </cus-dialog>

        <cus-dialog
          :visible="codeVisible"
          @on-close="codeVisible = false"
          ref="codePreview"
          width="800px"
          form
          :action="false"
        >
          <div id="codeeditor" style="height: 500px; width: 100%;">{{htmlTemplate}}</div>
        </cus-dialog>

        <cus-dialog
          :visible="saveVisible"
          @on-close="handleSaveDialogClose"
          @on-submit="handleSaveDialogSubmit"
          ref="savePreview"
          width="400px"
          form
        >
          <el-form :model="saveForm" :rules="saveFormRules" ref="saveForm" label-width="auto">
            <el-form-item label="组件组名称" prop="name">
              <el-input v-model="saveForm.name"></el-input>
            </el-form-item>
          </el-form>
          
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
import {basicComponents, layoutComponents, advanceComponents} from './componentsConfig.js'
import {loadJs, loadCss} from '../util/index.js'
import request from '../util/request.js'
import generateCode from './generateCode.js'

export default {
  name: 'fm-making-form',
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
      default: true
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
      default: () => ['grid','custom']
    }
  },
  data () {
    return {
      basicComponents,
      layoutComponents,
      advanceComponents,
      resetJson: false,
      widgetForm: {
        list: [],
        config: {
          labelauto: true,
          labelWidth: 100,
          labelPosition: 'right',
          size: 'small'
        },
      },
      configTab: 'widget',
      widgetFormSelect: null,
      saveVisible: false,
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
      }`,
      saveForm: {
        name: ''
      },
      saveFormRules: {
        name: { required: true, message: '请输入组件组名称', trigger: 'blur' }
      }
    }
  },
  mounted () {
    // this._loadComponents()
  },
  methods: {
    // 配置 Tab 选择
    handleConfigSelect (value) {
      this.configTab = value
    },
    handleMoveEnd (evt) {
      // console.log('end', evt)
    },
    handleMoveStart ({oldIndex}) {
      // console.log('start', oldIndex, this.basicComponents)
    },
    handleMove () {
      return true
    },
    // 预览
    handlePreview () {
      console.log(this.widgetForm)
      this.previewVisible = true
    },
    // 预览 获取数据
    handleTest () {
      this.$refs.generateForm.getData().then(data => {
        this.$alert(data, '').catch(e=>{})
        this.$refs.widgetPreview.end()
      }).catch(e => {
        this.$refs.widgetPreview.end()
      })
    },
    // 预览 重置
    handleReset () {
      this.$refs.generateForm.reset()
    },
    // 生成 JSON
    handleGenerateJson () {
      this.jsonVisible = true
      this.jsonTemplate = this.widgetForm
      console.log(JSON.stringify(this.widgetForm))
      this.$nextTick(() => {

        const editor = ace.edit('jsoneditor')
        editor.session.setMode("ace/mode/json")

        if (!this.jsonClipboard) {
          this.jsonClipboard = new Clipboard('.json-btn')
          this.jsonClipboard.on('success', (e) => {
            this.$message.success('复制成功')
          })
        }
        this.jsonCopyValue = JSON.stringify(this.widgetForm)
      })
    },
    // 保存组件组
    handleSave () {
      this.saveVisible = true
      
    },
    // 生成代码
    handleGenerateCode () {
      this.codeVisible = true
      this.htmlTemplate = generateCode(JSON.stringify(this.widgetForm))
      this.$nextTick(() => {
        const editor = ace.edit('codeeditor')
        editor.session.setMode("ace/mode/html")
      })
    },
    handleUpload () {
      this.uploadVisible = true
      this.$nextTick(() => {
        this.uploadEditor = ace.edit('uploadeditor')
        this.uploadEditor.session.setMode("ace/mode/json")
      })
    },
    handleUploadJson () {
      try {
        this.setJSON(JSON.parse(this.uploadEditor.getValue()))
        this.uploadVisible = false
      } catch (e) {
        this.$message.error(e.message)
        this.$refs.uploadJson.end()
      }
    },
    handleClear () {
      this.widgetForm = {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'right',
          size: 'small',
          customClass: ''
        },
      }

      this.widgetFormSelect = {}
    },
    handleSaveDialogClose() {
      this.saveVisible = false
      Object.assign(this.$data.saveForm, this.$options.data().saveForm)
    },
    handleSaveDialogSubmit() {
      this.$refs.saveForm.validate((valid) => {
        if (valid) {
          const widigetForm = JSON.parse(JSON.stringify(this.widgetForm))
          this.formatWidigetListValue(widigetForm.list)
          widigetForm.list = this.formatWidigetList(widigetForm.list)
          console.log(widigetForm)
          this.saveVisible = false
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getJSON () {
      return this.widgetForm
    },
    getHtml () {
      return generateCode(JSON.stringify(this.widgetForm))
    },
    setJSON (json) {
      this.widgetForm = json

      if (json.list.length> 0) {
        this.widgetFormSelect = json.list[0]
      }
    },
    handleDataChange (field, value, data) {
      console.log(field, value, data)
    },
    // 格式化保存JSON的属性
    formatWidigetListValue(list) {
      list.forEach((item) => {
        delete(item.key)
        delete(item.model)
        delete(item.rules)
        delete(item.options.remoteFunc)
        if (item.type === 'custom') {
          this.formatWidigetList(item.list)
        }
        if (item.type === 'grid') {
          item.columns.forEach((colItem) => {
            this.formatWidigetList(colItem.list)
          })
        }
      })
    },
    // 格式化保存JSON的层次 去除内层 custom 外层包裹 custom
    formatWidigetList(list) {
      let customIndex = list.findIndex(item => item.type === 'custom')
      while(customIndex >= 0) {
        const customList = list[customIndex].list
        list.splice(customIndex, 1, ...customList)
        customIndex = list.findIndex(item => item.type === 'custom')
      }
      list = [
        {
          type: 'custom',
          name: this.saveForm.name,
          icon: 'icon-grid-',
          list: [...list],
          options: {}
        }
      ]
      return list
    }
  }
}
</script>

<style lang="scss">
.widget-empty{
  background-position: 50%;
}

</style>
