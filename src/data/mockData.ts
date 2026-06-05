export interface Warehouse {
  id: string
  name: string
  location: string
  totalSKUs: number
  riskSKUs: number
  outOfStock: number
  capacity: number
  usedCapacity: number
}

export interface SKU {
  id: string
  warehouseId: string
  name: string
  category: string
  currentStock: number
  safetyStock: number
  maxStock: number
  dailySales: number
  riskLevel: 'out_of_stock' | 'critical' | 'low' | 'normal'
  supplierId: string | null
  tags: string[]
}

export interface Supplier {
  id: string
  name: string
  status: 'online' | 'offline' | 'responding'
  responseRate: number
  leadTime: number
  reliability: number
  skuIds: string[]
}

export interface RestockSuggestion {
  id: string
  skuId: string
  skuName: string
  warehouseId: string
  currentStock: number
  suggestedQuantity: number
  targetStock: number
  priority: 'urgent' | 'high' | 'medium' | 'low'
  supplierId: string | null
  supplierStatus: string
  estimatedDelivery: string | null
  tags: string[]
}

export interface Alert {
  id: string
  type: 'out_of_stock' | 'below_safety' | 'supplier_delay' | 'supplier_missing'
  level: 'critical' | 'warning' | 'info'
  title: string
  message: string
  skuId: string | null
  warehouseId: string | null
  supplierId: string | null
  timestamp: string
  status: 'pending' | 'processing' | 'resolved'
  action: string
}

export interface TrendData {
  date: string
  stockLevel: number
  alertCount: number
  restockCompletionRate: number
}

export const warehouses: Warehouse[] = [
  { id: 'wh-01', name: '华东仓', location: '上海', totalSKUs: 342, riskSKUs: 18, outOfStock: 5, capacity: 50000, usedCapacity: 41200 },
  { id: 'wh-02', name: '华南仓', location: '广州', totalSKUs: 278, riskSKUs: 12, outOfStock: 3, capacity: 40000, usedCapacity: 28500 },
  { id: 'wh-03', name: '华北仓', location: '北京', totalSKUs: 310, riskSKUs: 22, outOfStock: 8, capacity: 45000, usedCapacity: 43800 },
  { id: 'wh-04', name: '西南仓', location: '成都', totalSKUs: 195, riskSKUs: 7, outOfStock: 1, capacity: 30000, usedCapacity: 15600 },
  { id: 'wh-05', name: '华中仓', location: '武汉', totalSKUs: 224, riskSKUs: 15, outOfStock: 4, capacity: 35000, usedCapacity: 29100 },
]

