<template>
  <v-row class="flex-column-reverse flex-lg-row" >
    <v-col cols="12" lg="9">
      <v-card
        v-if="bmdKoboDataLoading || bmdKoboAreasLoading"
        outlined
        flat
        class="pa-4 d-flex align-center"
        style="min-height: 300px; background: none; border: none;"
      >
        <v-progress-circular class="mx-auto" indeterminate :color="$route.meta.color"></v-progress-circular>
      </v-card>
      <v-card
        v-else-if="!bmdKoboData || !bmdKoboAreas || !bmdKoboData.length || !bmdKoboAreas.length"
        outlined
        flat
        class="pa-4 d-flex align-center justify-center"
        style="min-height: 300px;"
      >
        <div class="text-h5">Failed to get data from server</div>
      </v-card>
      <v-card
        v-else
        outlined
        flat
        class="pa-4 d-flex align-center justify-center"
      >
        <!-- <div class="text-h5">Failed to get data from server</div> -->
        <WeekWiseHeatmap
          v-if="weekData"
          :key="selectedWeek.getTime()"
          :stations="bmdKoboAreas"
          :week="selectedWeek"
          :weekData="weekData"
        />
      </v-card>
    </v-col>
    <v-col cols="12" lg="3" id="week-wise-heatmap-right">
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

        <template v-if="weeks">
          <div class="text-subtitle-2 mt-4 mb-2">Week Picker</div>
          <v-select
            v-model="selectedWeek"
            :items="weeks"
            :label="selectedWeek ? 'Selected Week' : 'Select Week'"
            outlined
            item-text="label"
            item-value="value"
          ></v-select>
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { extent } from 'd3-array'
import { timeWeek, timeDay } from 'd3-time'
import { timeFormat } from 'd3-time-format'

import Legend from '../../components/BmdKobo/Legend.vue'
import WeekWiseHeatmap from '../../components/BmdKobo/WeekWiseHeatmap.vue'

export default {
  name: 'BmdSynopticWeekWiseHeatmap',
  data () {
    return {
      // selectedMonth: null,
      selectedWeek: null
    }
  },
  props: {
    bmdKoboAreas: { type: Array },
    bmdKoboAreasLoading: { type: Boolean, default: true },
    bmdKoboData: { type: Array },
    bmdKoboDataLoading: { type: Boolean, default: true }
  },
  components: {
    WeekWiseHeatmap,
    Legend
  },
  computed: {
    // months () {
    //   if (!this.bmdKoboData || this.bmdKoboDataLoading) return null
    //   const extents = extent(this.bmdKoboData, d => d.tm)
    //   return timeMonth.range(
    //     timeMonth.floor(extents[0]),
    //     timeMonth.ceil(extents[1])
    //   ).map(el => ({ label: timeFormat('%B %Y')(el), value: el }))
    // },
    weeks () {
      if (!this.bmdKoboData || !this.bmdKoboData.length || this.bmdKoboDataLoading) return null

      const extents = extent(this.bmdKoboData, d => d.tm)
      return timeWeek.range(
        timeWeek.floor(extents[0]),
        timeWeek.ceil(extents[1])
      ).map(el => {
        const weekend = timeDay.offset(el, 6)
        return {
          label: `${timeFormat('%b %-d, %Y')(el)} - ${timeFormat('%b %-d, %Y')(weekend)}`,
          value: el
        }
      }).reverse()
    },
    nextWeek () {
      return !this.selectedWeek
        ? null
        : timeWeek.offset(this.selectedWeek, 1)
    },
    weekData () {
      return !this.bmdKoboData || !this.selectedWeek
        ? null
        : this.bmdKoboData.filter(
          el => el.tm.getTime() >= this.selectedWeek.getTime() &&
            el.tm.getTime() < this.nextWeek.getTime()
        )
    }
  },
  watch: {
    // months: {
    //   handler (val) {
    //     if (val && val.length) this.selectedMonth = val[val.length - 1]
    //   },
    //   immediate: true
    // },
    weeks: {
      handler (val) {
        if (val && val.length) this.selectedWeek = val[0].value
      },
      immediate: true
    }
    // selectedMonth (val, old) {
    //   if (old) this.selectedWeek = timeWeek.floor(val)
    // }
  }
}
</script>

<style lang="scss">
#week-wise-heatmap-right .v-input .v-text-field__details {
  display: none;
}
</style>
