<template>
  <div class="service-table-container">
    <!-- Month Navigator -->
    <div class="v-sheet v-theme--light rounded-md pa-8 pb-6">
      <div class="month-navigator">
        <button
          @click="previousMonth"
          class="v-btn v-btn--flat v-theme--light bg-primary rounded-pill v-btn--variant-elevated px-3 btn nav-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"
            ></path>
          </svg>
        </button>
        <h2 class="current-month" style="font-weight: 600; line-height: 32px">
          {{ formatMonth(currentMonth) }}
        </h2>
        <button
          @click="nextMonth"
          class="v-btn v-btn--flat v-theme--light bg-primary rounded-pill v-btn--variant-elevated px-3 btn nav-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="v-sheet v-theme--light rounded-md d-flex flex-column gr-8 px-8 py-8">
      <div
        class="v-table v-table--fixed-height v-table--has-top v-table--has-bottom v-theme--light v-table--density-default v-data-table table text-body-2 text-grey1"
      >
        <div class="v-table__wrapper" style="max-height: 530px">
          <table class="service-table">
            <thead>
              <tr>
                <th v-for="(header, index) in tableHeaders" :key="index">
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="tableData.length === 0">
                <td :colspan="tableHeaders.length" class="no-data-cell">
                  <div class="no-data-content">No services has been redeemed</div>
                </td>
              </tr>

              <template v-else v-for="(row, index) in tableData" :key="index">
                <tr
                  @click="toggleRowExpansion(index)"
                  :class="{ expanded: expandedRow === index }"
                  class="table-row"
                >
                  <td class="icon-cell">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      :class="{ rotated: expandedRow === index }"
                      class="chevron-icon"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </td>
                  <td>{{ row.serviceName }}</td>
                  <td>{{ row.date }}</td>
                  <td>{{ row.petOwner }}</td>
                  <td>{{ row.membershipId }}</td>
                  <td>{{ row.vetName }}</td>
                </tr>
                <tr v-if="expandedRow === index" class="expanded-row">
                  <td colspan="6">
                    <div class="notes-section">
                      <h4>Notes:</h4>
                      <p>{{ row.notes }}</p>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination pa-8">
      <button
        @click="previousPage"
        :disabled="currentPage === 1"
        class="v-btn v-btn--flat v-theme--light bg-primary rounded-pill v-btn--variant-elevated px-3 btn nav-button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"
          ></path>
        </svg>
      </button>
      <span class="page-info"> Page {{ currentPage }} of {{ totalPages }} </span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="v-btn v-btn--flat v-theme--light bg-primary rounded-pill v-btn--variant-elevated px-3 btn nav-button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"
          ></path>
        </svg>
      </button>
    </div>

    <!-- Export Button -->
    <div class="export-section pa-8">
      <button
        @click="exportToPDF"
        class="v-btn v-btn--flat v-theme--light bg-primary rounded-pill v-btn--variant-elevated px-3 btn"
      >
        Export to PDF
      </button>
    </div>
    <div class="important-section">

      <div class="important-card">
        <div class="important-title">Important</div>
        <div class="important-content">Please send your Services Log Sheet along <br/>
        with TAX invoice to <a href="mailto:accounts@smoll.me" class="contact-us-link">accounts@smoll.me</a></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useSmollcareStore } from "@/stores/smollcare";

const smollcareStore = useSmollcareStore();

const tableHeaders = [
  "", // for the first blank <th>
  "Service Name",
  "Date",
  "Pet Owner",
  "Membership ID",
  "Vet Name",
];

const currentMonth = ref(new Date());
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const tableData = ref([]);
const expandedRow = ref(null);

const monthValue = computed(() => currentMonth.value.getMonth() + 1);
const yearValue = computed(() => currentMonth.value.getFullYear());
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value) || 1);

const formatMonth = (date) =>
  date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

const fetchServiceData = async (page = currentPage.value) => {
  try {
    const response = await smollcareStore.getBenefitUsage({
      month: monthValue.value,
      year: yearValue.value,
      page,
      limit: pageSize.value,
    });

    if (response?.data) {
      tableData.value = response.data.map((item, index) => ({
        id: index + 1,
        serviceName: item.serviceName,
        date: new Date(item.date).toLocaleDateString(),
        petOwner: item.petOwner,
        membershipId: item.membershipId,
        vetName: item.vetName,
        notes: item.note || "No notes",
      }));

      totalItems.value = response.count || 0;
      currentPage.value = response.currentPage || 1;
    }
  } catch (err) {
    console.error("Error fetching service data:", err);
  }
};

