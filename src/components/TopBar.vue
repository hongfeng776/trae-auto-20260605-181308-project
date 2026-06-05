<script setup lang="ts">
import { useBoard } from '@/composables/useBoard'
import { Bell, Package, Clock } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted } from 'vue'

const { pendingAlertCount } = useBoard()

const currentTime = ref('')
let timer: ReturnType<typeof setInterval> | null = null

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <header class="flex items-center justify-between px-6 py-3 border-b" style="background: var(--color-surface); border-color: var(--color-border)">
    <div class="flex items-center gap-3">
      <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-info/20">
        <Package class="w-5 h-5 text-info" />
      </div>
      <div>
        <h1 class="text-base font-bold font-display" style="color: var(--color-text)">库存补货协同看板</h1>
        <p class="text-[10px] text-text-muted">Inventory Replenishment Collaboration Board</p>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <div class="relative">
        <Bell class="w-5 h-5 text-text-muted cursor-pointer hover:text-warning transition" />
        <span
          v-if="pendingAlertCount > 0"
          class="absolute -top-1.5 -right-1.5 bg-danger text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center"
        >
          {{ pendingAlertCount }}
        </span>
      </div>
      <div class="flex items-center gap-1.5 text-text-muted text-xs">
        <Clock class="w-3.5 h-3.5" />
        {{ currentTime }}
      </div>
    </div>
  </header>
</template>
