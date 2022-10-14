<template>
  <div id="app">
    <div class="px-3 container-lg">
      <h2 class="table-header">Table Heading</h2>

      <div
        class="total my-3 d-flex align-items-center justify-content-end gap-3"
      >
        <!-- <span class="badge bg-danger text-dark" v-if="error"></span> -->
        <span class="badge bg-primary text-dark" v-if="msg !== ''">{{
          msg
        }}</span>
        <b-spinner v-if="activityIndicator"></b-spinner>
        Selected rows on table {{ selectedRowsOnTable.length ?? 0 }}
      </div>
      <div class="text-end total">
        Total payable amount: ${{ totalSum ?? 0 }} USD
      </div>
      <!-- tabs -->
      <BaseTabsVue :tabItems="tabsTitles" @selected-tab="setActiveTab" />

      <!-- tabs end's here-->
      <div class="table-container">
        <!-- sort, search and Pay dues button -->
        <BaseFilter
          :dropdownSort="sortList"
          @process-payDue="markAsPaid"
          @search-input="(e) => (searchKey = e)"
          @sortSelectedKey="(e) => (selectedSortKey = e)"
        />
        <!-- sort, search and Pay dues button end's here -->

        <!-- table  -->
        <b-table
          selectable
          @row-selected="onRowSelected"
          :items="computedData"
          :fields="mainTableCol"
          :busy="tableLoader"
          responsive
          class="bg-white"
          thead-class="table-field-header"
          :currentPage="paginate.currentPage"
          :perPage="paginate.perPage"
          selected-variant="primary"
          ref="selectableTable"
        >
          <!-- rows  -->
          <template #cell(name)="data">
            <div
              class="
                d-flex
                flex-column
                align-items-start
                justify-content-center
              "
            >
              <div class="user-name">
                {{ data.item.firstName }} {{ data.item.lastName }}
              </div>
              <div class="user-email">{{ data.item.email }}</div>
            </div>
          </template>
          <template #cell(paymentStatus)="data">
            <div
              class="
                d-flex
                flex-column
                align-items-start
                justify-content-center
              "
            >
              <div
                :class="paymentStatusClassMapper[data.item.paymentStatus] ?? ''"
                class="d-flex flex-row align-items-center ps-0 pe-3"
              >
                <b-icon icon="dot" font-scale="2"></b-icon>
                <span>{{ data.item.paymentStatus }}</span>
              </div>
              <div>
                <span class="payment-date"
                  >Paid on :{{ data.item.paidOn ?? "" }}</span
                >
              </div>
            </div>
          </template>
          <template #cell(userStatus)="data">
            <div
              class="
                d-flex
                flex-column
                align-items-start
                justify-content-center
              "
            >
              <div
                :class="userStatusClassMapper[data.item.userStatus] ?? ''"
                class="d-flex flex-row align-items-center ps-0 pe-3"
              >
                <b-icon icon="dot" font-scale="2"></b-icon>
                <span>{{ data.item.userStatus }}</span>
              </div>
              <div>
                <span class="last-logged-in"
                  >Last Login :{{ data.item.lastLogin }}</span
                >
              </div>
            </div>
          </template>
          <template #cell(amountInCents)="data">
            <div
              class="
                d-flex
                flex-column
                align-items-start
                justify-content-center
              "
            >
              <div class="d-flex flex-column gap-1">
                <div class="amount-text">${{ data.item.amountInCents }}</div>
                <div class="amount-currency">USD</div>
              </div>
            </div>
          </template>
          <template #cell(viewMore)>
            <div>
              <b-dropdown
                size="lg"
                variant="link"
                toggle-class="text-decoration-none"
                class="p-0 m-0"
              >
                <template #button-content>
                  <div
                    class="d-flex align-items-center justify-content-end gap-3"
                  >
                    <span class="p-0 m-0 view-more">View More</span>
                    <b-icon
                      icon="three-dots-vertical"
                      class="fs-6 text-dark"
                    ></b-icon>
                  </div>
                </template>

                <div v-for="(list, keys) in tableDropdownActions" :key="keys">
                  <li v-if="keys === 'Delete'">
                    <hr class="dropdown-divider" />
                  </li>
                  <b-dropdown-item class="dropdown-action-item" href="#"
                    ><span :class="list">{{ keys }}</span></b-dropdown-item
                  >
                </div>
              </b-dropdown>
            </div>
          </template>
          <template #cell(checkbox)="data">
            <div
              class="d-flex flex-row align-items-center mt-2 gap-3 margin-left"
            >
              <input
                type="checkbox"
                v-model="data.rowSelected"
                @click="() => checkbox(data.index)"
              />

              <b-icon
                v-model="data.detailsShowing"
                class="text-primary"
                @change="data.toggleDetails"
                :icon="
                  data.detailsShowing ? 'arrow-down-circle' : 'arrow-up-circle'
                "
                @click="data.toggleDetails"
              ></b-icon>
            </div>
          </template>

          <!-- headers  -->
          <template #head()="data">
            <span class="table-header-text">{{ data.label }}</span>
          </template>
          <template #head(checkbox)>
            <span>
              <b-form-checkbox
                value="checked"
                class="checkBox"
                v-model="selectedAllOnTable"
                @change="() => selectAllRows()"
                unchecked-value="unchecked"
            /></span>
          </template>
          <template #head(viewMore)>
            <span></span>
          </template>

          <!-- loading state -->
          <template #table-busy><TableSkeletonVue /> </template>

          <!-- activities table extended -->
          <template #row-details="row">
            <b-table
              :fields="activitiesCols"
              :items="row.item.activities"
              responsive="sm"
              class="table-field-header"
              thead-class="table-field-header"
              tbody-tr-class="table-field-header"
            >
              <template #head()="data">
                <span class="table-header-text">{{ data.label }}</span>
              </template>
              <template #cell(date)="data">
                <span class="detailed-table-date">{{ data.item.date }}</span>
              </template>
              <template #cell(userActivity)="data">
                <span class="detailed-table-userActivity">{{
                  data.item.userActivity
                }}</span>
              </template>
              <template #cell(details)="data">
                <span class="detailed-table-details">{{
                  data.item.details
                }}</span>
              </template>
            </b-table>
          </template>
        </b-table>
      </div>

      <!-- table ends here -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

