<script setup lang="ts">
import { RouterView } from 'vue-router';
import navbar from './components/navbar.vue';
import { watchEffect } from 'vue';
import { useAuthStore } from './store/auth';
import Loading from './components/Loading.vue'
import router from './router'
import httpClient from './service/httpClient';


const authStore = useAuthStore()

watchEffect((onCleanup) => {
  
  if (typeof authStore.Token == "string" && authStore.Token.length >= 1 ) {
    authStore.getUser()

  }
  if (!authStore.Token) {
    authStore.firstload = false
  }
  onCleanup(() => {
    if (!authStore.Token) {
      authStore.$patch({ userData: null })

    }
  })
})
</script>

<template>
<Loading/>
<navbar v-if="authStore.userData"/>
<RouterView v-if="!authStore.firstload"/>  
</template>

<style scoped>


</style>