const updatePage = (newPage) => {
  currentPage.value = newPage;
  expandedRow.value = null;
  fetchServiceData(newPage);
};

const updateMonth = (offset) => {
  const updated = new Date(currentMonth.value.getTime());
  updated.setDate(1); // Prevent overflow on month change
  updated.setMonth(updated.getMonth() + offset);
  currentMonth.value = updated;
  currentPage.value = 1;
  expandedRow.value = null;
  fetchServiceData(1);
};

const previousPage = () => {
  if (currentPage.value > 1) updatePage(currentPage.value - 1);
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) updatePage(currentPage.value + 1);
};

const previousMonth = () => updateMonth(-1);
const nextMonth = () => updateMonth(1);

const toggleRowExpansion = (index) => {
  expandedRow.value = expandedRow.value === index ? null : index;
};

const exportToPDF = async () => {
  try {
    const response = await smollcareStore.exportBenefitUsagePDF({
      month: monthValue.value,
      year: yearValue.value,
      page: currentPage.value,
      limit: pageSize.value,
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `benefit-usage-${monthValue.value}-${yearValue.value}-page-${currentPage.value}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Failed to export PDF:", error);
  }
};

onMounted(() => {
  fetchServiceData();
});
</script>

<style scoped>
.service-table-container {
  max-width: 1104px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.no-data-cell {
  padding: 120px !important;
}

.no-data-content {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
}

.month-navigator {
  display: flex;
  align-items: center;
  gap: 40px;
}

.nav-button {
  background: #000;
  color: #fff;
  border: none !important;
  padding: 0 !important;
  width: 30px;
  height: 30px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}
.nav-button svg {
  width: 24px;
  height: 24px;
}

.table-container {
  overflow-x: auto;
  line-height: 1.5;
  max-width: 100%;
  display: flex;
  flex-direction: column;
}
.service-table {
  width: 100%;
  border-spacing: 0;
}

.table-row:hover {
  background: #f8f8f8;
}

.table-row.expanded {
  background: #f0f0f0;
}

.table-row td {
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  font-size: 14px;
  color: #333;
}

.expanded-row {
  background: #f9f9f9;
}

.expanded-row td {
  border-bottom: 2px solid #ddd;
}

.notes-section {
  padding: 15px;
}

.notes-section h4 {
  margin: 0 0 10px 0;
  color: #000;
  font-size: 16px;
  font-weight: 600;
}

.notes-section p {
  margin: 0;
  color: #555;
  line-height: 1.5;
  font-size: 14px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
}

.pagination-button {
  background: #fff;
  color: #000;
  border: 2px solid #000;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.pagination .nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: #ccc;
  color: #ccc;
}

.page-info {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.export-section {
  padding: 30px;
}

.export-section button {
  color: #fff;
  padding: 10px 20px !important;
  font-size: 12px;
  font-weight: 600;
}

.export-button:hover {
  background: #333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.important-section{
  padding: 30px;
}

.important-card{
  background: #f8f8f8;
  border-radius: 20px;
  padding: 16px 24px ;
  display: flex;
  max-width: 500px;
  width: 100%;
  flex-direction: column;
}

.important-title{
  font-size: 28px;
  font-weight: bold;
  padding-bottom: 3px;
}

.contact-us-link {
  color: black;
  font-weight: bold;
  text-decoration: none;
}

.icon-cell {
  width: 24px;
  text-align: center;
  cursor: pointer;
}

.chevron-icon {
  transition: transform 0.3s ease;
  width: 16px;
  height: 16px;
}

.chevron-icon.rotated {
  transform: rotate(180deg);
}

/* Responsive Design */
@media (max-width: 768px) {
  .service-table-container {
    padding: 10px;
  }

  .month-navigator {
    flex-direction: column;
    gap: 15px;
  }

  .month-navigator .current-month {
    order: -1;
    font-size: 20px;
  }

  .month-navigator .nav-button {
    width: 120px;
  }

  .service-table {
    font-size: 12px;

    thead th,
    .service-table thead th,
    .service-table tbody td {
    }
  }

  .important-title{
    font-size: 20px;
  }
  .important-content,
  .important-desc{
    font-size: 14px;
  }

  .important-card br {
    display: none;
  }

  .pagination {
    flex-direction: column;
    gap: 10px;
  }

  .pagination .page-info {
    order: -1;
  }
}

@media (max-width: 480px) {
  .table-container {
    margin: 0 -10px;
  }

  .service-table thead th,
  .service-table tbody td {
    padding: 6px;
    font-size: 11px;
  }

  .export-button {
    width: 100%;
    padding: 12px;
  }
}
</style>
