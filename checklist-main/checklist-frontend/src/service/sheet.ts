import httpClient from "./httpClient";
import { AxiosResponse } from "axios";
import { ResponseAxios } from "@/types";
// import { information } from "../types/information";


export const sheetAPI = {
    postsheet: async<T>(data:FormData) => {
        try{
            const response:AxiosResponse<ResponseAxios<T>> = await httpClient({
                url:`sheet/postform`,
                method: 'POST',
                headers:{
                    'Content-Type' : 'multipart/form-data',
                },
                data
            });
            return response.data;
        }catch(error){
            throw error;
        }
    },
    getsheet: async<T>(fillter:{start_date?:string,end_date?:string,search?:string,pagechoose:number},pageRole:string) => {
        try{
            const response:AxiosResponse<ResponseAxios<T>> = await httpClient({
                url:`sheet/getsheet/:pageRole`,
                method: 'POST',
                headers:{
                    'Content-Type' : 'application/json',
                },
                params:{pageRole},
                data:{fillter}
            });
            return response.data;
        }catch(error){
            throw error;
        }
    },
    gethistory: async( _id :string  ) => {
        var data = {_id:_id}
        try{
            const response = await httpClient({
                url:`sheet/getHistory`,
                method: 'POST',
                headers:{
                    'Content-Type' : 'application/json',
                },
                data
                
            });
            return response.data;
        }catch(error){
            throw error;
        }
    },
    getScore: async(_id : string) => {
        var data ={_id:_id}
        try{
            const response = await httpClient({
                url:`sheet/getScore`,
                method: 'POST',
                headers:{
                    'Content-Type' : 'application/json',
                },
                data
            });
            return response.data;
        }catch(error){
            throw error;
        }
    },
    getPicture: async(path : string) => {
        try{
            const response = await httpClient({
                url:`sheet/getFile`,
                method: 'POST',
                headers:{
                    'Content-Type' : 'application/json',
                },
                responseType:'blob',
                data:{path}
            })
        return response
        }
        catch(error){
            throw error
        }
    
}
}