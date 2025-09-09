import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/views/HomePage.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    { path: '*', name: 'HomePage', component: HomePage },
    { path: '/HomePage', name: 'HomePageAlt', component: HomePage },
  ]
})