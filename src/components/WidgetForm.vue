<template>
  <div class="widget-form-container">
    <div v-if="data.list.length == 0" class="form-empty">从左侧拖拽来添加字段</div>
    <el-form :size="data.config.size" label-suffix=":" :label-position="data.config.labelPosition" :label-width="labelWidth">
      
      <draggable class="" 
        v-model="data.list" 
        v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
        @end="handleMoveEnd"
        @add="handleWidgetAdd"
      >

        <transition-group name="fade" tag="div" class="widget-form-list">
          <template v-for="(element, index) in data.list">
            <template v-if="element.type == 'grid'">
              <el-row class="widget-col widget-view" v-if="element && element.key" :key="element.key" 
                type="flex"
                :class="{active: selectWidget.key == element.key}"
                :gutter="element.options.gutter ? element.options.gutter : 0"
                :justify="element.options.justify"
                :align="element.options.align"
                @click.native="handleSelectWidget(index)">
                <el-col  v-for="(col, colIndex) in element.columns" :key="colIndex" :span="col.span ? col.span : 0">
                  
                  <draggable
                    v-model="col.list"
                    :no-transition-on-drag="true"
                    v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
                    @end="handleMoveEnd"
                    @add="handleWidgetColAdd($event, element, colIndex)"
                  >
                    <transition-group name="fade" tag="div" class="widget-col-list">
                      <template v-for="(el, i) in col.list">
                        <widget-form-item 
                          v-if="el.key"
                          :key="el.key"
                          :element="el" 
                          :select.sync="selectWidget" 
                          :index="i" 
                          :data="col">
                        </widget-form-item>
                      </template>
                    </transition-group>
                  </draggable>
                </el-col>
                <div class="widget-view-action widget-col-action" v-if="selectWidget.key == element.key">
      
                  <i class="iconfont icon-trash" @click.stop="handleWidgetDelete(index)"></i>
                </div>

                <div class="widget-view-drag widget-col-drag" v-if="selectWidget.key == element.key">
                  <i class="iconfont icon-drag drag-widget"></i>
                </div>
              </el-row>
            </template>

            <template v-else-if="element.type == 'custom'">
              <div
                class="widget-col widget-view"
                :class="{active: selectWidget.key == element.key}"
                
                v-if="element && element.key" 
                :key="element.key"
                @click="handleSelectWidget(index)"
              >
                <draggable
                  v-model="element.list"
                  
                  :no-transition-on-drag="true"
                  v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
                  @end="handleMoveEnd"
                  @add="handleWidgetCustomAdd($event, element)"
                >
                  <transition-group name="fade" tag="div" style="min-height: 50px;">
                    <template v-for="(el, i) in element.list">
                      <widget-form-item 
                        v-if="el.key"
                        :key="el.key"
                        :element="el" 
                        :select.sync="selectWidget" 
                        :index="i" 
                        :data="element">
                      </widget-form-item>
                    </template>
                  </transition-group>
                </draggable>

                <div class="widget-view-action widget-col-action" v-if="selectWidget.key == element.key">
      
                  <i class="iconfont icon-trash" @click.stop="handleWidgetDelete(index)"></i>
                </div>

                <div class="widget-view-drag widget-col-drag" v-if="selectWidget.key == element.key">
                  <i class="iconfont icon-drag drag-widget"></i>
                </div>
              </div>
            </template>


            <template v-else>
              <widget-form-item
                v-if="element && element.key"
                :key="element.key"
                :element="element"
                :select.sync="selectWidget"
                :index="index"
                :data="data"
              ></widget-form-item>
            </template>
          </template>
        </transition-group>
      </draggable>
    </el-form>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetFormItem from './WidgetFormItem'

export default {
  components: {
    Draggable,
    WidgetFormItem
  },
  props: ['data', 'select'],
  data () {
    return {
      selectWidget: this.select
    }
  },
  computed: {
    labelWidth() {
      if(this.data.config.labelauto) {
        return 'auto'
      } else {
        return this.data.config.labelWidth + 'px'
      }
    }
  },
  mounted () {
    document.body.ondrop = function (event) {
      let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
      if (isFirefox) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
  },
  methods: {
    handleMoveEnd ({newIndex, oldIndex}) {
      console.log('index', newIndex, oldIndex)
    },
    handleSelectWidget (index) {
      console.log(index, '#####')
      this.selectWidget = this.data.list[index]
    },
    handleWidgetAdd (evt) {
      const newIndex = evt.newIndex
      const to = evt.to
      
      this.$set(this.data.list, newIndex, this.widgetFormFormat(this.data.list[newIndex]))

      this.selectWidget = this.data.list[newIndex]
    },
    /**
     * 深拷贝表单元素数据，并添加 remoteFunc key model rules 等值
     * 遇到栅格布局，递归处理栅格内子表单元素
     */
    widgetFormFormat(data, index) {
      let key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
      // 为 key 添加 index 
      if(index || index === 0) {
        key =  key + '_' + index
      }

      let newData = JSON.parse(JSON.stringify(data))
      newData.options.remoteFunc = 'api_' + key
      newData.key = key
      newData.model = data.type + '_' + key
      newData.rules = []
      
      if (data.type === 'grid') {
        newData = {
          ...newData,
          // 为内部子表单组件添加 key  需要递归处理
          columns: newData.columns.map(({list, ...item}) => {
            const newList = list.map((item, index) => this.widgetFormFormat(item, index))
            return {list: newList,...item}
          })
        }
      }

      if (data.type === 'custom') {
        console.log('custom')
        newData = {
          ...newData,
          // 为内部子表单组件添加 key  需要递归处理
          list: newData.list.map((item, index) => this.widgetFormFormat(item, index))
        }
      }

      return newData
    },
    handleWidgetColAdd ($event, row, colIndex) {
      const newIndex = $event.newIndex
      const oldIndex = $event.oldIndex
      const item = $event.item

      // 防止布局元素的嵌套拖拽
      if (item.className.indexOf('data-grid') >= 0) {

        // 如果是列表中拖拽的元素需要还原到原来位置
        item.tagName === 'DIV' && this.data.list.splice(oldIndex, 0, row.columns[colIndex].list[newIndex])

        row.columns[colIndex].list.splice(newIndex, 1)

        return false
      }

      this.$set(row.columns[colIndex].list, newIndex, this.widgetFormFormat(row.columns[colIndex].list[newIndex]))
     
      this.selectWidget = row.columns[colIndex].list[newIndex]
    },
    handleWidgetCustomAdd($event, group) {
      const newIndex = $event.newIndex
      const oldIndex = $event.oldIndex
      const item = $event.item

      this.$set(group.list, newIndex, this.widgetFormFormat(group.list[newIndex]))

      this.selectWidget = group.list[newIndex]
    },
    handleWidgetDelete (index) {
      if (this.data.list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {}
        } else {
          this.selectWidget = this.data.list[index - 1]
        }
      } else {
        this.selectWidget = this.data.list[index + 1]
      }

      this.$nextTick(() => {
        this.data.list.splice(index, 1)
      })
    },
  },
  watch: {
    select (val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler (val) {
        this.$emit('update:select', val)
      },
      deep: true
    }
  }
}
</script>
