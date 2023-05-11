<script setup lang="ts">
import { defineProps, reactive, ref, Ref, onMounted, watchEffect } from 'vue'
import { sheetAPI } from '../service/sheet';
import { useAuthStore } from '../store/auth';
import type { resultscore, timer } from '../types/sheetans'
import { Icon } from '@iconify/vue';
import IMG from '../components/getFile.vue'
const props = defineProps<{ id: string }>()
const authStore = useAuthStore()
const tmp: Ref<resultscore> = ref({    id:'', docname:'',creater_id: '', target_id: '', scoredoc_total_all: [], inform: [], status: false, time_create: '' , image:['']})


const collapse = (key: string) => {
    var element = document.getElementById(key);
    if (element?.style.display == "none") {
        element.style.removeProperty("display")
    } else {
        element?.setAttribute("style", "display:none;");
    }
}

const converterTime = (time: number) => {
    return (Math.floor((time) / 60) + (time) % 60 / 100).toFixed(2)
}
const converterTimes = (timer: timer) => {
    return `${converterTime(timer.time_start)} - ${converterTime(timer.time_end)}`
}

const converterDay = (day:string) =>{
    let tmpday = new Date(day)
    return `${tmpday.getFullYear()}_${tmpday.getMonth()}_${tmpday.getDate()}`
}

const typeImage = (gimg : string[] , typeimg : string)=>{
    return (gimg.filter(val=>(val.split('_')[val.split('_').length-1]) == typeimg))
}

watchEffect(async () => {
    if (props.id) {
        authStore.setLoading(true)
        const result = await sheetAPI.getScore(props.id)
            .then((res) => {
                tmp.value = res.message as resultscore
                authStore.setLoading(false)
            }).catch((error) => {
                alert(error)
                authStore.setLoading(false)
            })
    }
})
</script>

