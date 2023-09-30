<script setup>
    import SidebarItem from './SidebarItem.vue';
    import SidebarItemHeader from './SidebarItemHeader.vue';
    import { translate } from '@/locales/translator';
    import useSidebarStore from '@/stores/sidebarStore';

    const items = [
        { title: 'dashboard', activeValue: 'dashboard', icon: 'mdi-home', route: 'dashboard' },
        { header: 'management' },
        {
            title: 'user',
            activeValue: 'user-management',
            icon: 'mdi-account-multiple',
            route: 'userManagement',
        },
        {
            title: 'schoolYear',
            activeValue: 'school-year',
            icon: 'mdi-calendar',
            route: 'schoolYear',
        },
        {
            title: 'faculty',
            activeValue: 'faculty',
            icon: 'mdi-domain',
            route: 'faculty',
        },
        {
            title: 'admin',
            activeValue: 'admin',
            icon: 'mdi-card-account-details-star',
            route: 'adminManagement',
        },
        { header: 'audit' },
        { title: 'post', activeValue: 'audit-post', icon: 'mdi-note-text', route: 'auditPost' },
        {
            title: 'signup-account',
            activeValue: 'audit-signup-account',
            icon: 'mdi-account-plus',
            route: 'auditAccount',
        },
        { header: 'report-violation' },
        { title: 'post', activeValue: 'report-violation-post', icon: 'mdi-note-remove', route: 'reportPost' },
        {
            title: 'account',
            activeValue: 'report-violation-account',
            icon: 'mdi-account-alert',
            route: 'reportAccount',
        },
    ];

    const store = useSidebarStore();
</script>

<template>
    <VNavigationDrawer
        v-model="store.isShowingSidebar"
        class="sidebar"
        :expand-on-hover="store.expandOnHover"
        :rail="store.expandOnHover"
        rail-width="65"
    >
        <VList density="compact" nav class="pl-4 py-4 pr-0">
            <template v-for="item in items" :key="item">
                <SidebarItemHeader v-if="item.header" :title="translate(`${item.header}`)" />
                <SidebarItem
                    v-if="!item.header"
                    :title="translate(`${item.title}`)"
                    :value="`${item.activeValue}`"
                    :icon="`${item.icon}`"
                    :route="`${item.route}`"
                />
            </template>
        </VList>
    </VNavigationDrawer>
</template>

<style lang="scss">
    @import '@/assets/base.css';

    .sidebar {
        position: fixed !important;
        top: var(--navbar-height);
        left: 0;
        overflow-y: scroll;
    }
</style>
