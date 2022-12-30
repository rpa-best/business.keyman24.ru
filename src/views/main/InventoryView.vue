<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button :label="$t('inventory.detail.new_button')" icon="pi pi-plus" class="p-button-success mr-2"
                      @click="openNew"/>
              <Button :label="$t('inventory.detail.delete_choices_button')" icon="pi pi-trash" class="p-button-danger"
                      @click="confirmDeleteSelected"
                      :disabled="!selectedItems || !selectedItems.length"/>
            </div>
          </template>

          <template v-slot:end>
            <FileUpload mode="basic"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        label="Import" :chooseLabel="$t('inventory.list.import_button')"
                        class="mr-2 inline-block"/>
            <Button :label="$t('inventory.list.import_button')"
                    icon="pi pi-upload"
                    class="p-button-help"
                    @click="exportCSV($event)"/>
          </template>
        </Toolbar>

        <DataTable
            ref="dt"
            :value="items.results"
            v-model:selection="selectedItems"
            dataKey="id"
            :rows="10"
            :filters="filters"
            responsiveLayout="scroll"
        >
          <template #loading>
            {{$t('inventory.table.loading')}}
          </template>
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">{{ $t('inventory.list.header') }}</h5>
            </div>
            <div class="my-2">
              <div class="flex">
                <div class="col-6">

                  <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-search"></i>
                    </span>
                    <InputText id="search" v-model.trim="params.search" autofocus
                               :placeholder="$t('inventory.list.filter.search')"
                               @input="fetch_inventory_list"
                    />
                  </div>

                </div>

                <div class="col-3">
                  <Dropdown id="not_zone" v-model="params.not_zone" :options="[
                          {id: false, name: $t('inventory.list.filter.in_zone')},
                          {id: true, name: $t('inventory.list.filter.not_zone')},
                      ]"
                            optionLabel="name" optionValue="id"
                            :placeholder="$t('inventory.list.filter.zone_placeholder')"
                            @change="fetch_inventory_list"
                  />
                </div>
                <div class="col-3">
                  <div class="field-radiobutton p-1">
                    <Checkbox id="comments" name="comments"
                              v-model="params.comments"
                              @click="fetch_inventory_list"
                              :binary="true"
                    />
                    <label for="category1">{{ $t('inventory.list.filter.comments') }}</label>
                  </div>
                </div>
              </div>

            </div>
          </template>

          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column field="id" :header="$t('inventory.table.id')" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">{{ $t('inventory.table.id') }}</span>
              {{ slotProps.data.id }}
            </template>
          </Column>

          <Column field="number" :header=" $t('inventory.table.name') " :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">{{ $t('inventory.table.number') }}</span>
              {{ slotProps.data.number }}
            </template>
          </Column>

          <Column field="name" :header="$t('inventory.table.name')" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">{{ $t('inventory.table.name') }}</span>
              {{ slotProps.data.name }}
            </template>
          </Column>

          <Column field="type" :header="$t('inventory.table.type')" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">{{ $t('inventory.table.type') }}</span>
              {{ slotProps.data.type.name }}
            </template>
          </Column>

          <Column v-if="params.comments" field="comments" :header="$t('inventory.table.comments')" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">{{ $t('inventory.table.comments') }}</span>
              {{ slotProps.data.comments }}
            </template>
          </Column>

          <Column headerStyle="right: 0">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                      @click="editProduct(slotProps.data)"/>
              <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                      @click="confirmDeleteProduct(slotProps.data)"/>
            </template>
          </Column>
        </DataTable>

        <Paginator
            :first="offset"
            :rows="10"
            :totalRecords="items.count"
            @page="change_page"
        />

        <Dialog v-model:visible="itemDialog" :style="{ width: '450px' }" :header="$t('inventory.detail.header')"
                :modal="true"
                class="p-fluid">

          <div v-if="item.code_image" class="field">
            <label for="code_image">{{ $t('inventory.detail.code_image') }}</label>
            <img :src="`data:image/jpg;base64, ${item.code_image}`" :alt="item.id" class="shadow-2" width="100"/>
          </div>

          <div class="field">
            <label for="number">{{ $t('inventory.detail.number') }}</label>
            <InputText id="number" v-model.trim="item.number" required="true" autofocus/>
          </div>

          <div class="field">
            <label for="name">{{ $t('inventory.detail.name') }}</label>
            <InputText id="name" v-model.trim="item.name" required="true" autofocus
                       :class="{ 'p-invalid': submitted && v$.item.name.$invalid }"/>
            <small class="p-invalid" v-if="submitted && v$.item.name.$invalid">{{
                $t('inventory.detail.name_required')
              }}</small>
          </div>

          <div class="field">
            <label for="description">{{ $t('inventory.detail.desc') }}</label>
            <Textarea id="description" v-model="item.desc" required="true" rows="3" cols="20"/>
          </div>

          <div class="field">
            <label for="type" class="mb-3">{{ $t('inventory.detail.type') }} </label>
            <Dropdown id="type" v-model="item.type.slug" :options="inventory_types.results"
                      optionLabel="name" optionValue="slug"
                      :class="{ 'p-invalid': submitted && v$.item.type.$invalid }"
                      :placeholder="$t('inventory.detail.type_placeholder') "/>
            <small class="p-invalid" v-if="submitted && v$.item.type.$invalid">{{
                $t('inventory.detail.name_required')
              }}</small>
          </div>

          <template #footer>
            <Button :label="$t('inventory.detail.cancel') " icon="pi pi-times" class="p-button-text"
                    @click="hideDialog"/>
            <Button :label="$t('inventory.detail.save') " icon="pi pi-check" class="p-button-text"
                    @click="() => saveItem(!v$.$invalid)"/>
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteItemDialog" :style="{ width: '450px' }"
                :header="$t('inventory.delete.header')" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="item"
            >{{ $t('inventory.delete.text') }} <b>{{ item.name }}</b
            >?</span
            >
          </div>
          <template #footer>
            <Button :label="$t('inventory.delete.no')"
                    icon="pi pi-times" class="p-button-text"
                    @click="deleteItemDialog = false"/>
            <Button :label="$t('inventory.delete.yes')"
                    icon="pi pi-check" class="p-button-text"
                    @click="deleteItem"/>
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteItemsDialog" :style="{ width: '450px' }"
                :header="$t('inventory.deletes.header')" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="item">{{ $t('inventory.deletes.text') }}</span>
          </div>
          <template #footer>
            <Button :label="$t('inventory.deletes.no')" icon="pi pi-times" class="p-button-text"
                    @click="deleteItemsDialog = false"/>
            <Button :label="$t('inventory.deletes.yes')" icon="pi pi-check" class="p-button-text"
                    @click="deleteSelectedItems"/>
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {FilterMatchMode} from "primevue/api";
import {useLayout} from "@/layout/composables/layout";
import {useI18n} from "vue-i18n";
import axios from "@/plugins/axios";
import {required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export default {
  name: "InventoryView",
  setup() {
    const {t} = useI18n()
    const v$ = useVuelidate()
    return {t, v$}
  },
  data() {
    const {contextPath} = useLayout();

    return {
      loading: false,
      selectedItems: null,
      itemDialog: false,
      deleteItemDialog: false,
      deleteItemsDialog: false,
      submitted: false,
      item: {},
      items: {},
      filters: {},
      dt: null,
      offset: 0,
      inventory_types: {},
      params: {
        not_zone: false,
        comments: false,
      },
      contextPath,
    }
  },
  validations() {
    return {
      item: {
        name: {required},
        type: {required},
      }
    }
  },
  async mounted() {
    this.initFilters()
    await this.fetch_inventory_list()
    await this.fetch_inventory_type_list()
  },
  methods: {
    async fetch_inventory_type_list() {
      const r = await axios.get(`/api/v1.1/business/${localStorage.getItem('org')}/inventory/type/`)
      this.inventory_types = r.data
    },
    async fetch_inventory_list() {
      this.loading = true
      const r = await axios.get(`/api/v1.1/business/${localStorage.getItem('org')}/inventory/`, {
        params: this.params
      })
      this.items = r.data
      this.loading = false
    },
    async change_page(e) {
      this.params.offset = e.first
      this.params.limit = e.rows
      await this.fetch_inventory_list()
    },
    async fetch_inventory(id) {
      const r = await axios.get(`/api/v1.1/business/${localStorage.getItem('org')}/inventory/${id}/`)
      this.item = r.data
    },
    openNew() {
      this.item = {
        type: {}
      };
      this.submitted = false;
      this.itemDialog = true
    },
    confirmDeleteSelected() {
      this.deleteItemsDialog = true;
    },
    initFilters() {
      this.filters = {
        global: {value: null, matchMode: FilterMatchMode.CONTAINS}
      }
    },
    exportCSV() {
      alert('TODO: Export excel')
    },
    async editProduct(editProduct) {
      await this.fetch_inventory(editProduct.id)
      this.itemDialog = true;
    },
    confirmDeleteProduct(editProduct) {
      this.item = editProduct;
      this.deleteItemDialog = true;
    },
    hideDialog() {
      this.itemDialog = false;
      this.submitted = false;
    },
    async saveItem(is_valid) {
      this.submitted = true
      if (!is_valid) {
        return
      }
      const data = {...this.item}
      data.type = data.type.slug

      try {
        if (!data.id) {
          await axios.post(`/api/v1.1/business/${localStorage.getItem('org')}/inventory/`, data)
        } else {
          await axios.patch(`/api/v1.1/business/${localStorage.getItem('org')}/inventory/${data.id}/`, data)
        }
        await this.fetch_inventory_list()
        this.hideDialog()
      } catch (e) {
      }
    },
    async deleteItem() {
      await axios.delete(`/api/v1.1/business/${localStorage.getItem('org')}/inventory/${this.item.id}`)
      await this.fetch_inventory_list()
      this.deleteItemDialog = false
    },
    async deleteSelectedItems() {
      const ids = []
      for (let v of this.selectedItems) {
        ids.push(v.id)
      }
      await axios.delete(`/api/v1.1/business/${localStorage.getItem('org')}/inventory/`, {
        params: {
          id: ids.join(',')
        }
      })
      await this.fetch_inventory_list()
      this.deleteItemsDialog = false
    }
  },
  computed: {}
}
</script>

<style scoped>

</style>