import Vue from 'vue'
import App from './App.vue'

import router from './router'
import vuetify from './plugins/vuetify'

import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'

Vue.config.productionTip = false

Vue.use(VueApollo)

const apolloClient = new ApolloClient({
  uri: process.env.NODE_ENV === 'development'
    ? 'http://localhost:9000/graphql'
    : process.env.VUE_APP_GRAPHQL_HTTP
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

new Vue({
  router,
  vuetify,
  render: h => h(App),
  apolloProvider
}).$mount('#app')
