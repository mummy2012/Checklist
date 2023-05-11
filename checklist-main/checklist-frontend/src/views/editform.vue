<script lang="ts" setup>
import { reactive, ref, Ref, onMounted, watchEffect, onUnmounted } from "vue"
import { Icon } from '@iconify/vue';
import { FilePreview } from '../types/index';
import type { information, choices } from "../types/information";
import { informationAPI } from '../service/information';
import { useRoute, useRouter } from "vue-router";
import { useBuStore } from "../store/bustore";
import { useAuthStore } from '../store/auth';

const authStore = useAuthStore()
const bu = useBuStore();
const route = useRoute();
const tmpbu = ref([]);
const information: Ref<information> = ref({ docname: "", status: false, bu: tmpbu, inform: [{ title: "", formlist: [{ question: "", types: "", timer: [{ time_start: 540, time_end: 720 }], choices: [{ choice: [""], score: 0 }], scorequestion_total: 0 }] }] })
const menuOpen = ref(false);
const router = useRouter();
const buttonRef = ref<HTMLButtonElement | null>(null)
const menuRef = ref<HTMLDivElement | null>(null)


const onSubmit = () => {
    const isConfirm = confirm(`คุณยืนยันที่จะแก้ไขหรือไม่?`)
    if (isConfirm) {
        const edit = informationAPI.updateFormById(route.params.id, information.value)
        router.push('/')
    }
}

const onCreate = async () => {
    try {
        const isConfirm = confirm(`คุณยืนยันที่จะสร้างรายการ ${information.value.docname} ใช่หรือไม่ ?`)
        if (isConfirm) {
            const response = await informationAPI.createInformation(information.value)
            if(response.statusCode != 201) throw {message:response.message}
            router.push('/')
        }
    } catch (error: any) {
        alert(error.message)
    }
}


const addText = (idbtn: string, index: any) => {
    if (document.getElementById(idbtn)?.getAttribute('ariachecked') == 'false') {
        var tmp = index[0]
        index.splice(1, index.length - 1)
        index[0] = tmp
        index[1] = 'OPTIONS'
        index.push('')
    }
    if ((document.getElementById(idbtn)?.getAttribute('ariachecked') == 'true')) {
        index.splice(1, index.length - 1)
    }
}

const addImage = (idbtn: string, index: any) => {
    if (document.getElementById(idbtn)?.getAttribute('ariachecked') == 'false') {
        var tmp = index[0]
        index.splice(1, index.length - 1)
        index[0] = tmp
        index[1] = 'IMAGE'
    }
    if ((document.getElementById(idbtn)?.getAttribute('ariachecked') == 'true')) {

        index.splice(1, index.length - 1)
    }
}
const findmaxscore = (allchoices: Array<choices>) => {
    const tmp = allchoices.reduce((prev, curr) => {
        if (prev <= curr.score) prev = curr.score;
        return prev
    }, 0)
    return tmp
}

onMounted(()=>{

    authStore.setLoading(true)
    const result = informationAPI.getFormById(route.params.id)
        .then((res) => {
            information.value = res.message
            authStore.setLoading(false)

        }).catch((error) => {
            console.log(error)
            authStore.setLoading(false)
        })

    const handleClickOutside = (event: MouseEvent) => {
        if (
            buttonRef.value &&
            !buttonRef.value.contains(event.target as Node) &&
            menuRef.value &&
            !menuRef.value.contains(event.target as Node)
        ) {
            menuOpen.value = false
        }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            menuOpen.value = false
        }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    onUnmounted(() => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleKeyDown)
    })
})

watchEffect(() => {
    if (bu.bustore.length == 0) {
        bu.getbu()
    }
})
</script>

