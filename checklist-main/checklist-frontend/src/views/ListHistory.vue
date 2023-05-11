<script setup lang="ts">
import { Icon } from '@iconify/vue';
import {ref,onMounted , Ref} from 'vue';
import { useRoute } from "vue-router";
import { sheetAPI } from '../service/sheet';
import { scoredoc } from '../types/sheetans'
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';
import modaltotalscore from '../components/modaltotalscore.vue';
import chooseformModal from '../components/chooseFormModal.vue'
const authStore = useAuthStore()
const router = useRouter()
const tmp:Ref<historyshow[]> = ref([])
const route = useRoute();
const id= ref('');
const modalshow = ref(false)
const modalChoose = ref(false)
interface historyshow { 
    _id : string,
    creater_id : string,
    time_create : string,
    detail : scoredoc[],
    status : boolean,
}

const converterTime=(time:number)=>{
   return (Math.floor((time) / 60) + (time) % 60 / 100).toFixed(2)
}

const converterDate=(day:Date)=>{
    const date = new Date(day)
    return(`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`)
}

const runNext=(obs:historyshow)=>{
    if(obs.status){
        id.value =  obs._id
        modalshow.value = !modalshow.value
    }else{
        var time = new Date()
        var converttime = new Date(obs.time_create)
        var timeToNum = time.getHours()*60+time.getMinutes()
        if( time.getDate() != converttime.getDate() || time.getMonth() != converttime.getMonth() || time.getFullYear() != converttime.getFullYear() ){
            id.value =  obs._id
            modalshow.value = !modalshow.value
        }else{
            if(!(obs.detail.filter(val=>(val.scoredoc_timer.time_start <= timeToNum) &&  (timeToNum < val.scoredoc_timer.time_end))[0].statusdoc)){
                router.push(`/information/AM/${route.params?.id}`)
            }else{
                id.value =  obs._id
                modalshow.value = !modalshow.value
            }
        }
    }

}

const chooseform =()=>{
    modalChoose.value =! modalChoose.value
}


onMounted(()=>{
    authStore.setLoading(true)
    const result = sheetAPI.gethistory(route.params.id as string)
    .then((res) => {
        tmp.value = res.message
        authStore.setLoading(false)
    }).catch((error) => {
        alert(error)
        authStore.setLoading(false)

    })
})
</script>
<template>
    <modaltotalscore :id="id" v-if="modalshow"/>
    <chooseformModal :id="route.params.id as string" :role="route.params.role as string" :modalChoose="modalChoose"/>
    <div class="flex-col flex px-4 sm:px-6 pt-6 pb-10">            
        <RouterLink to="/" class="group-hover:bg-slate-200 rounded-full flex gap-4 items-center cursor-pointer group">
            <div class="group-hover:bg-slate-200 rounded-full">
                <Icon icon="ic:outline-keyboard-arrow-left" width="24" height="24" />
             </div>
            <p class="text-blue-500 text-sm">ตรวจร้าน</p>
        </RouterLink>
        <br>
        <div class="bg-white w-full px-4 sm:px-6 py-5 rounded-t-xl flex flex-row max-md:flex-col md:justify-between">
            <div>
                <p class="fontheader mb-1">ประวัติการตรวจร้าน</p>
                <div class="flex flex-row gap-2 ">
                    <Icon icon="material-symbols:location-on" width="24" height="24" />
                    <p class="fontheader">{{route.params?.name}}</p>
                </div>
            </div>
            
            <!-- <RouterLink :to="{path:`/information/AM/${route.params?.id}`}" class="buttoncreate rounded-xl flex h-10  md:flex-row items-center p-5 max-md:p-2 gap-1 max-md:mt-2 max-md:justify-center hover:bg-blue-700 duration-300">
                <div  class="flex flex-row gap-2 items-center">
                    <Icon icon="material-symbols:add-circle-outline" color="white" width="24" height="24" class="" />
                    <p class="text-white text-sm">ทำแบบฟอร์มตรวจร้าน</p>
                </div>
            </RouterLink> -->
            <button @click="chooseform" class="buttoncreate rounded-xl flex h-10  md:flex-row items-center p-5 max-md:p-2 gap-1 max-md:mt-2 max-md:justify-center hover:bg-blue-700 duration-300">
                <div  class="flex flex-row gap-2 items-center">
                    <Icon icon="material-symbols:add-circle-outline" color="white" width="24" height="24" class="" />
                    <p class="text-white text-sm">ทำแบบฟอร์มตรวจร้าน</p>
                </div>
            </button>
            
        </div>
        <hr>
        <div class="bg-white w-full sm:px-6 pb-6">
            <div v-for="(val,ind) in tmp" :bind="ind" class="flex flex-col lg:flex-row gap-4 sm:gap-6 p-4 sm:p-6 hover:bg-gray-50 cursor-pointer duration-300 border-b border-gray-100">
                
                <div className="bg-gray-100 w-full h-44 lg:w-32 lg:h-32 rounded-xl object-cover"></div>
                <div @click="runNext(val)" class="flex flex-col ">
                    <div class="gap-2 flex flex-row mb-2">
                        <p class="text-gray-400">ชื่อผู้ตรวจสอบ:</p>
                        <p class="text-blue-600">{{ val.creater_id }}</p>
                    </div>
                    <div class="gap-2 flex flex-row items-center">
                        <Icon icon="uil:calender" width="20" height="20" class="text-gray-400"/>
                        <p>วันที่:</p>
                        <p>{{converterDate(val.time_create as unknown as Date)}}</p>
                    </div>
                    <div class="gap-1 md:gap-3  flex flex-row mt-1 max-md:flex-col" v-for="(value,inx) in val.detail" :bind="inx">
                        <div class="gap-1 flex flex-row">
                            <p class="text-gray-400">Time In:</p>
                            <p>{{ (value.scoredoc_check.time_out)?converterTime(value.scoredoc_check.time_in):'-'}}</p>
                        </div>
                        <Icon icon="material-symbols:arrow-right-alt-rounded" width="20" height="20" class="text-gray-900 max-md:hidden" />
                        <div class="gap-1 flex flex-row">
                            <p class="text-gray-400">Time Out:</p>
                            <p>{{ (value.scoredoc_check.time_out)?converterTime(value.scoredoc_check.time_out):'-'}}</p>
                        </div>
                        <Icon icon="bi:dot" width="24" height="24" class=" text-gray-400 max-md:hidden"/>
                        <div class="gap-2 flex flex-row items-center">
                            <Icon icon="ic:baseline-access-time-filled" width="20" height="20" class="text-gray-400" />
                            <p>{{`${(value.scoredoc_check.time_in && value.scoredoc_check.time_out)?value.scoredoc_check.time_out-value.scoredoc_check.time_in:'0'} นาที`}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-4 sm:p-6" v-if="tmp.length >=5">
                <button class="showmore text-sm p-3 rounded-lg"> ดูเพิ่มเติม </button>
            </div>
        </div>
    </div>
</template>

<style> 
.fontheader{
    font-family: 'Inter';
    font-weight: Medium;
    font-weight: 500;
}
.headercolor{
    color:#3B82F6;
}
.fontcolor{
    color: #6B7280;
}
.buttoncreate
{
    background-color:#3B82F6;
}
.showmore
{
    background-color: #EFF6FF;
    color:#3B82F6;
    font-family: 'Inter';
}


</style>