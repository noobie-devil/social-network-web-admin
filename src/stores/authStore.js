import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { POST } from '@/utils/http'
import { toastError } from '@/utils/toast'

const useAuthStore = defineStore('authStore', () => {
    const user = ref(JSON.parse(localStorage.getItem('user')))
    const error = ref(null)
    const router = useRouter()
    const path = '/login'

    const loggedIn = computed(() => user.value !== null)

    const login = async ({ email, password }) => {
        const { error: err, data } = await POST(path, {
            email,
            password,
        })
        if (err) {
            error.value = err.message
            toastError(err.message)
        } else {
            error.value = null
            user.value = data?.user
            localStorage.setItem('token', data?.accessToken)
            localStorage.setItem('user', JSON.stringify(data?.user))
        }
    }

    const logout = async () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        user.value = null
        router.push({ name: 'login' })
    }

    return { user, error, loggedIn, login, logout }
})

export default useAuthStore
