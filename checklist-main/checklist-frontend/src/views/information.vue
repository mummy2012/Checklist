<script lang="ts" setup>
import { Ref, ref, watchEffect, onMounted } from "vue";
import { Icon } from '@iconify/vue';
import { informationAPI } from "../service/information";
import { sheetAPI } from "../service/sheet";
import { sheetans, timer, scoredoc } from "../types/sheetans";
import { FilePreview } from "../types";
import { useRoute, useRouter } from "vue-router";
import Modaltotalscore from "../components/modaltotalscore.vue";
import checkinModal from "../components/checkinModal.vue";
import { useAuthStore } from '../store/auth';


interface FileID extends FilePreview {
    id?: string;
    no?: string;
    file: File
}

const router = useRouter()
const authStore = useAuthStore()
const route = useRoute();
const modalBool = ref(false)
const date = new Date();
const timenow = (date.getHours() * 60 + date.getMinutes())
const information: Ref<sheetans> = ref({ basedocid: "", target_id: "", permission: "", bu: '', docname: "", status: false, scoredoc_total_all: [], inform: [{ title: "", scoreform_total_all: [], formlist: [{ question: "", types: "", scorequestion_total: 0, answer: [""], scoreans: 0, choices: [{ choice: [""], score: 0 }] }] }] });
const file: Ref<FileID[]> = ref([])
const gettimer: Ref<timer[]> = ref([])
const modalshow = ref(false)
const id = ref('')
const findind = (form: scoredoc[]) => {
    return form.findIndex((index) =>
        index.scoredoc_timer.time_start <= timenow && index.scoredoc_timer.time_end >= timenow
    )
}
const onSubmit = async (stats: boolean) => {
    try {
        const isConfirm = confirm(`คุณยืนยันที่ส่งใช่หรือไม่ ?`)
        if (isConfirm) {
            information.value.status = stats
            information.value.permission = route.params?.role as string
            information.value.target_id = route.params?.id as string
            information.value.scoredoc_total_all[findind(information.value.scoredoc_total_all)].scoredoc_check = { time_in: timenow, time_out: 0 }
            information.value.scoredoc_total_all[findind(information.value.scoredoc_total_all)].statusdoc = false;
            let form = new FormData()
            for (const files of file.value) {
                form.append(`${files.no}_${files.id}`, files.file)
            }
            form.append("information", JSON.stringify(information.value))
            const response = await sheetAPI.postsheet(form)
            .then(res=>{
                id.value = res.message as string
                modalBool.value = true
            }).catch((error)=>{
                alert(error)
            })
          
        }
    } catch (error: any) {
        alert(error.message)
    }
}

const compareArray = (a: any[], b: string[]) => {
    for (var i = 0; i < a.length; ++i) {
        const set1 = new Set(a[i].choice);
        const set2 = new Set(b);
        if (set1.size != set2.size) {
            continue;
        }
        else if ([...set1].sort().join() === [...set2].sort().join()) {
            return true;
        } else {
            continue;
        }

    }
    return false
}

const uploadFile = (e: Event, id: string) => {
    let files = (e.target as HTMLInputElement).files as FileList;
    for (let index = 0; index < files.length; index++) {
        const element = files[index];
        file.value.push({ ...element, file: element, url: URL.createObjectURL(element), id, no: file.value.length.toString() } as FileID)
    }

}

const findFile = (id: string) => {
    let find = file.value.filter((res) => res.id == id)
     return find
    
}

const findspace = (anwstring: string[]) => {
    for (var i = 0; i < anwstring.length; i++) {
        if (!anwstring[i]) return false
    }
    return true
}

const delteimg = (url: string) => {
    file.value.splice(file.value.findIndex(val => val.url == url), 1)
}

const checkimgEmtry = (id: string) => {
    if (file.value.findIndex((res) => res.id == id) == -1) {
        return false
    } else {
        return true
    }
}

onMounted(() => {
    authStore.setLoading(true)
    const result = informationAPI.getFormByRole(route.params?.role as string,route.params?.id as string,route.params.docid as string)
        .then((res) => {
            information.value = res.message
            if(information.value.inform.length != 0){
                information.value.scoredoc_total_all.forEach(ea => gettimer.value.push(ea.scoredoc_timer))
                authStore.setLoading(false)
            }else{
                alert('ไม่มีข้อสอบในเวลานี้')
                router.push('/')
            }
        }).catch((error) => {
            alert(error)
            authStore.setLoading(false)
        })
})

