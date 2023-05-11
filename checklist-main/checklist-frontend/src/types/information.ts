import { FilePreview } from ".";

export interface information{
    docname:string;
    status:boolean;
    permission?:string;
    bu:string[];
    inform:Array<inform>;

}

export interface inform{
    title:string;
    scoreform_total_all?:number;
    formlist:Array<question>;
}

export interface choices{
    choice:Array<string>;
    score:number;
}
export interface question{
    question:string;
    types:string;
    timer:timer[];
    scorequestion_total:number;
    choices:Array<choices>;
    scoreans?:number
    answer?:Array<string>;
    Files?:FilePreview;
}

export interface timer{
    time_start:number;
    time_end:number;
}

export interface InformationType{
    data: information[];
    id:string;
    docname:string;
}
