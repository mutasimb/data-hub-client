<template>
  <svg
    class="svg-calendar my-4 mx-auto d-block"
    :height="stationTextSpacing + monthTextSpacing * years.length + h"
    :width="outerPadding * 2 + w + weekTextSpacing"
    ref="svgCalendar"
  />
</template>

<script>
import { select } from 'd3-selection'
import { scaleBand, scaleOrdinal } from 'd3-scale'
import { timeWeek, timeYear, timeMonths, timeDays } from 'd3-time'
import { timeFormat, utcFormat } from 'd3-time-format'
import { range } from 'd3-array'
import { schemeRdYlGn } from 'd3-scale-chromatic'

export default {
  data () {
    return {
      outerPadding: 10,
      stationTextSpacing: 15,
      weekTextSpacing: 35,
      monthTextSpacing: 25,
      cellsize: 14
    }
  },
  props: {
    station: { type: String, required: true },
    stationData: {
      type: Array,
      validator: (val) =>
        val.every((el) => 'st' in el && 'submit' in el && 'tm' in el)
    },
    years: {
      type: Array,
      validator: (val) => val.every((el) => typeof el === 'number')
    }
  },
  computed: {
    w () {
      // more work
      return this.cellsize * 53
    },
    h () {
      return this.cellsize * 7 * this.years.length
    }
  },
  methods: {
    monthPath (t0) {
      const t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0)
      const d0 = t0.getDay()
      const d1 = t1.getDay()
      const w0 = timeWeek.count(timeYear(t0), t0)
      const w1 = timeWeek.count(timeYear(t1), t1)

      return `M${(w0 + 1) * this.cellsize},${d0 * this.cellsize}H${
        w0 * this.cellsize
      }V${7 * this.cellsize}H${w1 * this.cellsize}V${
        (d1 + 1) * this.cellsize
      }H${(w1 + 1) * this.cellsize}V0H${(w0 + 1) * this.cellsize}Z`
    },
    initialPlot () {
      const { svgCalendar } = this.$refs
      const colorBand = scaleOrdinal()
        .domain(range(9))
        .range([
          '#eeeeee', ...schemeRdYlGn[8]
        ])
      const yearBand = scaleBand()
        .range([
          this.stationTextSpacing,
          this.stationTextSpacing + this.h + this.monthTextSpacing * this.years.length
        ])
        .domain(this.years)
      const gYear = select(svgCalendar)
        .selectAll('.g-year')
        .data(this.years)
        .enter()
        .append('g')
        .classed('g-year', true)
        .attr('transform', (d) => `translate(${
            this.weekTextSpacing + this.outerPadding
          }, ${
            yearBand(d) + this.monthTextSpacing - 1
          })`)
      const tooltip = select('#v-app-root')
        .append('div')
        .attr('class', 'tooltip-calendar-heatmap grow v-card v-sheet v-sheet--outlined theme--light elevation-0')
        .style('visibility', 'hidden')
        .style('opacity', '0')
        .html('')

      gYear.append('g')
        .classed('g-month-path', true)
        .selectAll('.path-month')
        .data((d) => timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)))
        .enter()
        .append('path')
        .classed('path-month', true)
        .attr('fill', 'transparent')
        .attr('stroke', '#222222')
        .attr('stroke-width', 2)
        .attr('d', this.monthPath)

      gYear.append('g')
        .classed('g-date-rect', true)
        .selectAll('rect')
        .data(d =>
          this.stationData
            .filter(el => d === +timeFormat('%Y')(el.tm))
            .reduce(
              (acc, el) => {
                const
                  x = timeWeek.count(new Date(d, 0, 1), el.tm)
                const y = el.tm.getDay()
                const i = acc.findIndex((el) => el.x === x && el.y === y)

                acc[i] = {
                  ...acc[i],
                  entries: [...acc[i].entries, el]
                }
                return acc
              },
              timeDays(
                new Date(d, 0, 1), new Date(d + 1, 0, 1)
              ).map((el) => ({
                x: timeWeek.count(new Date(d, 0, 1), el),
                y: el.getDay(),
                date: el,
                entries: []
              }))
            )
            .map(el => {
              const uniques = el.entries
                .filter(
                  (el, i, arr) => arr.map(
                    el1 => utcFormat('%Y%m%d%H')(el1.tm)
                  ).indexOf(utcFormat('%Y%m%d%H')(el.tm)) === i
                )
              return { ...el, valid: uniques.length, invalid: uniques.length < el.entries.length }
            })
        )
        .enter()
        .append('rect')
        .attr('x', (d) => d.x * this.cellsize + 1)
        .attr('y', (d) => d.y * this.cellsize + 1)
        .attr('width', this.cellsize - 2)
        .attr('height', this.cellsize - 2)
        .attr('fill', d => colorBand(d.valid))
        .attr('stroke-width', 2)
        .attr('stroke', d => d.invalid ? 'purple' : 'transparent')
        .on('mouseover', (e, d) => {
          let htmlString = ''
          htmlString = htmlString + '<div class="v-card__text">' // class v-card__text starts
          htmlString = htmlString + `<div>${this.station} Station</div>`
          htmlString = htmlString + `<div class="text-h5 text--primary">${timeFormat('%B %-d, %Y')(d.date)}</div>`
          htmlString = htmlString + (d.entries.length === 0
            ? '<p>No entry</p>'
            : d.valid === d.entries.length
              ? `<p>Entries: ${d.entries.length}</p>`
              : `<p>Valid entries: ${d.valid} | total entries: ${d.entries.length}</p>`)
          if (d.entries.length > 0) {
            htmlString = htmlString + '<div class="text--primary">' // class text--primary starts;
            htmlString = htmlString + d.entries
              .sort((a, b) => a.tm > b.tm ? 1 : -1)
              .map(el => `${utcFormat('%Y-%m-%d %H:%M UTC')(el.tm)}: Submitted ${timeFormat('at %-I:%M %p on %B %-d, %Y')(el.submit)} by ${el.user}`)
              .join('<br/>')
            htmlString = htmlString + '</div>' // class text--primary ends;
          }
          htmlString = htmlString + '</div>' // class v-card__text ends;

          tooltip.html(htmlString)
          return tooltip.style('visibility', 'visible').style('opacity', '1')
        })
        .on(
          'mousemove',
          e => tooltip.style('top', `${e.pageY - 10}px`).style('left', `${e.pageX + 20}px`)
        )
        .on('mouseout', () => tooltip.style('opacity', '0').style('visibility', 'hidden'))

      gYear.append('g')
        .classed('g-month-text', true)
        .selectAll('.text-month')
        .data(
          d => timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1))
            .map(el => timeWeek.ceil(el))
        )
        .enter()
        .append('text')
        .classed('text-month', true)
        .text(d => timeFormat('%b')(d))
        .attr('x', d => timeWeek.count(
          new Date(d.getFullYear(), 0, 1), d
        ) * this.cellsize)
        .attr('font-size', 11)
        .attr('alignment-baseline', 'after-edge')

      gYear.append('g')
        .classed('g-week-text', true)
        .selectAll('.text-week')
        .data(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
        .enter()
        .append('text')
        .classed('text-week', true)
        .text(d => d.slice(0, 3))
        .attr('x', -6)
        .attr('y', (d, i) => i * this.cellsize + this.cellsize / 2)
        .attr('font-size', 11)
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'middle')

      gYear.append('text')
        .text(d => d)
        .attr('x', -4)
        .attr('font-size', 12)
        .attr('font-weight', 700)
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'after-edge')

      select(svgCalendar)
        .append('text')
        .text(this.station)
        .attr('x', this.outerPadding + (this.w + this.weekTextSpacing) / 2)
        .attr('y', 5)
        .attr('font-size', 16)
        .attr('font-weight', 700)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'hanging')
    }
  },
  mounted () {
    this.initialPlot()
  }
}
</script>

<style lang="scss">
.tooltip-calendar-heatmap {
  position: absolute !important;
  z-index: 10;
  max-width: 640px;
  background-color: rgba(255,255,255,0.9) !important;
  font-family: 'Roboto', sans-serif;
  transition: opacity 0.25s ease-out;
}
</style>
