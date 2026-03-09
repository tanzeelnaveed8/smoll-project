<template>
  <v-sheet class="d-flex justify-center">
    <div class="px-6 py-6 d-flex flex-column gr-6 w-100" style="max-width: 1140px">
      <v-sheet class="d-flex justify-space-between w-100">
        <v-sheet class="d-flex align-center gc-4">
          <UtilityBar path="/products" />
        </v-sheet>
        <v-btn color="grey1" class="text-body-2 px-2" prepend-icon="$tb-plus" density="comfortable" @click="openAddDialog">
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
              <th class="font-weight-bold" style="width: 48px">Image</th>
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
              <td colspan="8" class="text-center py-6">
                <v-progress-circular indeterminate color="primary" size="24" />
              </td>
            </tr>
            <tr v-else-if="!products.length">
              <td colspan="8" class="text-center py-6 text-grey2">No products found</td>
            </tr>
            <tr v-for="product in products" :key="product.id" class="cursor-pointer" @click="editProduct(product)">
              <td class="pa-2">
                <v-avatar v-if="product.imageUrl" size="40" rounded>
                  <v-img :src="product.imageUrl" cover referrerpolicy="no-referrer" />
                </v-avatar>
                <v-avatar v-else size="40" rounded color="grey-lighten-2">
                  <v-icon icon="$tb-file-certificate" size="20" />
                </v-avatar>
              </td>
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
  <v-dialog v-model="showAddDialog" width="560" persistent>
    <v-card class="product-form-card">
      <v-card-title class="text-h6 font-weight-bold pa-5 pb-0">
        {{ editingProduct ? 'Edit Product' : 'Add Product' }}
      </v-card-title>
      <v-card-text class="pa-5 pt-4">
        <v-form class="product-form" @submit.prevent="handleSave">
          <v-text-field
            v-model="formData.name"
            label="Name"
            :rules="[v => !!v || 'Name is required']"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            class="mb-3"
          />
          <v-textarea
            v-model="formData.description"
            label="Description"
            rows="3"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            class="mb-3"
          />
          <v-row dense>
            <v-col cols="6">
              <v-text-field
                v-model.number="formData.price"
                label="Price"
                type="number"
                min="0"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                class="mb-3"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="formData.stock"
                label="Stock"
                type="number"
                min="0"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                class="mb-3"
              />
            </v-col>
          </v-row>
          <v-text-field
            v-model="formData.category"
            label="Category"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            class="mb-3"
          />
          <v-sheet class="mb-3">
            <p class="text-caption text-medium-emphasis mb-2">Image</p>
            <v-text-field
              v-model="formData.imageUrl"
              label="Image URL"
              placeholder="https://..."
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              class="mb-2"
              clearable
            />
            <v-file-input
              :key="fileInputKey"
              :model-value="formData.imageFile"
              label="Or upload image"
              prepend-icon=""
              prepend-inner-icon="$tb-cloud-upload"
              accept="image/*"
              density="compact"
              variant="outlined"
              hide-details="auto"
              show-size
              clearable
              @update:model-value="onProductImageSelect"
            />
            <v-sheet v-if="productPreviewSrc" class="mt-2 d-flex align-center gap-2 flex-wrap">
              <v-img
                :key="productPreviewSrc"
                :src="productPreviewSrc"
                alt="Preview"
                class="product-image-preview"
                cover
                referrerpolicy="no-referrer"
                @error="previewError = true"
                @load="previewError = false"
              />
              <span v-if="previewError && formData.imageUrl" class="text-caption text-medium-emphasis">Preview unavailable (URL saved)</span>
            </v-sheet>
          </v-sheet>
          <v-switch v-if="editingProduct" v-model="formData.isActive" label="Active" color="primary" hide-details class="mb-3" />
          <v-sheet class="d-flex gap-3 justify-end pt-2">
            <v-btn variant="outlined" @click="showAddDialog = false">Cancel</v-btn>
            <v-btn color="primary" :loading="saving" :disabled="uploading" @click="handleSave">
              {{ uploading ? 'Uploading image...' : 'Save' }}
            </v-btn>
          </v-sheet>
        </v-form>
      </v-card-text>
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
import { useUploadStore } from '@/stores/upload'
import { computed, ref, watchEffect } from 'vue'
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
const uploading = ref(false)
const editingProduct = ref<any>(null)
const deletingProduct = ref<any>(null)
const previewError = ref(false)
const previewObjectUrl = ref<string | null>(null)
const fileInputKey = ref(0)

const productPreviewSrc = computed(() => formData.value.imageUrl?.trim() || previewObjectUrl.value || '')

const formData = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  imageUrl: '',
  imageFile: null as File[] | null,
  isActive: true,
})

