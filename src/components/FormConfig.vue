<template>
  <div class="form-config-container">
    <el-form label-position="top" size="mini">
      <el-form-item label="表单标签宽度">

        <el-switch
          v-model="data.labelauto"
          active-text="自动宽度"
          inactive-text="手动设置"
        >
          >
        </el-switch>
        <el-input-number v-if="!data.labelauto" v-model="data.labelWidth" :min="0" :max="200" :step="10" />
      </el-form-item>

      <el-form-item label="表单对齐（左右对齐仅在标签手动宽度生效）">
        <el-radio-group v-model="data.labelPosition">
          <el-radio-button label="left">左对齐</el-radio-button>
          <el-radio-button label="right">右对齐</el-radio-button>
          <el-radio-button label="top">顶部对齐</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="组件尺寸">
        <el-radio-group v-model="data.size">
          <el-radio-button label="medium">medium</el-radio-button>
          <el-radio-button label="small">small</el-radio-button>
          <el-radio-button label="mini">mini</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  }
}
</script>
