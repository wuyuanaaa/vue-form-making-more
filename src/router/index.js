import Vue from 'vue'
import Router from 'vue-router'

import Home from '../demo/Home.vue'
import Demo from '../demo/Demo.vue'

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Home
    },
    {
      path: '/demo',
      component: Demo
    }
  ]
})