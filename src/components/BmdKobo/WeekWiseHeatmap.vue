<template>
  <svg
    class="svg-calendar my-4 mx-auto d-block"
    :width="textDatesSpacing + wPlot + textStationRight"
    :height="hPlot + textStationSpacing"
    ref="svgWeekWise"
  />
</template>

<script>
import { select } from 'd3-selection'
import { scaleBand, scaleOrdinal } from 'd3-scale'
import { timeDay } from 'd3-time'
import { utcFormat, timeFormat } from 'd3-time-format'
import { range } from 'd3-array'
import { schemeRdYlGn } from 'd3-scale-chromatic'

export default {
  data () {
    return {
      textStationRight: 15,
      textDatesSpacing: 95,
      textStationSpacing: 55,
      cellsize: 25
    }
  },
  props: {
    stations: { type: Array, required: true },
    week: { type: Date, required: true },
    weekData: { type: Array, required: true }
  },
  computed: {
    wPlot () {
      return this.cellsize * this.stations.length
    },
    hPlot () {
      return this.cellsize * 7
    }
  },
  methods: {
    initiatePlot () {
      const { svgWeekWise } = this.$refs
      const areaScale = scaleBand().domain(this.stations).range([0, this.wPlot])
      const colorScale = scaleOrdinal()
        .domain(range(9))
        .range([
          '#eeeeee', ...schemeRdYlGn[8]
        ])
      const gStation = select(svgWeekWise)
        .append('g')
        .classed('g-stations', true)
        .attr('transform', `translate(${this.textDatesSpacing}, ${this.textStationSpacing})`)
        .selectAll('.g-station')
        .data(this.stations)
        .enter()
        .append('g')
        .classed('g-station', true)
        .attr('transform', d => `translate(${areaScale(d)}, 0)`)
      const tooltip = select('#v-app-root')
        .append('div')
        .attr('class', 'tooltip-week-wise grow v-card v-sheet v-sheet--outlined theme--light elevation-0')
        .style('visibility', 'hidden')
        .style('opacity', '0')
        .html('')

      gStation.selectAll('rect')
        .data(d => this.weekData
          .filter(el => el.st === d)
          .reduce(
            (acc, el) => {
              const y = el.tm.getDay()
              const i = acc.findIndex((el) => el.y === y)

              acc[i] = {
                ...acc[i],
                entries: [...acc[i].entries, el]
              }
              return acc
            },
            timeDay.range(
              this.week, timeDay.offset(this.week, 7)
            ).map(el => ({
              station: d,
              y: el.getDay(),
              date: el,
              entries: []
            }))
          )
          .map(el => {
            const uniques = el.entries.filter(
              (el, i, arr) => arr.map(
                el1 => utcFormat('%Y%m%d%H')(el1.tm)
              ).indexOf(utcFormat('%Y%m%d%H')(el.tm)) === i
            )
            return { ...el, valid: uniques.length, invalid: uniques.length < el.entries.length }
          })
        )
        .enter()
        .append('rect')
        .attr('x', 1)
        .attr('y', (_, i) => i * this.cellsize + 1)
        .attr('width', this.cellsize - 2)
        .attr('height', this.cellsize - 2)
        .attr('fill', d => colorScale(d.valid))
        .attr('stroke-width', 2)
        .attr('stroke', d => d.invalid ? 'purple' : 'transparent')
        .on('mouseover', (e, d) => {
          let htmlString = ''
          htmlString = htmlString + '<div class="v-card__text">' // class v-card__text starts
          htmlString = htmlString + `<div>${d.station} Station</div>`
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

      select(svgWeekWise)
        .append('g')
        .classed('text-station', true)
        .attr('transform', d => `translate(${
          this.textDatesSpacing + 1 + this.cellsize / 2
        }, ${
          this.textStationSpacing - 3
        })`)
        .selectAll('text')
        .data(this.stations)
        .enter()
        .append('text')
        .text(d => d)
        .attr('transform', d => `translate(${areaScale(d)}, 0) rotate(-45)`)
        .attr('font-size', 11)
        .attr('alignment-baseline', 'middle')

      select(svgWeekWise)
        .append('g')
        .classed('text-date', true)
        .attr('transform', `translate(${this.textDatesSpacing - 3}, ${this.textStationSpacing + 1 + this.cellsize / 2})`)
        .selectAll('text')
        .data(timeDay.range(
          this.week, timeDay.offset(this.week, 7)
        ))
        .enter()
        .append('text')
        .text(d => timeFormat('%a, %b %-d, %Y')(d))
        .attr('transform', (_, i) => `translate(0, ${i * this.cellsize})`)
        .attr('font-size', 11)
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'middle')
    }
  },
  mounted () {
    this.initiatePlot()
  }
}
</script>

<style lang="scss">
.tooltip-week-wise {
  position: absolute !important;
  z-index: 10;
  max-width: 640px;
  background-color: rgba(255,255,255,0.95) !important;
  font-family: 'Roboto', sans-serif;
  transition: opacity 0.25s ease-out;
}
</style>
