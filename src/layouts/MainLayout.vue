<script setup>
    import AppNavbar from './components/AppNavbar.vue';
    import AppSidebar from './components/AppSidebar.vue';
</script>
<template>
    <AppNavbar />
    <AppSidebar />
    <slot></slot>
</template>
