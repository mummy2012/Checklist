<script setup lang="ts">
import { Icon } from '@iconify/vue';
</script>

<template>
    <div class="h-full min-h-screen flex-col bg-gray-200 flex   p-5">
        <RouterLink to="/" class="flex flex-row items-center pb-3">
            <Icon icon="ic:outline-keyboard-arrow-left" width="24" height="24" />
            <p class="fontheader headercolor">ASM Check List</p>
        </RouterLink>

        <div class="flex md:flex-row max-md:flex-col md:justify-between w-full md:items-center">
            <div class="flex items-center lg:w-1/6">
                <label for="simple-search" class="sr-only">Search</label>
                <div class="relative w-full">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor"
                            viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </div>
                    <input type="text" id="simple-search"
                        class="bg-gray-50 border text-black border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5  dark:bg-white dark:border-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                        placeholder="Search" required>
                </div>
            </div>
            <div class="mb-2 max-md:mt-2 md:mb-4">
                <div class=" text-black md:flex md:flex-row">
                    <div class="md:mr-4">
                        <label class="label-register fontheader">Start Date</label>
                        <input type="date"
                            class="block p-2 rounded shadow bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none w-full text-gray-400" />
                    </div>
                    <div class="max-md:mt-2">
                        <label class="label-register fontheader">End Date</label>
                        <input type="date"
                            class="block p-2 rounded shadow bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none w-full text-gray-400" />
                    </div>
                </div>
            </div>

        </div>
        <div class="flex flex-row max-sm:justify-around gap-4 md:w-1/4 h-14 max-lg:mt-4 mb-2">
            <div
                class="text-black text-sm fontheader   flex-row  bg-white w-full flex justify-around co items-center rounded-xl md:mr-2">
                <Icon icon="uis:check-circle" color="#10b981" />
                <p>ทำแล้ว</p>
                <span class="text-bold">4</span>
            </div>
            <div
                class="text-black text-sm fontheader flex-row  bg-white w-full flex justify-around co items-center rounded-xl">
                <Icon icon="uiw:circle-close" color="#f43f5e" />
                <p>ยังไม่ทำ</p>
                <span class="text-bold">1</span>
            </div>
        </div>


        <div class="flex items-center">
            <div class="fontheader text-bold text-lg mr-2">Checklist บันทึกการเข้าตรวจร้านของ ASM</div>
            <div class="text-gray-500 text-bold text-sm items-center">ทั้งหมด: 5</div>
        </div>
        <div
            class="mt-3 inline-flex  relative items-center py-2 px-1 w-full text-sm font-medium border-b lg:h-24 rounded-xl bg-white hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700  dark:hover:bg-gray-100 dark:hover:text-black dark:focus:ring-gray-500 dark:focus:text-black">
            <div class="ml-5 items-center w-full flex">
                <div>
                    <div class="font-bold self-start text-xl fontheader md:flex md:flex-row gap-1 md:items-center">
                        <span class="h-full truestate rounded-xl text-sm p-1 text-white ">ทำแล้ว</span>
                        {{`ID1336: Studio7(Ustore)-NRRU-Muang-Nakhonrat`}}
                    </div>
                    <div
                        class="text-sm self-end fontheader fontcolor gap-2 flex md:flex-row flex-col mt-1 md:flex-wrap md:items-center">
                        <div class="flex flex-row just gap-1">
                            <span>BU:</span>
                            <span class="text-black">BaNANA</span>
                        </div>
                        <Icon icon="bi:dot" width="24" height="24" class="max-md:hidden text-gray-400" />
                        <div class="flex flex-row gap-1">
                            <span>RM:</span>
                            <span class="text-black">ฐกรกฤตย์ ปิ่นเพชร</span>
                        </div>
                        <Icon icon="bi:dot" width="24" height="24" class="max-md:hidden text-gray-400" />
                        <div class="flex flex-row gap-1">
                            <span>AM:</span>
                            <span class="text-black">โชคชัย ฮังกาสี</span>
                        </div>
                        <Icon icon="bi:dot" width="24" height="24" class="max-md:hidden text-gray-400" />
                        <div class="flex flex-row gap-1">
                            <span>BM:</span>
                            <span class="text-black">นางจุรีรัตน์ เขียวคำ</span>
                        </div>
                        <Icon icon="bi:dot" width="24" height="24" class="max-lg:hidden text-gray-400" />
                        <div class="flex flex-row gap-1">
                            <Icon icon="ic:round-phone" width="24" height="24" class="text-gray-400" />
                            <span>โทรหน้าร้าน:</span>
                            <span class="text-black">081-701-4848, 02-992-6654</span>
                        </div>
                        <Icon icon="bi:dot" width="24" height="24" class="max-md:hidden text-gray-400" />
                        <div class="flex flex-row gap-1">
                            <Icon icon="mdi:email" width="24" height="24" class="text-gray-400" />
                            <span>Email:</span>
                            <span class="text-black">9_zrs_nbbsb082@comseven.com</span>
                        </div>
                    </div>
                </div>


            </div>
        </div>
        <div
            class="mt-3 inline-flex  relative items-center py-2 px-1 w-full text-sm font-medium border-b lg:h-24 rounded-xl bg-white hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700  dark:hover:bg-gray-100 dark:hover:text-black dark:focus:ring-gray-500 dark:focus:text-black">
            <div class="ml-5">
                <div class="font-bold self-start text-xl fontheader md:flex md:flex-row md:items-center gap-1">
                    <span class="h-full falsestate rounded-xl text-sm p-1 text-white ">ยังไม่ทำ</span>
                    {{`ID1336: Studio7(Ustore)-NRRU-Muang-Nakhonrat`}}
                </div>
                <div
                    class="text-sm self-end fontheader fontcolor gap-2 flex md:flex-row flex-col mt-1 md:flex-wrap md:items-center">
                    <div class="flex flex-row just gap-1">
                        <span>BU:</span>
                        <span class="text-black">BaNANA</span>
                    </div>
                    <Icon icon="bi:dot" width="24" height="24" class="max-md:hidden text-gray-400" />
                    <div class="flex flex-row gap-1">
                        <span>RM:</span>
                        <span class="text-black">ฐกรกฤตย์ ปิ่นเพชร</span>
                    </div>
                    <Icon icon="bi:dot" width="24" height="24" class="max-md:hidden text-gray-400" />
                    <div class="flex flex-row gap-1">
                        <span>AM:</span>
                        <span class="text-black">โชคชัย ฮังกาสี</span>
                    </div>
                    <Icon icon="bi:dot" width="24" height="24" class="max-md:hidden text-gray-400" />
                    <div class="flex flex-row gap-1">
                        <span>BM:</span>
                        <span class="text-black">นางจุรีรัตน์ เขียวคำ</span>
                    </div>
                    <Icon icon="bi:dot" width="24" height="24" class="max-lg:hidden text-gray-400" />
                    <div class="flex flex-row gap-1">
                        <Icon icon="ic:round-phone" width="24" height="24" class="text-gray-400" />
                        <span>โทรหน้าร้าน:</span>
                        <span class="text-black">081-701-4848, 02-992-6654</span>
                    </div>
                    <Icon icon="bi:dot" width="24" height="24" class="max-md:hidden text-gray-400" />
                    <div class="flex flex-row gap-1">
                        <Icon icon="mdi:email" width="24" height="24" class="text-gray-400" />
                        <span>Email:</span>
                        <span class="text-black">9_zrs_nbbsb082@comseven.com</span>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style>
.fontheader {
    font-family: 'Inter';

}

.headercolor {
    color: #3B82F6;
}

.fontcolor {
    color: #6B7280;
}

.falsestate {
    background-color: #F43F5E;
    font-family: "Inter";
}

.truestate {
    background-color: #10B981;
    font-family: "Inter";
}
</style>