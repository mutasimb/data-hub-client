<template>
  <v-app id="v-app-root">
    <NavDrawer ref="drawer" :routes="routes" />
    <AppBar
      :drawer="drawer"
      @toggle-drawer="$refs.drawer.drawer = !$refs.drawer.drawer"
    />

    <v-main :class="`${$route.meta.color} lighten-5`">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import routes from './router/routes'

import NavDrawer from './components/NavDrawer/Index.vue'
import AppBar from './components/AppBar/Index.vue'

export default {
  name: 'App',
  data () {
    return {
      drawer: false
    }
  },
  components: {
    NavDrawer,
    AppBar
  },
  computed: {
    routes () {
      return routes.filter((_, i) => i > 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.container-max-width {
  max-width: 1200px;
}
</style>
