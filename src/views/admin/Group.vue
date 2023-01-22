<template>
    <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button :label="$t('group.detail.new_button')" icon="pi pi-plus" class="p-button-success mr-2"
                      @click="openNew"/>
              <Button :label="$t('group.detail.delete_choices_button')" icon="pi pi-trash" class="p-button-danger"
                      @click="confirmDeleteSelected"
                      :disabled="!selectedItems || !selectedItems.length"/>
            </div>
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
            {{$t('group.table.loading')}}
          </template>
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">{{ $t('group.list.header') }}</h5>
            </div>
            <div class="my-2">
              <div class="flex">
                <div class="col-6">

                  <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-search"></i>
                    </span>
                    <InputText id="search" v-model.trim="params.search" autofocus
                               :placeholder="$t('group.list.filter.search')"
                               @input="fetch_list"
                    />
                  </div>

                </div>
              </div>

            </div>
          </template>

          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column field="id" :header="$t('group.table.id')" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">{{ $t('group.table.id') }}</span>
              {{ slotProps.data.id }}
            </template>
          </Column>

          <Column field="number" :header=" $t('group.table.name') " :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">{{ $t('group.table.name') }}</span>
              {{ slotProps.data.name }}
            </template>
          </Column>

          <!-- <Column field="name" :header="$t('group.table.level')" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">{{ $t('group.table.level') }}</span>
              {{ slotProps.data.level.name }}
            </template>
          </Column> -->

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

        <Dialog v-model:visible="itemDialog" :style="{ width: '800px' }" :header="$t('group.detail.header')"
                :modal="true"
                class="p-fluid">

          <div class="field">
            <label for="name">{{ $t('group.detail.name') }}</label>
            <InputText id="name" v-model.trim="item.name" required="true" autofocus/>
          </div>
<!-- 
          <div class="field">
            <label for="level">{{ $t('group.detail.level') }}</label>
            <Dropdown required="true" id="level" v-model="item.level.id" :options="levels.results"
                      optionLabel="name" optionValue="id"
                      :placeholder="$t('group.detail.level_placeholder') "/>
          </div> -->

          <div v-if="item.id" class="field">
            <label for="level">{{ $t('group.detail.level') }}</label>
            <PickList :modelValue="picklist_permissions" dataKey="permission" listStyle="height:300px"
            :showTargetControls="false" :showSourceControls="false" 
            @move-to-target="move_to_target" @move-all-to-target="move_to_target"
            @move-to-source="move_to_source" @move-all-to-source="move_to_source"
            >
                <template #item="slotProps">
                    <div class="p-caritem">
                        {{slotProps.item.permission.name}} ({{ slotProps.item.type.name }})
                    </div>
                </template>
            </PickList>
          </div>

          <template #footer>
            <Button :label="$t('group.detail.cancel') " icon="pi pi-times" class="p-button-text"
                    @click="hideDialog"/>
            <Button :label="$t('group.detail.save') " icon="pi pi-check" class="p-button-text"
                    @click="() => saveItem()"/>
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteItemDialog" :style="{ width: '450px' }"
                :header="$t('group.delete.header')" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="item"
            >{{ $t('group.delete.text') }} <b>{{ item.name }}</b
            >?</span
            >
          </div>
          <template #footer>
            <Button :label="$t('group.delete.no')"
                    icon="pi pi-times" class="p-button-text"
                    @click="deleteItemDialog = false"/>
            <Button :label="$t('group.delete.yes')"
                    icon="pi pi-check" class="p-button-text"
                    @click="deleteItem"/>
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteItemsDialog" :style="{ width: '450px' }"
                :header="$t('group.deletes.header')" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="item">{{ $t('group.deletes.text') }}</span>
          </div>
          <template #footer>
            <Button :label="$t('group.deletes.no')" icon="pi pi-times" class="p-button-text"
                    @click="deleteItemsDialog = false"/>
            <Button :label="$t('group.deletes.yes')" icon="pi pi-check" class="p-button-text"
                    @click="deleteSelectedItems"/>
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>
<script>
import {FilterMatchMode} from "primevue/api";
import axios from "@/plugins/axios";

