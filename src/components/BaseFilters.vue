<template>
  <div
    class="
      d-flex
      flex-column flex-md-row
      justify-content-md-between
      align-items-md-center
      gap-2
      p-3
      bg-white
    "
  >
    <div
      class="
        d-flex
        flex-column flex-md-row
        justify-content-md-between
        gap-md-3 gap-2
      "
    >
      <div>
        <b-dropdown class="w-100" variant="transparent">
          <template #button-content>
            <div class="d-flex flex-row align-items-center gap-2">
              <b-icon
                icon="funnel-fill"
                class="filter-icon"
                aria-hidden="true"
              ></b-icon>
              <span class="filter-text">Filter</span>
            </div>
          </template>
          <div v-for="(sortBy, index) in dropdownSort" :key="index">
            <b-dropdown-header>
              <span class="filter-item-header">{{
                Object.keys(sortBy)[0]
              }}</span>
            </b-dropdown-header>
            <b-form-radio-group
              v-model="selectSortKey"
              :options="sortBy[Object.keys(sortBy)[0]]"
              class="ms-2"
              value-field="item"
              text-field="name"
              disabled-field="notEnabled"
            >
              <template #value>
                <b-form-radio></b-form-radio>
              </template>
            </b-form-radio-group>
          </div>
        </b-dropdown>
      </div>
      <div class="d-flex flex-row rounded-circle">
        <button class="search-icon border-0">
          <b-icon icon="search" aria-hidden="true"></b-icon>
        </button>
        <b-form-input
          v-model="searchKey"
          class="search-input"
          placeholder="Search Users by Name, Email or Date"
        ></b-form-input>
      </div>
    </div>
    <div>
      <button @click="payDue" class="pay-dues-button text-white btn btn-lg">
        Pay Dues
      </button>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * We could have sub-components
 */
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      selectSortKey: "",
      sortList: [
        {
          sortBy: [
            {
              name: "Default",
              item: "",
            },
            {
              name: "First Name",
              item: "firstName",
            },
            {
              name: "Last Name",
              item: "lastName",
            },
            {
              name: "Due Date",
              item: "paidOn",
            },
            {
              name: "Last Login",
              item: "lastLogin",
            },
          ],
        },
        {
          user: [
            {
              name: "All",
              item: "all",
            },
            {
              name: "Active",
            },
            {
              name: "Inactive",
            },
          ],
        },
      ],
      searchKey: "",
    };
  },

  props: {
    dropdownSort: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    payDue() {
      this.$emit("process-payDue");
    },
  },

  watch: {
    searchKey(e) {
      this.$emit("search-input", e);
    },
    selectSortKey(e) {
      this.$emit("sortSelectedKey", e);
    },
  },
});
</script>
