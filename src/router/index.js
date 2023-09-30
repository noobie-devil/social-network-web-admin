import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '@/layouts/MainLayout.vue'
import NavbarLayout from '@/layouts/NavbarLayout.vue'
import EmptyLayout from '@/layouts/EmptyLayout.vue'

import useAuthStore from '@/stores/authStore.js'
import DashboardPage from '@/pages/DashboardPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import UserManagementPage from '@/pages/UserManagementPage.vue'
import SchoolYearManagementPage from '@/pages/SchoolYearManagementPage.vue'
import FacultyPage from '@/pages/FacultyPage.vue'
import AuditPostPage from '@/pages/AuditPostPage.vue'
import AuditAccountPage from '@/pages/AuditAccountPage.vue'
import PostViolationPage from '@/pages/PostViolationPage.vue'
import AccountViolationPage from '@/pages/AccountViolationPage.vue'
import AdminManagementPage from '@/pages/AdminManagementPage.vue'

export const routes = [
    {
        path: '/login',
        name: 'login',
        component: LoginPage,
        meta: {
            layout: EmptyLayout,
        },
    },
    {
        path: '/',
        name: 'dashboard',
        component: DashboardPage,
        meta: {
            layout: MainLayout,
        },
    },
    {
        path: '/users/manage',
        name: 'userManagement',
        component: UserManagementPage,
        meta: {
            layout: MainLayout,
        },
    },
    {
        path: '/school-years/manage',
        name: 'schoolYear',
        component: SchoolYearManagementPage,
        meta: {
            layout: MainLayout,
        },
    },
    {
        path: '/faculties/manage',
        name: 'faculty',
        component: FacultyPage,
        meta: {
            layout: MainLayout,
        },
    },
    {
        path: '/admins/manage',
        name: 'adminManagement',
        component: AdminManagementPage,
        meta: {
            layout: MainLayout,
        },
    },
    {
        path: '/audit/post',
        name: 'auditPost',
        component: AuditPostPage,
        meta: {
            layout: MainLayout,
        },
    },
    {
        path: '/audit/account',
        name: 'auditAccount',
        component: AuditAccountPage,
        meta: {
            layout: MainLayout,
        },
    },
    {
        path: '/report/post',
        name: 'reportPost',
        component: PostViolationPage,
        meta: {
            layout: MainLayout,
        },
    },
    {
        path: '/report/account',
        name: 'reportAccount',
        component: AccountViolationPage,
        meta: {
            layout: MainLayout,
        },
    },
    {
        path: '/:catchAll(.*)',
        name: 'notFound',
        component: NotFoundPage,
        meta: {
            layout: NavbarLayout,
        },
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior: () => {
        return { top: 0 }
    },
    routes
})
router.beforeEach((to, from, next) => {
    const store = useAuthStore()

    if (store.loggedIn && to.name === 'login') {
        next({ name: 'dashboard' })
    } else if (!store.loggedIn && to.name !== 'login') {
        next({ name: 'login' })
    } else {
        next()
    }
})

export default router
