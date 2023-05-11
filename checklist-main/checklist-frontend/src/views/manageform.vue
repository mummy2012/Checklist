<script setup lang="ts">
import { Icon } from '@iconify/vue';



</script>

<template>
    <div class="flex-col flex px-4 sm:px-6 pt-6 pb-10">
        <div class="md:container md:mx-auto w-full pt-4 p-4 sm:p-6">
            <RouterLink :to="{name : 'home'}"
             class="flex flex-row items-center gap-4 group cursor-pointer">
                <div class="group-hover:bg-slate-200 rounded-full">
                    <Icon icon="ic:outline-keyboard-arrow-left" width="24" height="24" />
                </div>
                <p class="text-blue-500 text-sm">จัดการแบบฟอร์ม</p>
            </RouterLink>
            <div class="mt-4 sm:mt-5">
                <RouterLink to="/manage/BSM"
                    class="mt-3 inline-flex  relative items-center py-2 px-6 max-md:px-4 w-full text-sm font-medium border-b  rounded-xl bg-white hover:bg-gray-50 focus:z-10 duration-300 group">
                    <div class="text-gray-700">
                        <Icon icon="fluent:form-new-24-regular" width="24" height="24" />
                    </div>
                    <div class="ml-5 flex flex-row justify-between w-full">
                        <div class="">
                            <p class="mb-1 self-start text-sm font-semibold text-gray-900">{{`จัดการแบบฟอร์ม BSM`}}</p>
                            <p class="text-xs text-gray-500 self-end">{{`สร้างแบบฟอร์ม`}}</p>
                        </div>
                    </div>
                    <div class="text-gray-900 group-hover:text-blue-500">
                        <Icon icon="uiw:right" />
                    </div>
                </RouterLink>
                <RouterLink to="/manage/ASM"
                    class="mt-3 inline-flex  relative items-center py-2 px-6 max-md:px-4 w-full text-sm font-medium border-b  rounded-xl bg-white hover:bg-gray-50 focus:z-10 duration-300 group">
                    <div class="text-gray-700">
                        <Icon icon="fluent:form-new-24-regular" width="24" height="24" />
                    </div>
                    <div class="ml-5 flex flex-row justify-between w-full">
                        <div>
                            <p class="mb-1 self-start text-sm font-semibold text-gray-900">{{`จัดการแบบฟอร์ม ASM`}}</p>
                            <p class="text-xs text-gray-500 self-end">{{`สร้างแบบฟอร์ม`}}</p>
                        </div>
                    </div>
                    <div class="text-gray-900 group-hover:text-blue-500">
                        <Icon icon="uiw:right" />
                    </div>
                </RouterLink>
                <RouterLink to="/manage/RSM"
                    class="mt-3 inline-flex  relative items-center py-2 px-6 max-md:px-4 w-full text-sm font-medium border-b  rounded-xl bg-white hover:bg-gray-50 focus:z-10 duration-300 group">
                    <div class="text-gray-700">
                        <Icon icon="fluent:form-new-24-regular" width="24" height="24" />
                    </div>
                    <div class="ml-5 flex flex-row justify-between w-full">
                        <div>
                            <p class="mb-1 self-start text-sm font-semibold text-gray-900">{{`จัดการแบบฟอร์ม RSM`}}</p>
                            <p class="text-xs text-gray-500 self-end">{{`สร้างแบบฟอร์ม`}}</p>
                        </div>
                    </div>
                    <div class="text-gray-900 group-hover:text-blue-500">
                        <Icon icon="uiw:right" />
                    </div>
                </RouterLink>
                <RouterLink to="/manage/TRAINING"
                    class="mt-3 inline-flex  relative items-center py-2 px-6 max-md:px-4 w-full text-sm font-medium border-b  rounded-xl bg-white hover:bg-gray-50 focus:z-10 duration-300 group">
                    <div class="text-gray-700">
                        <Icon icon="fluent:form-new-24-regular" width="24" height="24" />
                    </div>
                    <div class="ml-5 flex flex-row justify-between w-full">
                        <div>
                            <p class="mb-1 self-start text-sm font-semibold text-gray-900">{{`จัดการแบบฟอร์ม Training`}}</p>
                            <p class="text-xs text-gray-500 self-end">{{`สร้างแบบฟอร์ม`}}</p>
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