<template>
  <v-sheet class="d-flex justify-center">
    <div class="px-6 py-6 d-flex flex-column gr-6 w-100" style="max-width: 1140px">
      <v-sheet class="d-flex justify-space-between w-100">
        <v-sheet class="d-flex align-center gc-4">
          <UtilityBar path="/products" />
        </v-sheet>
        <v-btn color="grey1" class="text-body-2 px-2" prepend-icon="$tb-plus" density="comfortable" @click="showAddDialog = true">
          <template v-slot:prepend>
            <v-icon icon="$tb-plus" size="20" style="margin-right: -4px" />
          </template>
          New Product
        </v-btn>
      </v-sheet>
      <v-sheet class="d-flex flex-column gr-6">
        <v-table class="text-body-2" style="border: 1px solid #dde7ee; border-radius: 8px">
          <thead>
            <tr>
              <th class="font-weight-bold">Name</th>
              <th class="font-weight-bold">Description</th>
              <th class="font-weight-bold">Price</th>
              <th class="font-weight-bold">Stock</th>
              <th class="font-weight-bold">Category</th>
              <th class="font-weight-bold">Status</th>
              <th class="font-weight-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="text-center py-6">
                <v-progress-circular indeterminate color="primary" size="24" />
              </td>
            </tr>
            <tr v-else-if="!products.length">
              <td colspan="7" class="text-center py-6 text-grey2">No products found</td>
            </tr>
            <tr v-for="product in products" :key="product.id" class="cursor-pointer" @click="editProduct(product)">
              <td class="font-weight-bold">{{ product.name }}</td>
              <td>{{ product.description || '-' }}</td>
              <td>{{ product.price }} {{ product.currency }}</td>
              <td>{{ product.stock }}</td>
              <td>{{ product.category || '-' }}</td>
              <td>
                <v-chip :color="product.isActive ? 'success' : 'error'" size="small">
                  {{ product.isActive ? 'Active' : 'Inactive' }}
                </v-chip>
              </td>
              <td class="text-center">
                <v-btn icon variant="text" size="small" @click.stop="confirmDelete(product)">
                  <v-icon icon="$tb-x" size="18" color="error" />
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <TableFooter :maxValue path="/products" />
      </v-sheet>
    </div>
  </v-sheet>

  <!-- Add/Edit Dialog -->
  <v-dialog v-model="showAddDialog" width="500">
    <v-card class="pa-6">
      <h3 class="mb-4">{{ editingProduct ? 'Edit Product' : 'Add Product' }}</h3>
      <v-form ref="form" @submit.prevent="handleSave">
        <v-text-field v-model="formData.name" label="Name" :rules="[v => !!v || 'Name is required']" class="mb-2" />
        <v-textarea v-model="formData.description" label="Description" rows="3" class="mb-2" />
        <v-text-field v-model.number="formData.price" label="Price" type="number" class="mb-2" />
        <v-text-field v-model.number="formData.stock" label="Stock" type="number" class="mb-2" />
        <v-text-field v-model="formData.category" label="Category" class="mb-2" />
        <v-switch v-if="editingProduct" v-model="formData.isActive" label="Active" color="primary" class="mb-2" />
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
      <h3 class="mb-4">Delete Product</h3>
      <p>Are you sure you want to delete "{{ deletingProduct?.name }}"?</p>
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
import { useProductStore } from '@/stores/product'
import { ref, watchEffect } from 'vue'
import { useRoute, type LocationQueryValue } from 'vue-router'
import { toast } from 'vue3-toastify'

const route = useRoute()
const productStore = useProductStore()

const products = ref<any[]>([])
const loading = ref(false)
const maxValue = ref(0)
const showAddDialog = ref(false)
const showDeleteDialog = ref(false)
const saving = ref(false)
const deleting = ref(false)
const editingProduct = ref<any>(null)
const deletingProduct = ref<any>(null)

const formData = ref({ name: '', description: '', price: 0, stock: 0, category: '', isActive: true })

const getProducts = async (search?: string, page?: number) => {
  try {
    loading.value = true
    const { data, count } = await productStore.fetchProducts(search, page)
    products.value = data
    maxValue.value = Math.ceil(count / 10)
  } finally {
    loading.value = false
  }
}

const editProduct = (product: any) => {
  editingProduct.value = product
  formData.value = { name: product.name, description: product.description || '', price: product.price, stock: product.stock, category: product.category || '', isActive: product.isActive }
  showAddDialog.value = true
}

const confirmDelete = (product: any) => {
  deletingProduct.value = product
  showDeleteDialog.value = true
}

const handleSave = async () => {
  if (!formData.value.name) return
  try {
    saving.value = true
    if (editingProduct.value) {
      await productStore.updateProduct(editingProduct.value.id, formData.value)
      toast.success('Product updated')
    } else {
      await productStore.addProduct(formData.value)
      toast.success('Product added')
    }
    showAddDialog.value = false
    editingProduct.value = null
    formData.value = { name: '', description: '', price: 0, stock: 0, category: '', isActive: true }
    getProducts()
  } finally {
    saving.value = false
  }
}

const handleDelete = async () => {
  try {
    deleting.value = true
    await productStore.deleteProduct(deletingProduct.value.id)
    toast.success('Product deleted')
    showDeleteDialog.value = false
    getProducts()
  } finally {
    deleting.value = false
  }
}

watchEffect(async () => {
  const page = Number(route.query.page)
  const search = (route.query.search as LocationQueryValue) ?? ''
  await getProducts(search, page)
})
</script>