<template>
    <div className="relative z-10">


        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="flex items-center sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <div className="fixed z-10 inset-0 overflow-y-auto p-0 sm:p-10">
                <div className="flex items-center sm:items-center justify-center min-h-full p-4 text-center sm:p-0 h-full">


                    <div
                        className="relative bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 w-full max-w-8xl sm:w-full md:my-8 m-0 h-full grid grid-cols-12">

                        <div className="col-span-12 h-full overflow-y-auto">

                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Total Score</h3>
                            </div>
                            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                <div class="flex flex-wrap gap-4 justify-center sm:justify-start">
                                        <div class="group">
                                            <div
                                                class="w-56 h-56 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <IMG class="rounded-lg w-56 h-56" :filepath="`checklist/private/${tmp.target_id.ID}/${converterDay(tmp.time_create)}/${tmp.id}_${(typeImage(tmp.image,'fullfame'))}`" :width="`${56}`" :height="`${56}`"/>
                                                
                                
                                            </div>
                                            <label class="text-sm">รูปหน้าร้าน แบบเต็มเฟรม</label>
                                        </div>
                                        <div class="group">
                                            <div
                                                class=" w-56 h-56 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <IMG class="rounded-lg w-56 h-56" :filepath="`checklist/private/${tmp.target_id.ID}/${converterDay(tmp.time_create)}/${tmp.id}_${(typeImage(tmp.image,'leftcorner'))}`" :width="`${56}`" :height="`${56}`"/>
                                                    
                                            </div>
                                            <label class="text-sm">มุมด้านซ้ายของในร้าน</label>
                                        </div>
                                        <div class=" group">
                                            <div
                                                class=" w-56 h-56 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <IMG class="rounded-lg w-56 h-56" :filepath="`checklist/private/${tmp.target_id.ID}/${converterDay(tmp.time_create)}/${tmp.id}_${(typeImage(tmp.image,'rightcorner'))}`" :width="`${56}`" :height="`${56}`"/>
                                                    
                                            </div>
                                            <label class="text-sm">มุมด้านขวาของในร้าน</label>
                                        </div>
                                        <div class="group">
                                            <div
                                                class=" w-56 h-56 rounded-lg  bg-gray-100 flex items-center justify-center">
                                                <IMG class="rounded-lg w-56 h-56" :filepath="`checklist/private/${tmp.target_id.ID}/${converterDay(tmp.time_create)}/${tmp.id}_${(typeImage(tmp.image,'cashiercorner'))}`" :width="`${56}`" :height="`${56}`"/>
                                                    
                                            </div>
                                            <label class="text-sm">มุม Cashier</label>
                                        </div>
                                        <div class=" group">
                                            <div
                                                class=" w-56 h-56 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <IMG class="rounded-lg w-56 h-56 " :filepath="`checklist/private/${tmp.target_id.ID}/${converterDay(tmp.time_create)}/${tmp.id}_${(typeImage(tmp.image,'stockcorner'))}`" :width="`${56}`" :height="`${56}`"/>
                                                    
                                            </div>
                                        <label class="text-sm">มุมห้อง Stock</label>
                                    </div>
                                </div>
                                <div className="border border-gray-200 mt-4">
                                    <dl>
                                        <div className="bg-gray-100 px-4 py-5 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500 sm:col-span-1">ชื่อผู้ตรวจสอบ
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-4 sm:mt-0">{{
                                                tmp.creater_id }}</dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500 sm:col-span-1">วันที่</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-4 sm:mt-0">{{
                                                tmp.time_create }}</dd>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500 sm:col-span-1">Retail ID:</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-4 sm:mt-0">{{
                                                tmp.target_id.ID }}</dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500 sm:col-span-1">Retail Name:
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-4 sm:mt-0">
                                                {{ tmp.target_id.NAME }}</dd>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500 sm:col-span-1">BM Name:</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-4 sm:mt-0"> {{
                                                tmp.target_id.bm_location }}</dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500 sm:col-span-1">AM Name:</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-4 sm:mt-0">{{
                                                tmp.target_id.rm_location }}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                            <div className="px-4 py-5 sm:px-6 relative">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y w-full text-left">
                                        <thead className="bg-gray-100">
                                            <tr className="h-14 text-gray-500 text-sm grid grid-cols-12">
                                                <th scope="col"
                                                    className="col-span-3 sticky z-10 top-0 bg-gray-100 px-6 py-3 text-left text-xs text-gray-500 font-bold uppercase tracking-wider cursor-pointer">
                                                    TOTAL SCORE</th>
                                                <th scope="col"
                                                    className="col-span-3 sticky z-10 top-0 bg-gray-100 px-6 py-3 text-left text-xs text-gray-500 font-bold uppercase tracking-wider cursor-pointer">
                                                    ช่วงเวลา</th>
                                                <th scope="col"
                                                    className="col-span-3 sticky z-10 top-0 bg-gray-100 px-6 py-3 text-left text-xs text-gray-500 font-bold uppercase tracking-wider cursor-pointer">
                                                    คะแนนเต็ม</th>
                                                <th scope="col"
                                                    className="col-span-2 sticky z-10 top-0 bg-gray-100 px-6 py-3 text-left text-xs text-gray-500 font-bold uppercase tracking-wider cursor-pointer">
                                                    คะแนนที่ได้</th>
                                                <th scope="col"
                                                    className="col-span-1 sticky z-10 top-0 bg-gray-100 px-6 py-3 text-left text-xs text-gray-500 font-bold uppercase tracking-wider cursor-pointer">
                                                </th>
                                            </tr>
                                        </thead>

                                        <div className="contents">
                                            <tbody className="bg-white text-sm">
                                                <div v-for="(value, key) in tmp.inform" :key="key">
                                                    <div>
                                                        <tr className="border-b border-gray-300 group grid grid-cols-12 cursor-pointer"
                                                            @click="collapse(String(key))">
                                                            <td
                                                                className="sticky px-6 py-4 whitespace-nowrap col-span-3 font-semibold truncate text-xs">
                                                                {{ value.title }}</td>
                                                            <td className="sticky px-6 py-4 whitespace-nowrap col-span-3">
                                                                {{
                                                                    converterTimes(value.scoreform_total_all[0].scoreform_timer)
                                                                }}
                                                            </td>
                                                            <td className="sticky px-6 py-4 whitespace-nowrap col-span-3">
                                                                {{ value.scoreform_total_all[0].scoreform_total }}</td>
                                                            <td className="sticky px-6 py-4 whitespace-nowrap col-span-2">
                                                                {{ value.scoreform_total_all[0].scoreform_receive }}
                                                            </td>
                                                            <td
                                                                className="sticky px-6 py-1 col-span-1 cursor-pointer">
                                                                <Icon icon="material-symbols:keyboard-arrow-up-rounded" width="20" height="20" /> 
                                                                <Icon icon="material-symbols:keyboard-arrow-down-rounded" width="20" height="20" />
                                                            </td>
                                                            <td :id="String(key)"
                                                                className="sticky px-6 py-4 whitespace-nowrap cursor-pointer col-span-12" style="display:none;">
                                                                <p className="text-sm text-gray-500">History</p>
                                                                <div className="px-0 py-5 sm:px-6 relative">
                                                                    <div className="overflow-x-auto ">
                                                                        <table
                                                                            className="min-w-full divide-y  text-left">
                                                                            <thead className="bg-gray-100">
                                                                                <tr className="h-14 text-gray-500 text-sm">
                                                                                    <th scope="col"
                                                                                        className="sticky z-10 top-0 bg-gray-100 px-6 py-3 text-left text-xs text-gray-500 font-bold uppercase tracking-wider cursor-pointer">
                                                                                        คำถาม</th>
                                                                                    <th scope="col"
                                                                                        className="sticky z-10 top-0 bg-gray-100 px-6 py-3 text-left text-xs text-gray-500 font-bold uppercase tracking-wider cursor-pointer">
                                                                                        คะแนนเต็ม</th>
                                                                                    <th scope="col"
                                                                                        className="sticky z-10 top-0 bg-gray-100 px-6 py-3 text-left text-xs text-gray-500 font-bold uppercase tracking-wider cursor-pointer">
                                                                                        คะแนนที่ได้</th>
                                                                                </tr>
                                                                            </thead>

                                                                            <div className="contents ">
                                                                                <tbody className="min-w-full">
                    
                                                                                        <tr v-for="(val, index) in value.formlist"
                                                                                        :key="index"
                                                                                            className="odd:bg-white even:bg-slate-50 ">
                                                                                            <td scope="col"
                                                                                                className="sticky z-10 top-0 px-6 py-3 text-left text-xs  tracking-wider cursor-pointer">
                                                                                                {{ val.question }}
                                                                                            </td>                                                                                            
                                                                                            <td scope="col"
                                                                                                className="sticky z-10 top-0 px-6 py-3 text-left text-xs tracking-wider cursor-pointer">
                                                                                                {{ val.scorequestion_total }}
                                                                                            </td>
                                                                                            <td scope="col"
                                                                                                className="sticky z-10 top-0 px-6 py-3 text-left text-xs  tracking-wider cursor-pointer">
                                                                                                {{ val.scoreans }}</td>
                                                                                        </tr>
                                                                                   
                                                                                </tbody>
                                                                            </div>

                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                        </tr>
                                                    </div>
                                                </div>
                                            </tbody>
                                        </div>
                                        <tfoot className="bg-gray-100">
                                            <tr className="h-14 text-gray-500 text-sm grid grid-cols-12">
                                                <th scope="col"
                                                    className="col-span-3 sticky z-10 top-0 bg-gray-100 px-6 py-3 text-left text-xs text-gray-500 font-bold uppercase tracking-wider cursor-pointer">
                                                    รวม</th>
                                                <th scope="col"
                                                    className="col-span-3 sticky z-10 top-0 bg-gray-100 px-6 py-3 text-left text-xs text-gray-500 font-bold uppercase tracking-wider cursor-pointer">
                                                    <div class="flex flex-col gap-1">
                                                        <label
                                                        v-if="tmp.scoredoc_total_all.length != 1" v-for="ops in tmp.scoredoc_total_all">
                                                            {{
                                                                converterTimes(ops.scoredoc_timer) }}</label>
                                                        <label>{{ 'all' }}</label>

                                                    </div>
                                                </th>
                                                <th scope="col"
                                                    className="col-span-3 sticky z-10 top-0 bg-gray-100 px-6 py-3 text-left text-xs text-gray-500 font-bold uppercase tracking-wider cursor-pointer">
                                                    <div class="flex flex-col gap-1">
                                                        <label v-if="tmp.scoredoc_total_all.length != 1"
                                                            v-for="ops in tmp.scoredoc_total_all">{{ ops.scoredoc_total
                                                            }}</label>
                                                        <label>{{ tmp.scoredoc_total_all.reduce((curr, prev) => curr +
                                                            prev.scoredoc_total, 0) }}</label>
                                                    </div>
                                                </th>
                                                <th scope="col"
                                                    className="col-span-2 sticky z-10 top-0 bg-gray-100 px-6 py-3 text-left text-xs text-gray-500 font-bold uppercase tracking-wider cursor-pointer">
                                                    <div class="flex flex-col gap-1">
                                                        <label v-if="tmp.scoredoc_total_all.length != 1"
                                                            v-for="ops in tmp.scoredoc_total_all">{{ ops.scoredoc_receive
                                                            }}</label>
                                                        <label>{{ tmp.scoredoc_total_all.reduce((curr, prev) => curr +
                                                            ((prev.scoredoc_receive) ? prev.scoredoc_receive : 0), 0)
                                                        }}</label>
                                                    </div>
                                                </th>
                                                <th scope="col"
                                                    className="col-span-1 sticky z-10 top-0 bg-gray-100 px-6 py-3 text-left text-xs text-gray-500 font-bold uppercase tracking-wider cursor-pointer">
                                                </th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                <br>
                                <h1 class="font-extrabold text-lg">Example</h1>
                                <div class="p-3 bg-gray-200 rounded-xl">
                                    <div class="p-4 bg-gray-200 rounded-lg text-lg font-semibold uppercase">{{ tmp.docname
                                    }}</div>
                                    <div v-for="list in tmp.inform">
                                        <hr>
                                        <div class="w-full p-5 mt-2 bg-gray-100 rounded-lg flex flex-col">
                                            <label class="uppercase font-semibold">{{ `${list.title} (${ converterTimes(list.scoreform_total_all[0].scoreform_timer)})`}}</label>
                                            <div v-for="choice in list.formlist">
                                                <div class="w-full p-3  bg-gray-100 rounded-lg flex flex-col">
                                                    <label class="rounded-lg p-2">{{ choice.question }}</label>
                                                    <!-- FEILDTEXT -->

                                                    <div v-if="choice.types == 'Fieldtext'">
                                                        <div class="rounded-l border-2 p-2 mt-2 w-full bg-white"
                                                            placeholder="ข้อความแบบตอบข้อความ">{{ choice.answer[0] }}
                                                        </div>
                                                    </div>
                                                   

                                                    <!-- {{ choice.choices }} -->
                                                    <!-- Radio -->
                                                    <div v-if="choice.types == 'Radio'">
                                                        <div v-for="(order, ind) in choice.choices" :key="ind">
                                                            <div class="flex items-center mb-1 gap-2 mt-1">
                                                                <input type="radio" id="{{`radio ${val.question+1}`}}"
                                                                    class="w-4 h-4 rounded-full border-[1px] text-blue-600 bg-white border-gray-400 focus:ring-blue-500  dark:ring-offset-gray-800 focus:ring-2"
                                                                    :checked="order.choice[0] == choice.answer[0]"
                                                                    disabled />
                                                                <label class="bg-transparent p-2 outline-none  bg-white">{{
                                                                    order.choice[0] }}</label>
                                                            </div>

                                                            <div v-for="(option, opt) in choice.choices[ind].choice "
                                                                v-if="(choice.choices[ind].choice[1] == 'OPTIONS') && (choice.answer) && (choice.answer[0] == choice.choices[ind].choice[0])">
                                                                <div v-if="opt >= 1"
                                                                    class="flex flex-col gap-2 mb-2 bg-white p-4 rounded-lg">
                                                                    <label class="rounded-lg p-2">{{ `${ind + 1}.${opt - 1}${option}` }}</label>
                                                                    <div class="p-1 rounded-lg border-2">
                                                                        {{ choice.answer[opt - 1] }}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                      
                                                            <div v-if="(choice.choices[ind].choice[1] == 'IMAGE') &&  (choice.answer) && (choice.answer[0] == choice.choices[ind].choice[0])">
                                                            <label>รูปประกอบ</label>
                                                            <!-- <div class="grid grid-cols-5 p-6 border-2 border-dashed border-gray-200 rounded-lg"> -->
                                                            <div class="flex flex-wrap gap-6 p-6 border-2 border-dashed border-gray-200 rounded-lg">
                                                                    <div v-for="(option,opt) in choice.answer" :key="opt">
                                                                        <IMG v-if="opt != 0" :filepath="`checklist/private/example/${tmp.id}/${option}`" />
                                                                    </div>
                                                                </div>  
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <!-- CHECKBOX -->
                                                    <!-- {{ val }} -->
                                                    <div v-if="choice.types == 'Checkbox'">
                                                        <div v-for="(order, ind) in choice.choices" :key="ind">
                                                            <div class="mb-1 gap-2 mt-1">
                                                                <div v-for="(citem, num) in order.choice" :key="num"
                                                                    class="flex flex-col">
                                                                    <div class="flex flex-row items-center">
                                                                        <input type="checkbox" v-bind:value="citem"
                                                                            class="w-4 h-4 text-blue-600 bg-white border-[1px] border-gray-400 focus:ring-blue-500  dark:ring-offset-gray-800 focus:ring-2" :checked="choice.answer.some(v=>citem == v)" disabled/>
                                                                        <label class="bg-transparent p-2 outline-none">{{ citem }}</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <!-- Image -->
                                                    <div v-if="choice.types == 'Image'">
                                                        <label>รูปประกอบ</label>
                                                        <div class="grid grid-cols-5 p-6 border-2 border-dashed border-gray-200 rounded-lg">
                                                            <div class="relative flex flex-row-reverse" v-for="(option,opt) in choice.answer" :key="opt">
                                                                <IMG :filepath="`checklist/private/example/${tmp.id}/${option}`" />
                                                            </div>
                                                        </div>  
                                                    
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="w-full col-span-12 h-[62px]">
                        </div>

                    <div
                        className="absolute bottom-0 w-full col-span-12 h-fit bg-gray-100 px-4 py-3 sm:px-6 flex flex-row-reverse gap-4">
                        <RouterLink to="/" type="button"
                            className="text-sm h-fit w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto items-center cursor-pointer">
                            ปิด</RouterLink>
                    </div>

                </div>
            </div>

        </div>
    </div>
</div>
</template>