<template>
  <svg width="100%" height="128" ref="legend" />
</template>

<script>
import { select } from 'd3-selection'
import { schemeRdYlGn } from 'd3-scale-chromatic'

export default {
  name: 'Legend',
  mounted () {
    select(this.$refs.legend)
      .append('text')
      .text('Number of valid entries')
      .attr('transform', 'translate(0, 15)')

    select(this.$refs.legend)
      .append('text')
      .text('1')
      .attr('transform', 'translate(0, 37)')

    select(this.$refs.legend)
      .append('text')
      .text('8')
      .attr('transform', 'translate(142, 37)')

    select(this.$refs.legend)
      .selectAll('rect')
      .data([...schemeRdYlGn[8]])
      .enter()
      .append('rect')
      .attr('transform', 'translate(15, 25)')
      .attr('width', 13)
      .attr('height', 13)
      .attr('x', (d, i) => i * 15)
      .attr('y', 0)
      .attr('fill', (d) => d)

    select(this.$refs.legend)
      .append('text')
      .text('Days with invalid entries')
      .attr('transform', 'translate(0, 60)')

    select(this.$refs.legend)
      .append('rect')
      .attr('transform', 'translate(1, 70)')
      .attr('width', 13)
      .attr('height', 13)
      .attr('x', 0)
      .attr('y', 0)
      .attr('stroke', 'purple')
      .attr('fill', 'transparent')

    select(this.$refs.legend)
      .append('text')
      .text('No entry')
      .attr('transform', 'translate(0, 105)')

    select(this.$refs.legend)
      .append('rect')
      .attr('transform', 'translate(1, 115)')
      .attr('width', 13)
      .attr('height', 13)
      .attr('x', 0)
      .attr('y', 0)
      .attr('stroke', 'transparent')
      .attr('fill', '#eeeeee')
  }
}
</script>
