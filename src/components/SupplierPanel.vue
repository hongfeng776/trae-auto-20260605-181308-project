<script setup lang="ts">
import { Users, UserCheck, UserX, Clock, AlertTriangle } from 'lucide-vue-next'
import { useBoard } from '@/composables/useBoard'

const { supplierList, supplierMissingSKUs } = useBoard()

const statusMap: Record<string, { label: string; dot: string; badge: string }> = {
  online: { label: '在线', dot: 'bg-success', badge: 'badge-success' },
  offline: { label: '离线', dot: 'bg-danger', badge: 'badge-danger' },
  responding: { label: '响应中', dot: 'bg-warning', badge: 'badge-warning' },
}
</script>

<template>
  <div class="card">
    <div class="flex items-center gap-2 mb-4">
      <Users class="w-5 h-5 text-info" />
      <h2 class="text-lg font-semibold font-display" style="color: var(--color-text)">供应商协同</h2>
    </div>

    <div class="space-y-2">
      <div
        v-for="supplier in supplierList"
        :key="supplier.id"
        class="p-3 rounded-lg border transition-colors"
        style="background: var(--color-surface-light); border-color: var(--color-border)"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span
              class="w-2.5 h-2.5 rounded-full"
              :class="[statusMap[supplier.status]?.dot, supplier.status === 'responding' ? 'animate-pulse' : '']"
            />
            <span class="font-medium text-sm" style="color: var(--color-text)">{{ supplier.name }}</span>
          </div>
          <span class="badge" :class="statusMap[supplier.status]?.badge">
            {{ statusMap[supplier.status]?.label }}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-2 text-xs text-text-muted">
          <div class="flex items-center gap-1.5">
            <UserCheck class="w-3 h-3" />
            <span>响应率</span>
            <span class="font-medium" style="color: var(--color-text)">{{ supplier.responseRate }}%</span>
            <div class="flex-1 h-1 rounded-full overflow-hidden ml-1" style="background: var(--color-border)">
              <div
                class="h-full bg-info rounded-full"
                :style="{ width: supplier.responseRate + '%' }"
              />
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <Clock class="w-3 h-3" />
            <span>交货期</span>
            <span class="font-medium" style="color: var(--color-text)">{{ supplier.leadTime }}天</span>
          </div>
          <div class="flex items-center gap-1.5">
            <UserX class="w-3 h-3" />
            <span>可靠性</span>
            <span class="font-medium" style="color: var(--color-text)">{{ supplier.reliability }}%</span>
          </div>
          <div class="flex items-center gap-1.5">
            <Users class="w-3 h-3" />
            <span>SKU</span>
            <span class="font-medium" style="color: var(--color-text)">{{ supplier.skuIds.length }}个</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="supplierMissingSKUs.length > 0" class="mt-4">
      <div class="flex items-center gap-2 mb-2">
        <AlertTriangle class="w-4 h-4 text-warning" />
        <h3 class="text-sm font-semibold font-display" style="color: var(--color-text)">供应商缺失 SKU</h3>
      </div>
      <div class="space-y-1.5">
        <div
          v-for="sku in supplierMissingSKUs"
          :key="sku.id"
          class="flex items-center justify-between p-2 rounded-lg border"
          style="background: var(--color-warning-bg); border-color: var(--color-warning)"
        >
          <div class="flex items-center gap-2 text-xs">
            <AlertTriangle class="w-3 h-3 text-warning" />
            <span style="color: var(--color-text)">{{ sku.name }}</span>
          </div>
          <span class="badge badge-warning">需分配供应商</span>
        </div>
      </div>
    </div>
  </div>
</template>
