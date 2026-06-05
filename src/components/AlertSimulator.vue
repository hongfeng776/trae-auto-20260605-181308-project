<script setup lang="ts">
import { computed } from 'vue'
import { useBoard } from '@/composables/useBoard'
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle, Play } from 'lucide-vue-next'

const {
  alerts,
  pendingAlertCount,
  resolveAlert,
  processAlert,
  simulateOutofStock,
  simulateBelowSafety,
  simulateSupplierDelay,
  simulateSupplierMissing,
} = useBoard()

const sortedAlerts = computed(() => [...alerts.value].reverse())

const levelConfig: Record<string, { icon: typeof AlertTriangle; color: string }> = {
  critical: { icon: AlertTriangle, color: 'text-danger' },
  warning: { icon: AlertCircle, color: 'text-warning' },
  info: { icon: Info, color: 'text-info' },
}

const statusConfig: Record<string, { label: string; cls: string }> = {
  pending: { label: '待处理', cls: 'badge-danger' },
  processing: { label: '处理中', cls: 'badge-warning' },
  resolved: { label: '已处理', cls: 'badge-success' },
}
</script>

<template>
  <div class="card">
    <div class="flex items-center gap-2 mb-4">
      <div class="relative">
        <Bell class="w-5 h-5 text-warning" />
        <span
          v-if="pendingAlertCount > 0"
          class="absolute -top-1.5 -right-1.5 bg-danger text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
        >
          {{ pendingAlertCount }}
        </span>
      </div>
      <h2 class="text-lg font-semibold font-display" style="color: var(--color-text)">预警中心</h2>
    </div>

    <div class="mb-4">
      <h3 class="text-xs font-medium text-text-muted mb-2">模拟预警</h3>
      <div class="flex flex-wrap gap-2">
        <button @click="simulateOutofStock()" class="px-3 py-1.5 text-xs text-white bg-danger rounded-lg hover:opacity-80 transition">模拟断货</button>
        <button @click="simulateBelowSafety()" class="px-3 py-1.5 text-xs text-white bg-amber-500 rounded-lg hover:opacity-80 transition">模拟安全线</button>
        <button @click="simulateSupplierDelay()" class="px-3 py-1.5 text-xs text-white bg-orange-500 rounded-lg hover:opacity-80 transition">模拟供应商延迟</button>
        <button @click="simulateSupplierMissing()" class="px-3 py-1.5 text-xs text-white bg-yellow-600 rounded-lg hover:opacity-80 transition">模拟供应商缺失</button>
      </div>
    </div>

    <div>
      <h3 class="text-xs font-medium text-text-muted mb-2">预警列表</h3>
      <div class="max-h-80 overflow-y-auto space-y-2 pr-1">
        <div
          v-for="alert in sortedAlerts"
          :key="alert.id"
          :class="[
            'p-3 rounded-lg border-l-4',
            alert.status === 'pending' ? 'border-l-danger' : alert.status === 'processing' ? 'border-l-warning' : 'border-l-slate-600',
          ]"
          style="background: var(--color-surface-light)"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-start gap-2 min-w-0">
              <component
                :is="levelConfig[alert.level]?.icon ?? Info"
                :class="[
                  'w-4 h-4 mt-0.5 shrink-0',
                  levelConfig[alert.level]?.color ?? 'text-text-muted',
                  alert.status === 'pending' ? 'animate-pulse-glow' : '',
                ]"
              />
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-xs font-medium" style="color: var(--color-text)">{{ alert.title }}</span>
                  <span class="text-[10px] text-text-muted">{{ alert.timestamp.slice(11, 16) }}</span>
                </div>
                <p class="text-[11px] text-text-muted mt-0.5">{{ alert.message }}</p>
                <p v-if="alert.action" class="text-[10px] text-text-muted mt-0.5 opacity-70">→ {{ alert.action }}</p>
              </div>
            </div>
            <span class="badge shrink-0" :class="statusConfig[alert.status]?.cls ?? ''">
              {{ statusConfig[alert.status]?.label ?? alert.status }}
            </span>
          </div>
          <div v-if="alert.status !== 'resolved'" class="flex gap-2 mt-2">
            <button
              v-if="alert.status === 'pending'"
              @click="processAlert(alert.id)"
              class="flex items-center gap-1 px-2 py-1 text-[11px] text-warning rounded hover:opacity-80 transition"
              style="background: var(--color-warning-bg)"
            >
              <Play class="w-3 h-3" /> 处理
            </button>
            <button
              @click="resolveAlert(alert.id)"
              class="flex items-center gap-1 px-2 py-1 text-[11px] text-success rounded hover:opacity-80 transition"
              style="background: var(--color-success-bg)"
            >
              <CheckCircle class="w-3 h-3" /> 完成
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
