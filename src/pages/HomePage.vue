<script setup lang="ts">
import TopBar from '@/components/TopBar.vue'
import WarehouseList from '@/components/WarehouseList.vue'
import SKURiskPanel from '@/components/SKURiskPanel.vue'
import RestockAdvice from '@/components/RestockAdvice.vue'
import SupplierPanel from '@/components/SupplierPanel.vue'
import TrendOverview from '@/components/TrendOverview.vue'
import AlertSimulator from '@/components/AlertSimulator.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col" style="background: var(--color-bg)">
    <TopBar />
    <div class="flex flex-1 overflow-hidden">
      <aside class="w-64 shrink-0 overflow-y-auto p-4 border-r" style="border-color: var(--color-border)">
        <WarehouseList />
      </aside>
      <main class="flex-1 overflow-y-auto p-4">
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <SKURiskPanel />
          <RestockAdvice />
          <SupplierPanel />
          <AlertSimulator />
        </div>
        <div class="mt-4">
          <TrendOverview />
        </div>
      </main>
    </div>
  </div>
</template>
