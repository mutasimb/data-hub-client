<template>
  <v-container style="max-width: 1200px; margin-top: 112px;">
    <router-view
      :bmdKoboAreas="bmdKoboAreas ? bmdKoboAreas : []"
      :bmdKoboAreasLoading="$apollo.queries.bmdKoboAreas.loading"
      :bmdKoboData="bmdKoboDataSerialized"
      :bmdKoboDataLoading="$apollo.queries.bmdKoboData.loading"
    />
  </v-container>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'BmdSynoptic',
  apollo: {
    bmdKoboAreas: {
      query: gql`
        query {
          bmdKoboAreas: getAllBmdKoboAreas
        }
      `,
      update: data => data.bmdKoboAreas.sort()
    },
    bmdKoboData: gql`
      query {
        bmdKoboData: getAllBmdKoboEntries {
          st
          tm
          submit
          user
        }
      }
    `
  },
  computed: {
    bmdKoboDataSerialized () {
      return !this.$apolloData.queries.bmdKoboData.loading &&
        this.bmdKoboData &&
        this.bmdKoboData.length
        ? this.bmdKoboData.map(el => ({ ...el, submit: new Date(el.submit), tm: new Date(el.tm) }))
        : []
    }
  }
}
</script>