</script>

<template>
    <checkinModal :date="date" :time="gettimer" :file="file" />
    <Modaltotalscore :id="id" v-if="modalBool"/>
    <div class="flex flex-col px-4 sm:px-6 pb-10">
        <div class="bg-white container w-full place-self-center  h-full mt-6 rounded-2xl">
            <div class="p-5 max-md:p-2 h-full container min-h-full">
                <div v-for="(item, idx) in information?.inform" :key="idx">
                    <div class="w-full p-4 bg-gray-200 rounded-lg mt-6 text-lg font-semibold uppercase">{{ item.title }}
                    </div>
                    <div v-for="(val, index) in item.formlist" :key="index">
                        <div class="w-full p-5 mt-4 bg-gray-100 rounded-lg flex flex-col">
                            <label class="rounded-lg p-2">{{ `${index + 1}. ${val.question}` }}</label>
                            <!-- FEILDTEXT -->

                            <div v-if="val.types == 'Fieldtext'">
                                <input v-model="val.answer"
                                    @change="(val.scoreans && val.choices[0].score != 0) ? val.scoreans = val.choices[0].score : val.scoreans = val.choices[0].score"
                                    class="rounded-l border-2 p-2 mt-2 w-full bg-white"
                                    placeholder="ข้อความแบบตอบข้อความ" />
                            </div>

                            <!-- RADIO -->
                            <div v-if="val.types == 'Radio'">
                                <div v-for="(choice, ind) in val.choices" :key="ind">
                                    <div class="flex items-center mb-1 gap-2 mt-1">
                                        <input type="radio" id="{{`radio ${val.question+1}`}}" v-model="val.answer"
                                            v-bind:value="[choice.choice[0]]"
                                            @change="(val.scoreans && choice.choice == val.answer) ? val.scoreans = choice.score : (val.choices[ind].choice[1] != 'OPTIONS' && val.choices[ind].choice[1] != 'IMAGE') ? val.scoreans = + choice.score : val.scoreans = 0"
                                            class="w-4 h-4 rounded-full border-[1px] text-blue-600 bg-white border-gray-400 focus:ring-blue-500  dark:ring-offset-gray-800 focus:ring-2" />
                                        <label class="bg-transparent p-2 outline-none  bg-white">{{
                                            choice.choice[0]
                                        }}</label>
                                    </div>

                                    <div
                                        v-if="(val.choices[ind].choice[1] == 'IMAGE') && (val.answer) && (val.answer[0] == val.choices[ind].choice[0])">
                                        <input
                                            @change="uploadFile($event, `${idx}_${index}_${ind}`), (checkimgEmtry(`${idx}_${index}_${ind}`)) ? val.scoreans = choice.score : val.scoreans = 0"
                                            accept="image/jpg,image/jpeg,image/png,image/gif" type="file" multiple
                                            class="block w-full text-sm text-slate-500 my-4
                                                            file:mr-2 file:py-2 file:px-2 file:rounded-lg file:border file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 file:cursor-pointer hover:file:bg-gray-900 hover:file:text-white file:duration-300" />
                                        <label>รูปประกอบ</label>
                                        <div class="grid grid-cols-5 p-6 border-2 border-dashed border-gray-200 rounded-lg">
                                            <div class="relative"
                                                v-for="res in findFile(`${idx}_${index}_${ind}`)">
                                                <img class="w-48 h-48 object-center object-cover m-auto" :src="res.url" />
                                                <div @click="delteimg(res.url as string), (checkimgEmtry(`${idx}_${index}_${ind}`)) ? val.scoreans = choice.score : val.scoreans = 0"
                                                    class="absolute right-1 -top-2 text-white bg-gray-900 rounded-full flex justify-center items-center w-4 h-4 hover:bg-rose-500 cursor-pointer duration-300">
                                                    <div class="tooltip tooltip_delete">
                                                        <Icon icon="ic:round-minus" width="20" height="20" />
                                                        <span class="hidden sm:block tooltiptext tooltiptext_delete">
                                                            ลบ
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div v-for="(option, opt) in val.choices[ind].choice "
                                        v-if="(val.choices[ind].choice[1] == 'OPTIONS') && (val.answer) && (val.answer[0] == val.choices[ind].choice[0])">
                                        <div v-if="opt >= 2" class="flex flex-col gap-2 mb-2 bg-white p-4 rounded-lg">
                                            <label class="rounded-lg p-2">{{ `${index + 1}.${opt - 1} ${option}` }}</label>
                                            <input v-model="val.answer[opt - 1]"
                                                @change="(val.choices[ind].choice[1] == 'OPTIONS' && val.answer?.length === choice.choice.length - 1 && findspace(val.answer as string[])) ? val.scoreans = choice.score : val.scoreans = 0"
                                                class="p-1 rounded-lg border-2" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- CHECKBOX -->
                            <!-- {{ val }} -->
                            <div v-if="val.types == 'Checkbox'">
                                <div v-for="(choice, ind) in val.choices" :key="ind">
                                    <div class="mb-1 gap-2 mt-1">
                                        <div v-for="(citem, num) in choice.choice" :key="num" class="flex flex-col">
                                            <div class="flex flex-row items-center">
                                                <input type="checkbox" v-bind:value="citem"
                                                    @change="((!val.answer) ? val.answer = [citem] : (val.answer.includes(citem)) ? val.answer.splice(val.answer.indexOf(citem), 1) : val.answer.push(citem)) && compareArray(val.choices, val.answer as string[]) ? val.scoreans = choice.score : val.scoreans = 0"
                                                    class="w-4 h-4 text-blue-600 bg-white border-[1px] border-gray-400 focus:ring-blue-500  dark:ring-offset-gray-800 focus:ring-2" />
                                                <label class="bg-transparent p-2 outline-none">{{ citem }}</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- IMAGE -->
                            <div v-if="val.types == 'Image'">
                                <div>
                                    <input
                                        @change="uploadFile($event, `${idx}_${index}`), (checkimgEmtry(`${idx}_${index}`)) ? val.scoreans = val.choices[0].score : val.scoreans = 0"
                                        accept="image/jpg,image/jpeg,image/png,image/gif" type="file" multiple
                                        class="block w-full text-sm text-slate-500 mb-1 mt-3
                                                file:mr-4 file:py-2 file:px-2 file:rounded-lg file:border file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 file:cursor-pointer hover:file:bg-gray-900 hover:file:text-white file:duration-300" />
                                </div>
                                <label>รูปประกอบ</label>
                                <div class="grid grid-cols-5 p-6 border-2 border-dashed border-gray-200 rounded-lg">
                                    <div class="relative" v-for="res in findFile(`${idx}_${index}`)">
                                        <img class="w-48 h-48 object-center object-cover m-auto" :src="res.url" />
                                        <button
                                            @click="delteimg(res.url as string), (checkimgEmtry(`${idx}_${index}`)) ? val.scoreans = val.choices[0].score : val.scoreans = 0"
                                            class="absolute right-1 -top-2 text-white bg-gray-900 rounded-full flex justify-center items-center w-4 h-4 hover:bg-rose-500 cursor-pointer duration-300">
                                            <div class="tooltip tooltip_delete">
                                                <Icon icon="ic:round-minus" width="20" height="20" />
                                                <span class="hidden sm:block tooltiptext tooltiptext_delete">
                                                    ลบ
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="px-5 max-md:px-2 container">
                <div
                    class="w-full flex items-center p-3 bg-gray-100 rounded-2xl mb-10 max-md:p-3 flex-row justify-end gap-2">
                    <button @click="$router.back()"
                        class="text-sm h-fit w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto items-center disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:cursor-not-allowed">ยกเลิก</button>
                    <button @click="onSubmit(true)"
                        class="text-sm h-fit w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto items-center disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:cursor-not-allowed">ยืนยัน</button>
                </div>
            </div>

        </div>

    </div>
</template>

<style scoped>
.headercolor {
    color: #3B82F6;
}

.fontcolor {
    color: #6B7280;
}

.buttoncreate {
    background-color: #3B82F6;
}

.showmore {
    background-color: #EFF6FF;
    color: #3B82F6;
    font-family: 'Inter';
}
</style>