<script setup>
import Autocomplete from 'primevue/autocomplete'
import Card from 'primevue/card';
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
        <h2 class="col-12">Your guide to waste, recycling, and composting in Seattle</h2>
        <h3>Where should it go?</h3>
        <div class="col-12 md:col-6 lg:col-4 p-fluid">
            <Autocomplete v-model="selectedItem" :suggestions="filteredWasteItems" :dropdown="true"
                @complete="searchItems" optionLabel="name" forceSelection>
                <template #item="{item}">
                    <div class="ml-2">{{item.name}}</div>
                </template>
            </Autocomplete>
            <Card>
                <template #title>
                    Simple Card
                </template>
                <template #content>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error
                        repudiandae numquam deserunt
                        quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse,
                        cupiditate neque quas!</p>
                </template>
            </Card>
        </div>

    </div>

    <!-- <Editor v-model="value1"/> -->
</template>