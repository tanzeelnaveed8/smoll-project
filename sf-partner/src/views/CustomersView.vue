<template>
  <v-sheet class="px-8 d-flex justify-center py-8">
    <v-sheet class="d-flex flex-column gr-6 w-100" max-width="1104">
      <v-sheet class="d-flex justify-space-between align-center">
        <v-sheet>
          <h2 style="font-weight: 600; line-height: 32px">Customers</h2>
          <p class="mt-1">Customer list with visit and order-level activity statistics.</p>
        </v-sheet>
        <v-btn flat appendIcon="$tb-plus" class="px-3 btn" @click="openCreateDialog">Add Customer</v-btn>
      </v-sheet>

      <v-text-field
        v-model="search"
        prepend-inner-icon="$tb-search"
        placeholder="Search customer"
        hide-details
        class="text-field"
        @update:model-value="fetchCustomers"
      />

      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="filteredCustomers"
        :items-per-page="10"
        class="table text-body-2 text-grey1"
      >
        <template #item.actions="{ item }">
          <div class="d-flex gc-2">
            <v-btn
              variant="plain"
              color="#10AFE1"
              class="px-0"
              min-width="auto"
              @click="openEditDialog($event, item.raw)"
              >Edit</v-btn
            >
            <v-btn
              variant="plain"
              color="#E02A2A"
              class="px-0"
              min-width="auto"
              @click="openDeleteDialog($event, item.raw)"
              >Delete</v-btn
            >
          </div>
        </template>
      </v-data-table>
    </v-sheet>
  </v-sheet>

  <v-dialog v-model="upsertDialog" width="520">
    <v-sheet class="pa-6">
      <h3 class="text-h6 mb-4">{{ editingCustomer ? 'Edit Customer' : 'Add Customer' }}</h3>
      <v-form @submit.prevent="submitCustomer">
        <v-text-field v-model="form.name" label="Name" class="mb-2" />
        <v-text-field v-model="form.email" label="Email" class="mb-2" />
        <v-text-field v-model="form.phone" label="Phone" class="mb-4" />
        <div class="d-flex justify-end gc-2">
          <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
          <v-btn type="submit" color="primary" :loading="actionLoading">
            {{ editingCustomer ? 'Save Changes' : 'Create Customer' }}
          </v-btn>
        </div>
      </v-form>
    </v-sheet>
  </v-dialog>

  <v-dialog v-model="deleteDialog" width="420">
    <v-sheet class="pa-6">
      <h3 class="text-h6 mb-2">Delete customer?</h3>
      <p class="text-grey2 mb-5">This action cannot be undone.</p>
      <div class="d-flex justify-end gc-2">
        <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
        <v-btn color="error" :loading="actionLoading" @click="confirmDelete">Delete</v-btn>
      </div>
    </v-sheet>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useCustomersStore, type Customer } from '@/stores/customers'
import { computed, onMounted, reactive, ref } from 'vue'
import { toast } from 'vue3-toastify'

const customersStore = useCustomersStore()
const loading = ref(false)
const actionLoading = ref(false)
const search = ref('')
const customers = ref<Customer[]>([])
const editingCustomer = ref<Customer | null>(null)
const deletingCustomer = ref<Customer | null>(null)
const upsertDialog = ref(false)
const deleteDialog = ref(false)

const form = reactive({
  name: '',
  email: '',
  phone: ''
})

const headers = [
  { title: 'Customer', key: 'name' },
  { title: 'Visits', key: 'visits' },
  { title: 'Orders', key: 'orders' },
  { title: 'Pets', key: 'pets' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const filteredCustomers = computed(() => customers.value)

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.phone = ''
}

const closeDialog = () => {
  upsertDialog.value = false
  editingCustomer.value = null
  resetForm()
}

const openCreateDialog = () => {
  editingCustomer.value = null
  resetForm()
  upsertDialog.value = true
}

const openEditDialog = (event: Event, customer: Customer) => {
  event.stopPropagation()
  editingCustomer.value = customer
  form.name = customer.name ?? ''
  form.email = customer.email ?? ''
  form.phone = customer.phone ?? ''
  upsertDialog.value = true
}

const openDeleteDialog = (event: Event, customer: Customer) => {
  event.stopPropagation()
  deletingCustomer.value = customer
  deleteDialog.value = true
}

const submitCustomer = async () => {
  const payload = {
    name: form.name || undefined,
    email: form.email || undefined,
    phone: form.phone || undefined
  }

  try {
    actionLoading.value = true
    if (editingCustomer.value) {
      await customersStore.updateCustomer(editingCustomer.value.id, payload)
      toast.success('Customer updated successfully')
    } else {
      await customersStore.addCustomer(payload)
      toast.success('Customer created successfully')
    }
    closeDialog()
    await fetchCustomers()
  } finally {
    actionLoading.value = false
  }
}

const confirmDelete = async () => {
  if (!deletingCustomer.value) return
  try {
    actionLoading.value = true
    await customersStore.deleteCustomer(deletingCustomer.value.id)
    toast.success('Customer deleted successfully')
    deleteDialog.value = false
    deletingCustomer.value = null
    await fetchCustomers()
  } finally {
    actionLoading.value = false
  }
}

const fetchCustomers = async () => {
  try {
    loading.value = true
    customers.value = await customersStore.fetchCustomers(search.value)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchCustomers()
})
</script>

<style lang="scss" scoped>
.table {
  &:deep(.v-data-table__th) {
    font-weight: 600 !important;
    color: #494949 !important;
    font-size: 14px;
    line-height: 16px;
  }
}

.btn {
  text-indent: 0;
  letter-spacing: 0;
  font-weight: 600;
}
</style>
