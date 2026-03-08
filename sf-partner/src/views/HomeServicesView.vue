<template>
  <div class="px-8 py-10 d-flex flex-column gr-6 h-100" style="background-color: #f8fafb">
    <v-sheet>
      <h1 class="text-grey1 text-h4 font-weight-regular" style="font-family: 'CooperLtBT' !important">
        Home Services
      </h1>
      <p class="text-grey2 mt-1">Services listing with time and starting price. Nutritions and products from backend.</p>
    </v-sheet>

    <!-- Promotions / Ads placeholder -->
    <v-sheet class="rounded-lg pa-4 mb-4" style="border: 1px dashed #d0d7dc; background: #f4f6f8">
      <p class="text-grey2 text-body-2 font-weight-bold">Promotions &amp; Ads</p>
      <p class="text-grey2 text-caption">(Placeholder: display promotions and ads here)</p>
    </v-sheet>

    <v-tabs v-model="tab" class="mb-4">
      <v-tab value="services">Services</v-tab>
      <v-tab value="nutritions">Nutritions (Products)</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <!-- Services tab: listing with time needed and starting price -->
      <v-tabs-window-item value="services">
        <v-sheet class="d-flex flex-column gr-4">
          <p class="text-body-1 font-weight-bold">Services Listing</p>
          <v-sheet v-if="servicesLoading" class="d-flex justify-center py-8">
            <v-progress-circular indeterminate color="primary" />
          </v-sheet>
          <v-sheet v-else-if="!services.length" class="text-grey2 py-6">No services yet.</v-sheet>
          <v-list v-else class="rounded-lg" style="border: 1px solid #dde7ee">
            <v-list-item
              v-for="s in services"
              :key="s.id"
              class="d-flex justify-space-between align-center"
              style="border-bottom: 1px solid #eee"
            >
              <div>
                <p class="font-weight-bold">{{ s.name || s.title }}</p>
                <p class="text-grey2 text-body-2">{{ s.description || '-' }}</p>
                <p v-if="s.durationMinutes != null" class="text-caption">Time needed: {{ s.durationMinutes }} min</p>
              </div>
              <v-chip color="primary" variant="flat">{{ s.price }} {{ s.currency || 'AED' }}</v-chip>
            </v-list-item>
          </v-list>
          <p class="text-caption text-grey2 mt-2">Inside each service: different options, add-ons, and special notes (manage in Services page).</p>
        </v-sheet>
      </v-tabs-window-item>

      <!-- Nutritions tab: All products from backend -->
      <v-tabs-window-item value="nutritions">
        <v-sheet class="d-flex flex-column gr-4">
          <p class="text-body-1 font-weight-bold">All Products (Nutritions)</p>
          <v-sheet v-if="productsLoading" class="d-flex justify-center py-8">
            <v-progress-circular indeterminate color="primary" />
          </v-sheet>
          <v-sheet v-else-if="!products.length" class="text-grey2 py-6">No products yet.</v-sheet>
          <v-list v-else class="rounded-lg" style="border: 1px solid #dde7ee">
            <v-list-item
              v-for="p in products"
              :key="p.id"
              class="d-flex justify-space-between align-center"
              style="border-bottom: 1px solid #eee"
            >
              <div>
                <p class="font-weight-bold">{{ p.name }}</p>
                <p class="text-grey2 text-body-2">{{ p.description || '-' }}</p>
                <p class="text-caption">Category: {{ p.category || '-' }} | Stock: {{ p.stock ?? 0 }}</p>
              </div>
              <v-chip color="primary" variant="flat">{{ p.price }} {{ p.currency || 'AED' }}</v-chip>
            </v-list-item>
          </v-list>
          <p class="text-caption text-grey2 mt-2">Inside products: options, add-ons, special notes (managed in Admin Products).</p>

          <!-- AI Pick -->
          <v-sheet class="mt-6 pa-4 rounded-lg" style="border: 1px solid #d0d7dc">
            <h3 class="text-body-1 font-weight-bold mb-2">AI Pick</h3>
            <p class="text-grey2 text-body-2 mb-3">
              Get nutrition recommendations based on pet details (species, age, weight, case). Uses AI API to suggest products from the list above.
            </p>
            <v-btn color="primary" variant="outlined" disabled>
              AI Pick (available in member app with pet context)
            </v-btn>
          </v-sheet>
        </v-sheet>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useServicesStore } from '@/stores/services'
import api from '@/utils/api'

const tab = ref('services')
const services = ref<any[]>([])
const products = ref<any[]>([])
const servicesLoading = ref(false)
const productsLoading = ref(false)
const servicesStore = useServicesStore()

const loadServices = async () => {
  try {
    servicesLoading.value = true
    const data = await servicesStore.fetchServices()
    services.value = Array.isArray(data) ? data : (data?.data ?? [])
  } finally {
    servicesLoading.value = false
  }
}

const loadProducts = async () => {
  try {
    productsLoading.value = true
    const { data } = await api.get('/partners/catalog/products')
    products.value = data?.data ?? []
  } catch {
    products.value = []
  } finally {
    productsLoading.value = false
  }
}

onMounted(() => {
  loadServices()
  loadProducts()
})

watch(tab, (t) => {
  if (t === 'nutritions' && !products.value.length && !productsLoading.value) loadProducts()
})
</script>
