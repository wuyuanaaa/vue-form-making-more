<template>
  <div>
    <el-form
      ref="generateForm"
      label-suffix=":"
      :size="data.config.size"
      :model="models"
      :rules="rules"
      :label-position="data.config.labelPosition"
      :label-width="labelWidth"
    >
      <template v-for="item in data.list">

        <template v-if="item.type == 'grid'">
          <el-row
            :key="item.key"
            type="flex"
            :gutter="item.options.gutter ? item.options.gutter : 0"
            :justify="item.options.justify"
            :align="item.options.align"
          >
            <el-col v-for="(col, colIndex) in item.columns" :key="colIndex" :span="col.span">
              

              <template v-for="citem in col.list" >
                <el-form-item v-if="citem.type=='blank'" :label="citem.name" :prop="citem.model" :key="citem.key">
                  <slot :name="citem.model" :model="models"></slot>
                </el-form-item>
                <genetate-form-item v-else 
                  :key="citem.key" 
                  :models.sync="models" 
                  :remote="remote" 
                  :rules="rules" 
                  :widget="citem"
                  @input-change="onInputChange"
                  @add-linkage="onAddLinkage"
                >
                </genetate-form-item>
              </template>
            </el-col>
          </el-row>
        </template>

        <template v-else-if="item.type == 'blank'">
          <el-form-item :label="item.name" :prop="item.model" :key="item.key">
            <slot :name="item.model" :model="models"></slot>
          </el-form-item>
        </template>

        <template v-else>
          <genetate-form-item
            :key="item.key" 
            :models.sync="models" 
            :rules="rules" 
            :widget="item" 
            @input-change="onInputChange"
            :remote="remote"
            @add-linkage="onAddLinkage"
          >
          </genetate-form-item>
        </template>
        
      </template>
    </el-form>
  </div>
</template>

<script>
import GenetateFormItem from './GenerateFormItem'
import {loadJs} from '../util/index.js'

export default {
  name: 'fm-generate-form',
  components: {
    GenetateFormItem
  },
  props: ['data', 'remote', 'value', 'insite'],
  data () {
    return {
      models: {},
      rules: {},
      linkageObserver: {},
      modelsObj: []
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
  created () {
    this.generateModle(this.data.list)
  },
  mounted () {
  },
  methods: {
    /**
     * 优化/重置表单字段
     */
    generateModle (genList) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === 'grid') {
          genList[i].columns.forEach(item => {
            this.generateModle(item.list)
          })
        } else {
          /**
           * 设置表单项默认值 model
           * 优先取 prop 里 value 下面对应表单项的值
           */
          if (this.value && Object.keys(this.value).indexOf(genList[i].model) >= 0) {
            this.models[genList[i].model] = this.value[genList[i].model]
          } else {
            if (genList[i].type === 'blank') {
              this.$set(this.models, genList[i].model, genList[i].options.defaultType === 'String' ? '' : (genList[i].options.defaultType === 'Object' ? {} : []))
            } else {
              this.models[genList[i].model] = genList[i].options.defaultValue
            }      
          }
          /**
           * 校验逻辑处理
           */
          if (this.rules[genList[i].model]) {
            this.rules[genList[i].model] = [...this.rules[genList[i].model], ...genList[i].rules.map(item => {
              if (item.pattern) {
                return {...item, pattern: eval(item.pattern)}
              } else {
                return {...item}
              }
            })]
          } else {
            this.rules[genList[i].model] = [...genList[i].rules.map(item => {
              if (item.pattern) { // 自定义正则  通过 eval 将正则字符串转换成正则表达式 "/d+/" => /d+/
                return {...item, pattern: eval(item.pattern)}
              } else {
                return {...item}
              }
            })]
          }      
        }
      }
    },
    /**
     * 获取表单结果方法 返回一个 promise
     */
    getData () {
      return new Promise((resolve, reject) => {
        this.$refs.generateForm.validate(valid => {
          if (valid) {
            resolve(this.models)
          } else {
            reject(new Error(this.$t('fm.message.validError')).message)
          }
        })
      })
    },
    reset () {
      this.$refs.generateForm.resetFields()
    },
    /**
     * 子表单项的 on-change 事件
     * value 新的数据值
     * field 子表单项的 model 值
     */
    onInputChange (value, field) {
      if(this.linkageObserver[field]) {
        this.linkageObserver[field].forEach(item => {
          console.log(this.$refs['generateForm'])
          const children = this.$refs['generateForm'].fields
          const subscriber = children.find(child => child.labelFor === item)
          subscriber && subscriber.$parent.update(value)
        })
      }
      this.$emit('on-change', field, value, this.models)
    },
    /**
     * 子表单派发联动事件
     * target: 监听目标
     * Subscriber: 订阅者
     */
    onAddLinkage(target, subscriber) {
      if(this.linkageObserver[target]) {
        this.linkageObserver[target].push(subscriber)
      } else {
        this.$set(this.linkageObserver, target, [subscriber])
      }
      console.log(this.linkageObserver)
      console.log('target', target)
    },
    refresh () {
      
    }
  },
  watch: {
    /**
     * ???此处监听表单传值 jsonData 动态改变情况，当前项目无需考虑此场景，如果打开需取消 deep 否则下拉项联动异常
     * 因导致下拉项联动关闭
     */
    /* data: {
      deep: true,
      handler (val) {
        console.log('generateModle')
        this.generateModle(val.list)
      }
    }, */
    value: {
      deep: true,
      handler (val) {
        console.log(JSON.stringify(val))
        this.models = {...this.models, ...val}
      }
    }
  }
}
</script>

<style lang="scss">
// @import '../styles/cover.scss';
</style>