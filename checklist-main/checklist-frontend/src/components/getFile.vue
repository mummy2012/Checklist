<script setup lang="ts">
import { ref, watchEffect } from "vue"
import {sheetAPI} from "../service/sheet"
import LoadingImage from "./LoadingImage.vue";
const props = defineProps<{ width?: string, height?: string, filepath: string }>()
const file = ref("")
const load = ref(true)
watchEffect(async () => {
    if (props.filepath ) {
        try {
            const response = await sheetAPI.getPicture(props.filepath)
                file.value = URL.createObjectURL(new Blob([response.data]))
            load.value = false
        } catch (error:any) {
       alert(error.message)
        }

    }
})

</script>

<template>
    <LoadingImage class="fixed z-[999]" :load="load"/>
    <img v-if="file" :src="file"
        :class="`w-${width || 48} h-${height || 48} object-center object-cover m-auto`" />

</template>