export const skus: SKU[] = [
  { id: 'sku-001', warehouseId: 'wh-01', name: '蓝牙耳机 Pro Max', category: '电子产品', currentStock: 0, safetyStock: 50, maxStock: 500, dailySales: 12, riskLevel: 'out_of_stock', supplierId: null, tags: ['断货', '供应商缺失'] },
  { id: 'sku-002', warehouseId: 'wh-01', name: '无线充电器 15W', category: '电子产品', currentStock: 8, safetyStock: 40, maxStock: 300, dailySales: 6, riskLevel: 'critical', supplierId: 'sup-01', tags: ['需紧急补货'] },
  { id: 'sku-003', warehouseId: 'wh-01', name: '手机壳 防摔款', category: '配件', currentStock: 35, safetyStock: 60, maxStock: 800, dailySales: 8, riskLevel: 'low', supplierId: 'sup-02', tags: ['库存偏低'] },
  { id: 'sku-004', warehouseId: 'wh-01', name: 'USB-C 数据线 1m', category: '配件', currentStock: 220, safetyStock: 80, maxStock: 1000, dailySales: 15, riskLevel: 'normal', supplierId: 'sup-01', tags: [] },
  { id: 'sku-005', warehouseId: 'wh-02', name: '智能手环 S3', category: '电子产品', currentStock: 0, safetyStock: 30, maxStock: 200, dailySales: 5, riskLevel: 'out_of_stock', supplierId: 'sup-03', tags: ['断货', '预警过多'] },
  { id: 'sku-006', warehouseId: 'wh-02', name: '运动水壶 750ml', category: '日用品', currentStock: 15, safetyStock: 50, maxStock: 400, dailySales: 7, riskLevel: 'critical', supplierId: null, tags: ['供应商缺失', '需紧急补货'] },
  { id: 'sku-007', warehouseId: 'wh-02', name: '笔记本支架 铝合金', category: '办公用品', currentStock: 45, safetyStock: 40, maxStock: 300, dailySales: 3, riskLevel: 'normal', supplierId: 'sup-04', tags: [] },
  { id: 'sku-008', warehouseId: 'wh-03', name: '机械键盘 87键', category: '电子产品', currentStock: 0, safetyStock: 25, maxStock: 150, dailySales: 4, riskLevel: 'out_of_stock', supplierId: 'sup-05', tags: ['断货'] },
  { id: 'sku-009', warehouseId: 'wh-03', name: '显示器增高架', category: '办公用品', currentStock: 5, safetyStock: 20, maxStock: 100, dailySales: 2, riskLevel: 'critical', supplierId: 'sup-04', tags: ['需紧急补货'] },
  { id: 'sku-010', warehouseId: 'wh-03', name: '桌面收纳盒', category: '日用品', currentStock: 28, safetyStock: 45, maxStock: 350, dailySales: 6, riskLevel: 'low', supplierId: 'sup-02', tags: ['库存偏低'] },
  { id: 'sku-011', warehouseId: 'wh-03', name: '鼠标垫 超大号', category: '配件', currentStock: 0, safetyStock: 35, maxStock: 250, dailySales: 5, riskLevel: 'out_of_stock', supplierId: null, tags: ['断货', '供应商缺失'] },
  { id: 'sku-012', warehouseId: 'wh-03', name: '护眼台灯 LED', category: '电子产品', currentStock: 12, safetyStock: 30, maxStock: 200, dailySales: 4, riskLevel: 'critical', supplierId: 'sup-03', tags: ['预警过多', '需紧急补货'] },
  { id: 'sku-013', warehouseId: 'wh-03', name: '插线板 6位', category: '日用品', currentStock: 0, safetyStock: 40, maxStock: 300, dailySales: 8, riskLevel: 'out_of_stock', supplierId: 'sup-01', tags: ['断货', '预警过多'] },
  { id: 'sku-014', warehouseId: 'wh-04', name: '旅行箱 24寸', category: '日用品', currentStock: 80, safetyStock: 30, maxStock: 200, dailySales: 2, riskLevel: 'normal', supplierId: 'sup-06', tags: [] },
  { id: 'sku-015', warehouseId: 'wh-04', name: '保温杯 500ml', category: '日用品', currentStock: 22, safetyStock: 50, maxStock: 400, dailySales: 6, riskLevel: 'low', supplierId: 'sup-02', tags: ['库存偏低'] },
  { id: 'sku-016', warehouseId: 'wh-05', name: '空气净化器 滤芯', category: '配件', currentStock: 0, safetyStock: 20, maxStock: 150, dailySales: 3, riskLevel: 'out_of_stock', supplierId: null, tags: ['断货', '供应商缺失'] },
  { id: 'sku-017', warehouseId: 'wh-05', name: '电动牙刷头 替换装', category: '日用品', currentStock: 18, safetyStock: 40, maxStock: 300, dailySales: 5, riskLevel: 'critical', supplierId: 'sup-06', tags: ['需紧急补货'] },
  { id: 'sku-018', warehouseId: 'wh-05', name: '瑜伽垫 6mm', category: '运动', currentStock: 95, safetyStock: 30, maxStock: 200, dailySales: 3, riskLevel: 'normal', supplierId: 'sup-05', tags: [] },
  { id: 'sku-019', warehouseId: 'wh-01', name: '降噪耳塞', category: '日用品', currentStock: 42, safetyStock: 55, maxStock: 400, dailySales: 7, riskLevel: 'low', supplierId: 'sup-04', tags: ['库存偏低'] },
  { id: 'sku-020', warehouseId: 'wh-02', name: '移动电源 20000mAh', category: '电子产品', currentStock: 3, safetyStock: 25, maxStock: 200, dailySales: 4, riskLevel: 'critical', supplierId: null, tags: ['供应商缺失', '需紧急补货', '预警过多'] },
]

export const suppliers: Supplier[] = [
  { id: 'sup-01', name: '深圳达信电子', status: 'online', responseRate: 95, leadTime: 3, reliability: 92, skuIds: ['sku-002', 'sku-004', 'sku-013'] },
  { id: 'sup-02', name: '义乌众联贸易', status: 'online', responseRate: 88, leadTime: 5, reliability: 85, skuIds: ['sku-003', 'sku-010', 'sku-015'] },
  { id: 'sup-03', name: '东莞科创科技', status: 'responding', responseRate: 76, leadTime: 4, reliability: 78, skuIds: ['sku-005', 'sku-012'] },
  { id: 'sup-04', name: '杭州远航办公', status: 'offline', responseRate: 65, leadTime: 7, reliability: 70, skuIds: ['sku-007', 'sku-009', 'sku-019'] },
  { id: 'sup-05', name: '广州锐视科技', status: 'online', responseRate: 91, leadTime: 3, reliability: 88, skuIds: ['sku-008', 'sku-018'] },
  { id: 'sup-06', name: '成都锦城百货', status: 'offline', responseRate: 55, leadTime: 8, reliability: 62, skuIds: ['sku-014', 'sku-017'] },
]

