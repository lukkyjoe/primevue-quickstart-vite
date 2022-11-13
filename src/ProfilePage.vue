<script lang="ts" setup>
import Autocomplete from 'primevue/autocomplete'
import Card from 'primevue/card';
import Editor from 'primevue/editor';
import { ref, onMounted } from 'vue'
import gql from 'graphql-tag'
import { print } from 'graphql'
import axios from 'axios'
const wasteItems = ref([])
const filteredWasteItems = ref([])
const selectedItem = ref()

const QUERY_WASTE_ITEMS = gql`
    query MyQuery {
    waste_items(limit: -1) {
        id
        name
        instructions {
        content
        locations_id
        }
    }
    }
`

onMounted(() => {
    axios.post('https://kzozb8le.directus.app/graphql?limit=-1', {
        query: print(QUERY_WASTE_ITEMS)
    })
        .then(res => {
            console.log('res', res)
            wasteItems.value = res.data.data.waste_items
        })
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