<template>
    <v-sheet class="pa-7 pt-5 d-flex gr-2 flex-column notes">
        <v-sheet class="d-flex flex-column gr-5 scroll" :class="readonly && 'extend-notes'">
            <h5 class="text-h6 pl-2 pb-2" style='font-weight: 700;color: black;border-bottom: 1px solid #dde7ee;'>
                Notes
            </h5>
            <p v-if="!notes.length" class="text-center font-weight-medium text-grey2 mt-4 ">
                There are currently no notes.
            </p>
            <v-sheet 
              v-for="(note, i) in notes" 
              :key="i + 'a'"
              class="d-flex justify-space-between gc-2 align-center gr-1 pa-3"
              style="border-radius: 12px; border: 1px solid #49494920; background-color: #42759410; "
            >
              <p class="text-grey2" style="font-weight: 600; word-wrap: break-word; max-width: 90%;">{{ note.content }}</p>
                <div class="d-flex gc-4">
                    <p class="font-weight-medium">{{dayjs(note.createdAt).format('hh:mm A, DD MMM YYYY')}}</p> 
                    <v-btn 
                            @click="() => handleRemoveNote(i)" 
                            v-if="!readonly" 
                            height="auto" 
                            width="auto" 
                            icon
                            variant="text"
                            :disabled="loading"
                        >
                        <v-icon style="color: #de2f2f;" size="24" icon="$tb-trash" />
                        </v-btn>
                </div>
        
            </v-sheet>
        </v-sheet>

        <v-sheet class="pa-4 px-8 w-100" :class="readonly && 'd-none'"
            style="position: absolute; bottom: 0px; left: 0px; background-color: white;">
            <v-form class="d-flex flex-column gr-4 align-end" @submit.prevent="handleSubmitNote">
                <v-sheet class="w-100">
                    <v-textarea :disabled="loading" v-model="note" class="text-field text-body-2 mt-1"
                        style="border-radius: 12px;" hide-details="auto" rows="3" no-resize
                        placeholder="Write your note here ..." color="grey1" type="text" 
                        @keydown="handleSubmitOnCtrlEnter">
                    </v-textarea>
                </v-sheet>
                <v-btn :loading="loading" flat type="submit" rounded="md" :disabled="!note || loading">Add Note</v-btn>
            </v-form>
        </v-sheet>

    </v-sheet>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth';
import { useCaseStore } from '@/stores/case';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

const props = defineProps<{
    readonly: boolean,
    caseId: string,
    notes: {content:string,createdAt:string}[] | null,
}>()

const caseStore = useCaseStore()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const notes = ref<{content:string,createdAt:string}[] >((props.notes && [...props.notes]) ||  [])
const note = ref(null)
const loading = ref(false)

const handleSubmitOnCtrlEnter = (e:KeyboardEvent) => (e.ctrlKey && e.key === 'Enter') && handleSubmitNote()


const sendNote = async () => {
    try {
        loading.value = true
        await caseStore.sendNote(props.caseId, { notes: notes.value })
    } finally {
        loading.value = false
    }
}

const handleRemoveNote = async (noteInd: number) => {
    const filteredNotes = notes.value.filter((note, i) => i !== noteInd)
    notes.value = filteredNotes
    await sendNote()
    toast.success('Note removed')
}

const handleSubmitNote = async () => {
    if (!note.value) return;

    try{
        console.log(dayjs().utc())
    notes.value = [...notes.value, {content:note.value,createdAt:dayjs().utc().format()}]
    await sendNote()
    toast.success('Note added') 

    }catch(err){
        notes.value = notes.value.slice(0,-1)
    }finally{
    note.value = null
    }
  
}

</script>

<style lang="scss" scoped>
.notes {
    height: calc(100vh - 124px);
}

.scroll {
    height: calc(100vh - 339px);
    overflow-y: scroll;
    padding: 4px;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 50px;
        background: #e8e8e8;
    }
}

.extend-notes {
    height: calc(100vh - 180px) !important;
}

.text-field {

    &:deep(.v-field) {
        border-radius: 12px;
    }
}
</style>