<template>
  <v-sheet class="d-flex justify-center">
    <div class="px-6 py-6 d-flex flex-column gr-6 w-100" style="max-width: 1140px">
      <v-sheet class="d-flex justify-space-between w-100">
        <v-sheet class="d-flex align-center gc-4">
          <UtilityBar path="/services" />
        </v-sheet>
        <v-btn color="grey1" class="text-body-2 px-2" prepend-icon="$tb-plus" density="comfortable" @click="showAddDialog = true">
          <template v-slot:prepend>
            <v-icon icon="$tb-plus" size="20" style="margin-right: -4px" />
          </template>
          New Service
        </v-btn>
      </v-sheet>
      <v-sheet class="d-flex flex-column gr-6">
        <v-table class="text-body-2" style="border: 1px solid #dde7ee; border-radius: 8px">
          <thead>
            <tr>
              <th class="font-weight-bold">Name</th>
              <th class="font-weight-bold">Description</th>
              <th class="font-weight-bold">Price</th>
              <th class="font-weight-bold">Status</th>
              <th class="font-weight-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="text-center py-6">
                <v-progress-circular indeterminate color="primary" size="24" />
              </td>
            </tr>
            <tr v-else-if="!services.length">
              <td colspan="5" class="text-center py-6 text-grey2">No services found</td>
            </tr>
            <tr v-for="service in services" :key="service.id" class="cursor-pointer" @click="editService(service)">
              <td class="font-weight-bold">{{ service.name }}</td>
              <td>{{ service.description || '-' }}</td>
              <td>{{ service.price }} {{ service.currency }}</td>
              <td>
                <v-chip :color="service.isActive ? 'success' : 'error'" size="small">
                  {{ service.isActive ? 'Active' : 'Inactive' }}
                </v-chip>
              </td>
              <td class="text-center">
                <v-btn icon variant="text" size="small" @click.stop="confirmDelete(service)">
                  <v-icon icon="$tb-x" size="18" color="error" />
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <TableFooter :maxValue path="/services" />
      </v-sheet>
    </div>
  </v-sheet>

  <!-- Add/Edit Dialog -->
  <v-dialog v-model="showAddDialog" width="500">
    <v-card class="pa-6">
      <h3 class="mb-4">{{ editingService ? 'Edit Service' : 'Add Service' }}</h3>
      <v-form ref="form" @submit.prevent="handleSave">
        <v-text-field v-model="formData.name" label="Name" :rules="[v => !!v || 'Name is required']" class="mb-2" />
        <v-textarea v-model="formData.description" label="Description" rows="3" class="mb-2" />
        <v-text-field v-model.number="formData.price" label="Price" type="number" class="mb-2" />
        <v-switch v-if="editingService" v-model="formData.isActive" label="Active" color="primary" class="mb-2" />
        <v-sheet class="d-flex gc-3 justify-end">
          <v-btn variant="outlined" @click="showAddDialog = false">Cancel</v-btn>
          <v-btn color="grey1" type="submit" :loading="saving">Save</v-btn>
        </v-sheet>
      </v-form>
    </v-card>
  </v-dialog>

  <!-- Delete Confirmation -->
  <v-dialog v-model="showDeleteDialog" width="400">
    <v-card class="pa-6">
      <h3 class="mb-4">Delete Service</h3>
      <p>Are you sure you want to delete "{{ deletingService?.name }}"?</p>
      <v-sheet class="d-flex gc-3 justify-end mt-4">
        <v-btn variant="outlined" @click="showDeleteDialog = false">Cancel</v-btn>
        <v-btn color="error" :loading="deleting" @click="handleDelete">Delete</v-btn>
      </v-sheet>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import UtilityBar from '@/components/partials/UtilityBar.vue'
import TableFooter from '@/components/partials/table/TableFooter.vue'
import { useServiceStore } from '@/stores/service'
import { ref, watchEffect } from 'vue'
import { useRoute, type LocationQueryValue } from 'vue-router'
import { toast } from 'vue3-toastify'

const route = useRoute()
const serviceStore = useServiceStore()

const services = ref<any[]>([])
const loading = ref(false)
const maxValue = ref(0)
const showAddDialog = ref(false)
const showDeleteDialog = ref(false)
const saving = ref(false)
const deleting = ref(false)
const editingService = ref<any>(null)
const deletingService = ref<any>(null)

const formData = ref({ name: '', description: '', price: 0, isActive: true })

const getServices = async (search?: string, page?: number) => {
  try {
    loading.value = true
    const { data, count } = await serviceStore.fetchServices(search, page)
    services.value = data
    maxValue.value = Math.ceil(count / 10)
  } finally {
    loading.value = false
  }
}

const editService = (service: any) => {
  editingService.value = service
  formData.value = { name: service.name, description: service.description || '', price: service.price, isActive: service.isActive }
  showAddDialog.value = true
}

const confirmDelete = (service: any) => {
  deletingService.value = service
  showDeleteDialog.value = true
}

const handleSave = async () => {
  if (!formData.value.name) return
  try {
    saving.value = true
    if (editingService.value) {
      await serviceStore.updateService(editingService.value.id, formData.value)
      toast.success('Service updated')
    } else {
      await serviceStore.addService(formData.value)
      toast.success('Service added')
    }
    showAddDialog.value = false
    editingService.value = null
    formData.value = { name: '', description: '', price: 0, isActive: true }
    getServices()
  } finally {
    saving.value = false
  }
}

const handleDelete = async () => {
  try {
    deleting.value = true
    await serviceStore.deleteService(deletingService.value.id)
    toast.success('Service deleted')
    showDeleteDialog.value = false
    getServices()
  } finally {
    deleting.value = false
  }
}

watchEffect(async () => {
  const page = Number(route.query.page)
  const search = (route.query.search as LocationQueryValue) ?? ''
  await getServices(search, page)
})
</script>
