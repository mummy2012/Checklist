<script setup lang="ts">
import { Icon } from '@iconify/vue';
import type { timer } from '../types/information'
import { ref, watchEffect, Ref, onMounted } from 'vue';
import { FilePreview } from "../types";
import { useRoute, useRouter } from "vue-router";

interface FileID extends FilePreview {
    id?: string;
    no?: string;
    url?: string;
    file: File;

}

const router = useRouter();
const modalcheck = ref(true)
const props = defineProps<{ date: any, time: timer[], file: FileID[] }>()
const date = new Date();
const timenow = (date.getHours() * 60 + date.getMinutes())
const converterTime = (time: number) => {
    return (Math.floor((time) / 60) + (time) % 60 / 100).toFixed(2)
}

const checktime = (time_start: number, time_end: number) => {
    return ((time_start <= timenow) && (timenow <= time_end)) ? true : false
}

const uploadFile = (e: Event, id: string) => {
    let files = (e.target as HTMLInputElement).files as FileList;
    if (checkimgEmtry(id)) {
        for (let index = 0; index < files.length; index++) {
            const element = files[index];
            props.file.push({ ...element, file: element, url: URL.createObjectURL(element), id } as FileID)
        }
    } else {
        findFile(id)?.forEach(val => delteimg(val.url as string))
        for (let index = 0; index < files.length; index++) {
            const element = files[index];
            props.file.push({ ...element, file: element, url: URL.createObjectURL(element), id } as FileID)
        }
    }
}

const findFile = (id: string) => {
    let find = props.file.filter((res) => res.id == id)
    if (find) return find
}

const checkimgEmtry = (id: string) => {
    if (props.file.findIndex((res) => res.id == id) == -1) {
        return true
    } else {
        return false
    }
}


const delteimg = (url: string) => {
    props.file.splice(props.file.findIndex(val => val.url == url), 1)
}

const checkIN =()=>{
    if(props.file.length == 5){
        modalcheck.value = !modalcheck.value
    }else{
        alert('Please upload picture')
    }
}

const getBack =()=>{
    router.push('/')
}
</script>

