<template>
    <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <!-- <Button :label="$t('worker.detail.new_button')" icon="pi pi-plus" class="p-button-success mr-2"
                      @click="openNew"/> -->
              <Button :label="$t('worker.detail.delete_choices_button')" icon="pi pi-trash" class="p-button-danger"
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
            {{$t('worker.table.loading')}}
          </template>
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">{{ $t('worker.list.header') }}</h5>
            </div>
            <div class="my-2">
              <div class="flex">
                <div class="col-6">

                  <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-search"></i>
                    </span>
                    <InputText id="search" v-model.trim="params.search" autofocus
                               :placeholder="$t('worker.list.filter.search')"
                               @input="fetch_list"
                    />
                  </div>

                </div>
              </div>

            </div>
          </template>

          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column field="id" :header="$t('worker.table.id')" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">{{ $t('group.table.id') }}</span>
              {{ slotProps.data.id }}
            </template>
          </Column>

          <Column field="number" :header=" $t('worker.table.name') " :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">{{ $t('worker.table.name') }}</span>
              {{ slotProps.data.name }}
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

        <Dialog v-model:visible="itemDialog" :style="{ width: '800px' }" :header="$t('worker.detail.header')"
                :modal="true"
                class="p-fluid">

          <div class="field">
            <label for="name">{{ $t('worker.detail.name') }}</label>
            <InputText id="name" v-model.trim="item.name" required="true" autofocus/>
          </div>
          <div v-if="!item.user.id">
            <div class="field">
                <label for="username">{{ $t('worker.detail.username') }}</label>
                <InputText id="username" v-model.trim="item.user.username" required="true" autofocus/>
            </div>

            <div class="field">
                <label for="phone">{{ $t('worker.detail.phone') }}</label>
                <InputMask id="phone" v-model="item.user.phone"
                             class="p-inputmask" placeholder="+7(999) 999 99 99"
                             mask="+7(999) 999 99 99"
                  />
            </div>

            <div class="field">
                <label for="password1">{{ $t('worker.detail.password1') }}</label>
                <Password id="password1" v-model="item.user.password1" toggleMask>
                  <template #header>
                    <h6>{{ $t('worker.detail.Password') }}</h6>
                  </template>
                  <template #footer="sp">
                    {{ sp.level }}
                    <Divider/>
                    <p class="mt-2">{{ $t('worker.detail.password_suggestions') }}</p>
                    <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                      <li>{{ $t('worker.detail.password_one_lowercase') }}</li>
                      <li>{{ $t('worker.detail.password_one_uppercase') }}</li>
                      <li>{{ $t('worker.detail.password_one_numeric') }}</li>
                      <li>{{ $t('worker.detail.password_8_chars') }}</li>
                    </ul>
                  </template>
                </Password>
            </div>

            <div class="field">
                <label for="password2">{{ $t('worker.detail.password2') }}</label>
                <Password id="password2" v-model="item.user.password2" toggleMask :feedback="false"></Password>
            </div>
        </div>
          

          <div v-if="item.user.id" class="field">
            <label for="name">{{ $t('worker.detail.permissions') }}</label>
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

          <div v-if="item.user.id" class="field">
            <label for="name">{{ $t('worker.detail.permission_groups') }}</label>
            <PickList :modelValue="picklist_permission_groups" dataKey="permission" listStyle="height:300px"
            :showTargetControls="false" :showSourceControls="false" 
            @move-to-target="move_to_target_groups" @move-all-to-target="move_to_target_groups"
            @move-to-source="move_to_source_groups" @move-all-to-source="move_to_source_groups"
            >
                <template #item="slotProps">
                    <div class="p-caritem">
                        {{slotProps.item.group.name}}
                    </div>
                </template>
            </PickList>
          </div>

          <template #footer>
            <Button :label="$t('worker.detail.cancel') " icon="pi pi-times" class="p-button-text"
                    @click="hideDialog"/>
            <Button :label="$t('worker.detail.save') " icon="pi pi-check" class="p-button-text"
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
    name: 'User',
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
      picklist_permission_groups: [[], []],
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
            const r = await axios.post(`/api/v1.1/business/${localStorage.getItem('org')}/permission/user/${this.item.user.username}/`, {
                permission: item.permission.id, type: item.type.slug,
            })
            item.id = r.data.id
            this.picklist_permissions[1].push(item)
            this.picklist_permissions[0].splice(this.picklist_permissions[0].indexOf(item), 1)
        }
    },
    async move_to_source(e) {
        for (let item of e.items) {
            await axios.delete(`/api/v1.1/business/${localStorage.getItem('org')}/permission/user/${this.item.user.username}/${item.id}/`)
            this.picklist_permissions[0].push(item)
            this.picklist_permissions[1].splice(this.picklist_permissions[1].indexOf(item), 1)
        }
    },  
    async move_to_target_groups(e) {
        for (let item of e.items) {
            const r = await axios.post(`/api/v1.1/business/${localStorage.getItem('org')}/permission/group/user/${this.item.user.username}/`, 
            {group: item.group.id})
            item.id = r.data.id
            this.picklist_permission_groups[1].push(item)
            this.picklist_permission_groups[0].splice(this.picklist_permission_groups[0].indexOf(item), 1)
        }
    },
    async move_to_source_groups(e) {
        for (let item of e.items) {
            await axios.delete(`/api/v1.1/business/${localStorage.getItem('org')}/permission/group/user/${this.item.user.username}/${item.id}/`)
            this.picklist_permission_groups[0].push(item)
            this.picklist_permission_groups[1].splice(this.picklist_permission_groups[1].indexOf(item), 1)
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
    async fetch_group_permissions() {
        const r = await axios.get(`/api/v1.1/business/${localStorage.getItem('org')}/permission/group/`, {params: {not_paginate: 1}})
        const ip_ids = this.picklist_permission_groups[1].reduce((a, v) => [...a, v.id], [])
        const perms = []
        for (let p of r.data) {
            if (!ip_ids.includes(p.id)) {
                perms.push({
                    group: p
                }) 
            }

        }
        this.picklist_permission_groups[0] = perms
    },
    async fetch_levels() {
        const r = await axios.get(`/api/v1.1/business/${localStorage.getItem('org')}/permission/level/`)
        this.levels = r.data
    },
    async fetch_list() {
      this.loading = true
      const r = await axios.get(`/api/v1.1/business/${localStorage.getItem('org')}/worker/`, {
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
    async fetch_id_permissions(username) {
        const r = await axios.get(`/api/v1.1/business/${localStorage.getItem('org')}/permission/user/${username}/`)
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
    async fetch_id_group_permissions() {
        const r = await axios.get(`/api/v1.1/business/${localStorage.getItem('org')}/permission/group/user/${this.item.user.username}/`)
        this.picklist_permission_groups[1] = r.data
    },  
    async fetch_id(id) {
      const r = await axios.get(`/api/v1.1/business/${localStorage.getItem('org')}/worker/${id}/`)
      this.item = r.data
      if (!this.item.user) {
        this.item.user = {}
      }
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
      if (editProduct.user && editProduct.user.id) {
        await this.fetch_id_permissions(editProduct.user.username)
        await this.fetch_id_group_permissions(editProduct.user.username)
        await this.fetch_permissions()
        await this.fetch_group_permissions()
      }
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
      try {
        if (!data.user.id) {
            const user = {
                username: data.user.username,
                password1: data.user.password1,
                password2: data.user.password2
            }
            if (data.user.phone != '') {
                user.phone = data.user.phone
            }
            console.log(user);
            await axios.post(`/api/v1.1/business/${localStorage.getItem('org')}/worker/${data.id}/user/`, user)
        }
        delete data.user
        await axios.patch(`/api/v1.1/business/${localStorage.getItem('org')}/worker/${data.id}/`, data)
        await this.fetch_list()
        this.hideDialog()
      } catch (e) {}
    },
    async deleteItem() {
      await axios.delete(`/api/v1.1/business/${localStorage.getItem('org')}/worker/${this.item.id}`)
      await this.fetch_list()
      this.deleteItemDialog = false
    },
    async deleteSelectedItems() {
      const ids = []
      for (let v of this.selectedItems) {
        ids.push(v.id)
      }
      await axios.delete(`/api/v1.1/business/${localStorage.getItem('org')}/worker/`, {
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