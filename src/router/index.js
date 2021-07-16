import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

router.afterEach(to => {
  document.title = `CIMMYT-Bangladesh Data Hub${to.path === '/'
      ? ''
      : ' | ' + to.meta.title
    }`
})

export default router
