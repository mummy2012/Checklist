import { defineStore } from 'pinia';
import router from "../router";
import { buAPI } from '../service/bu';

export interface buStore {
    id_bu:number,
    buname:string,
    createdAt?: string,
    updatedAt?: string,
}

export interface buStoreTypes{
    bustore: buStore[]

}
export const useBuStore = defineStore({
    id:"bu",
    state: ()=>({
        bustore:[],
    } as buStoreTypes),
    actions:{
        async getbu(){
            try{
                const response = await buAPI.getBu<buStore[]>()
                this.bustore = response.message
            }
            catch(error:any){
                console.log(error)
            }
        }
    }

})
