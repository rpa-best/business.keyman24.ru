<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <DataTable
                    ref="dt"
                    :value="items.results"
                    dataKey="id"
                    :rows="10"
                    :filters="filters"
                    responsiveLayout="scroll"
                >
                <template #loading>
                    {{$t('device.table.loading')}}
                </template>
                <template #header>
                    <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                        <h5 class="m-0">{{ $t('device.list.header') }}</h5>
                    </div>
                    <div class="my-2">
                        <div class="flex">
                            <div class="col-6">
                                <div class="p-inputgroup">
                                    <span class="p-inputgroup-addon">
                                        <i class="pi pi-search"></i>
                                    </span>
                                    <InputText id="search" v-model.trim="params.search" autofocus
                                            :placeholder="$t('device.list.filter.search')"
                                            @input="fetch_list"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                <Column field="id" :header="$t('device.table.id')" :sortable="true">
                    <template #body="slotProps">
                    <span class="p-column-title">{{ $t('device.table.id') }}</span>
                    {{ slotProps.data.id }}
                    </template>
                </Column>

                <Column field="name" :header=" $t('device.table.name') " :sortable="true">
                    <template #body="slotProps">
                    <span class="p-column-title">{{ $t('device.table.name') }}</span>
                    {{ slotProps.data.name }}
                    </template>
                </Column>

                <Column field="type" :header=" $t('device.table.type') " :sortable="true">
                    <template #body="slotProps">
                    <span class="p-column-title">{{ $t('device.table.type') }}</span>
                    {{ slotProps.data.type }}
                    </template>
                </Column>
                </DataTable>

                <Paginator
                    :first="offset"
                    :rows="10"
                    :totalRecords="items.count"
                    @page="change_page"
                />
            </div>
        </div>
    </div>
</template>
<script>
import {FilterMatchMode} from "primevue/api";
import axios from "@/plugins/axios";

export default {
    name: 'Device',
    data() {
        return {
            items: {},
            params: {},
            offset: 0,
        }
    },
    async mounted() {
        this.initFilters()
        await this.fetch_list()
    },
    methods: {
        initFilters() {
            this.filters = {
                global: {value: null, matchMode: FilterMatchMode.CONTAINS}
            }
        },
        async fetch_list() {
            this.loading = true
            const r = await axios.get(`/api/v1.1/business/${localStorage.getItem('org')}/device/`, {
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
    }
}
</script>