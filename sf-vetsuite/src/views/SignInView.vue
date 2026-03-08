<template>
  <div class="h-100 w-100">
    <v-main class="d-flex align-center justify-center h-100">
        <v-sheet max-width="380" class="w-100 d-flex flex-column align-center" style="gap: 32px">
          <v-icon icon="$tb-logo" size="118" style="height: 62px" />
          <v-sheet class="d-flex flex-column w-100 text-center">
            <h3 class="text-h5 text-grey1" style="font-family: 'CooperLtBT' !important">
              Sign In to smoll
            </h3>
            <v-sheet class="d-flex flex-column gr-5 mt-6 text-start">
              <v-form
                class="d-flex flex-column gr-5"
                ref="formRef"
                v-model="isFormValid"
                validate-on="blur"
                @submit.prevent="handleFormSubmit"
              >
                <v-sheet class="d-flex flex-column gr-3">
                  <v-sheet>
                    <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
                      Email address
                    </p>
                    <v-text-field
                      v-model="account.email"
                      type="email"
                      :disabled="actionLoading"
                      hide-details="auto"
                      class="text-field mt-1 text-grey2"
                      placeholder="Enter email"
                      :rules="rules.email"
                    />
                  </v-sheet>

                  <v-sheet>
                    <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
                      Password
                    </p>
                    <v-text-field
                      v-model="account.pwd"
                      class="text-field mt-1"
                      :disabled="actionLoading"
                      hide-details="auto"
                      placeholder="Password"
                      :type="showPassword ? 'text' : 'password'"
                      :rules="rules.pwd"
                      :append-inner-icon="showPassword ? '$tb-eye' : '$tb-eye-closed'"
                      @click:append-inner="showPassword = !showPassword"
                    />
                  </v-sheet>
                </v-sheet>
                <v-btn
                  v-push
                  type="submit"
                  class="bg-primary w-100 text-body-1"
                  height="48"
                  :loading="actionLoading"
                  :disabled="actionLoading"
                >
                  Sign In
                </v-btn>
              </v-form>
              <RouterLink
                to="/"
                class="text-grey2 text-body-2 text-decoration-none"
                style="font-weight: 600; line-height: 24px"
              >
                Forgot your Password?
              </RouterLink>
            </v-sheet>
            <span class="text-grey2 mt-4 text-start">
              <span class="text-no-wrap tex-grey2">Contact </span>
              <a
                class="text-primary text-body-2 contact-us-link"
                style="font-weight: 600; line-height: 24px"
                href="mailto:care@smoll.me"
              >
                care@smoll.me</a
              >
            </span>
          </v-sheet>
        </v-sheet>
      </v-main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref()
const isFormValid = ref()
const showPassword = ref(false)
const actionLoading = ref(false)

const rules = ref({
  email: [
    (v: string) =>
      /^[\w.+-]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v) || 'Please enter a valid email address.'
  ],
  pwd: [(v: string) => /^.{8,}/gm.test(v) || 'Password must be atleast 8 character long.']
})

const account = ref({
  email: '',
  pwd: ''
})

const handleFormSubmit = async () => {
  const result = await formRef.value?.validate()
  if (!result?.valid) return

  try {
    actionLoading.value = true

    await authStore.login({
      email: account.value.email.trim(),
      password: account.value.pwd.trim()
    })

    router.replace('/')
  } catch (err: unknown) {
    const msg =
      err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string | string[] } } }).response?.data?.message
        : null
    const text = Array.isArray(msg) ? msg[0] : msg
    if (!text) toast.error('Sign in failed. Check server is running and VITE_API_URL points to it.')
  } finally {
    actionLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.contact-us-link {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
</style>
