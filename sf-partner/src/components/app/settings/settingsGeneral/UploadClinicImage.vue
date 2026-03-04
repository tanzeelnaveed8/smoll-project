<template>
    <div class="d-flex flex-column gr-6">
        <input multiple ref="inputRef" class="d-none" type="file" @change="handleFileInputChange" accept="image/png, image/jpeg, image/jpg">
        <p class="font-weight-bold">Gallery</p>
        <v-sheet class="gallery ga-4">
            <v-sheet class="position-relative upload-container" v-for="(file, i) in uploadedFiles" :key="i"
                v-if="uploadedFiles.length">
                <v-img height="98" width="98" class=" cursor-default" :src="file.url" cover
                    style="border-radius: 12px;border: 1px solid #9e9e9e;"
                    />
                <v-btn @click="() => handleRemoveImage(i)" flat icon class="position-absolute remove-image">
                    <v-icon icon="$tb-x" size="16" />
                </v-btn>
            </v-sheet>
            <v-sheet class="upload" :class="loading && 'loading'" @click="handleUploadClick">
                <v-progress-circular v-if="loading" indeterminate size="24" color="grey2" width="3" />
                <template v-else>
                    <v-icon icon="$tb-plus" />
                    <p class="text-no-wrap text-body-2 font-weight-bold mt-1">Upload</p>
                </template>

            </v-sheet>
        </v-sheet>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import type { UploadedFile } from '@/stores/types/global';
import { useUploadStore } from '@/stores/upload';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

const authStore = useAuthStore()
const { uploadFile } = useUploadStore()

const inputRef = ref<HTMLInputElement | null>(null)
const loading = ref(false)

const { user } = storeToRefs(authStore)
const uploadedFiles = ref<UploadedFile[] | []>(user.value?.imgCollections || [])

const handleUploadClick = () => {
    if (!loading.value) inputRef.value?.click()
}

const handleRemoveImage = async (imgIndex: number) => {
    console.log(uploadedFiles.value[imgIndex])
    const filteredImages = uploadedFiles.value.filter((file) => file.filename !== uploadedFiles.value[imgIndex].filename)
    uploadedFiles.value = filteredImages


    if (user.value) {
        const { specialities, ...updatedUser } = user.value

        await authStore.updateUser({
            ...updatedUser,
            imgCollections: filteredImages
        })

        toast.success('Image removed.')
    }
}

const handleFileInputChange = async (e: any) => {
    if (loading.value) return

    try {
        loading.value = true
        const files = e.target.files

        if (!files.length) return

        if (files.length > 5 || uploadedFiles.value.length >= 5) {
            toast.error('Cannot upload more than 5 images.')
            return
        }

        const bodyFormData = new FormData();
        [...files].forEach((file: any, ind: number) => {
            bodyFormData.append(`files`, file);
        });

        const responseFiles = await uploadFile(bodyFormData)
        uploadedFiles.value = [...uploadedFiles.value, ...responseFiles]

        if (user.value) {
            const { specialities, ...updatedUser } = user.value

            await authStore.updateUser({
                ...updatedUser,
                imgCollections: uploadedFiles.value
            })
        }

        toast.success('Profile updated!')
    } finally {
        loading.value = false
    }
}
</script>

<style lang="scss" scoped>
.gallery {
    display: grid;
    grid-template-columns: repeat(3, 98px);
    grid-template-rows: repeat(2, 98px);
    gap: 12px;
}

.upload {
    cursor: pointer;
    border: 1px dashed #9e9e9e;
    border-radius: 12px;
    height: 98px !important;
    width: 98px !important;
    max-height: 98px !important;
    max-width: 98px !important;
    background-color: #42759410;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #222;
    transition: all 0.2s;

    &:hover {
        border-color: #427594;
    }


}

.loading {
    color: #494949;
    cursor: default;
}


.upload-container {
    &:hover .remove-image {
        visibility: visible;
    }
}

.remove-image {
    visibility: hidden;
    transition: all 0.2s;
    height: 20px;
    width: 20px;
    background-color: rgb(255, 18, 18) !important;
    top: 4px;
    right: 4px;
}
</style>