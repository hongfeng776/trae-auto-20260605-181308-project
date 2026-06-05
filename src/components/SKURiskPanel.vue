<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { AlertTriangle, Package, Shield } from 'lucide-vue-next'
import { useBoard } from '@/composables/useBoard'

const { filteredSKUs, riskCounts, selectedRiskTab, selectedSkuId, setRiskTab, selectSku } = useBoard()

const rowRefs = ref<Record<string, HTMLTableRowElement>>({})

const tabs = [
  { key: 'all' as const, label: '全部', color: '' },
  { key: 'out_of_stock' as const, label: '断货', color: 'text-danger' },
  { key: 'critical' as const, label: '极低', color: 'text-amber-400' },
  { key: 'low' as const, label: '偏低', color: 'text-yellow-400' },
  { key: 'normal' as const, label: '正常', color: 'text-success' },
]

const underlineColor: Record<string, string> = {
  all: 'bg-slate-400',
  out_of_stock: 'bg-danger',
  critical: 'bg-amber-400',
  low: 'bg-yellow-400',
  normal: 'bg-success',
}

const riskBadge: Record<string, { label: string; cls: string }> = {
  out_of_stock: { label: '断货', cls: 'badge-danger' },
  critical: { label: '极低', cls: 'badge-warning' },
  low: { label: '偏低', cls: 'badge-warning' },
  normal: { label: '正常', cls: 'badge-success' },
}

function tabCount(key: string) {
  if (key === 'all') return filteredSKUs.value.length
  return riskCounts.value[key as keyof typeof riskCounts.value]
}

watch(selectedSkuId, async (id) => {
  if (id && rowRefs.value[id]) {
    await nextTick()
    rowRefs.value[id]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
})
</script>

<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <AlertTriangle class="w-5 h-5 text-warning" />
        <h2 class="text-lg font-semibold font-display" style="color: var(--color-text)">SKU 风险面板</h2>
      </div>
      <button
        v-if="selectedSkuId"
        class="text-xs text-text-muted hover:text-info transition px-2 py-1 rounded"
        style="background: var(--color-surface-light)"
        @click="selectSku(null)"
      >
        取消选中
      </button>
    </div>

    <div class="flex border-b" style="border-color: var(--color-border)">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="relative flex-1 px-3 py-2.5 text-xs font-medium text-center transition-colors"
        :class="selectedRiskTab === tab.key ? (tab.color || 'text-text-primary') : 'text-text-muted hover:text-text-primary'"
        @click="setRiskTab(tab.key)"
      >
        {{ tab.label }}
        <span class="ml-1 text-[10px] opacity-70">({{ tabCount(tab.key) }})</span>
        <span
          v-if="selectedRiskTab === tab.key"
          class="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
          :class="underlineColor[tab.key]"
        />
      </button>
    </div>

    <div class="overflow-x-auto mt-2">
      <table class="w-full text-xs">
        <thead>
          <tr class="text-left text-text-muted">
            <th class="px-3 py-2 font-medium">SKU名称</th>
            <th class="px-3 py-2 font-medium">分类</th>
            <th class="px-3 py-2 font-medium">当前库存</th>
            <th class="px-3 py-2 font-medium">安全线</th>
            <th class="px-3 py-2 font-medium">风险等级</th>
            <th class="px-3 py-2 font-medium">处理标签</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="sku in filteredSKUs"
            :key="sku.id"
            :ref="(el) => { if (el) rowRefs[sku.id] = el as HTMLTableRowElement }"
            class="border-t transition-all cursor-pointer"
            :class="[
              selectedSkuId === sku.id
                ? 'ring-1 ring-info bg-info/10'
                : sku.currentStock === 0
                  ? 'bg-red-500/10 hover:bg-red-500/15'
                  : 'hover:bg-surface-light',
            ]"
            style="border-color: var(--color-border)"
            @click="selectSku(sku.id)"
          >
            <td class="px-3 py-2.5">
              <div class="flex items-center gap-2">
                <Package class="w-3.5 h-3.5 text-text-muted shrink-0" />
                <span class="font-medium" :class="selectedSkuId === sku.id ? 'text-info' : ''" style="color: var(--color-text)">{{ sku.name }}</span>
              </div>
            </td>
            <td class="px-3 py-2.5 text-text-muted">{{ sku.category }}</td>
            <td class="px-3 py-2.5 font-mono" :class="sku.currentStock === 0 ? 'text-danger font-bold' : ''" style="color: var(--color-text)">
              {{ sku.currentStock }}
            </td>
            <td class="px-3 py-2.5 font-mono text-text-muted">{{ sku.safetyStock }}</td>
            <td class="px-3 py-2.5">
              <span class="badge" :class="riskBadge[sku.riskLevel]?.cls">
                <Shield class="w-3 h-3 mr-0.5" />
                {{ riskBadge[sku.riskLevel]?.label }}
              </span>
            </td>
            <td class="px-3 py-2.5">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="tag in sku.tags"
                  :key="tag"
                  class="badge"
                  :class="tag === '断货' ? 'badge-danger' : tag === '供应商缺失' ? 'badge-warning' : tag === '预警过多' ? 'badge-info' : 'badge-info'"
                >{{ tag }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
