<template>
  <v-sheet
    height="100vh"
    width="571"
    color="#fff"
    style="transform-origin: right"
    class="position-relative"
  >
    <!-- //TOP -->
    <v-sheet
      class="d-flex justify-space-between align-center gc-6"
      style="border-bottom: 1px solid #dde7ee; padding: 14px 32px"
    >
      <h4 style="font-size: 18px; line-height: 24px">{{ type ? 'Edit' : 'Add Services' }}</h4>

      <v-btn
        class="text-grey1"
        icon="$tb-x"
        width="auto"
        height="auto"
        flat
        color="transparent"
        @click="$emit('close')"
      />
    </v-sheet>

    <!-- MAIN -->
    <v-form
      ref="formRef"
      v-model="isFormValid"
      validate-on="blur"
      @submit.prevent="handleFormSubmit"
      class="d-flex flex-column justify-space-between pb-12"
    >
      <v-sheet class="pa-8 d-flex flex-column gr-6">
        <!-- MAIN HEADER -->
        <v-sheet class="mb-3">
          <h3 class="text-h5 font-weight-bold">
            {{ type ? 'Edit your Service' : 'Create a Service' }}
          </h3>
        </v-sheet>
        <v-sheet v-if="type !== 'edit'">
            <v-sheet class="border border-dashed pa-5 pt-7 d-flex flex-column gr-2 align-center justify-center" style="border-radius: 10px;border-color: #b3b3b3 !important;">
              <input class="d-none" ref="inputFileCsvRef" type="file" @change="handleCsvUpload" accept=".csv">
              <v-btn flat @click="inputFileCsvRef.click()" :loading="isLoading === 'bulkServices'" :disable="isLoading">Upload CSV file</v-btn>
                <span class="text-center text-grey2" style="font-weight: 600;">Please upload a file matching the CSV <br/> template format. <a class="download-template" href="/CSV-template.csv" target="_blank">Download</a></span>
            </v-sheet>
          
            <v-sheet class="d-flex gc-4 align-center mt-6">
              <v-divider />
              <span class="font-weight-bold text-grey2">Or</span>
              <v-divider />
            </v-sheet>
          </v-sheet>
        <!-- MAIN CONTENT -->
        <v-sheet class="d-flex flex-column gr-6">
          <v-sheet>
            <p style="line-height: 24px" class="text-body-2 text-grey2 font-weight-bold">Title</p>
            <v-text-field
              v-model="form.title"
              type="text"
              :disabled="isLoading"
              hide-details="auto"
              class="text-field mt-1 text-grey2"
              placeholder="Title"
              :rules="rules.title"
            />
          </v-sheet>
          <v-sheet class="d-flex gc-3">
            <v-sheet class="w-100">
              <p style="line-height: 24px" class="text-body-2 text-grey2 font-weight-bold">
                Price (VAT included)
              </p>
              <v-text-field
                v-model.number="form.price"
                type="number"
                :disabled="isLoading"
                hide-details="auto"
                class="text-field-price mt-1 text-grey2"
                placeholder="Price"
                :rules="rules.price"
              >
                <template v-slot:prepend>
                  <v-sheet class="price-field-prefix">AED</v-sheet>
                </template>
              </v-text-field>
            </v-sheet>
            <v-sheet class="w-100">
              <p style="line-height: 24px" class="text-body-2 text-grey2 font-weight-bold">Type</p>
              <v-select
                v-model="form.type"
                menu-icon="$tb-chevron-down"
                :menu-props="{ offset: '10px' }"
                :disabled="isLoading"
                hide-details="auto"
                placeholder="Select Type"
                class="select mt-1"
                item-title="title"
                :items="serviceLabels"
                :rules="rules.type"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" :value="item.value.code">{{
                    item.value.name
                  }}</v-list-item>
                </template>
              </v-select>
            </v-sheet>
          </v-sheet>

          <v-sheet>
            <p style="line-height: 24px" class="text-body-2 text-grey2 font-weight-bold">
              Description
            </p>
            <v-textarea
              hide-details="auto"
              v-model="form.description"
              :disabled="isLoading"
              no-resize
              row-height="24"
              rows="8"
              placeholder="Description"
              class="mt-1"
              :rules="rules.description"
            />
          </v-sheet>
          <v-sheet class="d-flex align-center ">

            <label class="switch">
              <input type="checkbox" v-model="form.quickBooking"/>
              <span class="slider round"></span>
            </label>
            <p class="font-weight-bold ml-3 text-grey2">Quick list</p>
          </v-sheet>
        </v-sheet>
      </v-sheet>

      <!-- FOOTER -->
      <v-sheet class="drawer-footer">
        <v-btn
          v-if="type"
          variant="plain"
          color="#E02A2A"
          class="px-0 btn"
          :loading="isLoading === 'remove'"
          :disabled="isLoading"
          @click="modalConfirmation = true"
        >
          <template #prepend>
            <v-icon size="24" icon="$tb-trash" />
          </template>
          Remove service
        </v-btn>
        <v-btn
          class="px-3 ml-auto"
          flat
          type="submit"
          :loading="isLoading === 'submit'"
          :disabled="isLoading || disableSubmitBtn"
        >
          {{ type ? 'Save Changes' : 'Save' }}</v-btn
        >
      </v-sheet>
    </v-form>
  </v-sheet>
  <v-dialog v-model="modalConfirmation" width="auto">
    <ConfirmationModal
      text="Are you sure you want to remove this service?"
      btnText="Remove"
      @close="modalConfirmation = false"
      @closeAll="handleServiceDelete"
    />
  </v-dialog>
