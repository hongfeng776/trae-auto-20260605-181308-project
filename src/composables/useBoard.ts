import { ref, computed } from 'vue'
import {
  warehouses as mockWarehouses,
  skus as mockSKUs,
  suppliers as mockSuppliers,
  initialAlerts,
  trendData7d,
  trendData30d,
  generateRestockSuggestions,
  createAlert,
  type Warehouse,
  type SKU,
  type Supplier,
  type RestockSuggestion,
  type Alert,
  type TrendData,
} from '@/data/mockData'

const selectedWarehouseId = ref<string | null>(null)
const selectedRiskTab = ref<'out_of_stock' | 'critical' | 'low' | 'normal' | 'all'>('all')
const selectedSkuId = ref<string | null>(null)
const warehouseList = ref<Warehouse[]>([...mockWarehouses])
const skuList = ref<SKU[]>([...mockSKUs])
const supplierList = ref<Supplier[]>([...mockSuppliers])
const alerts = ref<Alert[]>([...initialAlerts])
const trendPeriod = ref<7 | 30>(7)

const filteredSKUs = computed(() => {
  let list = skuList.value
  if (selectedWarehouseId.value) {
    list = list.filter(s => s.warehouseId === selectedWarehouseId.value)
  }
  if (selectedRiskTab.value !== 'all') {
    list = list.filter(s => s.riskLevel === selectedRiskTab.value)
  }
  return list
})

const riskCounts = computed(() => {
  const base = selectedWarehouseId.value
    ? skuList.value.filter(s => s.warehouseId === selectedWarehouseId.value)
    : skuList.value
  return {
    out_of_stock: base.filter(s => s.riskLevel === 'out_of_stock').length,
    critical: base.filter(s => s.riskLevel === 'critical').length,
    low: base.filter(s => s.riskLevel === 'low').length,
    normal: base.filter(s => s.riskLevel === 'normal').length,
  }
})

const restockSuggestions = computed(() => {
  let list = generateRestockSuggestions(skuList.value, supplierList.value)
  if (selectedWarehouseId.value) {
    list = list.filter(r => r.warehouseId === selectedWarehouseId.value)
  }
  return list.sort((a, b) => {
    const prio = { urgent: 0, high: 1, medium: 2, low: 3 }
    return prio[a.priority] - prio[b.priority]
  })
})

const currentTrendData = computed<TrendData[]>(() =>
  trendPeriod.value === 7 ? trendData7d : trendData30d
)

const pendingAlertCount = computed(() =>
  alerts.value.filter(a => a.status === 'pending').length
)

const supplierMissingSKUs = computed(() =>
  skuList.value.filter(s => !s.supplierId && s.riskLevel !== 'normal')
)

function selectWarehouse(id: string | null) {
  selectedWarehouseId.value = id
  selectedSkuId.value = null
}

function selectSku(id: string | null) {
  selectedSkuId.value = selectedSkuId.value === id ? null : id
}

function setRiskTab(tab: typeof selectedRiskTab.value) {
  selectedRiskTab.value = tab
  selectedSkuId.value = null
}

function setTrendPeriod(p: 7 | 30) {
  trendPeriod.value = p
}

function resolveAlert(id: string) {
  const a = alerts.value.find(x => x.id === id)
  if (a) a.status = 'resolved'
}

function processAlert(id: string) {
  const a = alerts.value.find(x => x.id === id)
  if (a) a.status = 'processing'
}

function simulateOutofStock() {
  const target = skuList.value.find(s => s.currentStock > 0 && s.riskLevel === 'low')
  if (target) {
    target.currentStock = 0
    target.riskLevel = 'out_of_stock'
    target.tags = ['断货', ...target.tags.filter(t => t !== '库存偏低')]
    const wh = warehouseList.value.find(w => w.id === target.warehouseId)
    if (wh) wh.outOfStock++
    alerts.value.unshift(
      createAlert('out_of_stock', 'critical', '模拟断货预警', `${target.name} 库存已降至0，触发断货预警`, '立即启动紧急补货流程', target.id, target.warehouseId, target.supplierId ?? undefined)
    )
  }
}

function simulateBelowSafety() {
  const target = skuList.value.find(s => s.riskLevel === 'normal' && s.currentStock > s.safetyStock)
  if (target) {
    target.currentStock = Math.round(target.safetyStock * 0.5)
    target.riskLevel = 'critical'
    target.tags = ['需紧急补货']
    alerts.value.unshift(
      createAlert('below_safety', 'warning', '模拟安全线预警', `${target.name} 库存(${target.currentStock})已低于安全线(${target.safetyStock})`, '加急补货', target.id, target.warehouseId, target.supplierId ?? undefined)
    )
  }
}

function simulateSupplierDelay() {
  const target = supplierList.value.find(s => s.status === 'online')
  if (target) {
    target.status = 'offline'
    alerts.value.unshift(
      createAlert('supplier_delay', 'warning', '模拟供应商延迟', `${target.name} 突然离线，影响${target.skuIds.length}个SKU补货`, '联系备用供应商', undefined, undefined, target.id)
    )
  }
}

function simulateSupplierMissing() {
  const target = skuList.value.find(s => s.supplierId && s.riskLevel === 'critical')
  if (target) {
    const oldSup = target.supplierId
    target.supplierId = null
    target.tags = [...target.tags.filter(t => t !== '需紧急补货'), '供应商缺失']
    alerts.value.unshift(
      createAlert('supplier_missing', 'warning', '模拟供应商缺失', `${target.name} 供应商被移除，补货流程中断`, '重新分配供应商', target.id, target.warehouseId, oldSup ?? undefined)
    )
  }
}

export function useBoard() {
  return {
    selectedWarehouseId,
    selectedRiskTab,
    selectedSkuId,
    trendPeriod,
    warehouseList,
    skuList,
    supplierList,
    alerts,
    filteredSKUs,
    riskCounts,
    restockSuggestions,
    currentTrendData,
    pendingAlertCount,
    supplierMissingSKUs,
    selectWarehouse,
    selectSku,
    setRiskTab,
    setTrendPeriod,
    resolveAlert,
    processAlert,
    simulateOutofStock,
    simulateBelowSafety,
    simulateSupplierDelay,
    simulateSupplierMissing,
  }
}
