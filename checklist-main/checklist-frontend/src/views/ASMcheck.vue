<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { Ref,ref,onMounted, watchEffect } from 'vue';
import { sheetAPI } from "../service/sheet";
import { useAuthStore } from '../store/auth';

const tmp : Ref<inforbu[]> = ref([{id_expension:0,ID:0,NAME:'',BU:'',am_location:'',rm_location:'',STATUS:1,bm_location:''}]);
const authStore = useAuthStore()
const sucorunsuc = ref({suc:0,unsuc:0,wait:0})
const pages=ref(1)
const page=ref(1)
const searchText = ref('')
const fillter:Ref<{start_date?:string,end_date?:string,search?:string,pagechoose:number}> = ref({pagechoose:1})

interface thismessage{
    result : inforbu[],
    count : number
}

watchEffect(async()=>{
    authStore.setLoading(true)
    const ASM = await sheetAPI.getsheet(fillter.value,'AM').then(res=>{ 
        tmp.value = (res.message as thismessage).result
        pages.value = (res.message as thismessage).count  
        sucorunsuc.value = {
            suc:tmp.value.filter((val)=>val.STATUS == '1').length,
            wait:tmp.value.filter((val)=>val.STATUS == '2').length,
            unsuc:tmp.value.filter((val)=>val.STATUS == '3').length
         }
        authStore.setLoading(false)
    }).catch((error)=>{
        alert(error)
        authStore.setLoading(false)
    })
    
})

interface inforbu {
    id_expension : number,
    ID: number,
    NAME : string,
    BU: string,
    am_location : number | string,
    rm_location : number | string,
    STATUS : boolean | number | string ,
    bm_location: number | string,

}

const changepage =(choosepage:number)=>{
    var tmp =document.querySelectorAll('.page__numbers')
    tmp.forEach((val)=>val.classList.remove('active'))
    document.getElementById(choosepage as unknown as string)?.classList.add("active");
    fillter.value.pagechoose = choosepage
}

</script>

<template>
    <div class="flex-col flex px-4 sm:px-6 pt-6 pb-10">

        <RouterLink to="/" v-if="authStore.userData?.role === 'Admin'"
             class="flex flex-row items-center pb-3 gap-4 group">
             <div class="group-hover:bg-slate-200 rounded-full">
                <Icon icon="ic:outline-keyboard-arrow-left" width="24" height="24" />
             </div>
            <p class="text-blue-500 text-sm">ASM Check List</p>
        </RouterLink>

        <div class="flex md:flex-row max-md:flex-col md:justify-between w-full md:items-center">
            <div class="flex items-center lg:w-1/4 py-4 sm:py-0">
                <div class="relative w-full">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg aria-hidden="true" class="w-5 h-5 text-gray-500" fill="currentColor"
                            viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </div>
                    <input type="text" id="simple-search" @change="fillter.search = searchText"  v-model="searchText"
                        class="bg-gray-50 border text-black border-gray-300 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:ring-2 hover:ring-blue-500 hover:border-blue-500 focus:outline-none block pl-10 p-2.5 w-full duration-300"
                        placeholder="ค้นหา..." >
                </div>
            </div>
            <div class="mb-2 max-md:mt-2 md:mb-4">
                <div class="flex gap-4 w-full">
                    <div class="w-full">
                        <label class="text-sm text-gray-500">Start Date</label>
                        <input type="date" v-model="fillter.start_date"
                            class="block p-2 rounded shadow bg-white border border-gray-300 hover:ring-2 hover:ring-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none w-full text-gray-400" />
                    </div>
                    <div class="w-full" > 
                        <label class="text-sm text-gray-500">End Date</label>
                        <input type="date" v-model="fillter.end_date"
                            class="block p-2 rounded shadow bg-white border border-gray-300 hover:ring-2 hover:ring-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none w-full text-gray-400" />
                    </div>
                </div>
            </div>
        </div>

        
        <div class="flex flex-col sm:flex-row gap-4 sm:w-1/2 md:w-full lg:w-1/2  mt-6">
            <div
                class="flex justify-between w-full items-center rounded-2xl px-3 py-4 text-sm bg-white">
                <div class="flex items-center gap-3">
                    <Icon icon="uis:check-circle" color="#10b981" />
                    <p class="text-sm">ทำแล้ว</p>
                </div>
                <span class="text-bold text-xl text-green-500">{{ sucorunsuc.suc }}</span>
            </div>
            <div
                class="flex justify-between w-full items-center rounded-2xl px-3 py-4 text-sm bg-white">
                <div class="flex items-center gap-3">
                    <Icon icon="uiw:circle-close" color="#f43f5e" />
                    <p class="text-sm">ยังไม่ทำ</p>
                </div>
                <span class="text-bold text-xl text-red-500">{{ sucorunsuc.unsuc }}</span>
            </div>
            <div
                class="flex justify-between w-full items-center rounded-2xl px-3 py-4 text-sm bg-white">
                <div class="flex items-center gap-3">
                    <Icon icon="ion:time-sharp" color="#b6b910" />
                    <p class="text-sm">ยังไม่เสร็จ</p>
                </div>
                <span class="text-bold text-xl text-red-500">{{ sucorunsuc.wait }}</span>
            </div>
        </div>
        <div class="flex items-center mt-5">
            <div class="text-sm mr-2">Checklist บันทึกการเข้าตรวจร้าน</div>
            <div class="text-gray-500 text-bold text-sm items-center">{{`ทั้งหมด: ${pages}`}}</div>
        </div>
        <RouterLink v-for="(val,ind) in tmp" :key="ind" :to="{path:`history/AM/${val.ID}/${val.NAME}`}"
            class="mt-4 inline-flex relative items-center p-4 sm:p-6 w-full text-sm font-medium border-b  rounded-xl bg-white hover:bg-gray-50 hover:shadow-sm focus:z-10 duration-300 cursor-pointer">
            <div>
                <div
                    class="font-semibold self-start text-lg md:flex md:flex-row gap-1 md:items-center">


                </div>
                <div class="font-bold self-start text-xl fontheader md:flex md:flex-row gap-1 md:items-center">
                        <span v-if="val.STATUS == '3'"  class="h-full falsestate rounded-full text-sm px-3 py-1 text-white mr-4">ยังไม่ทำ</span>
                        <span v-if="val.STATUS == '1'" class="h-full truestate rounded-full text-sm px-3 py-1 text-white mr-4">ทำแล้ว</span>
                        <span v-if="val.STATUS == '2'" class="h-full waitstate rounded-full text-sm px-3 py-1 text-white mr-4">ยังไม่เสร็จ</span>
                        {{val?.NAME}}
                    </div>
                <div
                    class="mt-3 text-sm self-end gap-2 flex md:flex-row flex-col md:flex-wrap md:items-center">
                    
                    <div class="flex flex-row gap-1 text-gray-500">
                        <span>BU:</span>
                        <span class="text-gray-900">{{val?.BU}}</span>
                    </div>
                    <Icon icon="bi:dot" width="24" height="24" class="max-md:hidden text-gray-400" />
                    <div class="flex flex-row gap-1 text-gray-500">
                        <span>RM:</span>
                        <span class="text-gray-900">{{ val?.rm_location }}</span>
                    </div>
                    <Icon icon="bi:dot" width="24" height="24" class="max-md:hidden text-gray-400" />
                    <div class="flex flex-row gap-1 text-gray-500">
                        <span>AM:</span>
                        <span class="text-gray-900">{{ val?.am_location }}</span>
                    </div>
                    <Icon icon="bi:dot" width="24" height="24" class="max-md:hidden text-gray-400" />
                    <div class="flex flex-row gap-1 text-gray-500">
                        <span>BM:</span>
                        <span class="text-gray-900">{{ val?.bm_location }}</span>
                    </div>

                </div>
            </div>
        </RouterLink>

        <div class="flex flex-col items-center justify-center">  
            <ul class="page">
                <button @click="(page>1)?(page=page-1):(page=page)" class="page__btn "><Icon icon="material-symbols:arrow-circle-left-rounded" class="hover:text-[#286969e1] text-[#23adade1]" width="26px" height="26px" /></button>
                <li class="flex " v-for="i in Math.ceil(pages/5)"> 
                    <li v-if="i==page" @click="changepage( j+((i-1)*5) )" :id="`${j+((i-1)*5)}`" class="page__numbers" v-for="j in ((pages-((i-1)*5)>5)?5:pages%5)"> {{ j+((i-1)*5) }}</li>
                </li>
                <button @click="(page<Math.ceil(pages/5))?(page=page+1):(page=page)" class="page__btn"><Icon icon="material-symbols:arrow-circle-right-rounded" class="hover:text-[#286969e1] text-[#23adade1]" width="26" height="26" /></button>
            </ul>
        </div>

    </div>
