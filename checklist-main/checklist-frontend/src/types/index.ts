export interface ResponseAxios<T = any> {

    statusCode: number;
    message: T;

}

export interface PaginateType {
    page: number;
    take: number
}

export interface FilePreview extends File {
    url?: string;
}

export {};

declare global {
    interface Window {
        constraints:any
    }
}