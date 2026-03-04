<template>
  <v-sheet class="w-100 d-flex flex-column gr-6">
    <p class="font-weight-bold">Change Password</p>
    <v-form
      class="d-flex flex-column gr-6"
      ref="formRef"
      v-model="isFormValid"
      @submit.prevent="handleFormSubmit"
    >
      <!-- @submit.prevent="handleFormSubmit" -->
      <v-sheet class="d-flex flex-column gr-4" max-width="311">
        <v-sheet>
          <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
            Old Password
          </p>
          <v-text-field
            v-model="account.oldPwd"
            class="text-field mt-1"
            :disabled="actionLoading"
            hide-details="auto"
            placeholder="Enter old password"
            :type="showOldPassword ? 'text' : 'password'"
            :rules="rules.pwd"
            :append-inner-icon="showOldPassword ? '$tb-eye' : '$tb-eye-closed'"
            @click:append-inner="showOldPassword = !showOldPassword"
          />
        </v-sheet>
        <v-sheet>
          <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
            New Password
          </p>
          <v-text-field
            v-model="account.newPwd"
            class="text-field mt-1"
            :disabled="actionLoading"
            hide-details="auto"
            placeholder="Enter new password"
            :type="showNewPassword ? 'text' : 'password'"
            :rules="rules.pwd"
            :append-inner-icon="showNewPassword ? '$tb-eye' : '$tb-eye-closed'"
            @click:append-inner="showNewPassword = !showNewPassword"
          />
        </v-sheet>
        <v-sheet>
          <p style="font-weight: 600; line-height: 24px" class="text-body-2 text-grey2">
            Repeat Password
          </p>
          <v-text-field
            ref="repeatPasswordRef"
            v-model="account.repeatPwd"
            class="text-field mt-1"
            type="password"
            :disabled="actionLoading"
            hide-details="auto"
            placeholder="Enter new password"
            :rules="rules.repeatPwd"
          />
        </v-sheet>
      </v-sheet>
      <v-btn
        v-push
        :disabled="disableSubmitBtn || actionLoading"
        class="align-self-start px-3"
        style="letter-spacing: 0px; line-height: 24px"
        type="submit"
        >Change Password</v-btn
      >
    </v-form>
  </v-sheet>
</template>
<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { ref, watch } from "vue";
import { toast } from "vue3-toastify";

const formRef = ref();
const repeatPasswordRef = ref();

const showOldPassword = ref(false);
const showNewPassword = ref(false);
const actionLoading = ref(false);
const isFormValid = ref(false);
const disableSubmitBtn = ref(true);

const { updateUser } = useAuthStore();

const account = ref({
  oldPwd: "",
  newPwd: "",
  repeatPwd: "",
});

const rules = ref({
  pwd: [
    (v: string) => /^.{8,}/gm.test(v) || "Password must be atleast 8 character long.",
  ],
  repeatPwd: [(v: string) => account.value.newPwd === v || "Password doesn't match."],
});

const handleFormSubmit = async () => {
  if (!isFormValid.value) return;
  try {
    await updateUser({
      oldPassword: account.value.oldPwd,
      password: account.value.newPwd,
    });
    toast.success("Password has been changed!");
    account.value = {
      oldPwd: "",
      newPwd: "",
      repeatPwd: "",
    };
    formRef.value.reset();
  } finally {
    disableSubmitBtn.value = true;
  }
};

watch(
  () => account,
  (v) => {
    if (
      !v.value.oldPwd?.length ||
      !v.value.newPwd?.length ||
      !v.value.repeatPwd?.length
    ) {
      disableSubmitBtn.value = true;
    } else {
      disableSubmitBtn.value = false;
    }
  },
  { deep: true }
);
watch(
  () => account.value.newPwd,
  async () => {
    repeatPasswordRef.value.validate();
  }
);
</script>