export const initialAlerts: Alert[] = [
  { id: 'alt-001', type: 'out_of_stock', level: 'critical', title: '断货预警', message: '蓝牙耳机 Pro Max 库存为0，供应商缺失，无法自动补货', skuId: 'sku-001', warehouseId: 'wh-01', supplierId: null, timestamp: '2026-06-05T08:30:00', status: 'pending', action: '立即分配供应商并紧急补货' },
  { id: 'alt-002', type: 'below_safety', level: 'critical', title: '安全线预警', message: '无线充电器 15W 库存(8)远低于安全线(40)，需紧急补货', skuId: 'sku-002', warehouseId: 'wh-01', supplierId: 'sup-01', timestamp: '2026-06-05T09:15:00', status: 'processing', action: '已通知供应商，等待确认交货' },
  { id: 'alt-003', type: 'supplier_missing', level: 'warning', title: '供应商缺失', message: '运动水壶 750ml 无关联供应商，补货流程无法启动', skuId: 'sku-006', warehouseId: 'wh-02', supplierId: null, timestamp: '2026-06-05T07:45:00', status: 'pending', action: '分配供应商后启动补货' },
  { id: 'alt-004', type: 'supplier_delay', level: 'warning', title: '供应商延迟', message: '杭州远航办公(离线)已超48小时未响应，影响3个SKU补货', skuId: null, warehouseId: null, supplierId: 'sup-04', timestamp: '2026-06-05T06:00:00', status: 'pending', action: '联系备用供应商或催促响应' },
  { id: 'alt-005', type: 'out_of_stock', level: 'critical', title: '断货预警', message: '鼠标垫 超大号 库存为0且无供应商，持续断货中', skuId: 'sku-011', warehouseId: 'wh-03', supplierId: null, timestamp: '2026-06-05T10:00:00', status: 'pending', action: '紧急分配供应商' },
  { id: 'alt-006', type: 'below_safety', level: 'warning', title: '安全线预警', message: '护眼台灯 LED 库存(12)低于安全线(30)，预警次数已超阈值', skuId: 'sku-012', warehouseId: 'wh-03', supplierId: 'sup-03', timestamp: '2026-06-05T11:20:00', status: 'pending', action: '加急补货，升级预警级别' },
  { id: 'alt-007', type: 'out_of_stock', level: 'critical', title: '断货预警', message: '空气净化器滤芯 库存为0，供应商缺失，季节性需求增加', skuId: 'sku-016', warehouseId: 'wh-05', supplierId: null, timestamp: '2026-06-05T08:50:00', status: 'pending', action: '分配季节性供应商并紧急补货' },
  { id: 'alt-008', type: 'supplier_delay', level: 'info', title: '供应商响应中', message: '东莞科创科技正在处理补货请求，预计24小时内确认', skuId: null, warehouseId: null, supplierId: 'sup-03', timestamp: '2026-06-05T12:00:00', status: 'processing', action: '持续跟踪响应进度' },
]

function generateTrendData(days: number): TrendData[] {
  const data: TrendData[] = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      stockLevel: Math.round(60 + Math.random() * 30 + (days > 7 ? Math.sin(i / 3) * 10 : 0)),
      alertCount: Math.round(3 + Math.random() * 8),
      restockCompletionRate: Math.round(55 + Math.random() * 35),
    })
  }
  return data
}

export const trendData7d = generateTrendData(7)
export const trendData30d = generateTrendData(30)

export function generateRestockSuggestions(skuList: SKU[], supplierList: Supplier[]): RestockSuggestion[] {
  const riskSKUs = skuList.filter(s => s.riskLevel !== 'normal')
  return riskSKUs.map((sku, idx) => {
    const supplier = supplierList.find(sp => sp.id === sku.supplierId)
    const targetStock = Math.round(sku.safetyStock * 2.5)
    const suggested = Math.max(0, targetStock - sku.currentStock)
    const priority: RestockSuggestion['priority'] =
      sku.riskLevel === 'out_of_stock' ? 'urgent' :
      sku.riskLevel === 'critical' ? 'high' :
      sku.riskLevel === 'low' ? 'medium' : 'low'
    const tags: string[] = []
    if (sku.currentStock === 0) tags.push('紧急补货')
    if (!sku.supplierId) tags.push('需确认供应商')
    if (sku.tags.includes('预警过多')) tags.push('预警过多')
    if (supplier?.status === 'offline') tags.push('供应商离线')
    return {
      id: `rs-${String(idx + 1).padStart(3, '0')}`,
      skuId: sku.id,
      skuName: sku.name,
      warehouseId: sku.warehouseId,
      currentStock: sku.currentStock,
      suggestedQuantity: suggested,
      targetStock,
      priority,
      supplierId: sku.supplierId,
      supplierStatus: supplier ? (supplier.status === 'online' ? '在线' : supplier.status === 'responding' ? '响应中' : '离线') : '缺失',
      estimatedDelivery: supplier ? `${supplier.leadTime}天` : null,
      tags,
    }
  })
}

export function createAlert(type: Alert['type'], level: Alert['level'], title: string, message: string, action: string, skuId?: string, warehouseId?: string, supplierId?: string): Alert {
  return {
    id: `alt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    level,
    title,
    message,
    skuId: skuId || null,
    warehouseId: warehouseId || null,
    supplierId: supplierId || null,
    timestamp: new Date().toISOString(),
    status: 'pending',
    action,
  }
}
