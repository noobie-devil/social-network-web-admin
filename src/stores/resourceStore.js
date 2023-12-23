import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { GET, DELETE, POST, PUT } from '@/utils/http.js'
import { toastError, toastSuccess } from '@/utils/toast'
import useAdminActivityStore from './adminActivityStore'

const useResourceStore = defineStore('resourceStore', () => {
    const resources = ref([])
    const error = ref(null)
    const loading = ref(false)
    const totalItems = ref(0)
    const path = '/permission/resource'
    const adminActivityStore = useAdminActivityStore()

    const getItems = async ({ page = 1, itemsPerPage = 10, sortBy = [{ key: 'id', order: 'desc' }], search = '' }) => {
        loading.value = true

        const params = {
            // _sort: sortBy[0].key,
            // _order: sortBy[0].order,
            page: page,
            limit: Math.max(itemsPerPage, 0),
            search
        }

        const { error: err, data } = await GET(path, { params })
        console.log(data)

        if (err) {
            error.value = err.message
            toastError(err.message)
        } else {
            error.value = null
            // resources.value = enrollmentYears
            // totalItems.value = totalCount
        }

        loading.value = false
    }

    const addItem = async (item) => {
        loading.value = true
        const { error: err, data } = await POST(path, item)

        if (err) {
            error.value = err.message
            toastError(err.message)
        } else {
            toastSuccess('Create new school year successfully')
            error.value = null
            resources.value.unshift(data)
            totalItems.value++
            await adminActivityStore.addItem({ activityType: 'Add new school year', targetId: data.id })
        }

        loading.value = false
    }

    const editItem = async (item) => {
        loading.value = true
        const { error: err, data } = await PUT(`${path}/${item._id}`, {
            name: item.name,
            startYear: +item.startYear
        })

        if (err) {
            error.value = err.message
            toastError(err.message)
        } else {
            toastSuccess('Edit school year successfully')
            error.value = null
            const foundIndex = resources.value.findIndex((x) => x._id == item._id)
            resources.value[foundIndex] = data
            await adminActivityStore.addItem({ activityType: 'Edit school year', targetId: data.id })
        }

        loading.value = false
    }

    const deleteItems = async (items) => {
        for (let id of items) {
            await deleteItem({ id })
        }
    }

    const deleteItem = async (item) => {
        loading.value = true
        const { error: err } = await DELETE(`${path}/${item._id}`)

        if (err) {
            error.value = err.message
            toastError(err.message)
        } else {
            toastSuccess('Delete school year successfully')
            error.value = null
            resources.value = resources.value.filter((it) => it._id !== item._id)
            totalItems.value--
            await adminActivityStore.addItem({ activityType: 'Delete school year', targetId: item._id })
        }

        loading.value = false
    }

    const resourceNames = computed(() => {
        return resources.value.map(it => it.name)
    })

    return {
        resources,
        error,
        loading,
        totalItems,
        resourceNames,
        getItems,
        addItem,
        editItem,
        deleteItem,
        deleteItems,
    }
})

export default useResourceStore
