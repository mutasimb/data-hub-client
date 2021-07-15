<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    temporary
    width="320"
    @input="onDrawerInput"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h6">
          CIMMYT-Bangladesh Data Hub
        </v-list-item-title>
        <!-- <v-list-item-subtitle>
          subtext
        </v-list-item-subtitle> -->
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-subheader>Datasets</v-subheader>
      <v-list-item
        v-for="(item, i) in routes"
        :key="i"
        link
        :to="item.path"
      >
        <v-list-item-content>
          <v-list-item-title>{{ item.meta.title }}</v-list-item-title>
        </v-list-item-content>

        <v-list-item-icon>
          <v-icon x-small :color="item.meta.color">
            {{ `mdi-checkbox-blank-circle${ i === selectedItem ? '' : '-outline' }` }}
          </v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'NavDrawer',
  data () {
    return {
      drawer: false
    }
  },
  props: {
    routes: { type: Array }
  },
  computed: {
    selectedItem () {
      return this.routes.findIndex(
        el => el.name === this.$route.name || (
          'children' in el &&
            el.children.length &&
            el.children.some(child => child.name === this.$route.name)
        )
      )
    }
  },
  methods: {
    onDrawerInput (val) {
      if (val === false) this.$emit('update:drawer', val)
    }
  }
}
</script>
