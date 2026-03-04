<template>
  <v-sheet height="100%">
    <v-sheet class="d-flex px-4 py-3 align-center">
      <v-text-field
        class="text-field text-body-2 rounded-circle"
        style="height: 40px"
        hide-details="auto"
        placeholder="Search"
        color="grey1"
        type="text"
        @input="$emit('update', $event.target.value)"
      >
        <template v-slot:prepend-inner> <v-icon icon="$tb-search" size="20" /></template>
      </v-text-field>
      <!-- //MENU -->
      <v-menu offset="10" scroll-strategy="close" location="bottom right">
        <template v-slot:activator="{ props }">
          <v-btn
            v-push
            icon="$tb-filter-lines"
            flat
            height="32"
            width="32"
            density="compact"
            class="text-grey1 ml-3"
            color="transparent"
            v-bind="props"
          />
        </template>
        <v-list
          v-model:activated="filterSelected"
          activatable
          mandatory
          style="border: 1px solid #d5d5d5"
          elevation="4"
        >
          <v-list-item
            v-for="(item, index) in menuList"
            :key="index"
            :value="item.value"
            class="text-body-1 px-3"
            height="42"
            min-height="auto"
            style="font-weight: 600"
            :style="index && 'border-top: 1px solid #d5d5d5'"
            @click="item.action"
            >{{ item.title }}
          </v-list-item>
        </v-list>
      </v-menu>
    </v-sheet>
    <v-divider color="#2C2B35"></v-divider>

    <v-sheet class="d-flex justify-space-between align-center px-6 text-grey1 py-3">
      <p style="font-weight: 600">
        {{ filterSelected[0][0].toUpperCase() + filterSelected[0].slice(1) }}
      </p>
    </v-sheet>

    <v-sheet height="100%">
      <v-sheet
        height="100%"
        v-if="!conversations.length && !loading"
        class="py-3 text-grey2 font-weight-bold px-8 text-body-1 d-flex align-center justify-center"
      >
        <p style="padding-bottom: 220px">
          {{ filterSelected[0] === 'all' ? 'No messages' : 'No starred chats' }}
        </p>
      </v-sheet>

      <v-list
        v-else
        style="background-color: transparent"
        :mandatory="true"
        activable
        class="py-0 list"
      >
        <template v-if="loading">
          <v-list-item v-for="n in 3" :key="n" class="pa-6">
            <ChatInboxItem :disabled="true" loading style="border-radius: 0" />
          </v-list-item>
        </template>

        <template v-else-if="allConversations">
          <v-list-item
            v-for="(conversation, i) in conversations"
            :key="i"
            :value="i"
            :id="conversation.conversationID"
            :active="activeUser?.conversationID === conversation.conversationID"
            class="pa-6"
            @click="model = conversation"
          >
            <ChatInboxItem
              :conversation
              @handleFavorite="$emit('handleFavoriteChat', conversation.conversationID, $event)"
            />
          </v-list-item>
        </template>
      </v-list>
    </v-sheet>
  </v-sheet>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import ChatInboxItem from './ChatInboxItem.vue'
import { useChatStore } from '@/stores/chat'
import { storeToRefs } from 'pinia'
// import { HiddenState } from '@sendbird/chat/groupChannel'
import type { ConversationWith } from '@/stores/types/chat'
import type { ZIMConversation } from 'zego-zim-web'

const props = defineProps<{
  loading: boolean
  allConversations: Map<string, ZIMConversation> | null
}>()

defineEmits<{
  (event: 'update', searchKeyword: string): void
  (event: 'select', conversation: any): void
  (e: 'handleFavoriteChat', consversationID: string, toggleFavorite: boolean): void
}>()

const model = defineModel<any>('select')
const chatStore = useChatStore()
const { activeUser } = storeToRefs(chatStore)
const filterSelected = ref(['all'])

const menuList = ref([
  {
    title: 'All',
    value: 'all',
    action: ''
  },
  {
    title: 'Starred',
    value: 'starred',
    action: ''
  }
  // {
  //   title: 'Archived',
  //   value: 'archived',
  //   action: ''
  // }
])

const conversations = computed(() =>
  Array.from(props.allConversations?.values() || []).filter((user) => {
    if (filterSelected.value[0] === 'starred') {
      return user.isPinned
    } else {
      return user
    }
  })
)
</script>

<style lang="scss" scoped>
.search-field:deep(.v-field) {
  border: none;
}
.text-field {
  &:deep(.v-field) {
    height: inherit;
    background-color: #f4f6f8;
    border-radius: 50px;
    border: none !important;
    font-weight: 500;
  }

  &:deep(.v-input__control) {
    height: inherit !important;
  }

  &:deep(.v-field__prepend-inner) {
    height: 40px !important;
    padding: 0px;
    align-items: center !important;
  }

  &:deep(.v-field__field) {
    height: inherit;
  }

  &:deep(.v-field__input) {
    min-height: auto;
    padding-top: 8px;
    padding-left: 8px;
    padding-bottom: 8px;
    font-weight: 600;
    font-size: 14px;
    height: 100%;

    &::placeholder {
      color: #222 !important;
      font-weight: 600;
    }
  }
}

.list-item {
  position: relative;
  top: -1px;

  &:deep(.v-list-item--active .v-list-item__overlay) {
    opacity: 0;
  }

  &:deep(.v-list-item) {
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    &::after {
      border: none;
    }
  }

  &:deep(.v-list-item--active) {
    position: relative;
    border-top: 1px solid #2c2b35;
    border-bottom: 1px solid #2c2b35;

    background-color: #212028 !important;

    &::after {
      content: '';
      border: none;
      width: 4px;
      opacity: 1;
      background-color: #5b53f5;
      border: none;
      border-radius: 0;
      border-top-left-radius: 14px;
      border-bottom-left-radius: 14px;
      position: absolute;
      left: calc(100% - 4px);
    }
  }
}

.list {
  overflow-y: scroll;
  height: calc(100vh - 237px);

  &::-webkit-scrollbar {
    display: none;
  }
  & .v-list-item {
    border-bottom: solid 1px #dde7ee;
  }
}
</style>
