import HttpClient from './httpClient';
import { AxiosResponse } from 'axios';
import { ResponseAxios } from '@/types';

export const authAPI = {
    Login: async (data: { username:string, password: string }) => {
        try {
            const response: AxiosResponse<string> = await HttpClient({
                url: `/users/signIn`,
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                data
            });
            return response.data;
        }catch(error)
        {
            throw error;
        }
    },
    getUser:async<T>()=>{
        try{
            const response: AxiosResponse<T> = await HttpClient({
                url: `users/getuser`,
                method: `GET`,
                headers: {
                    'Content-Type' : 'application/json',
                },
            });
            
            return response.data;
        }catch( error ){
            throw error;
        }
    },
   
}