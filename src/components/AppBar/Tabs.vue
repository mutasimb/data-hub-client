<template>
  <v-tabs v-model="activeTab">
    <v-tabs-slider color="white"></v-tabs-slider>
    <v-tab v-for="(tab, i) in activeTabs" :key="i" :to="tab.to">{{ tab.title }}</v-tab>
  </v-tabs>
</template>

<script>
export default {
  name: 'HeaderTabs',
  data () {
    return {
      activeTab: 0,
      allTabs: [
        { title: 'Week-wise Heatmap', to: '/bmd-synoptic/week-wise-heatmap' },
        { title: 'Calendar Heatmap', to: '/bmd-synoptic/calendar-heatmap' },
        { title: 'Tab 1', to: '/bmd-forecast/tab-1' },
        { title: 'Tab 2', to: '/bmd-forecast/tab-2' },
        { title: 'Tab 1', to: '/fall-armyworm/tab-1' }
      ]
    }
  },
  computed: {
    activeTabs () {
      const activeDataset = this.$route.path.split('/').filter(el => el)
      return this.allTabs.filter(el => el.to.startsWith('/' + activeDataset[0]))
    }
  }
}
</script>
