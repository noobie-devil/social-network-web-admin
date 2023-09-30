import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { GET, DELETE, POST, PATCH } from '@/utils/http.js'
import { toastError, toastSuccess } from '@/utils/toast'
import useAdminActivityStore from './adminActivityStore'

const majorStore = defineStore('majorStore', () => {
    const majors = ref([])
    const error = ref(null)
    const loading = ref(false)
    const totalItems = ref(0)
    const path = '/majors'
    const faculty = ref(null)
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

        const { error: err, data, totalCount } = await GET(`${path}?faculty=${faculty.value}`, { params })

        if (err) {
            error.value = err.message
            toastError(err.message)
        } else {
            error.value = null
            majors.value = data
            totalItems.value = totalCount
        }

        loading.value = false
    }

    const addItem = async (item) => {
        loading.value = true
        const { error: err, data } = await POST(path, {
            ...item,
            faculty: Number(faculty.value),
        })

        if (err) {
            error.value = err.message
            toastError(err.message)
        } else {
            toastSuccess('Create new major successfully')
            error.value = null
            majors.value.unshift(data)
            totalItems.value++
            await adminActivityStore.addItem({ activityType: 'Add new major', targetId: data.id })
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
            toastSuccess('Edit major successfully')
            error.value = null
            const foundIndex = majors.value.findIndex((x) => x.id == item.id)
            majors.value[foundIndex] = data
            await adminActivityStore.addItem({ activityType: 'Edit major', targetId: data.id })
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
            toastSuccess('Delete major successfully')
            error.value = null
            majors.value = majors.value.filter((it) => it.id !== item.id)
            totalItems.value--
            await adminActivityStore.addItem({ activityType: 'Delete major', targetId: item.id })
        }

        loading.value = false
    }

    const majorNames = computed(() => {
        return majors.value.map(it => it.name)
    })

    return {
        majors,
        faculty,
        error,
        loading,
        totalItems,
        majorNames,
        getItems,
        addItem,
        editItem,
        deleteItem,
        deleteItems,
    }
})

export default majorStore