<template>
    <div class="flex-col flex px-4 sm:px-6 pt-6 pb-10 overflow-x-hidden">
        <div class="rounded-2xl relative container w-full place-self-center h-full mt-8">
            <div class="h-full container min-h-full">
                <div class="bg-white rounded-2xl px-4 py-5 sm:px-6 sm:shadow-sm">

                    <div class="text-base">สร้างแบบฟอร์ม</div>
                    <div class="text-gray-400 text-sm">Information</div>
                    <br>
                    <label class="text-sm">ชื่อแบบฟอร์ม</label>
                    <input v-model="information.docname"
                        class="block w-full p-2 rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none hover:ring-2 hover:ring-blue-500 duration-300"
                        placeholder="เช่น แบบฟอร์มที่ 1" required />
                </div>
                <div v-for="(item, idx) in information.inform">
                    <div class="bg-white rounded-2xl px-4 py-5 sm:px-6 mt-6 sm:shadow-sm">
                        <div>
                            <div class="flex flex-col-reverse sm:flex-row justify-between items-end">
                                <div class="w-full sm:w-1/2">
                                    <label class="text-sm">หัวข้อใหญ่ของคำถาม</label>
                                    <input v-model="item.title"
                                        class="block w-full p-2 rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none hover:ring-2 hover:ring-blue-500 duration-300"
                                        placeholder="เช่น INTERNAL CONTROL, STOCK MANAGEMENT, อื่นๆ" required />
                                </div>
                                <button v-if="information.inform.length != 1" @click="information.inform.splice(idx, 1)"
                                    class="text-gray-900 hover:text-rose-500 duration-300">
                                    <p class="underline font-semibold text-sm tooltip">ลบ<span
                                            class="hidden sm:block tooltiptext">ลบหัวข้อใหญ่ของคำถาม</span></p>
                                </button>
                            </div>
                            <br>

                            <div class="relative">
                                <label for="candidates" class="text-sm font-medium leading-6 text-gray-900">
                                    เลือก BU ที่ใช้แบบฟอร์ม
                                </label>
                                <button
                                    class="inline-flex w-full max-w-xs justify-between h-10 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 duration-300 hover:ring-2 hover:ring-blue-500"
                                    type="button" ref="buttonRef" :aria-haspopup="menuOpen" :aria-expanded="menuOpen"
                                    @click="menuOpen = !menuOpen">
                                    <span>เลือก</span>
                                </button>
                                <div v-if="menuOpen" ref="menuRef"
                                    class="z-10 absolute mt-2 left-0 w-full border border-gray-300 p-1 bg-white shadow-sm rounded-lg">
                                    <div class="w-full">
                                        <select multiple v-model="information.bu" @change="tmpbu.push()"
                                            class="w-full outline-none overflow rounded-lg">
                                            <option v-for="(option, index) in bu.bustore" :key:="index" 
                                                :value="option.buname" class="p-2">
                                                <span class="ml-2 text-gray-700"></span>
                                                {{ option.buname }}
                                            </option>
                                        </select>
                                        <p class="p-2 border-t border-gray-200">
                                            <span class="text-gray-500 mr-2">เลือก: </span>
                                            {{ tmpbu.join(', ') }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-row flex-wrap w-full gap-1 mt-3">
                                <div class="flex flex-row rounded-xl bg-sky-300 gap-1 px-2 " v-for="(opt, ops) in information.bu"
                                    :key="ops">
                                    <label>{{ opt }}</label>
                                    <span @click="tmpbu.splice(ops, 1)"
                                        class="rounded-full flex justify-center items-center">
                                        <Icon icon="gridicons:cross-circle" color="#fcedd3" width="10" height="10" />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div v-for="(val, index) in information.inform[idx].formlist" :key="index">
                            <div class="bg-blue-50 border border-gray-100 rounded-lg w-full p-5 mt-4  flex flex-col">
                                <!-- {{ val }} -->
                                <div class="w-full text-end">
                                    <button v-if="item.formlist.length != 1" @click="item.formlist.splice(index, 1)"
                                        class="tooltip tooltip_delete w-fit text-gray-500 hover:text-rose-500 duration-300">
                                        <Icon icon="ion:trash-outline" width="20" height="20" /><span
                                            class="hidden sm:block tooltiptext tooltiptext_delete">ลบคำถาม</span>
                                    </button>
                                </div>
                                <textarea rows="2" v-model="val.question"
                                    class="mt-2 block w-full p-2 rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none hover:ring-2 hover:ring-blue-500 duration-300"
                                    placeholder="ป้อนข้อความคำถาม" required />

                                <div class="grid grid-cols-2 gap-4 mt-4 w-full sm:w-1/2">
                                    <div className="col-span-2 sm:col-span-1">
                                        <label class="block text-sm font-medium text-gray-700">รูปแบบคำตอบ</label>
                                        <select v-model="val.types"
                                            @change="(val.types !== 'Radio') ? (val.choices = [{ choice: [''], score: 0 }], val.scorequestion_total = +0) : val.choices = [{ choice: ['Yes'], score: 0 }, { choice: ['No'], score: 0 }], val.scorequestion_total = +0"
                                            class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-pointer duration-300 hover:ring-blue-500 hover:ring-2">
                                            <option value="">Select</option>
                                            <option value="Fieldtext">Field Text</option>
                                            <option value="Radio">Radio</option>
                                            <option value="Checkbox">Checkbox</option>
                                            <option value="Image">Upload Image</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700">
                                            *กำหนดเวลา
                                        </label>
                                        <select v-model="val.timer" class="bg-white p-2 rounded-lg border-2 texts-center">
                                            <option
                                                :value="[{ time_start: 540, time_end: 720 }, { time_start: 780, time_end: 1200 }]">
                                                9.00am - 12.00pm,13.00pm - 20.00pm</option>
                                            <option :value="[{ time_start: 540, time_end: 720 }]">9.00am - 12.00pm</option>
                                            <option :value="[{ time_start: 780, time_end: 1200 }]">13.00pm - 20.00pm</option>
                                            <option :value="[{ time_start: 540, time_end: 1200 }]">9.00am - 20.00pm</option>
                                        </select>
                                    </div>
                                </div>
                                <label v-if="val.types === 'Radio'" class="text-gray-500 text-xs mt-2">*สำหรับรูปแแบคำตอบ
                                    Radio จะให้คำตอบเริ่มต้นคือ yes และ no</label>

                                <!-- FEILDTEXT -->
                                <div v-if="val.types == 'Fieldtext'">
                                    <input v-model="val.choices[0].choice"
                                        class="rounded-md border-2 p-2 mt-4 w-full sm:w-1/2 bg-gray-200"
                                        placeholder="คำตอบแบบป้อนข้อความ" disabled />
                                    <div class="flex flex-col mt-3">
                                        <label class="">ให้คะแนนคำตอบ</label>
                                        <input v-model="val.choices[0].score"
                                            @change="(val.scorequestion_total) ? val.scorequestion_total = + val.choices[0].score : val.scorequestion_total = + val.choices[0].score"
                                            class="block w-1/2 sm:w-1/6 p-2 rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none hover:ring-2 hover:ring-blue-500 duration-300" />
                                    </div>
                                </div>

                                <!-- Radio -->
                                <div v-if="val.types == 'Radio'">
                                    <div v-for="(choice, ind) in val.choices" :key="ind">
                                        <div class="flex flex-col justify-center py-3 gap-2">
                                            <div class="w-fulll">
                                                <input type="radio"
                                                    class="w-4 h-4 text-blue-600 bg-white border-gray-300 focus:ring-blue-500  dark:ring-offset-gray-800 focus:ring-2"
                                                    disabled />
                                                <input v-model="choice.choice[0]"
                                                    class="w-full sm:w-1/4 bg-transparent px-2 py-1 focus:border-b-2 focus:border-blue-500 border-b-2 border-gray-300 hover:border-b-2 hover:border-blue-500 outline-none duration-300"
                                                    :placeholder="(choice.choice[1]) ? `โปรดป้อนคำตอบตัวเลือกและคำถาม` : `ป้อนคำตอบตัวเลือก`">
                                            </div>
                                            <div v-if="choice.choice[1] == 'OPTIONS'">
                                                <label class="text-sm text-gray-700">เปิดใช้งานหากเพิ่มคำถามย่อย
                                                    ในคำตอบตัวเลือก</label>
                                                <div v-for="(option, ops) in choice.choice" :bind="ops">
                                                    <div v-if="ops >= 2" class="">
                                                        <div class="flex flex-row gap-4">
                                                            <textarea rows="2" v-model="choice.choice[ops]"
                                                                class="w-full mt-4 block p-2 rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none hover:ring-2 hover:ring-blue-500 duration-300"
                                                                :placeholder="`คำถามข้อที่ ${ops - 1}`" />
                                                            <button v-if="choice.choice.length != 3"
                                                                @click="choice.choice.splice(ops, 1)"
                                                                class="p-2 rounded-lg mt-2 text-sm flex gap-2 flex-row items-center text-gray-600 hover:text-rose-500 duration-300">
                                                                <p class="underline font-semibold text-sm tooltip">
                                                                    ลบ
                                                                    <span class="hidden sm:block tooltiptext">
                                                                        ลบคำถามย่อย
                                                                    </span>
                                                                </p>
                                                            </button>
                                                        </div>
                                                        <button v-if="ops == choice.choice.length - 1"
                                                            @click="choice.choice.push('')"
                                                            class="colorbutton p-2 rounded-lg mt-2 text-sm flex gap-2 flex-row items-center hover:bg-blue-100 duration-300 tooltip tooltip_button">
                                                            <Icon icon="ic:baseline-plus" color="#3b82f6" width="24"
                                                                height="24" />
                                                            <p class="text-sm">
                                                                เพิ่มคำถามย่อย
                                                                <span
                                                                    class="hidden sm:block tooltiptext tooltiptext_button">
                                                                    เพิ่มคำถามย่อยในคำตอบตัวเลือก
                                                                </span>
                                                            </p>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-if="choice.choice[1] == 'IMAGE'">
                                                <input @change="" accept="image/jpg,image/jpeg,image/png,image/gif"
                                                    type="file" disabled
                                                    class="block w-full text-sm text-slate-500 mb-1 mt-1
                                                file:mr-2 file:py-2 file:px-2 file:rounded-lg file:border file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 file:cursor-pointer hover:file:bg-gray-900 hover:file:text-white file:duration-300" />
                                            </div>
                                            <div class="flex flex-col">
                                                <label class="text-sm py-1">ให้คะแนนคำตอบ</label>
                                                <div class="flex flex-col gap-4 items-start">
                                                    <div class="flex flex-row gap-4 sm:gap-6 w-full items-center">
                                                        <input v-model="val.choices[ind].score"
                                                            @change="val.scorequestion_total = +findmaxscore(val.choices)"
                                                            class="block w-1/2 sm:w-1/4 p-2 rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none hover:ring-2 hover:ring-blue-500 duration-300" />
                                                        <button v-if="val.choices.length != 1"
                                                            @click="val.choices.splice(ind, 1)">
                                                            <p class="underline font-semibold text-sm tooltip">
                                                                ลบ
                                                                <span class="hidden sm:block tooltiptext">
                                                                    ลบตัวเลือกคำตอบ
                                                                </span>
                                                            </p>
                                                        </button>
                                                        <div class="flex gap-2 items-center w-full">
                                                            <label class="form-switch">
                                                                <input :id="`ctx${index}${ind}1`" type="checkbox"
                                                                    @click="addText((`ctx${index}${ind}1`), (choice.choice))"
                                                                    :ariachecked="choice.choice[1] == 'OPTIONS'"
                                                                    :checked="choice.choice[1] == 'OPTIONS'">
                                                                <i></i>

                                                            </label>
                                                            <span class="hidden sm:block text-xs text-gray-500">
                                                                กดเปิดใช้งานหากเพิ่มคำถามย่อย ในคำตอบตัวเลือก
                                                            </span>

                                                            <label class="form-switch ml-4 sm:ml-6">
                                                                <input :id="`ctx${index}${ind}2`" type="checkbox"
                                                                    @click="addImage((`ctx${index}${ind}2`), (choice.choice))"
                                                                    :ariachecked="choice.choice[1] == 'IMAGE'"
                                                                    :checked="choice.choice[1] == 'IMAGE'">
                                                                <i></i>
                                                            </label>
                                                            <span class="hidden sm:block text-xs text-gray-500">
                                                                กดเปิดใช้งานหากการอัปโหลดรูปภาพ ในคำตอบตัวเลือก
                                                            </span>

                                                        </div>
                                                    </div>
                                                    <button v-if="ind == val.choices.length - 1"
                                                        @click="val.choices.push({ choice: [''], score: 0 })"
                                                        class="colorbutton p-2 rounded-lg mt-2 text-sm flex gap-2 flex-row items-center hover:bg-blue-100 duration-300 tooltip tooltip_button">
                                                    <Icon icon="ic:baseline-plus" width="20" height="20" />
                                                    <p class="text-sm">
                                                            เพิ่มตัวเลือกคำตอบ
                                                            <span class="hidden sm:block tooltiptext tooltiptext_button">
                                                                เพิ่มคำตอบตัวเลือกแบบ Radio
                                                            </span>
                                                        </p>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div v-if="val.types == 'Checkbox'">
                                    <div class="grid grid-cols-2 gap-4 sm:gap-6 mt-6">
                                        <div v-for="(choice, ind) in val.choices" :key="ind"
                                            class="col-span-2 sm:col-span-1">
                                            <div
                                                class="flex flex-col gap-2 bg-white border-2 border-dashed border-gray-300 px-4 py-5 sm:px-6 rounded-lg">
                                                <div class="w-full flex justify-between">
                                                    <p class="text-sm text-gray-500">กลุมคำตอบที่ 1</p>
                                                    <button @click="val.choices.splice(ind, 1)">
                                                        <div class="text-gray-500 hover:text-rose-500 duration-300 tooltip">
                                                            <Icon icon="ion:trash-outline" width="20" height="20" />
                                                            <span class="hidden sm:block tooltiptext">
                                                                ลบกลุ่มคำตอบ
                                                            </span>
                                                        </div>
                                                    </button>
                                                </div>
                                                <div v-for="(citem, num) in choice.choice" :key="num"
                                                    class="flex flex-col gap-2">
                                                    <div class="flex items-center gap-4 mt-2">
                                                        <div class="flex gap-3 w-full items-center">
                                                            <input type="checkbox"
                                                                class="w-4 h-4 text-blue-600 bg-white border-[1px] border-gray-400 focus:ring-blue-500  dark:ring-offset-gray-800 focus:ring-2"
                                                                disabled />
                                                            <input v-model="choice.choice[num]"
                                                                class="w-full sm:w-1/2 bg-transparent px-2 py-1 focus:border-b-2 focus:border-blue-500 border-b-2 border-gray-300 hover:border-b-2 hover:border-blue-500 outline-none duration-300"
                                                                placeholder="ป้อนคำตอบตัวเลือก">
                                                        </div>
                                                        <button v-if="choice.choice.length != 1"
                                                            @click="choice.choice.splice(num, 1)">
                                                            <p class="underline font-semibold text-sm tooltip">
                                                                ลบ
                                                                <span class="hidden sm:block tooltiptext">
                                                                    ลบตัวเลือกคำตอบ
                                                                </span>
                                                            </p>
                                                        </button>
                                                    </div>
                                                    <button v-if="num == choice.choice.length - 1"
                                                        @click="choice.choice.push('')"
                                                        class="colorbutton w-fit p-2 rounded-lg mt-2 text-sm flex gap-2 flex-row items-center hover:bg-blue-100 duration-300 tooltip tooltip_button">
                                                        <Icon icon="ic:baseline-plus" width="20" height="20" />
                                                        <p class="text-sm">
                                                            เพิ่มตัวเลือกคำตอบ
                                                            <span class="hidden sm:block tooltiptext tooltiptext_button">
                                                                เพิ่มคำตอบตัวเลือกแบบ checkbox
                                                            </span>
                                                        </p>
                                                    </button>
                                                </div>
                                                <div class="flex flex-col w-full">
                                                    <label class="">ให้คะแนนคำตอบ</label>
                                                    <div class="flex flex-row items-center gap-2">
                                                        <input v-model="val.choices[ind].score"
                                                            class="rounded-l border-2 p-2 w-1/2 sm:w-1/4 bg-white"
                                                            @change="val.scorequestion_total = +findmaxscore(val.choices)" />
                                                        <!-- <button @click="val.choices.splice(ind,1)">
                                                            <Icon icon="ion:trash-outline" width="24" height="24" />
                                                        </button> -->
                                                    </div>
                                                </div>
                                            </div>

                                            <!--ช่องให้คะแนยยังไม่ได้ทำ-->
                                        </div>
                                    </div>
                                    <button
                                        class="mt-6 w-full sm:w-fit border-2 p-2 rounded-lg text-sm flex justify-center gap-2 flex-row items-center hover:bg-blue-500 border-blue-500 text-blue-500 hover:text-white hover:border-transparent duration-300"
                                        @click="val.choices.push({ choice: [''], score: 0 })">
                                        <Icon icon="ic:baseline-plus" width="20" height="20" />
                                        <div>เพิ่มกลุ่มคำตอบ</div>
                                    </button>
                                    <div>
                                    </div>
                                </div>
                                <div v-if="val.types == 'Image'">
                                    <div>
                                        <input @change="" accept="image/jpg,image/jpeg,image/png,image/gif" type="file"
                                            class="mt-6 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-2 file:rounded-lg file:border file:text-sm file:font-medium file:bg-gray-200 file:text-gray-500 hover:file:bg-gray-200 hover:file:text-gray-500 file:duration-300"
                                            disabled />
                                    </div>
                                    <label class="mt-2">ให้คะแนนคำตอบ</label>
                                    <input v-model="val.choices[0].score"
                                        @change="(val.scorequestion_total) ? val.scorequestion_total = + val.choices[0].score : val.scorequestion_total = + val.choices[0].score"
                                        class="block w-1/2 sm:w-1/6 p-2 rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none hover:ring-2 hover:ring-blue-500 duration-300" />
                                </div>

                            </div>
                            <button v-if="index === (item.formlist.length - 1)"
                                @click="item.formlist.push({ question: '', types: '', timer: [{ time_start: 540, time_end: 720 }], scorequestion_total: 0, choices: [{ choice: [''], score: 0 }] })"
                                class="colorbutton p-2 rounded-lg mt-2 text-sm flex gap-2 flex-row items-center hover:bg-blue-100 duration-300">
                                <Icon icon="ic:baseline-plus" color="#3b82f6" width="24" height="24" />
                                <div>เพิ่มคำถามข้อใหม่</div>
                            </button>
                        </div>
                    </div>

                </div>
                <div class="px-4 py-5 sm:px-6">
                    <button
                        @click="information.inform.push({ title: '', formlist: [{ question: '', types: '', timer: [{ time_start: 540, time_end: 720 }], scorequestion_total: 0, choices: [{ choice: [''], score: 0 }] }] })"
                        class="w-full sm:w-fit border-2 p-2 rounded-lg mt-2 text-sm flex justify-center gap-2 flex-row items-center hover:bg-blue-500 border-blue-500 text-blue-500 hover:text-white hover:border-transparent duration-300">
                        <Icon icon="ic:baseline-plus" width="24" height="24" />
                        <div>สร้างหัวข้อใหญ่ของคำถามใหม่</div>
                    </button>
                </div>
            </div>

            <div
                class="w-full sticky bottom-0 flex items-center p-3 bg-white rounded-2xl mb-10 max-md:p-3 flex-row justify-end gap-2">
                <button @click="$router.back()"
                    class="text-sm h-fit w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto items-center disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:cursor-not-allowed">ยกเลิก
                </button>
                <button @click="onCreate"
                    class="text-sm h-fit w-full inline-flex justify-center rounded-md border border-gray-500 shadow-sm px-4 py-2 bg-emerald-500 font-medium text-amber-50 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto items-center disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:cursor-not-allowed">สร้างใหม่
                </button>
                <button @click="onSubmit"
                    class="text-sm h-fit w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto items-center disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:cursor-not-allowed">ยืนยัน</button>
            </div>
        </div>

    </div>
</template>

<style>
.colorbutton {
    color: #3b82f6;
    border-color: #3b82f6;
}
</style>