<template>
    <div className="relative z-10" v-if="modalcheck">
        <div class="relative z-10">

            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div class="flex items-center sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                <div class="fixed z-10 inset-0 overflow-y-auto p-0 sm:p-10">
                    <div class="flex items-center sm:items-center justify-center min-h-full p-4 text-center sm:p-0 h-full">

                        <div
                            class="relative bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 w-full max-w-5xl sm:w-full md:my-8 m-0 h-full grid grid-cols-12">

                            <div class="col-span-12 h-full overflow-y-auto">

                                <div class="px-4 py-5 sm:px-6">
                                    <h3 class="text-lg font-medium leading-6 text-gray-900">เช็คอินหน้าร้าน</h3>
                                </div>
                                <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                                    <div class="mb-6">
                                        <div class="flex flex-row gap-1 items-center">
                                            <Icon icon="uil:calender" color="#6b7280" width="24" height="24" />
                                            <label class="text-gray-500">Time In:</label>
                                            <label>{{ `${props.date.getDate()}/${props.date.getMonth() +
                                                1}/${props.date.getFullYear()}
                                                                                            `}}</label>
                                            <label>{{ `${props.date.getHours()}:${((props.date.getMinutes()) < 10) ? '0' +
                                                (props.date.getMinutes()) : (props.date.getMinutes())}` }}</label>
                                        </div>
                                        <div class="mt-6">
                                            <p class="text-sm text-gray-500 font-medium">{{ `เวลาที่ต้องเข้ามาทำแบบฟอร์ม:
                                                                                            (${props.time.length}
                                                                                            ครั้ง)`}}</p>
                                            <div class="flex justify-between items-center" v-for="time in props.time">
                                                <div class="flex gap-1">
                                                    <Icon icon="material-symbols:nest-clock-farsight-analog-rounded"
                                                        :color="`${(checktime(time.time_start, time.time_end)) ? '#1F2937' : '#6b7280'}`"
                                                        width="24" height="24" />
                                                    <label
                                                        :class="`${(checktime(time.time_start, time.time_end)) ? 'text-[#1F2937]' : 'text-[#6b7280]'}`">{{
                                                            `${converterTime(time.time_start)}
                                                                                                                - ${converterTime(time.time_end)}` }}</label>
                                                </div>
                                                <p v-if="checktime(time.time_start, time.time_end)"
                                                    class="text-sm text-green-500 font-medium px-4 py-1 bg-green-100 rounded-full">
                                                    เปิด</p>
                                                <p v-if="!checktime(time.time_start, time.time_end)"
                                                    class="text-sm text-gray-500 font-medium px-4 py-1 bg-gray-100 rounded-full">
                                                    ปิด</p>
                                            </div>


                                        </div>
                                    </div>
                                    <div class="flex flex-wrap gap-4 justify-center sm:justify-start">
                                        <div class="cursor-pointer group">
                                            <div
                                                class="relative w-56 h-56 rounded-lg mx-auto object-cover object-center bg-gray-100 duration-300 group-hover:opacity-80">
                                                <div class="relative" v-for="res in findFile(`fullfame`)">
                                                    <img :src="res.url"
                                                        class="absolute z-[1] w-56 h-56 rounded-lg mx-auto object-cover object-center bg-gray-100 duration-300 group-hover:opacity-80" />
                                                    <Icon v-if="!checkimgEmtry(`fullfame`)"
                                                        @click="delteimg(res.url as string)" icon="ic:round-minus"
                                                        width="20" height="20"
                                                        class="absolute -top-2 -right-2 text-white w-6 h-6 bg-gray-900 rounded-full z-[2] " />
                                                </div>
                                                <input @change="uploadFile($event, `fullfame`)"
                                                    accept="image/jpg,image/jpeg,image/png,image/gif" type="file"
                                                    class="file:relative file:w-56 file:h-56 file:rounded-lg file:mx-auto file:object-cover file:object-center file:bg-transparent text-transparent  file:hover:z-[99]" />
                                            </div>
                                            <label class="text-sm">รูปหน้าร้าน แบบเต็มเฟรม</label>
                                        </div>
                                        <div class="cursor-pointer group">
                                            <div
                                                class="relative w-56 h-56 rounded-lg mx-auto object-cover object-center bg-gray-100 duration-300 group-hover:opacity-80">
                                                <div class="relative" v-for="res in findFile(`leftcorner`)">
                                                    <img :src="res.url"
                                                        class="absolute z-[1] w-56 h-56 rounded-lg mx-auto object-cover object-center bg-gray-100 duration-300 group-hover:opacity-80" />
                                                    <Icon v-if="!checkimgEmtry(`leftcorner`)"
                                                        @click="delteimg(res.url as string)" icon="ic:round-minus"
                                                        width="20" height="20"
                                                        class="absolute -top-2 -right-2 text-white w-6 h-6 bg-gray-900 rounded-full z-[2] " />
                                                </div>
                                                <input @change="uploadFile($event, `leftcorner`)"
                                                    accept="image/jpg,image/jpeg,image/png,image/gif" type="file"
                                                    class="file:relative file:w-56 file:h-56 file:rounded-lg file:mx-auto file:object-cover file:object-center file:bg-transparent text-transparent  file:hover:z-[99]" />
                                            </div>
                                            <label class="text-sm">มุมด้านซ้ายของในร้าน</label>
                                        </div>
                                        <div class="cursor-pointer group">
                                            <div
                                                class="relative w-56 h-56 rounded-lg mx-auto object-cover object-center bg-gray-100 duration-300 group-hover:opacity-80">
                                                <div class="relative" v-for="res in findFile(`rightcorner`)">
                                                    <img :src="res.url"
                                                        class="absolute z-[1] w-56 h-56 rounded-lg mx-auto object-cover object-center bg-gray-100 duration-300 group-hover:opacity-80" />
                                                    <Icon v-if="!checkimgEmtry(`rightcorner`)"
                                                        @click="delteimg(res.url as string)" icon="ic:round-minus"
                                                        width="20" height="20"
                                                        class="absolute -top-2 -right-2 text-white w-6 h-6 bg-gray-900 rounded-full z-[2] " />
                                                </div>
                                                <input @change="uploadFile($event, `rightcorner`)"
                                                    accept="image/jpg,image/jpeg,image/png,image/gif" type="file"
                                                    class="file:relative file:w-56 file:h-56 file:rounded-lg file:mx-auto file:object-cover file:object-center file:bg-transparent text-transparent  file:hover:z-[99]" />
                                            </div>
                                            <label class="text-sm">มุมด้านขวาของในร้าน</label>
                                        </div>
                                        <div class="cursor-pointer group">
                                            <div
                                                class="relative w-56 h-56 rounded-lg mx-auto object-cover object-center bg-gray-100 duration-300 group-hover:opacity-80">
                                                <div class="relative" v-for="res in findFile(`cashiercorner`)">
                                                    <img :src="res.url"
                                                        class="absolute z-[1] w-56 h-56 rounded-lg mx-auto object-cover object-center bg-gray-100 duration-300 group-hover:opacity-80" />
                                                    <Icon v-if="!checkimgEmtry(`cashiercorner`)"
                                                        @click="delteimg(res.url as string)" icon="ic:round-minus"
                                                        width="20" height="20"
                                                        class="absolute -top-2 -right-2 text-white w-6 h-6 bg-gray-900 rounded-full z-[2] " />
                                                </div>
                                                <input @change="uploadFile($event, `cashiercorner`)"
                                                    accept="image/jpg,image/jpeg,image/png,image/gif" type="file"
                                                    class="file:relative file:w-56 file:h-56 file:rounded-lg file:mx-auto file:object-cover file:object-center file:bg-transparent text-transparent  file:hover:z-[99]" />
                                            </div>
                                            <label class="text-sm">มุม Cashier</label>
                                        </div>
                                        <div class="cursor-pointer group">
                                            <div
                                                class="relative w-56 h-56 rounded-lg mx-auto object-cover object-center bg-gray-100 duration-300 group-hover:opacity-80">
                                                <div class="relative" v-for="res in findFile(`stockcorner`)">
                                                    <img :src="res.url"
                                                        class="absolute z-[1] w-56 h-56 rounded-lg mx-auto object-cover object-center bg-gray-100 duration-300 group-hover:opacity-80" />
                                                    <Icon v-if="!checkimgEmtry(`stockcorner`)"
                                                        @click="delteimg(res.url as string)" icon="ic:round-minus"
                                                        width="20" height="20"
                                                        class="absolute -top-2 -right-2 text-white w-6 h-6 bg-gray-900 rounded-full z-[2] " />
                                                </div>
                                            <input @change="uploadFile($event, `stockcorner`)"
                                                accept="image/jpg,image/jpeg,image/png,image/gif" type="file"
                                                class="file:relative file:w-56 file:h-56 file:rounded-lg file:mx-auto file:object-cover file:object-center file:bg-transparent text-transparent  file:hover:z-[99]" />
                                            </div>
                                        <label class="text-sm">มุมห้อง Stock</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="absolute bottom-0 w-full col-span-12 h-fit bg-gray-50 px-4 py-3 sm:px-6 flex flex-row-reverse gap-4">
                                <button @click="checkIN" type="button"
                                    class="text-sm h-fit w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto items-center cursor-pointer duration-300 disabled:text-gray-400 disabled:bg-gray-200">ดำเนินการต่อ</button>
                                <button @click="getBack" type="button"
                                    class="text-sm h-fit w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto items-center cursor-pointer duration-300">ปิด</button>
                            </div>
                        </div>
                    </div>

                    <div class="w-full col-span-12 h-[62px] ">
                    </div>


                </div>
            </div>

        </div>
    </div>


</template>