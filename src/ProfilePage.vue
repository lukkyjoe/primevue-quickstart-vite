<script setup>
import Autocomplete from 'primevue/autocomplete'
import Editor from 'primevue/editor';
import { ref, onMounted } from 'vue'
const wasteItems = ref([{ name: 'foo' }])
const filteredWasteItems = ref([])
const value1 = ref('<div>Welcome to PrimeVue <b>Editor</b></div><div><br></div>');
const selectedItem = ref()

onMounted(() => {
    fetch('https://kzozb8le.directus.app/items/waste_items?limit=-1')
        .then(res => res.json())
        .then(d => wasteItems.value = d.data)
})

const searchItems = (event) => {
    console.log('searchItems', event)
    try {
        if (!event.query.trim().length) {
            filteredWasteItems.value = [...wasteItems.value];
        }
        else {
            filteredWasteItems.value = wasteItems.value.filter((item) => {
                return item.name.toLowerCase().includes(event.query.toLowerCase());
            });
        }
    } catch (e) {
        console.error(e)
        console.log(item)
        console.log(event.query)
    }

}
</script>

<template>
    <div class="grid justify-content-center">
        <h2 class="col-12">Your local guide to waste, recycling, and composting</h2>
        <div class="col-12 md:col-6 lg:col-4 p-fluid">
            <Autocomplete v-model="selectedItem" :suggestions="filteredWasteItems" :dropdown="true"
                @complete="searchItems" optionLabel="name" forceSelection>
                <template #item="{item}">
                    <div class="ml-2">{{item.name}}</div>
                </template>
            </Autocomplete>
        </div>

    </div>

    <!-- <Editor v-model="value1"/> -->
</template>