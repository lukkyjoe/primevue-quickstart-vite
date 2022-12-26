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
query QueryForLocationId($_eq: GraphQLStringOrFloat = "") {
  waste_items(filter: { instructions: { locations_id: { _eq: $_eq } } }, limit: -1) {
    id
    instructions {
      content
      id
      locations_id
    }
    name
  }
}
`

const SEATTLE_LOCATION_ID = 4

onMounted(() => {
    axios.post('https://kzozb8le.directus.app/graphql?limit=-1', {
        query: print(QUERY_WASTE_ITEMS),
        variables: {
            _eq: SEATTLE_LOCATION_ID
        }
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
        <h2 class="col-12 text-center">Your guide to waste, recycling, and composting in Seattle</h2>
        <div class="col-12 md:col-7 lg:col-5 p-fluid">
            <Autocomplete v-model="selectedItem" :suggestions="filteredWasteItems" :dropdown="true"
                @complete="searchItems" optionLabel="name" forceSelection>
                <template #item="{item}">
                    <div class="ml-2">{{item.name}}</div>
                </template>
            </Autocomplete>
            <Card>
                <template #title>
                    {{selectedItem?.name}}
                </template>
                <template #content>
                    <div v-html="selectedItem?.instructions[0].content"></div>
                    <!-- https://vuejs.org/api/built-in-directives.html#v-html -->
                </template>
            </Card>
        </div>

    </div>

    <!-- <Editor v-model="value1"/> -->
</template>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400&display=swap');
    h2 {
        font-family: 'Oswald', sans-serif;
        font-weight: 500;
    }

</style>