<template>
  <v-app-bar
    fixed
    dark
    :class="`${$route.meta.color} darken-2`"
    hide-on-scroll
  >
    <!-- <v-app-bar-nav-icon @click.stop="$emit('toggle-drawer')"></v-app-bar-nav-icon> -->
    <v-toolbar-title>{{
      !$route.meta.title || $route.meta.title === 'CIMMYT-Bangladesh Data Hub'
        ? 'CIMMYT-Bangladesh Data Hub'
        : $route.meta.title + ' | CIMMYT-Bangladesh Data Hub'
    }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon href="https://github.com/mutasimb/data-hub-client" target="_blank">
      <v-icon>mdi-github</v-icon>
    </v-btn>

    <template v-slot:extension>
      <Tabs />
    </template>
  </v-app-bar>
</template>

<script>
import Tabs from './Tabs.vue'

export default {
  name: 'Header',
  components: {
    Tabs
  }
}
</script>
