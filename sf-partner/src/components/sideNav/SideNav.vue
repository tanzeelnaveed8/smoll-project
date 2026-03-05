<template>
  <v-navigation-drawer permanent width="272" class="side-nav position-fixed">
    <template v-slot:prepend>
      <v-sheet class="d-flex justify-space-between px-6">
        <v-icon icon="$tb-logo" class="my-6" size="118" style="height: 62px" />
      </v-sheet>
    </template>
    <v-list color="transparent" class="px-3 d-flex flex-column gr-1 list-container">
      <v-list-item
        v-for="(link, i) in links"
        :key="i"
        :prepend-icon="link.icon"
        :active="link.to === '/' ? $route.path === '/' : undefined"
        :active-class="`side-nav--active`"
        :to="link.to"
        class="side-nav--link rounded-lg"
        :style="{ fontWeight: 600, color: '#222222' }"
      >
        <v-sheet class="d-flex justify-space-between" style="color: inherit">
          {{ link.title }}
        </v-sheet>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <SideNavFooter />
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import SideNavFooter from "./SideNavFooter.vue";

const links = [
  { title: "Dashboard", icon: "$tb-smart-home", to: "/" },
  { title: "Services", icon: "$tb-briefcase-2", to: "/services" },
  { title: "Products", icon: "$tb-pet", to: "/products" },
  { title: "Visits", icon: "$tb-writing-sign", to: "/visits" },
  { title: "Customers", icon: "$tb-user", to: "/customers" },
  { title: "Veterinarians", icon: "$tb-vets", to: "/veterinarians" },
  { title: "Finance", icon: "$tb-graph", to: "/finance" },
  { title: "Smoll Care", icon: "$tb-paw", to: "/smoll-care" },
  { title: "Settings", icon: "$tb-settings", to: "/settings" },
];
</script>

<style lang="scss" scoped>
.side-nav:deep(.v-navigation-drawer__content) {
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
}

.side-nav--link {
  border: none;

  &::after {
    border: none !important;
  }

  &:deep(.v-list-item-title) {
    font-weight: 600 !important;
  }

  & :deep(.v-list-item__prepend) {
    display: contents;

    .v-icon {
      margin-right: 20px;
      opacity: 1;
    }

    .v-list-item__spacer {
      display: none;
    }
  }
}

.side-nav--active {
  background-color: #f4f6f8 !important;
  color: black !important;
  font-weight: 700 !important;

  &:deep(.icon) {
    stroke-width: 1.7 !important;
  }
}

.side-nav--link {
  &:hover {
    background-color: #f4f6f8cb;
  }

  &:deep(.v-list-item__overlay) {
    opacity: 0 !important;
  }
}
</style>
