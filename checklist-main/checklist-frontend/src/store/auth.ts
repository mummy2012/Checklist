import { defineStore } from 'pinia';
import router from "../router";
import { authAPI } from '../service/auth';
import { AxiosResponse } from 'axios';
import { ResponseAxios } from '@/types';
import httpClient from '@/service/httpClient';


export interface UserInterface {
    fullname: string;
    location_id:number;
    role: "BM" | "RM" | "AM" | "Admin";
    updatedAt: string;
    username: string;
}

export interface useAuthStoreTypes{
    Token?:string;
    userData: null | UserInterface;
    returnUrl: null | string;
    firstload: boolean;
    loading: boolean;
}

export const useAuthStore = defineStore({
    id: "auth",
    state:()=>({
        Token:localStorage.getItem("Token"),
        userData:null,
        returnUrl: null,
        firstload: true,
        loading: false
    } as useAuthStoreTypes),
    actions: {
        async login({ username, password }:{username:string,password: string}){
            try{
                this.loading = true
                const response = await authAPI.Login({ username, password})
                this.Token = response
                localStorage.setItem("Token",response)
                this.loading = false
            }catch(error: any){
                this.loading=false
                // console.log(username)
                alert(error)
                this.userData = {
                    fullname:'wachiravit',
                    location_id: 3004,
                    role : 'Admin',
                    updatedAt : '111',
                    username: 'test'
                }
            }
        },
        async getUser(){
            try{
                this.loading = true
                const response = await authAPI.getUser<UserInterface>()
                this.userData = response
                this.loading = false
                console.log(response)
                router.push(this.returnUrl || '/');
                setTimeout(()=>{
                    this.firstload = false
                },100)
            }
            catch(error: any){
                this.loading = false
                alert(error)
                setTimeout(()=>{
                    this.firstload=false
                },100)
                this.Token = undefined
                localStorage.removeItem("Token")
                router.push(this.returnUrl || '/login')
            }
        },
        logout(){
            this.returnUrl = null;
            this.userData = null;
            this.Token = undefined;
            localStorage.removeItem('Token');
            router.push('/login');
        },
        setLoading(value: boolean){
            this.loading = value
        }
        
    }
})