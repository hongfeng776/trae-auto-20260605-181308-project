<script setup lang="ts">
import { Truck, AlertCircle, CheckCircle, Clock } from 'lucide-vue-next'
import { useBoard } from '@/composables/useBoard'

const { restockSuggestions, warehouseList } = useBoard()

const priorityMap: Record<string, { label: string; cls: string }> = {
  urgent: { label: '紧急', cls: 'badge-danger' },
  high: { label: '高', cls: 'badge-warning' },
  medium: { label: '中', cls: 'badge-info' },
  low: { label: '低', cls: 'badge-success' },
}

const supplierDotMap: Record<string, { dot: string; badge?: string; badgeCls?: string }> = {
  '在线': { dot: 'bg-success' },
  '离线': { dot: 'bg-danger' },
  '响应中': { dot: 'bg-warning' },
  '缺失': { dot: 'bg-orange-500', badge: '需确认供应商', badgeCls: 'badge-warning' },
}

function warehouseName(id: string) {
  return warehouseList.value.find(w => w.id === id)?.name ?? id
}
</script>

<template>
  <div class="card">
    <div class="flex items-center gap-2 mb-4">
      <Truck class="w-5 h-5 text-info" />
      <h2 class="text-lg font-semibold font-display" style="color: var(--color-text)">补货建议</h2>
    </div>
    <div class="space-y-3 max-h-[480px] overflow-y-auto pr-1">
      <div
        v-for="item in restockSuggestions"
        :key="item.id"
        class="p-3 rounded-lg border transition-colors"
        style="background: var(--color-surface-light); border-color: var(--color-border)"
      >
        <div class="flex items-center justify-between mb-2">
          <div>
            <span class="font-semibold text-sm" style="color: var(--color-text)">{{ item.skuName }}</span>
            <span class="ml-2 text-xs text-text-muted">{{ warehouseName(item.warehouseId) }}</span>
          </div>
          <span class="badge" :class="priorityMap[item.priority]?.cls">
            {{ priorityMap[item.priority]?.label }}
          </span>
        </div>
        <div class="flex items-center gap-3 mb-2">
          <div class="flex-1">
            <div class="text-xs text-text-muted mb-1">
              当前 {{ item.currentStock }} / 目标 {{ item.targetStock }}
            </div>
            <div class="h-1.5 rounded-full overflow-hidden" style="background: var(--color-border)">
              <div
                class="h-full bg-info rounded-full transition-all"
                :style="{ width: Math.min(100, (item.currentStock / item.targetStock) * 100) + '%' }"
              />
            </div>
          </div>
          <div class="text-right">
            <div class="text-[10px] text-text-muted">建议补货</div>
            <div class="text-lg font-bold text-info">{{ item.suggestedQuantity }}</div>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="flex items-center gap-1 text-xs text-text-muted">
              <span class="w-2 h-2 rounded-full inline-block" :class="supplierDotMap[item.supplierStatus]?.dot" />
              {{ item.supplierStatus }}
            </span>
            <span
              v-if="supplierDotMap[item.supplierStatus]?.badge"
              class="badge"
              :class="supplierDotMap[item.supplierStatus]?.badgeCls"
            >
              <AlertCircle class="w-3 h-3 mr-0.5" />
              {{ supplierDotMap[item.supplierStatus].badge }}
            </span>
          </div>
          <div class="flex gap-1">
            <span
              v-for="tag in item.tags"
              :key="tag"
              class="badge"
              :class="tag === '紧急补货' ? 'badge-danger' : tag === '需确认供应商' ? 'badge-warning' : tag === '预警过多' ? 'badge-info' : tag === '供应商离线' ? 'badge-danger' : 'badge-info'"
            >{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
