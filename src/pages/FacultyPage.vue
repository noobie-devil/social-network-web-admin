<script setup>
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue';

    import useFacultyStore from '@/stores/facultyStore.js';
    import TableWithActions from '@/components/TableWithActions.vue';
    import { translate } from '@/locales/translator.js';
    import CardStatisticsVertical from '@/components/CardStatisticsVertical.vue';
    import MajorPage from './MajorPage.vue';
    import { basicRules } from '@/utils/validation.js';
    import useFilterStore from '@/stores/filterStore';

    const facultyStore = useFacultyStore();
    const { faculties, totalItems, loading } = storeToRefs(facultyStore);

    const addForm = ref(null);
    const editForm = ref(null);
    const formRules = ref(basicRules);
    const faculty = ref(null);
    const name = ref(null);
    const code = ref(null);

    const filterStore = useFilterStore();
    filterStore.setFilters([]);

    // for developing without real backend
    const totalStats = [
        {
            label: 'faculty',
            value: '100.000',
            direction: 'up',
            percent: '+24%',
            time: 'then week ago',
        },
        {
            label: 'major',
            value: '1.000.000',
            direction: 'up',
            percent: '+80%',
            time: 'then week ago',
        },
    ];

    const facultyHeaders = [
        {
            key: 'id',
            title: translate('id'),
            align: 'center',
        },
        {
            key: 'name',
            title: translate('name'),
            align: 'center',
        },
        {
            key: 'code',
            title: translate('code'),
            align: 'center',
        },
        {
            key: 'actions',
            title: translate('action'),
            align: 'center',
        },
    ];

    const addItem = async () => {
        if ((await addForm.value.validate()).valid) {
            await facultyStore.addItem({
                name: name.value,
                code: code.value,
            });

            name.value = null;
            code.value = null;
        }
    };

    const editItem = async (item) => {
        if ((await editForm.value.validate()).valid) {
            await facultyStore.editItem(item);
        }
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
        :headers="facultyHeaders"
        :items="faculties"
        :loading="loading"
        :itemsLength="totalItems"
        @addItem="addItem"
        @deleteItem="facultyStore.deleteItem"
        @deleteItems="facultyStore.deleteItems"
        @editItem="editItem"
        @update-options="facultyStore.getItems"
        @clickRow="(it) => (faculty = it)"
        showModalOnClickRow
        hideModalActions
    >
        <template #add>
            <VContainer>
                <VForm ref="addForm">
                    <VRow>
                        <VCol cols="12">
                            <VTextField
                                type="email"
                                :label="translate('name')"
                                v-model.trim="name"
                                :rules="formRules"
                            />
                        </VCol>
                        <VCol cols="12">
                            <VTextField :label="translate('abbreviation')" v-model.trim="code" :rules="formRules" />
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
                            <VTextField
                                type="email"
                                :label="translate('name')"
                                v-model.trim="item.name"
                                :rules="formRules"
                            />
                        </VCol>
                        <VCol cols="12">
                            <VTextField :label="translate('code')" v-model.trim="item.code" :rules="formRules" />
                        </VCol>
                    </VRow>
                </VForm>
            </VContainer>
        </template>

        <template #modal>
            <MajorPage :faculty="faculty" />
        </template>
    </TableWithActions>
</template>
