import httpClient from "./httpClient";
import { AxiosResponse } from "axios";
import { ResponseAxios } from "@/types";
import { information } from "../types/information";


export const informationAPI = {
    createInformation: async (data: information) => {
        try{
            const response = await httpClient({
                url:`information/createform`,
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
    getFormByRole: async (role:string,id:string,docid:string)=>{
        try{
            const response = await httpClient({
                url:`information/getFromByRole/${role}/${id}/${docid}`,
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json',
                },
                params:{role,id,docid},
            });
            return response.data;
        }catch(error){
            throw error;
        }
    },
    getFormByAdmin: async (permission: string) => {
        try {
            const response = await httpClient({
                url: `/information/getFormByAdmin/${permission}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                params:{permission}
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
 
    getFormById: async (id:string | object)=>{
        try{
            const response = await httpClient({
                url:`information/getFormByID/${id}`,
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json',
                },
                params:{id}
            });
            return response.data;
        }catch(error){
            throw error;
            }
    },
    
    deleteFormById: async (id:string | object)=>{
        try{
            const response = await httpClient({
                url:`information/deleteform/${id}`,
                method: 'DELETE',
                headers: {
                    'Content-Type' : 'application/json',
                },
                params:{id}
            });
            return response.data;
        }catch(error){
            throw error;
            }
    },
    
    updateFormById: async (id:string | object,data:any )=>{
        try{
            const response = await httpClient({
                url:`information/updateForm/${id}`,
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json',
                },
                params:{id},
                data
            });
            return response.data;
        }catch(error){
            throw error;
            }
    },

    changeStatus: async (id:string | object, role:string, status:boolean,bu:string )=>{
        const data={role:role,status:status,bu:bu}
        try{
            const response = await httpClient({
                url:`information/changeStatus/${id}`,
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json',
                },
                params:{id},
                data
            });
            return response.data;
        }catch(error){
            throw error;
            }
    },

    checkOpen: async(id:string,role:string) => {
        try{
            const response = await httpClient({
                url:`information/checkOpenBu/${role}/${id}`,
                method:'GET',
                headers:{
                    'Content-Type' : 'application/json',
                },
                params:{id,role},
            });
            return response.data
        }catch(error){
            throw error
        }
    }
    
}
