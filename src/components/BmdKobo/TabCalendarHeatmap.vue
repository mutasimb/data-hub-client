<template>
  <v-row class="flex-column-reverse flex-lg-row">
    <v-col cols="12" lg="9">
      <v-card
        v-if="bmdKoboDataLoading || bmdKoboAreasLoading || $apollo.queries.bmdKoboYears.loading"
        outlined
        flat
        class="pa-4 d-flex align-center"
        style="min-height: 300px; background: none; border: none;"
      >
        <v-progress-circular class="mx-auto" indeterminate :color="$route.meta.color"></v-progress-circular>
      </v-card>
      <v-card
        v-else-if="!bmdKoboData || !bmdKoboYears"
        outlined
        flat
        class="pa-4 d-flex align-center justify-center"
        style="min-height: 300px;"
      >
        <div class="text-h5">Failed to get data from server</div>
      </v-card>
      <v-card v-else outlined flat class="pa-4" style="overflow-x: scroll;">
        <CalendarHeatmap
          v-for="area in bmdKoboAreas.filter(
            el => selectedAreas.length === 0 || selectedAreas.indexOf(el) > -1
          )"
          :key="area"
          :station="area"
          :years="bmdKoboYears"
          :stationData="bmdKoboData.filter((el) => el.st === area)"
        />
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card outlined flat class="pa-4">
        <div class="text-caption">
          Welcome to the BMD Synoptic Station Data Monitor. The visualizations
          in this page represent the data being colleceted through the
          KoboToolbox by the BMD staffs all over the country by the means of
          handheld tabs. Currently, the data of 20 BMD stations are being
          collected in this manner starting from May 20, 2019. The heatmaps in
          this page provide the visuals whether the data collection frequency
          is okay or not.
        </div>

        <div class="text-subtitle-2 mt-4">Legend</div>
        <Legend class="mt-2" />

        <template v-if="showFilters">
          <div class="text-subtitle-2 mt-4 mb-2">Filters</div>
          <v-select
            v-model="selectedAreas"
            :items="bmdKoboAreas"
            label="Stations"
            multiple
            clearable
            outlined
          >
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index === 0">
                <span>{{ item }}</span>
              </v-chip>
              <span v-if="index === 1" class="grey--text text-caption">
                (+{{ selectedAreas.length - 1 }} others)
              </span>
            </template>
          </v-select>
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import gql from 'graphql-tag'

import CalendarHeatmap from './CalendarHeatmap.vue'
import Legend from './Legend.vue'

export default {
  name: 'BmdSynopticCalendarHeatmap',
  data () {
    return {
      selectedAreas: []
    }
  },
  props: {
    bmdKoboAreas: { type: Array },
    bmdKoboAreasLoading: { type: Boolean, default: true },
    bmdKoboData: { type: Array },
    bmdKoboDataLoading: { type: Boolean, default: true }
  },
  apollo: {
    bmdKoboYears: gql`
      query {
        bmdKoboYears: getAllBmdKoboYears
      }
    `
  },
  components: {
    CalendarHeatmap,
    Legend
  },
  computed: {
    showFilters () {
      return this.bmdKoboAreas && this.bmdKoboAreas.length > 0
    }
  }
}
</script>
