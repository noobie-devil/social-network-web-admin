<script setup>
    import { storeToRefs } from 'pinia';
    import { ref, toRefs } from 'vue';

    import useMajorStore from '@/stores/majorStore.js';
    import TableWithActions from '@/components/TableWithActions.vue';
    import { translate } from '@/locales/translator.js';
    import { basicRules } from '@/utils/validation.js';
    import useFilterStore from '@/stores/filterStore';

    const props = defineProps({
        facultyId: {
            type: Number,
            required: true,
        },
    });
    const { facultyId } = toRefs(props);

    const majorStore = useMajorStore();
    const { majors, faculty, totalItems, loading } = storeToRefs(majorStore);
    faculty.value = facultyId.value;

    const addForm = ref(null);
    const editForm = ref(null);
    const formRules = ref(basicRules);
    const name = ref(null);
    const abbreviation = ref(null);

    const filterStore = useFilterStore();
    filterStore.setFilters([]);

    const majorHeaders = [
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
            key: 'abbreviation',
            title: translate('abbreviation'),
            align: 'center',
        },
        {
            key: 'actions',
            title: translate('action'),
            align: 'center',
        },
    ];

    const editItem = async (item) => {
        if ((await editForm.value.validate()).valid) {
            await majorStore.editItem(item);
        }
    };

    const addItem = async () => {
        if ((await addForm.value.validate()).valid) {
            await majorStore.addItem({
                name: name.value,
                abbreviation: abbreviation.value,
            });

            name.value = null;
            abbreviation.value = null;
        }
    };
</script>

<template>
    <TableWithActions
        :headers="majorHeaders"
        :items="majors"
        :loading="loading"
        :itemsLength="totalItems"
        @addItem="addItem"
        @deleteItem="majorStore.deleteItem"
        @deleteItems="majorStore.deleteItems"
        @editItem="editItem"
        @update-options="majorStore.getItems"
    >
        <template #add>
            <VContainer>
                <VForm ref="addForm">
                    <VRow>
                        <VCol cols="12">
                            <VTextField type="email" label="Name" v-model.trim="name" :rules="formRules" />
                        </VCol>
                        <VCol cols="12">
                            <VTextField label="Abbreviation" v-model.trim="abbreviation" :rules="formRules" />
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
                            <VTextField type="email" label="Name" v-model.trim="item.name" :rules="formRules" />
                        </VCol>
                        <VCol cols="12">
                            <VTextField label="Abbreviation" v-model.trim="item.abbreviation" :rules="formRules" />
                        </VCol>
                    </VRow>
                </VForm>
            </VContainer>
        </template>
    </TableWithActions>
</template>
