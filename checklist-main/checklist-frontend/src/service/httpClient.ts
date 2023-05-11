import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

const httpClient = axios.create({
    baseURL: "http://localhost:9999"
})

const onRequest = (config:AxiosRequestConfig):AxiosRequestConfig => {
    const token = localStorage.getItem('Token')
    if (token) {
        config.headers!.Authorization = `Bearer ${token}`
    }
    return config;
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
    return response;
}

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject({ status: 9999, message: error });
}

httpClient.interceptors.request.use(onRequest, onRequestError);
httpClient.interceptors.response.use(onResponse, onResponseError);

export default httpClient