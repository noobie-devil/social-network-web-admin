import { defineStore } from 'pinia'
import { ref } from 'vue'

import { GET, POST, PATCH, DELETE } from '@/utils/http.js'
import { toastError, toastSuccess } from '@/utils/toast'
import useAdminActivityStore from './adminActivityStore'

const useAdminStore = defineStore('adminStore', () => {
    const admins = ref([])
    const error = ref(null)
    const loading = ref(false)
    const totalItems = ref(0)
    const path = '/admins'
    const adminActivityStore = useAdminActivityStore()

    const getItems = async ({ page = 1, itemsPerPage = 10, sortBy = [{ key: 'id', order: 'desc' }], search = '' }) => {
        loading.value = true

        const params = {
            _sort: sortBy[0]?.key,
            _order: sortBy[0]?.order,
            _page: page,
            _limit: Math.max(itemsPerPage, 0),
            q: search,
        }

        const { error: err, data, totalCount } = await GET(path, { params })

        if (err) {
            error.value = err.message
            toastError(err.message)
        } else {
            error.value = null
            admins.value = data
            totalItems.value = totalCount
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
            toastSuccess('Create new admin successfully')
            error.value = null
            admins.value.unshift(data)
            totalItems.value++
            await adminActivityStore.addItem({ activityType: 'Add new admin', targetId: data.id })
        }

        loading.value = false
    }

    const editItem = async (item) => {
        loading.value = true
        const { error: err, data } = await PATCH(`${path}/${item.id}`, item)

        if (err) {
            error.value = err.message
            toastError(err.message)
        } else {
            toastSuccess('Edit admin successfully')
            error.value = null
            const foundIndex = admins.value.findIndex((x) => x.id == item.id)
            admins.value[foundIndex] = data
            await adminActivityStore.addItem({ activityType: 'Edit admin', targetId: item.id })
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
        const { error: err } = await DELETE(`${path}/${item.id}`)

        if (err) {
            error.value = err.message
            toastError(err.message)
        } else {
            toastSuccess('Delete admin successfully')
            error.value = null
            admins.value = admins.value.filter((it) => it.id !== item.id)
            totalItems.value--
            await adminActivityStore.addItem({ activityType: 'Delete admin', targetId: item.id })
        }

        loading.value = false
    }

    return {
        admins,
        error,
        loading,
        totalItems,
        getItems,
        addItem,
        editItem,
        deleteItem,
        deleteItems,
    }
})

export default useAdminStore
