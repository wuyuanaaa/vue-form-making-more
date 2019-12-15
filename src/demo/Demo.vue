<template>
  <div>
    <fm-generate-form
      v-if="jsonData"
      :data="jsonData"
      :remote="remoteFuncs"
      :value="editData"
      :remote-option="dynamicData"
      ref="generateForm"
    ></fm-generate-form>
    <el-button type="primary" @click="handleSubmit">Submit</el-button>
  </div>
</template>

<script>
import request from '../util/request'

export default {
  name: "Demo",
  data() {
    return {
      jsonData: undefined,
      editData: {
        'select': '2222'
      },
      remoteFuncs: {},
      dynamicData: {}
    };
  },
  mounted() {
    request({
      url: '/api/form',
      method: 'get'
    }).then(res => {
      
      this.jsonData = res.data
      console.log(this.jsonData.list)
    }).catch(e => {
      console.log('get formData err', e)
    })
  },
  methods: {
    handleSubmit() {
      this.$refs.generateForm
        .getData()
        .then(data => {
          // Data verification succeeded
          alert(JSON.stringify(data));
        })
        .catch(e => {
          // Data verification failed
        });
    },
    func_1576135219864(val) {
      console.log(val);
    }
  }
};
</script>

<style>
</style>