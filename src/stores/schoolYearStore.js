import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { GET, DELETE, POST, PATCH } from '@/utils/http.js'
import { toastError, toastSuccess } from '@/utils/toast'
import useAdminActivityStore from './adminActivityStore'

const useSchoolYearStore = defineStore('schoolYearStore', () => {
    const schoolYears = ref([])
    const error = ref(null)
    const loading = ref(false)
    const totalItems = ref(0)
    const path = '/school-years'
    const adminActivityStore = useAdminActivityStore()

    const getItems = async ({ page = 1, itemsPerPage = 10, sortBy = [{ key: 'id', order: 'desc' }], search = '' }) => {
        loading.value = true

        const params = {
            _sort: sortBy[0].key,
            _order: sortBy[0].order,
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
            schoolYears.value = data
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
            toastSuccess('Create new school year successfully')
            error.value = null
            schoolYears.value.unshift(data)
            totalItems.value++
            await adminActivityStore.addItem({ activityType: 'Add new school year', targetId: data.id })
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
            toastSuccess('Edit school year successfully')
            error.value = null
            const foundIndex = schoolYears.value.findIndex((x) => x.id == item.id)
            schoolYears.value[foundIndex] = data
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
        const { error: err } = await DELETE(`${path}/${item.id}`)

        if (err) {
            error.value = err.message
            toastError(err.message)
        } else {
            toastSuccess('Delete school year successfully')
            error.value = null
            schoolYears.value = schoolYears.value.filter((it) => it.id !== item.id)
            totalItems.value--
            await adminActivityStore.addItem({ activityType: 'Delete school year', targetId: item.id })
        }

        loading.value = false
    }

    const schoolYearNames = computed(() => {
        return schoolYears.value.map(it => it.name)
    })

    return {
        schoolYears,
        error,
        loading,
        totalItems,
        schoolYearNames,
        getItems,
        addItem,
        editItem,
        deleteItem,
        deleteItems,
    }
})

export default useSchoolYearStore