</template>

<style scoped>
.fontheader {
     font-family: 'Inter';
     font-weight: Medium;
     font-weight: 500;
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
 .waitstate {
     background-color: #b6b910;
     font-family: "Inter";
 }


 :root {
  --primary: #23adad;
  --greyLight: #23adade1;
  --greyLight-2: #cbe0dd;
  --greyDark: #2d4848;
  box-sizing: border-box;
  font-size: 62.5%;
  overflow-y: scroll;
  font-family: "Poppins", sans-serif;
  letter-spacing: 0.6px;
  line-height: 1.4;
  backface-visibility: hidden;
  -webkit-font-smoothing: subpixel-antialiased;
}

.items-list {
  max-width: 90vw;
  margin: 2rem;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 3rem;
  justify-content: center;
  align-content: center;
}
@media only screen and (max-width: 600px) {
  .items-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

.item {
  width: 10rem;
  height: 10rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #2d4848;
  cursor: pointer;
}
.item span {
  background: #ffffff;
  box-shadow: 0 0.8rem 2rem rgba(90, 97, 129, 0.05);
  border-radius: 0.6rem;
  padding: 2rem;
  font-size: 3rem;
  transition: all 0.3s ease;
}
.item:hover span {
  transform: scale(1.2);
  color: #23adad;
}
.item p {
  font-size: 1.2rem;
  margin-top: 1rem;
  color: #23adade1;
}

.page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 3rem;
  margin: 2rem;
  border-radius: 0.6rem;
  background: #ffffff;
  box-shadow: 0 0.8rem 2rem rgba(90, 97, 129, 0.05);
}
.page__numbers, .page__btn, .page__dots {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.8rem;
  font-size: 1rem;
  cursor: pointer;
}
.page__dots {
  width: 2.6rem;
  height: 2.6rem;
  color: #23adade1;
  cursor: initial;
}
.page__numbers {
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 0.4rem;
}
.page__numbers:hover {
  color: #23adad;
}
.page__numbers.active {
  color: #ffffff;
  background: #23adad;
  font-weight: 600;
  border: 1px solid #23adad;
}
.page__btn {
  color: #23adade1;
}
.page__btn.active {
  color: #2d4848;
  pointer-events: initial;
}
.page__btn.active:hover {
  color: #23adad;
}
</style>