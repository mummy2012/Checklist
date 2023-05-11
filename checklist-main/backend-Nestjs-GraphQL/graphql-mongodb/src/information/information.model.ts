import * as mongoose from 'mongoose';

export const InformationSchema = new mongoose.Schema({
    //user_create
    docname:{ type: String, required:true },
    status:{ type:  Boolean , required:true },
    scoredoc_total_all:[{
        _id:false,
        scoredoc_timer:{ time_start : { type:Number },time_end : { type:Number} } ,
        scoredoc_total:{ type: Number }
    }],
    permission:{type:String ,reqired :true},
    bu:[{id_:false, type:String }],
    create_date:{type: Date , default: Date.now },
    inform:[{
        _id: false,
        title:{ type: String, required:true },
        scoreform_total_all:[{
            _id:false,
            scoreform_timer:{ time_start : { type:Number },time_end : { type:Number} },
            scoreform_total:{ type: Number }
        }],
        formlist:[{
            _id: false,
            question:{ type: String, required:true },
            timer: [{
                time_start:{type: Number},
                time_end:{type: Number}, 
                _id:false 
            }],
            types: { type: String, required:true },
            scorequestion_total:{type:Number},
            choices:[{
                _id: false,
                choice:[{type: String , _id: false}],
                score: { type:Number }
            }]
        }]
    }],
})

export interface Information extends mongoose.Document{
    docname:string;
    status:boolean;
    scoredoc_total_all:Array<scoredoc>;
    permission:string;
    bu:Array<string>;
    inform:Array<inform>;
}
export interface inform{
    title:string;
    scoreform_total_all:Array<scoreform>;
    formlist:Array<question>;
}

export interface scoredoc{
    scoredoc_timer:timer;
    scoredoc_total:number;
}

export interface scoreform{
    scoreform_timer:timer;
    scoreform_total:number;
}


export interface question{
    question:string;
    timer:timer[];
    type:string;
    scorequestion_total:number;
    choices:Array<choices>;
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

interface FilePreview extends File {
    url?: string;
}

