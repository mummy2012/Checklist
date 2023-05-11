import * as mongoose from 'mongoose';



export const SheetSchema = new mongoose.Schema({
    basedoc_id:{ type: String , required:true },
    creater_id:{ type: String, required:true},
    target_id: { type: String,  required:true},
    time_create:{type: Date, required:true} ,
    docname:{ type: String, required:true },
    status:{ type:  Boolean , required:true },
    image:[{ type : String }],
    scoredoc_total_all:[{
        _id:false,
        scoredoc_timer:{ time_start : { type:Number,required:true},time_end : { type:Number,required:true} } ,
        scoredoc_check:{ time_in: { type:Number },time_out : { type:Number} } ,
        scoredoc_total:{ type: Number },
        scoredoc_receive:{type: Number},
        statusdoc:{type: Boolean }
    }],
    inform:[{
        _id: false,
        title:{ type: String },
        scoreform_total_all:[{
            _id:false,
            scoreform_timer:{ time_start : { type:Number },time_end : { type:Number} },
            scoreform_total:{ type: Number },
            scoreform_receive:{ type: Number},
        }],
        formlist:[{
            _id: false,
            question:{ type: String },
            timer: [{
                time_start:{type: String},
                time_end:{type:String}, 
                _id:false 
            }],
            types: { type: String, required:true },
            answer:[{ type:String, _id: false}],
            scorequestion_total:{type:Number , required:true},
            scoreans: { type: Number },
            choices:[{
                _id: false,
                choice:[{type: String , _id: false}],
                score: { type:Number }
            }]
        }]
    }],
})

export interface Sheet extends mongoose.Document{
    basedoc_id:string;
    creater_id:string;
    target_id:string;
    time_create?:string;
    docname:string;
    scoredoc_total_all:Array<scoredoc>;
    status:boolean;
    complete:boolean;
    permission:string;
    inform:Array<inform>;
    image:string[];
}

export interface inform{
    title:string;
    scoreform_total_all:Array<scoreform>;
    formlist:Array<question>;
}

export interface scoredoc{
    scoredoc_timer:timer;
    scoredoc_check:timer_check;
    scoredoc_total:number | undefined;
    scoredoc_receive?:number | undefined;
    statusdoc: boolean;
}
export interface detailgroup{
    scoredoc_timer:timer;
    scoredoc_check:timer_check;
}

export interface scoreform{
    scoreform_timer:timer;
    scoreform_total:number;
    scoreform_receive?: number;
}

export interface question{
    question:string;
    timer:timer[];
    types:string;
    choices:Array<choices>;
    scorequestion_total:number;
    scoreans?:number
    answer:Array<string>;
    Files?:FilePreview;
}

export interface choices{
    choice:Array<string>;
    score:number;
}

export interface timer{
    time_start:number;
    time_end:number;
}

export interface timer_check{
    time_in:number;
    time_out:number;
}

interface FilePreview extends File {
    url?: string;
}

interface FileID extends FilePreview {
    id?: string;
    no?: string;
    file: File
}

export interface tmpinfor{
    title:string;
    scoreform_total_all:Array<scoreform>;
}

export interface listgroup{
    _id:string | object;
    creater_id:string;
    time_create:string;
    status:boolean;
    detail:Array<detailgroup>;
}
//
