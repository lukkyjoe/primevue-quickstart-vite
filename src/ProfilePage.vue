<script setup>
import Autocomplete from 'primevue/autocomplete'
import Editor from 'primevue/editor';
import {ref, onMounted} from 'vue'
const wasteItems = ref([{name: 'foo'}])
const filteredWasteItems = ref([])
const value1 = ref('<div>Welcome to PrimeVue <b>Editor</b></div><div><br></div>');
const selectedItem = ref()
const searchItems = (event) => {
    console.log('event', event)
    filteredWasteItems.value = [...wasteItems.value]

}
onMounted(() => {
    fetch('https://kzozb8le.directus.app/items/waste_items')
        .then(res => {
            console.log('res', res)
            return res.json()
        })
        .then(d => {
            console.log('d', d)
            wasteItems.value = d.data
        })
})
</script>

<template>
    <Autocomplete v-model="selectedItem" :suggestions="filteredWasteItems" :dropdown="true" @complete="searchItems" optionLabel="name" forceSelection>
        <template #item="{item}">
            <div class="ml-2">{{item.name}}</div>
        </template>
    </Autocomplete> 
    <!-- <Editor v-model="value1"/> -->
</template>