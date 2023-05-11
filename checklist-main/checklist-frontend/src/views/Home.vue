<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { onMounted, watchEffect } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useAuthStore();
watchEffect(()=>{
    if(userStore.userData?.role == 'AM'){
        router.push({name:'asm'})
    }
    if(userStore.userData?.role == 'BM'){
        router.push({name:'bsm'})
    }
    userStore.setLoading(false)
})
</script>

<template>
    <div class="flex justify-center bg-white min-h-[100vh]">
        <div class="md:container md:mx-auto w-full pt-4 p-4 sm:p-6">
            <label class="text-sm place-content-center text-blue-500">เมนู Check List</label>
            <div class="mt-4 sm:mt-5">
                <RouterLink to="bsm"
                    class="mt-3 inline-flex  relative items-center py-2 px-6 max-md:px-4 w-full text-sm font-medium border-b  rounded-xl bg-white hover:bg-gray-50 focus:z-10 duration-300 group">
                    <div class="text-gray-700">
                        <Icon icon="material-symbols:fact-check-outline-rounded" width="24" height="24" />
                    </div>
                    <div class="ml-5 flex flex-row justify-between w-full">
                        <div>
                            <p class="mb-1 self-start text-sm font-semibold text-gray-900">{{ `BSM` }}</p>
                            <p class="text-xs text-gray-500 self-end">{{ `Checklist บันทึกการเข้าตรวจร้านของ
                                                            BSM`}}</p>
                        </div>
                    </div>
                    <div class="text-gray-900 group-hover:text-blue-500">
                        <Icon icon="uiw:right" />
                    </div>
                </RouterLink>
                <RouterLink to="asm"
                    class="mt-3 inline-flex  relative items-center py-2 px-6 max-md:px-4 w-full text-sm font-medium border-b  rounded-xl bg-white hover:bg-gray-50 focus:z-10 duration-300 group">
                    <div class="text-gray-700">
                        <Icon icon="material-symbols:fact-check-outline-rounded" width="24" height="24" />
                    </div>
                    <div class="ml-5 flex flex-row justify-between w-full">
                        <div>
                            <p class="mb-1 self-start text-sm font-semibold text-gray-900">{{ `ASM` }}</p>
                            <p class="text-xs text-gray-500 self-end">{{ `Checklist บันทึกการเข้าตรวจร้านของ
                                                            ASM`}}</p>
                        </div>
                    </div>
                    <div class="text-gray-900 group-hover:text-blue-500">
                        <Icon icon="uiw:right" />
                    </div>
                </RouterLink>
                <RouterLink to="rsm" disable
                    class="mt-3 inline-flex  relative items-center py-2 px-6 max-md:px-4 w-full text-sm font-medium border-b  rounded-xl bg-white hover:bg-gray-50 focus:z-10 duration-300 group">
                    <div class="text-gray-700">
                        <Icon icon="material-symbols:fact-check-outline-rounded" width="24" height="24" />
                    </div>
                    <div class="ml-5 flex flex-row justify-between w-full">
                        <div>
                            <p class="mb-1 self-start text-sm font-semibold text-gray-900">{{ `RSM` }}</p>
                            <p class="text-xs text-gray-500 self-end">{{ `Checklist บันทึกการเข้าตรวจร้านของ
                                                            RSM`}}</p>
                        </div>
                    </div>
                    <div class="text-gray-900 group-hover:text-blue-500">
                        <Icon icon="uiw:right" />
                    </div>
                </RouterLink>
                <RouterLink to="training"
                    class="mt-3 inline-flex  relative items-center py-2 px-6 max-md:px-4 w-full text-sm font-medium border-b  rounded-xl bg-white hover:bg-gray-50 focus:z-10 duration-300 group">
                    <div class="text-gray-700">
                        <Icon icon="material-symbols:fact-check-outline-rounded" width="24" height="24" />
                    </div>
                    <div class="ml-5 flex flex-row justify-between w-full">
                        <div>
                            <p class="mb-1 self-start text-sm font-semibold text-gray-900">{{ `Training` }}</p>
                            <p class="text-xs text-gray-500 self-end">{{ `Checklist บันทึกการเข้าตรวจร้านของ
                                                            Training`}}</p>
                        </div>
                    </div>
                    <div class="text-gray-900 group-hover:text-blue-500">
                        <Icon icon="uiw:right" />
                    </div>
                </RouterLink>
                <div
                    class="mt-3 inline-flex  relative items-center py-2 px-6 max-md:px-4 w-full text-sm font-medium border-b  rounded-xl bg-white hover:bg-gray-50 focus:z-10 duration-300 group">
                    <div class="text-gray-700">
                        <Icon icon="akar-icons:statistic-up" width="24" height="24" />
                    </div>
                    <div class="ml-5 flex flex-row justify-between w-full">
                        <div>
                            <p class="mb-1 self-start text-sm font-semibold text-gray-900">{{ `แดชบอร์ด` }}</p>
                            <p class="text-xs text-gray-500 self-end">{{ `แดชบอร์ดแสดงข้อมูล check list` }}</p>
                        </div>
                    </div>
                    <div class="text-gray-900 group-hover:text-blue-500">
                        <Icon icon="uiw:right" />
                    </div>
                </div>
                <RouterLink to="manageform"
                    class="mt-3 inline-flex  relative items-center py-2 px-6 max-md:px-4 w-full text-sm font-medium border-b  rounded-xl bg-white hover:bg-gray-50 focus:z-10 duration-300 group">
                    <div class="text-gray-700">
                        <Icon icon="material-symbols:edit-document-outline-rounded" width="24" height="24" />
                    </div>
                    <div class="ml-5 flex flex-row justify-between w-full">
                        <div>
                            <p class="mb-1 self-start text-sm font-semibold text-gray-900">{{ `จัดการฟอร์ม` }}</p>
                            <p class="text-xs text-gray-500 self-end">{{ `จัดการรูปแบบฟอร์ม check list` }}</p>
                        </div>
                    </div>
                    <div class="text-gray-900 group-hover:text-blue-500">
                        <Icon icon="uiw:right" />
                    </div>
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<style>
.headercolor {
    color: #3B82F6;
}

.fontcolor {
    color: #6B7280;
}

.spanarraow {
    align-self: flex-end;
}
</style>