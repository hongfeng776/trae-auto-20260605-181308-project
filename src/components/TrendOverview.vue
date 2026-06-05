<script setup lang="ts">
import { computed } from 'vue'
import { useBoard } from '@/composables/useBoard'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components'
import { TrendingUp } from 'lucide-vue-next'

use([CanvasRenderer, LineChart, BarChart, PieChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent])

const { currentTrendData, trendPeriod, setTrendPeriod } = useBoard()

const stockLevelOption = computed(() => ({
  backgroundColor: 'transparent',
  title: { text: '库存水平趋势', textStyle: { color: '#94a3b8', fontSize: 12, fontFamily: 'DM Sans' }, left: 'center' },
  tooltip: { trigger: 'axis', backgroundColor: '#1e293b', borderColor: '#475569', textStyle: { color: '#f1f5f9', fontSize: 11 } },
  grid: { left: 36, right: 12, top: 36, bottom: 20 },
  xAxis: {
    type: 'category',
    data: currentTrendData.value.map(d => d.date),
    axisLine: { lineStyle: { color: '#475569' } },
    axisLabel: { color: '#94a3b8', fontSize: 9 },
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: '#475569' } },
    axisLabel: { color: '#94a3b8', fontSize: 9 },
    splitLine: { lineStyle: { color: '#334155' } },
  },
  series: [{
    type: 'line',
    data: currentTrendData.value.map(d => d.stockLevel),
    smooth: true,
    symbol: 'none',
    itemStyle: { color: '#3b82f6' },
    areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(59,130,246,0.35)' }, { offset: 1, color: 'rgba(59,130,246,0.02)' }] } },
  }],
}))

const alertCountOption = computed(() => ({
  backgroundColor: 'transparent',
  title: { text: '预警数量趋势', textStyle: { color: '#94a3b8', fontSize: 12, fontFamily: 'DM Sans' }, left: 'center' },
  tooltip: { trigger: 'axis', backgroundColor: '#1e293b', borderColor: '#475569', textStyle: { color: '#f1f5f9', fontSize: 11 } },
  grid: { left: 36, right: 12, top: 36, bottom: 20 },
  xAxis: {
    type: 'category',
    data: currentTrendData.value.map(d => d.date),
    axisLine: { lineStyle: { color: '#475569' } },
    axisLabel: { color: '#94a3b8', fontSize: 9 },
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: '#475569' } },
    axisLabel: { color: '#94a3b8', fontSize: 9 },
    splitLine: { lineStyle: { color: '#334155' } },
  },
  series: [{
    type: 'bar',
    data: currentTrendData.value.map(d => d.alertCount),
    itemStyle: { color: '#f59e0b', borderRadius: [3, 3, 0, 0] },
    barMaxWidth: 16,
  }],
}))

const restockPieOption = computed(() => {
  const last = currentTrendData.value[currentTrendData.value.length - 1]
  const completed = last?.restockCompletionRate ?? 0
  return {
    backgroundColor: 'transparent',
    title: { text: '补货完成率', textStyle: { color: '#94a3b8', fontSize: 12, fontFamily: 'DM Sans' }, left: 'center' },
    tooltip: { trigger: 'item', backgroundColor: '#1e293b', borderColor: '#475569', textStyle: { color: '#f1f5f9', fontSize: 11 } },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '58%'],
      data: [
        { value: completed, name: '已完成', itemStyle: { color: '#10b981' } },
        { value: 100 - completed, name: '未完成', itemStyle: { color: '#475569' } },
      ],
      label: { color: '#94a3b8', fontSize: 10, formatter: '{b}\n{d}%' },
      labelLine: { lineStyle: { color: '#475569' } },
    }],
  }
})
</script>

<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <TrendingUp class="w-5 h-5 text-info" />
        <h2 class="text-lg font-semibold font-display" style="color: var(--color-text)">趋势概览</h2>
      </div>
      <div class="flex gap-1">
        <button
          :class="trendPeriod === 7 ? 'bg-info text-white' : 'bg-surface-light text-text-muted'"
          class="px-3 py-1 rounded text-xs transition-colors"
          @click="setTrendPeriod(7)"
        >7天</button>
        <button
          :class="trendPeriod === 30 ? 'bg-info text-white' : 'bg-surface-light text-text-muted'"
          class="px-3 py-1 rounded text-xs transition-colors"
          @click="setTrendPeriod(30)"
        >30天</button>
      </div>
    </div>
    <div class="flex gap-3">
      <VChart :option="stockLevelOption" class="flex-1" style="height: 200px" />
      <VChart :option="alertCountOption" class="flex-1" style="height: 200px" />
      <VChart :option="restockPieOption" class="flex-1" style="height: 200px" />
    </div>
  </div>
</template>
