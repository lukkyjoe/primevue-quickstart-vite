<script setup>
import Autocomplete from 'primevue/autocomplete'
import Editor from 'primevue/editor';
import {ref, onMounted} from 'vue'
const wasteItems = ref([])
const value1 = ref('<div>Welcome to PrimeVue <b>Editor</b></div><div><br></div>');
const selectedItem = ref()
const searchItems = (event) => wasteItems.value = [{name: 'sup'}, {name: 'bar'}, {name: 'foo'}]
onMounted(() => {
    fetch('https://kzozb8le.directus.app/items/waste_items')
        .then(res => {
            console.log('res', res)
            return res.json()
        })
        .then(d => {
            console.log('d', d)
            wasteItems.value = d.data.map(({name}) => name)
        })
})
</script>

<template>
    <Autocomplete v-model="selectedItem" :suggestions="wasteItems" :dropdown="true" @complete="searchItems">
        <template #item="slotProps">
            <div class="ml-2">hi {{slotProps.item.name}}</div>
        </template>
    </Autocomplete> 
    <Editor v-model="value1"/>
</template>