export default {
    name: 'Group',
    data() {

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
      levels: {},
      offset: 0,
      params: {},
      picklist_permissions: [[], []],
      permission_type: [
        {slug: 'read', name: this.$t('group.permission.detail.type.Read')},
        {slug: 'create', name: this.$t('group.permission.detail.type.Create')},
        {slug: 'update', name: this.$t('group.permission.detail.type.Update')},
        {slug: 'delete', name: this.$t('group.permission.detail.type.Delete')}
      ]
    }
  },
  async mounted() {
    this.initFilters()
    await this.fetch_list()
    await this.fetch_levels()
  },
  methods: {
    async move_to_target(e) {
        for (let item of e.items) {
            const r = await axios.post(`/api/v1.1/business/${localStorage.getItem('org')}/permission/group/${this.item.id}/permission/`, {
                permission: item.permission.id, type: item.type.slug,
            })
            item.id = r.data.id
            this.picklist_permissions[1].push(item)
            this.picklist_permissions[0].splice(this.picklist_permissions[0].indexOf(item), 1)
        }
    },
    async move_to_source(e) {
        for (let item of e.items) {
            await axios.delete(`/api/v1.1/business/${localStorage.getItem('org')}/permission/group/${this.item.id}/permission/${item.id}/`)
            this.picklist_permissions[0].push(item)
            this.picklist_permissions[1].splice(this.picklist_permissions[1].indexOf(item), 1)
        }
    },  
    async fetch_permissions() {
        const r = await axios.get(`/api/v1.1/business/${localStorage.getItem('org')}/permission/`)
        const ip_ids = this.picklist_permissions[1].reduce((a, v) => [...a, `${v.permission.slug}-${v.type.slug}`], [])
        const perms = []
        for (let p of r.data) {
            for (let t of this.permission_type) {
                if (!ip_ids.includes(`${p.slug}-${t.slug}`)) {
                        perms.push({
                        permission: p,
                        type: t
                    }) 
                }
            }
        }
        this.picklist_permissions[0] = perms
    },
    async fetch_levels() {
        const r = await axios.get(`/api/v1.1/business/${localStorage.getItem('org')}/permission/level/`)
        this.levels = r.data
    },
    async fetch_list() {
      this.loading = true
      const r = await axios.get(`/api/v1.1/business/${localStorage.getItem('org')}/permission/group/`, {
        params: this.params
      })
      this.items = r.data
      this.loading = false
    },
    async change_page(e) {
      this.params.offset = e.first
      this.params.limit = e.rows
      await this.fetch_list()
    },
    async fetch_id_permissions(id) {
        const r = await axios.get(`/api/v1.1/business/${localStorage.getItem('org')}/permission/group/${id}/permission/`)
        for (let gp of r.data) {
            for (let t of this.permission_type) {
                if (t.slug === gp.type) {
                    gp.type = t
                    break
                }
            }
        }
        this.picklist_permissions[1] = r.data
    },
    async fetch_id(id) {
      const r = await axios.get(`/api/v1.1/business/${localStorage.getItem('org')}/permission/group/${id}/`)
      this.item = r.data
    },
    openNew() {
      this.item = {
        level: {}
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
      await this.fetch_id(editProduct.id)
      await this.fetch_id_permissions(editProduct.id)
      await this.fetch_permissions()
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
    async saveItem() {
      const data = {...this.item}
      data.level = data.level.id

      try {
        if (!data.id) {
          await axios.post(`/api/v1.1/business/${localStorage.getItem('org')}/permission/group/`, data)
        } else {
          await axios.patch(`/api/v1.1/business/${localStorage.getItem('org')}/permission/group/${data.id}/`, data)
        }
        await this.fetch_list()
        this.hideDialog()
      } catch (e) {
      }
    },
    async deleteItem() {
      await axios.delete(`/api/v1.1/business/${localStorage.getItem('org')}/permission/group/${this.item.id}`)
      await this.fetch_list()
      this.deleteItemDialog = false
    },
    async deleteSelectedItems() {
      const ids = []
      for (let v of this.selectedItems) {
        ids.push(v.id)
      }
      await axios.delete(`/api/v1.1/business/${localStorage.getItem('org')}/permission/group/`, {
        params: {
          id: ids.join(',')
        }
      })
      await this.fetch_list()
      this.deleteItemsDialog = false
    }
  },
  computed: {}
}
</script>