// component import
import TableSkeletonVue from "./components/TableSkeleton.vue";
import BaseTabsVue from "./components/BaseTabs.vue";
import BaseFilter from "./components/BaseFilters.vue";

import {
  MarkPaid as ServiceMarkPaid,
  fetchData as ServiceFetchData,
} from "./plugins/http";
export default Vue.extend({
  name: "App",
  components: {
    TableSkeletonVue,
    BaseTabsVue,
    BaseFilter,
  },
  data() {
    return {
      selectedTab: "",
      searchKey: "",
      totalTabDescription: "",
      tableLoader: false,
      activityIndicator: false,
      tabsTitles: [
        {
          label: "All",
          key: "",
          pattern: "",
        },
        {
          label: "Paid",
          key: "paid",
          pattern: "(?i)^paid$",
        },
        {
          label: "Unpaid",
          key: "unpaid",
          pattern: "(?i)^unpaid$",
        },
        {
          label: "Overdue",
          key: "Overdue",
          pattern: "(?i)^overdue$",
        },
      ],
      selectedSortKey: "",
      sortList: [
        {
          sortBy: [
            {
              name: "All",
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
              name: "Email",
              item: "email",
            },
          ],
        },
        {
          user: [
            // {
            //   name: "All",
            //   item: "all",
            // },
            // {
            //   name: "Active",
            // },
            // {
            //   name: "Inactive",
            // },
          ],
        },
      ],
      error: null,
      msg: "",
      tableData: [],
      totalSum: 0,
      selectedRowsOnTable: [],
      mainTableCol: [
        {
          key: "checkbox",
          class: "text-start",
          thStyle: { width: "8%" },
          _showDetails: true,
        },
        {
          key: "name",
          thStyle: { width: "20%" },
        },
        "userStatus",
        "paymentStatus",
        {
          label: "Amount",
          key: "amountInCents",
        },
        {
          key: "viewMore",
          thStyle: { width: "11%" },
          tdClass: "text-end",
          class: "text-end",
        },
      ],
      activitiesCols: [
        {
          label: "Date",
          key: "date",
          thStyle: { width: "11%" },
          tdClass: "text-start",
          class: "text-start",
        },
        {
          label: "User Activity",
          key: "userActivity",
          thStyle: { width: "25%" },
          tdClass: "text-start",
          class: "text-start",
        },
        {
          label: "Details",
          key: "details",
          tdClass: "text-start",
          class: "text-start",
          thStyle: { width: "30%" },
        },
      ],

      userStatusClassMapper: {
        inactive: "statusInActive",
        active: "statusActive",
      },
      paymentStatusClassMapper: {
        paid: "payment-paid",
        unpaid: "payment-unpaid",
        overdue: "payment-overdue",
      },
      tableDropdownActions: {
        edit: "",
        "View profile": "",
        "Activate User": "primary-text",
        Delete: "text-danger",
      },
      paginate: {
        perPage: 20,
        currentPage: 1,
        totalPages: 0,
      },
      checkBoxStatus: "checked",
      selectedAllOnTable: "unchecked",
    };
  },

  methods: {
    checkbox(e: any) {
      const table = this.$refs.selectableTable as any;
      table.selectRow(e);
    },
    onRowSelected(e: any) {
      this.selectedRowsOnTable = e;
    },

    selectAllRows() {
      const table = this.$refs.selectableTable as any;

      this.selectedAllOnTable === "checked"
        ? table.selectAllRows()
        : table.clearSelected();
    },

    setActiveTab(e: string) {
      this.selectedTab = e;
    },
    async markAsPaid() {
      this.activityIndicator = true;
      let success = false;

      const _selectedRowsOnTable = this.selectedRowsOnTable ?? [];
      // we only make request if a row is 1 or more rows are selected
      if (
        Array.isArray(_selectedRowsOnTable) &&
        _selectedRowsOnTable.length > 0
      ) {
        const fetchAll = _selectedRowsOnTable.map((users: any) => {
          return ServiceMarkPaid(users.id);
        });

        try {
          await Promise.all(fetchAll);
          success = true;
          this.msg = `Updated ${_selectedRowsOnTable.length} records` as string;
        } catch (err) {
          this.error = err as any;
          console.log(err, "Error on pay dues");
        } finally {
          this.activityIndicator = false;
          if (success) {
            await this.fetchData();
          }
        }
      }
    },
    async fetchData() {
      this.tableLoader = true;
      const data = await ServiceFetchData();

      if (!data) {
        this.tableData = [];
        this.totalTabDescription = "Unable to load Data";
        return;
      }

      this.tableData = data;
      // calculate total
      let totalPaid = 0;
      for (let i = 0; i < data.length; i++) {
        totalPaid = totalPaid + data[i].amountInCents;
      }
      this.totalSum = totalPaid;
      this.totalTabDescription = `Total payable amount: ${this.totalSum} USD`;
      this.tableLoader = false;
    },
  },

  computed: {
    computedData() {
      const data: any = this.tableData;
      const selectedTab: string = this.selectedTab.toLocaleLowerCase() ?? "";
      const selectedSortKey: string | number = this.selectedSortKey.toString();
      const result = data.filter((items: any) => {
        return (
          items.paymentStatus.toLocaleLowerCase().match(selectedTab) &&
          (items.firstName.toLocaleLowerCase().match(this.searchKey) ||
            items.lastName.toLocaleLowerCase().match(this.searchKey) ||
            items.email.toLocaleLowerCase().match(this.searchKey))
        );
      });

      const sortedResult = result.sort(
        (a: { [x: string]: any }, b: { [x: string]: any }) =>
          (a[selectedSortKey] || "")
            .toString()
            .localeCompare((b[selectedSortKey] || "").toString())
      );
      return sortedResult;
    },
  },

  async mounted() {
    await this.fetchData();
  },

  watch: {
    msg() {
      setTimeout(() => {
        this.msg = "";
      }, 10000);
    },
  },
});
</script>