const getProducts = async (search?: string, page?: number) => {
  try {
    loading.value = true
    const pageNum = page != null && Number(page) >= 1 ? Number(page) : 1
    const searchStr = search != null ? String(search).trim() : ''
    const result = await productStore.fetchProducts(searchStr || undefined, pageNum)
    products.value = result?.data ?? []
    const total = result?.count ?? 0
    maxValue.value = Math.max(1, Math.ceil(total / 10))
  } catch {
    products.value = []
    maxValue.value = 1
    toast.error('Failed to load products')
  } finally {
    loading.value = false
  }
}

const editProduct = (product: any) => {
  if (previewObjectUrl.value) {
    URL.revokeObjectURL(previewObjectUrl.value)
    previewObjectUrl.value = null
  }
  editingProduct.value = product
  previewError.value = false
  formData.value = {
    name: product.name,
    description: product.description || '',
    price: product.price,
    stock: product.stock,
    category: product.category || '',
    imageUrl: product.imageUrl || '',
    imageFile: null,
    isActive: product.isActive,
  }
  showAddDialog.value = true
}

const openAddDialog = () => {
  if (previewObjectUrl.value) {
    URL.revokeObjectURL(previewObjectUrl.value)
    previewObjectUrl.value = null
  }
  editingProduct.value = null
  previewError.value = false
  formData.value = { name: '', description: '', price: 0, stock: 0, category: '', imageUrl: '', imageFile: null, isActive: true }
  fileInputKey.value += 1
  showAddDialog.value = true
}

const confirmDelete = (product: any) => {
  deletingProduct.value = product
  showDeleteDialog.value = true
}

const uploadStore = useUploadStore()

const onProductImageSelect = async (files: File[] | File | null) => {
  const list = Array.isArray(files) ? files : files ? [files] : []
  if (!list.length) {
    previewObjectUrl.value = null
    return
  }
  const file = list[0]
  if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file')
    return
  }
  if (previewObjectUrl.value) URL.revokeObjectURL(previewObjectUrl.value)
  previewObjectUrl.value = URL.createObjectURL(file)
  previewError.value = false
  const fd = new FormData()
  fd.append('files', file)
  try {
    uploading.value = true
    const uploaded = await uploadStore.uploadFile(fd)
    const first = uploaded?.[0]
    const url = typeof first?.url === 'string' ? first.url : null
    if (url) {
      if (previewObjectUrl.value) {
        URL.revokeObjectURL(previewObjectUrl.value)
        previewObjectUrl.value = null
      }
      formData.value.imageUrl = url
      previewError.value = false
    } else {
      toast.error('Image upload failed')
    }
  } catch {
    toast.error('Image upload failed')
  } finally {
    uploading.value = false
    formData.value.imageFile = null
    fileInputKey.value += 1
  }
}

const handleSave = async () => {
  const name = formData.value.name?.trim()
  if (!name) {
    toast.error('Name is required')
    return
  }
  try {
    saving.value = true
    const price = Number(formData.value.price)
    const stock = Number(formData.value.stock)
    const payload = {
      name,
      description: formData.value.description?.trim() || undefined,
      price: Number.isFinite(price) ? price : 0,
      stock: Number.isFinite(stock) ? stock : 0,
      category: formData.value.category?.trim() || undefined,
      imageUrl: formData.value.imageUrl?.trim() || undefined,
      isActive: formData.value.isActive,
    }
    if (editingProduct.value) {
      await productStore.updateProduct(editingProduct.value.id, payload)
      toast.success('Product updated')
    } else {
      await productStore.addProduct(payload)
      toast.success('Product added')
    }
    showAddDialog.value = false
    editingProduct.value = null
    if (previewObjectUrl.value) {
      URL.revokeObjectURL(previewObjectUrl.value)
      previewObjectUrl.value = null
    }
    formData.value = { name: '', description: '', price: 0, stock: 0, category: '', imageUrl: '', imageFile: null, isActive: true }
    const pageNum = route.query.page != null && Number(route.query.page) >= 1 ? Number(route.query.page) : 1
    const searchStr = (route.query.search as string) ?? ''
    await getProducts(searchStr, pageNum)
  } catch {
    toast.error(editingProduct.value ? 'Failed to update product' : 'Failed to add product')
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
    const pageNum = route.query.page != null && Number(route.query.page) >= 1 ? Number(route.query.page) : 1
    const searchStr = (route.query.search as string) ?? ''
    await getProducts(searchStr, pageNum)
  } finally {
    deleting.value = false
  }
}

watchEffect(async () => {
  const page = route.query.page != null && Number(route.query.page) >= 1 ? Number(route.query.page) : 1
  const search = (route.query.search as LocationQueryValue) ?? ''
  await getProducts(search, page)
})
</script>

<style scoped>
.product-form-card {
  border-radius: 12px;
}
.product-image-preview {
  max-width: 120px;
  max-height: 120px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}
</style>
