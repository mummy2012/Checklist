<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { informationAPI } from '../service/information';
import { ref, reactive, onMounted, onUnmounted, Ref, watchEffect } from 'vue'
import { RouterLink, useRoute } from "vue-router";
import { useBuStore } from '../store/bustore'

const bu = useBuStore();

watchEffect(() => {
    if (bu.bustore.length == 0) {
        bu.getbu()
    }
})

const route = useRoute();
const role = ref('')
const selectbu = ref('')
const information: Ref<manageform[]> = ref([{ id: "", docname: "", role: "", status: false, bu: '' }])
const tmp = ref()
const tmpbu = ref([])
interface manageform {
    id: string,
    docname: string,
    role: string,
    status: boolean,
    bu: string,
}


switch (route.params.id) {
    case 'ASM': { role.value = 'AM'; break; }
    case 'RSM': { role.value = 'RM'; break; }
    case 'BSM': { role.value = 'BM'; break; }
    case 'TRAINING': { role.value = 'TRAIN'; break; }
}

const remove = async (id: string | object, docname: string) => {
    try {
        const isConfirm = confirm(`คุณยืนยันที่จะลบรายการ ${docname} ใช่หรือไม่ ?`)
        if (isConfirm) {
            informationAPI.deleteFormById(id)
                .then(() => information.value.forEach((val, ind) => { if (val.id == id) information.value.splice(ind, 1) }))
                .catch(error => {
                    console.log(error)
                })
        }
    } catch (error: any) {
        alert(error)
    }
}

const changestatus = async (id: string | object, roles: string, status: boolean, index: number, bu: string) => {
    try {
        const check = confirm(`คุณต้องการ${status ? "เปิดการใช้งาน" : "ปิดการใช้งาน"}ใช้หรือไม่`)
        if (check) {
            await informationAPI.changeStatus(id, roles, status, bu)
                .then((res) => (information.value.forEach(element => {
                    (element.id != id && element.bu == bu) ? element.status = false : (element.bu == bu) ? element.status = status : element.status = element.status
                })))
                .catch((error: any) => {
                    alert(error)
                })
        }
    } catch (error: any) {
        alert(error)
    }
}

onMounted(() => {
    const result = informationAPI.getFormByAdmin(role.value)
        .then((res) => {
            information.value = res.message
        }).catch((error) => {
            console.log(error)
        })

})



const selectedOptions = ref<string[]>([])
const menuOpen = ref(false)
const buttonRef = ref<HTMLButtonElement | null>(null)
const menuRef = ref<HTMLDivElement | null>(null)

const handleOptionSelect = (event: InputEvent) => {
    const target = event.target as HTMLSelectElement
    selectedOptions.value = Array.from(target.selectedOptions, (option) => option.value)
}

const toggleMenu = () => {
    menuOpen.value = !menuOpen.value
}

onMounted(() => {
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
</script>

<template>
    <div class="flex-col flex px-4 sm:px-6 pb-10">
        <div class="pt-6">
            <RouterLink :to="{ name: 'manageform' }" class="flex flex-row items-center gap-4 group cursor-pointer">
                <div class="group-hover:bg-slate-200 rounded-full">
                    <Icon icon="ic:outline-keyboard-arrow-left" width="24" height="24" />
                </div>
                <p class="text-blue-500 text-sm">{{ `จัดการแบบฟอร์ม ${$route.params.id}` }}</p>
            </RouterLink>
            <div class="flex flex-row justify-between">
                <RouterLink :to="`/createform/${$route.params.id}`"
                    class="p-2 bg-[#3B82F6] rounded-lg flex flex-row items-center justify-center gap-1 text-sm text-amber-50 mt-2 sm:mt-3 max-w-[10rem]">
                    <Icon icon="ic:baseline-plus" width="24" height="24" />
                    <div>สร้างแบบฟอร์ม</div>
                </RouterLink>
                <div class="relative">
                    <label for="candidates" class="text-sm font-medium leading-6 text-gray-900">
                        เลือก BU ที่ใช้แบบฟอร์ม
                    </label>
                    <button
                        class="inline-flex w-full max-w-xs justify-between h-10 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 duration-300 hover:ring-2 hover:ring-blue-500"
                        type="button" ref="buttonRef" :aria-haspopup="menuOpen" :aria-expanded="menuOpen"
                        @click="toggleMenu">
                        <span>เลือก</span>
                    </button>
                    <div v-if="menuOpen" ref="menuRef"
                        class="z-10 absolute mt-2 left-0 w-full border border-gray-300 p-1 bg-white shadow-sm rounded-lg">
                        <div class="w-full">
                            <select multiple v-model="tmpbu" @change="tmpbu.push()"
                                class="w-full outline-none overflow rounded-lg">
                                <option v-for="(option, index) in bu.bustore" :key:="index" :value="option.buname"
                                    class="p-2">
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
            </div>
            <div class="mt-3" v-for="(val, ind) in information" :key="ind">
                <div class=" inline-flex justify-between flex-col sm:flex-row relative items-start sm:items-center py-2 px-6 max-md:px-4 w-full text-sm font-medium border-b  rounded-xl bg-white hover:bg-gray-50 focus:z-10 duration-300 group"
                    v-if="selectbu == '' || selectbu == val.bu">
                    <div class="flex flex-col">
                        <div class="text-sm font-medium text-blue-500">{{ `${val.docname}` }}</div>
                        <div>
                            <div class="flex flex-row flex-wrap w-full gap-1 mt-3">
                                <div class="flex flex-row rounded-xl bg-sky-300 gap-1 px-2 py-0.5 " v-for="(opt, ops) in val.bu" :key="ops">
                                    <label>{{ opt }}</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-row gap-2 max-md:gap-3 mt-3 sm:mt-0">
                        <button v-if="val.status" @click="changestatus(val.id, role, !val.status, ind, val.bu)"
                            class="px-4 py-2 border border-gray-100 shadow-sm bg-green-500 text-white flex justify-center items-center rounded-lg text-sm font-[poppins] cursor-pointer hover:bg-green-500 hover:text-white duration-300">{{
                                (val.status) ? `เลือกใช้งานอยู่` : `เลือก` }}</button>
                        <button v-if="!val.status" @click="changestatus(val.id, role, !val.status, ind, val.bu)"
                            class="px-4 py-2 border border-gray-100 shadow-sm bg-gray-100 text-gray-500 flex justify-center items-center rounded-lg text-sm font-[poppins] cursor-pointer hover:bg-green-500 hover:text-white duration-300 focus:bg-green-500 focus:text-white ">{{
                                (val.status) ? `เลือกใช้งานอยู่` : `เลือก` }}</button>
                        <RouterLink :to="`/editform/${val.id}`"
                            class="px-4 py-2 border border-gray-100 shadow-sm bg-gray-100 text-gray-500 flex justify-center items-center rounded-lg text-sm font-[poppins] cursor-pointer hover:bg-amber-500 hover:text-white duration-300">
                            แก้ไข</RouterLink>
                        <button @click="remove(val.id, val.docname)"
                            class="px-4 py-2 border border-gray-100 shadow-sm bg-gray-100 text-gray-500 flex justify-center items-center rounded-lg text-sm font-[poppins] cursor-pointer hover:bg-rose-500 hover:text-white duration-300">ลบ</button>
                    </div>
                </div>
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

select:focus option:checked {
    background: #3b82f6 linear-gradient(0deg, #3b82f6 0%, #3b82f6 100%);
}
</style>