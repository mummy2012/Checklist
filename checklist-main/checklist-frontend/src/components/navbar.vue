<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { useAuthStore } from '../store/auth';
import { useRoute } from "vue-router";

const authStore=useAuthStore()
</script>

<template>
    <div class="sticky top-0 z-10 shadow-sm border border-b-2 border-gray-200 left-0 w-full items-center flex flex-row max-md:justify-between md:justify-around bg-white p-4">
        <div class="flex flex-row gap-6 items-center">
            <RouterLink to="/" class="font-bold max-md:text-sm text-base text-blue-500">Check List<span class="ml-1">@com7</span></RouterLink>
            <div class="flex gap-1 items-center">
                <RouterLink to='/' @click="" class="text-sm font-medium text-gray-500 px-3 py-2 rounded-md focus:text-white focus:bg-blue-500 hover:bg-blue-100 duration-300 cursor-pointer">Check List</RouterLink>
            </div>
            <div>
                <button @click="authStore.logout()" class="text-sm bg-rose-400 p-1 rounded-lg flex justify-center items-center text-white px-2">LOGOUT</button>
            </div>
        </div>
        <div class="flex flex-row items-center gap-1">
            <div class="text-gray-500">
                <Icon icon="mdi:user" width="24" height="24"/>
            </div>
            <div class="text-sm text-gray-900 font-medium">{{ authStore.userData?.fullname}}</div>

        </div>
    </div>
</template>