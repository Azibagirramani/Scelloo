<template>
  <b-tabs class="my-3">
    <b-tab
      v-for="(tab, index) in tabItems"
      :key="index"
      :title="tab.label"
      @click="() => emitToParent(tab.key)"
      :title-link-class="
        tab.key === selectedTab
          ? 'border-bottom border-dark border-2 border-0 bg-transparent'
          : 'border-0 bg-transparent'
      "
      active-tab-class="table-tab-title-active"
    >
      <template #title>
        <div
          :class="
            tab.key === selectedTab
              ? 'table-tab-title-active '
              : 'table-tab-title'
          "
        >
          {{ tab.label }}
        </div>
      </template>
    </b-tab>
  </b-tabs>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    tabItems: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedTab: "",
    };
  },
  methods: {
    emitToParent(payload: any) {
      this.selectedTab = payload;
      this.$emit("selected-tab", payload);
    },
  },
});
</script>

<style>
</style>