</template>

<script lang="ts" setup>
import useMitt from '@/functions/useMitt'
import { useServicesStore } from '@/stores/services'
import type { Service } from '@/stores/types/services'
import { onMounted, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import ConfirmationModal from '../modal/ConfirmationModal.vue'
import { serviceLabels } from '@/constant'
import Papa from 'papaparse';

const props = defineProps<{
  type?: 'edit'
  formData?: Service
  defaultType?: string
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { emitter } = useMitt()
const formRef = ref()
const isFormValid = ref(true)
const modalConfirmation = ref(false)
const form = ref({
  title: '',
  description: '',
  type: props.defaultType ?? null,
  price: undefined,
  quickBooking: false,
  ...props?.formData
})
const disableSubmitBtn = ref(true)

const inputFileCsvRef = ref()

const isLoading = ref<'submit' | 'remove'  | 'bulkServices' | null>(null)


const rules = ref({
  title: [(v: string) => v?.length > 0 || 'Title is required.'],
  type: [(v: string) => v?.length > 0 || 'Type is required.'],
  price: [(v: number) => v > 0 || 'Price is required.'],
  description: [(v: string) => v?.length > 0 || 'Description is required.']
})

const { addServices, UpdateServices, removeService ,addBulkServices } = useServicesStore()

const updateServicesTable = (payload: Service) => {
  emitter.emit('manage-service-drawer:update_servcie', { payload })
}

const manageServices = async () => {
  try {
    isLoading.value = 'submit'
    const { id, ...formData } = form.value

    if (props.type) {
      await UpdateServices(`${id}`, { ...formData, currency: 'AED', type: formData.type as string })
      toast.success('Service Updated!')
    } else {
      const formData = await addServices({
        ...form.value,
        currency: 'AED',
        type: form.value.type as string
      })
      form.value = formData
      toast.success('Service Added!')
    }
    disableSubmitBtn.value = true
    updateServicesTable(form.value as Service)
    emit('close')
  } finally {
    isLoading.value = null
  }
}

const handleFormSubmit = async () => {
  if (!isFormValid.value) return
  await manageServices()
}

const manageRemoveService = async () => {
  try {
    isLoading.value = 'remove'
    await removeService(`${form.value.id}`)
  } finally {
    isLoading.value = null
  }
}

const handleServiceDelete = async () => {
  modalConfirmation.value = false
  await manageRemoveService()
  emitter.emit('manage-service-drawer:delete_servcie', { id: `${form.value.id}` })
  emit('close')
  toast.success('Service Removed!')
}

const submitBulkServices = async (services:Service[]) => {
     try{
      isLoading.value = 'bulkServices'
      await addBulkServices(services)
    }finally{
         isLoading.value = null
     }
}


const handleCsvUpload = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  if (!target || !target.files) return;
  const file = target.files[0];
  if (!file) return;
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true, 
    complete: async (result) => {
      const parsedData = result.data.map((item :any) => {
      return {
        ...item as {},
        quickBooking: item.quickBooking === 'TRUE',
      };
    });
      await submitBulkServices(parsedData as Service[])
      toast.success("Services added!")
      emitter.emit('refetch_services')
      emit('close')
    },
  });
}


watch(
  () => form,
  () => {
    if (disableSubmitBtn.value) disableSubmitBtn.value = false
  },
  { deep: true }
)

onMounted(() => {
  if (props.type) disableSubmitBtn.value = true
})
</script>

<style lang="scss" scoped>
@import '@/assets/global.css';

.price-field-prefix {
  border: 1px solid #a0aeb8;
  color: #494949;
  height: 100%;
  font-weight: 500;
  padding: 10px 8px;
  border-top-right-radius: 0px;
  border-top-left-radius: 8px !important;

  border-right: none;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 8px !important;
}

.text-field-price {
  &:deep(.v-field) {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    font-weight: 500;
    color: #494949;
  }
  &:deep(.v-input__prepend) {
    margin: 0px;
    padding-top: 0px !important;
  }

  &:deep(.v-field__input) {
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &:deep(.v-input__details) {
    grid-column: span 2;
  }
}

.btn {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  height: fit-content !important;
  min-height: auto !important;
}

.switch {
  position: relative;
  display: inline-block;
  width: 51px;
  height: 31px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #78788029;
  -webkit-transition: 0.2s;
  transition: 0.2s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 25px;
  width: 25px;
  left: 4px;
  bottom: 3.3px;
  background-color: white;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.4);
  -webkit-transition: 0.2s;
  transition: 0.2s;
}

input:checked + .slider {
  background-color: #10afe1;
}

input:focus + .slider {
  box-shadow: 0 0 1px #10afe1;
}

input:checked + .slider:before {
  -webkit-transform: translateX(18px);
  -ms-transform: translateX(18px);
  transform: translateX(18px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 38px;
}

.slider.round:before {
  border-radius: 50%;
}

.download-template{
  font-weight: 600;
  color: #427594;
  text-decoration: none;
  &:hover{
    text-decoration: underline;
    text-underline-offset: 2px;
  }
}
</style>
