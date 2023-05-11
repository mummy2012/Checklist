<script lang='ts' setup>
import { informationAPI } from '../service/information';
import { Ref,ref, watchEffect } from 'vue';
import {scoredoc} from '../types/sheetans';
import { useRouter } from 'vue-router';

const props = defineProps<{ id: string,role: string , modalChoose:boolean }>()
const choiceform:Ref<orderchoice[]> = ref([]) 
const router = useRouter()
interface orderchoice{
    id:string;
    docname:string;
    scoredoc_all_total:scoredoc[];
}
const go=(docid:string)=>{
    try {
        const isConfirm = confirm(`เลือกข้อสอบชุดนี้ใช่หรือไม่?`)
        if (isConfirm) {
            router.push(`/information/${props.role}/${props.id}/${docid}`) 
        }
 
    }catch(error: any) {
        alert(error.message)
    }
}
watchEffect(async()=>{
    if (props.id && props.role ) {
        try {
            const response = await informationAPI.checkOpen(props.id,props.role)
            choiceform.value = response.message;
            
        } catch (error:any) {
            alert(error.message)
        }

    }
})
</script>
<template>
    <div class="relative z-10" v-if="modalChoose">

<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

<div class="flex items-center sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
    <div class="fixed z-10 inset-0 overflow-y-auto p-0 sm:p-10">
        <div class="flex items-center sm:items-center justify-center min-h-full p-4 text-center sm:p-0 h-auto">

            <div class="relative bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 w-full max-w-5xl sm:w-full md:my-8 m-0 h-full grid grid-cols-12">
                
                <div class="col-span-12 h-full overflow-y-auto">
                    
                    <div class="px-4 py-5 sm:px-6">
                        <h3 class="text-lg font-medium leading-6 text-gray-900">เลือกทำแบบฟอร์ม</h3>
                    </div>
                    <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                        <div class="grid grid-cols-4 gap-4" v-for="order in choiceform">
                            <div class="col-span-2 sm:col-span-1">
                                <button @click="go(order.id)" class="p-6 w-full border border-gray-200 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 duration-300 focus:ring-offset-2 focus:ring focus:ring-blue-500">
                                    {{order?.docname}}
                                </button>
                            </div>
                            
                        </div>
                    </div>
                </div>

                <!-- <div class="w-full col-span-12 h-[62px] ">
                </div> -->

                <!-- <div class="absolute bottom-0 w-full col-span-12 h-fit bg-gray-50 px-4 py-3 sm:px-6 flex flex-row-reverse gap-4">
                    <button type="button" class="text-sm h-fit w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto items-center cursor-pointer duration-300 disabled:text-gray-400 disabled:bg-gray-200">ดำเนินการต่อ</button>
                    <button type="button" class="text-sm h-fit w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto items-center cursor-pointer duration-300">ปิด</button>
                </div> -->
                
            </div>
        </div>
        
    </div>
</div>

</div>

</template>