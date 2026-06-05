<script setup lang="ts">
import { useBoard } from '@/composables/useBoard'
import { Warehouse, MapPin, Package, AlertTriangle, XCircle } from 'lucide-vue-next'

const { warehouseList, selectedWarehouseId, selectWarehouse } = useBoard()

function capacityPercent(used: number, total: number) {
  return total > 0 ? Math.round((used / total) * 100) : 0
}

function capacityColor(percent: number) {
  if (percent > 85) return 'bg-red-500'
  if (percent > 70) return 'bg-yellow-500'
  return 'bg-green-500'
}
</script>

<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2 text-lg font-semibold font-display" style="color: var(--color-text)">
        <Warehouse class="w-5 h-5 text-info" />
        仓库列表
      </div>
      <button
        class="px-3 py-1 text-xs rounded-md transition-colors"
        :class="selectedWarehouseId === null ? 'bg-info text-white' : 'text-text-muted hover:bg-surface-light'"
        @click="selectWarehouse(null)"
      >
        全部
      </button>
    </div>

    <div class="space-y-2">
      <div
        v-for="wh in warehouseList"
        :key="wh.id"
        class="p-3 rounded-lg cursor-pointer transition-all border-l-4"
        :class="[
          selectedWarehouseId === wh.id ? 'border-l-info ring-1 ring-info/30' : '',
          wh.outOfStock > 0 && selectedWarehouseId !== wh.id ? 'border-l-danger' : 'border-l-transparent',
        ]"
        style="background: var(--color-surface-light)"
        @click="selectWarehouse(wh.id)"
      >
        <div class="flex items-center gap-1 font-medium mb-2" style="color: var(--color-text)">
          {{ wh.name }}
          <MapPin class="w-3.5 h-3.5 ml-1 text-text-muted" />
          <span class="text-xs text-text-muted">{{ wh.location }}</span>
        </div>

        <div class="flex items-center gap-3 text-xs text-text-muted mb-2">
          <span class="flex items-center gap-1"><Package class="w-3.5 h-3.5" /> {{ wh.totalSKUs }} SKU</span>
          <span
            class="flex items-center gap-1 px-1.5 py-0.5 rounded-full"
            :class="wh.riskSKUs > 0 ? 'badge-danger' : ''"
          >
            <AlertTriangle class="w-3 h-3" /> {{ wh.riskSKUs }} 风险
          </span>
          <span
            class="flex items-center gap-1"
            :class="wh.outOfStock > 0 ? 'text-danger font-semibold' : ''"
          >
            <XCircle class="w-3 h-3" /> {{ wh.outOfStock }} 缺货
          </span>
        </div>

        <div class="flex items-center gap-2">
          <div class="flex-1 h-1.5 rounded-full overflow-hidden" style="background: var(--color-border)">
            <div
              class="h-full rounded-full transition-all"
              :class="capacityColor(capacityPercent(wh.usedCapacity, wh.capacity))"
              :style="{ width: capacityPercent(wh.usedCapacity, wh.capacity) + '%' }"
            />
          </div>
          <span class="text-xs text-text-muted">
            {{ capacityPercent(wh.usedCapacity, wh.capacity) }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
