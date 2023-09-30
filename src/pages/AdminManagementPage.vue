<script setup>
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue';

    import TableWithActions from '@/components/TableWithActions.vue';
    import { translate } from '@/locales/translator.js';
    import useAdminStore from '@/stores/adminStore.js';
    import CardStatisticsVertical from '@/components/CardStatisticsVertical.vue';
    import { generatePassword } from '@/utils/string';
    import { emailRules, basicRules } from '@/utils/validation.js';

    const adminStore = useAdminStore();
    const { admins, totalItems, loading } = storeToRefs(adminStore);

    const copyText = translate('copyRaw');

    const addForm = ref(null);
    const editForm = ref(null);
    const formRules = ref(basicRules);
    const _emailRules = ref(emailRules);
    const email = ref(null);
    const randomPassword = ref(null);
    const role = ref(null);
    const copyTooltipText = ref(copyText);
    const roles = ref(['sysadmin', 'serveradmin', 'processadmin', 'setdupadmin']);

    // for developing without real backend
    const totalStats = [
        {
            label: 'systemAdmin',
            value: '100.000',
            direction: 'up',
            percent: '+24%',
            time: 'then week ago',
        },
        {
            label: 'serverAdmin',
            value: '1.000.000',
            direction: 'up',
            percent: '+80%',
            time: 'then week ago',
        },
        {
            label: 'processAdmin',
            value: '100.000',
            direction: 'up',
            percent: '+24%',
            time: 'then week ago',
        },
        {
            label: 'setupAdmin',
            value: '1.000.000',
            direction: 'up',
            percent: '+80%',
            time: 'then week ago',
        },
    ];

    const adminHeaders = [
        {
            key: 'id',
            title: translate('id'),
            align: 'center',
        },
        {
            key: 'email',
            title: translate('email'),
            align: 'center',
        },
        {
            key: 'role',
            title: translate('role'),
            align: 'center',
        },
        {
            key: 'createdAt',
            title: translate('createdAt'),
            align: 'center',
        },
        {
            key: 'actions',
            title: translate('action'),
            align: 'center',
            sortable: false,
        },
    ];

    const addItem = async () => {
        if ((await addForm.value.validate()).valid) {
            await adminStore.addItem({
                email: email.value,
                role: role.value,
                password: randomPassword.value,
            });
            email.value = null;
            role.value = null;
            randomPassword.value = null;
        }
    };

    const editItem = async (item) => {
        if ((await editForm.value.validate()).valid) {
            await adminStore.editItem(item);
        }
    };

    const copyToClipboard = () => {
        let textArea = document.createElement('textarea');
        textArea.value = randomPassword.value;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        copyTooltipText.value = `${translate('copied')}!`;
    };

    let timer = null;
    const onMouseLeaveCopy = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            copyTooltipText.value = copyText;
        }, 200);
    };
</script>

<template>
    <VRow class="flex-wrap pa-4">
        <VCol cols="12" sm="6" v-for="({ label, value, direction, percent, time }, index) in totalStats" :key="index"
            ><CardStatisticsVertical
                :label="translate(label)"
                :value="value"
                :direction="direction"
                :percent="percent"
                :time="time"
        /></VCol>
    </VRow>

    <TableWithActions
        :headers="adminHeaders"
        :items="admins"
        :loading="loading"
        :itemsLength="totalItems"
        @addItem="addItem"
        @deleteItem="adminStore.deleteItem"
        @deleteItems="adminStore.deleteItems"
        @editItem="editItem"
        @update-options="adminStore.getItems"
    >
        <template #add>
            <VContainer>
                <VForm ref="addForm">
                    <VRow>
                        <VCol cols="12">
                            <VTextField
                                type="email"
                                :label="translate('email')"
                                v-model.trim="email"
                                :rules="_emailRules"
                            />
                        </VCol>
                        <VCol cols="12" class="d-flex align-center">
                            <VTextField
                                v-model.trim="randomPassword"
                                readonly
                                :label="translate('password')"
                                :rules="formRules"
                            >
                                <template #append-inner>
                                    <VTooltip :text="translate('generateRandomPassword')" location="bottom">
                                        <template #activator="{ props }">
                                            <VIcon
                                                @click="randomPassword = generatePassword()"
                                                class="mx-1"
                                                v-bind="props"
                                                >mdi-key</VIcon
                                            >
                                        </template>
                                    </VTooltip>
                                    <VTooltip
                                        :text="copyTooltipText"
                                        location="bottom"
                                        @update:modelValue="onMouseLeaveCopy"
                                    >
                                        <template #activator="{ props }">
                                            <VIcon @click="copyToClipboard" class="mx-1" v-bind="props"
                                                >mdi-content-copy</VIcon
                                            >
                                        </template>
                                    </VTooltip>
                                </template>
                            </VTextField>
                        </VCol>
                        <VCol cols="12">
                            <VSelect
                                v-model.trim="role"
                                :label="translate('role')"
                                :items="roles"
                                :rules="formRules"
                            ></VSelect>
                        </VCol>
                    </VRow>
                </VForm>
            </VContainer>
        </template>

        <template #edit="{ item }">
            <VContainer>
                <VForm ref="editForm">
                    <VRow>
                        <VCol cols="12">
                            <h2>ID: {{ item.id }}</h2>
                        </VCol>
                        <VCol cols="12">
                            <VTextField
                                :label="translate('email')"
                                v-model.trim="item.email"
                                :rules="_emailRules"
                            ></VTextField>
                        </VCol>
                        <VCol cols="12">
                            <VSelect
                                :label="translate('role')"
                                v-model.trim="item.role"
                                :items="roles"
                                :rules="formRules"
                            ></VSelect>
                        </VCol>
                    </VRow>
                </VForm>
            </VContainer>
        </template>
    </TableWithActions>
</template>
