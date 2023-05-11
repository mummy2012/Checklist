import { FilePreview } from ".";

export interface sheetans{
    basedocid:string;
    createrid?:string;
    target_id : string;
    permission:string;
    bu:string;
    docname:string;
    status:boolean;
    scoredoc_total_all:Array<scoredoc>;
    inform:Array<inform>;
}

export interface scoredoc{
    scoredoc_timer:timer;
    scoredoc_total:number;
    statusdoc?:boolean;
    scoredoc_check:timercheck;
    scoredoc_receive?:number;
}

export interface scoreform{
    scoreform_timer:timer;
    scoreform_total:number;
    scoreform_receive?: number;
}

interface FileID extends FilePreview {
    id?: string;
    no?: string;
    file: File
}

export interface timer{
    time_start:number;
    time_end:number;
}

export interface timercheck{
    time_in:number;
    time_out:number;
}
export interface inform{
    title:string;
    formlist:Array<question>;
    scoreform_total_all:scoreform[];
}

export interface choices{
    choice:Array<string>;
    score:number;
}
export interface question{
    question:string;
    types:string;
    scorequestion_total:number;
    choices:Array<choices>;
    scoreans:number
    answer:Array<string>;
    Files?:FilePreview;
}

export interface resultscore{
    id:string,
    docname:string,
    creater_id:string,
    target_id:any,
    scoredoc_total_all:Array<scoredoc>,
    inform:Array<inform>,
    status:boolean | Date,
    time_create:string,
    image:string[],
}

export interface fillter{
    
}
// tag


