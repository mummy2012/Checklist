import HttpClinet from "./httpClient";
import { AxiosResponse } from "axios";
import { ResponseAxios } from "@/types";

export const buAPI = {
    getBu: async <T>() => {
        try{
            const response: AxiosResponse<ResponseAxios<T>> = await HttpClinet({
                url: `/sheet/getBu`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }catch(error){
            throw error;
        }
    }
}