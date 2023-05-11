import { Injectable, NotFoundException } from '@nestjs/common';
import { Sheet, inform,scoredoc,tmpinfor  } from './sheet.model';
import { InjectModel } from '@nestjs/mongoose';
import { expansionsService } from 'src/models/expansion_shop/expansion_shop.service';
import { busService } from 'src/models/bus/bus.service';
import { UsersService } from 'src/models/npi_user/npi_user.service';
import { S3Service } from 'src/aws/s3.service';
import { Model } from 'mongoose';
import { User } from 'src/models/npi_user/npi_user.entity';



@Injectable()
export class SheetService {
    constructor(
        @InjectModel('Sheet')
        private readonly sheetModel: Model<Sheet>,
        private expansion:expansionsService,
        private bu:busService,
        private user:UsersService,
    ) {}

    async postSheet(
        basedoc_id: string, 
        creater_id:string,
        target_id:string,
        scoredoc_total_all:scoredoc[],
        docname:string,
        status:boolean,
        inform:inform[],
        file:Express.Multer.File[],
    ){
        const current = new Date();
        const timeStamp = new Date(Date.UTC(current.getFullYear(), 
        current.getMonth(),current.getDate(),current.getHours(), 
        current.getMinutes(),current.getSeconds(), current.getMilliseconds()));
        const timenow=(current.getHours()*60+current.getMinutes())
        const today = new Date();
        today.setHours(0,0,0,0);
        const findind =(form:scoredoc[])=>{
            return form.findIndex((index) =>
            index.scoredoc_timer.time_start <= timenow && index.scoredoc_timer.time_end >= timenow
            )
        }
        
        if(findind(scoredoc_total_all) != -1 ){
            inform.forEach((val)=>val.scoreform_total_all[0].scoreform_receive=(val.formlist.reduce((count,num)=> (num?.scoreans||0) +count,0)))
            try{
                let image = []
                for(const img of file){

                    if(img.fieldname.split("_").length >= 3){
                        (!inform[Number(img.fieldname.split("_")[1])].formlist[Number(img.fieldname.split("_")[2])].answer)?(inform[Number(img.fieldname.split("_")[1])].formlist[Number(img.fieldname.split("_")[2])].answer)= [`${img.fieldname + img.originalname}`]
                        : (inform[Number(img.fieldname.split("_")[1])].formlist[Number(img.fieldname.split("_")[2])].answer).push(`${img.fieldname + img.originalname}`)   
                    }else{
                        image.push(`${img.originalname}_${img.fieldname.split("_")[1]}`)
                    }

                }
                const check:Sheet = await this.sheetModel.findOne({ basedoc_id : basedoc_id , creater_id : creater_id  , target_id: target_id , time_create : {$gte:today,$lt: new Date(today.getTime()+24*60*60*1000)} }).exec()
                let complete = false
                if(check){
                    if(!!check.status){
                        throw  new Error('เคยทำไปแล้ว')
                    }
                    if(typeof(check.scoredoc_total_all[findind(scoredoc_total_all)].statusdoc ) == 'undefined')
                    {
                        check.scoredoc_total_all[findind(check.scoredoc_total_all)].scoredoc_receive = inform.reduce(
                            (count, val) => (val.scoreform_total_all[0]?.scoreform_receive || 0 )+ count,
                            0,
                            );
                        check.scoredoc_total_all[findind(check.scoredoc_total_all)].scoredoc_check={ time_in : scoredoc_total_all[findind(check.scoredoc_total_all)].scoredoc_check.time_in,time_out : timenow}
                        if(check.scoredoc_total_all[findind(check.scoredoc_total_all)].scoredoc_check.time_out){
                            check.scoredoc_total_all[findind(check.scoredoc_total_all)].statusdoc = true;
                        }
                        if((scoredoc_total_all.findIndex(val1=> typeof(val1.statusdoc) == 'undefined') == -1)){
                            complete = true
                        }
                        const docupdate = {
                            basedoc_id: check.basedoc_id,
                            creater_id: check.creater_id,
                            target_id: check.target_id,
                            scoredoc_total_all:check.scoredoc_total_all,
                            docname:check.docname,
                            image:image,
                            status:complete,
                            inform:check.inform.concat(inform),
                            time_create:timeStamp
                        }
                        const result = await this.sheetModel.findByIdAndUpdate(check._id, docupdate)
                        .setOptions({ overwrite: true, new: true })
                        .populate('docname')
                        .populate('status')
                        .populate('scoredoc_total_all')
                        .populate('inform')
                        .populate('time_create');
                        return check._id
                    }
                    else{
                        throw  new Error('ทำซ้ำ')
                    }
                }else{
                         scoredoc_total_all[findind(scoredoc_total_all)].scoredoc_receive = inform.reduce(
                        (count, val) => (val.scoreform_total_all[0]?.scoreform_receive || 0) + count,
                        0,
                    );
                    scoredoc_total_all[findind(scoredoc_total_all)].scoredoc_check.time_out = timenow
                    if(scoredoc_total_all[findind(scoredoc_total_all)].scoredoc_check.time_out){
                        scoredoc_total_all[findind(scoredoc_total_all)].statusdoc = true;
                    }
                    if((scoredoc_total_all.findIndex(val1=> typeof(val1.statusdoc) == 'undefined') == -1)){
                        complete = true
                    }
                    
                    scoredoc_total_all[findind(scoredoc_total_all)].statusdoc = true; 
                    let tmpinfor:tmpinfor[] = []

                    
                    inform.forEach(val=>tmpinfor.push({title:val.title,scoreform_total_all:val.scoreform_total_all}))
                    const result = await this.sheetModel.create({
                            basedoc_id,
                            creater_id,
                            target_id,
                            docname,
                            image,
                            status:complete,
                            scoredoc_total_all,
                            inform:inform,
                            time_create:timeStamp
                        });
                        return result._id
                    }
            }catch(error : any){
                return error
            }
        }else{
            throw new Error('มันไม่ใช่เวลา')
        }
    }

    async requesthistory(id_target){
        const result:Sheet[] = await this.sheetModel.find({ target_id:id_target})
        let tmp = []

        return result.map(prod => ({ 
            _id : prod._id,
            creater_id :  prod.creater_id,
            time_create : prod.time_create,
            status: prod.status,
            detail : prod.scoredoc_total_all.map(value=>({scoredoc_timer:value.scoredoc_timer,scoredoc_check:value.scoredoc_check,statusdoc:value.statusdoc}))
        }))
        
    }


    async getRename(local_id:string | number){
        try{
            const nameFind = await this.user.findOne({where:{username : local_id}})
            return nameFind
        }catch(error){
            return error
        }
    }
    async getExpansionByRM(username:string){
        try{
            const expansionFind = await this.expansion.findAll({where:{rm_location:username}})
            return expansionFind
        }catch(error){
            return error
        }
    }

    // หาร้านของฝั่ง AM ฟิวเตอร์ยังใช้ไม่ได้
    async getExpansionByAM(username:string,fillter:{start_date?:string,end_date?:string,search?:string,pagechoose:number}){
        try{
            let page = fillter.pagechoose
            let range = 10
            const expansionFind = await this.expansion.findAll({where:{am_location:username,  STATUS:"1"},limit:range,offset:(page-1)*range,order:['ID'] , group :"ID" })
            let count = Math.ceil((await this.expansion.findAll({where:{am_location:username , STATUS:"1"},group:"ID" })).length / range)
            return {result:expansionFind,count:count}
        }catch(error){
            return error
        }
    }
    // หาร้านของฝั่ง Admin ฟิวเตอร์ยังใช้ไม่ได้
    async getExpansionByAdmin(username:string,fillter:{start_date?:string,end_date?:string,search?:string,pagechoose:number}){
        try{
            
            let page = fillter.pagechoose
            let range = 10
            let serach_id = fillter?.search
            const expansionFind = await this.expansion.findAll({where:{STATUS:"1" },limit:range,offset:(page-1)*range,order:['ID'] , group :"ID" })
            let count = Math.ceil((await this.expansion.findAll({where:{STATUS:"1" },group:"ID" })).length / range)
            return {result:expansionFind,count:count}
        }catch(error){
            return error
        }
    }
    async getExpansionByBM(username:string,fillter:{start_date?:string,end_date?:string,search?:string,pagechoose:number}){
        try{
            let new_username = (await this.getRename(username)) 
            const expansionFind = await this.expansion.findOne({where:{ID:new_username.location_id}})
            return expansionFind
        }catch(error){
            return error
        }
    }
    async getExpansionById(id:number){
        try{
            const expansionFind = await this.expansion.findOne({where:{ID:id}})
            return expansionFind
        }catch(error){
            return error
            
        }
    }
    async getBu(id_bu:number){
        try{
            const findBu = await this.bu.findOne({where:{id_bu}})
            return findBu
        }catch(error){
            return error
        }
    }
    async getAllbu(){
        const findAll = await this.bu.findAll({where:{}})

        return findAll.map((prod) => ({
            id_bu: prod.id_bu,
            buname: prod.bu_name
        }))
    }
    async checkMonth(target_id:number,creater_id?:number,pageRole?:string ){
        try{
            // เช็คว่าในวันนี้ร้านนั้นมี AM ทำข้อสอบไปหรือยังยังไม่ได้ทำ ยังไม่เสร็จ
            if(pageRole == 'AM'){
                const date = new Date()
                const findTarget = await this.sheetModel.aggregate([
                {
                    $match:{
                        "target_id":String(target_id),
                        "time_create":{
                            $gte: new Date(date.getFullYear(),date.getMonth(),1),
                            $lt: new Date(date.getFullYear(),date.getMonth()+1,1)
                        }
                    }
                }
                ])
                if (findTarget.length > 0) {
                    return findTarget[0].status ? '1' : '2';
                  } else {
                    return '3';
                  }
            }if(pageRole == 'BM'){
                // เช็คว่าในวันนี้ร้านนั้นมี BM ทำข้อสอบไปหรือยังยังไม่ได้ทำ ยังไม่เสร็จ
                const date = new Date()
                const findTarget = await this.sheetModel.aggregate([
                {
                    $match:{
                        "target_id":String(target_id),
                        "time_create":{
                            $lte: new Date(date.getFullYear(),date.getMonth(),date.getDate()),
                            
                        }
                    }
                }
                ])
                //  findTarget.filter(val=>console.log( this.getRename(val.creater_id)))
                if (findTarget.length > 0) {
                    return findTarget[0].status ? '1' : '2';
                  } else {
                    return '3';
                  }
            }
            } catch (error) {
              return error;
            }
    }

    async getDetailScore(_id : string|number){
        try{
        const result = await this.sheetModel.findById(_id)
            if(result){
                const tmpresult = {
                    id : result._id,
                    docname: result.docname,
                    creater_id: (await this.getRename(result.creater_id)).fullname,
                    target_id: (await this.getExpansionById(Number(result.target_id))),
                    scoredoc_total_all : result.scoredoc_total_all,
                    inform : result.inform,
                    time_create: result.time_create,
                    status: result.status,
                    image : result.image 
                }
                if(tmpresult.target_id.rm_location){
                    if(tmpresult.target_id?.rm_location || typeof tmpresult.target_id?.rm_location == 'number'){
                        (tmpresult.target_id.rm_location as unknown as string) = (await this.getRename(tmpresult.target_id.rm_location)).fullname
                    }
                }else{
                    (tmpresult.target_id.rm_location as unknown as string) = '-'
                }
                if(tmpresult.target_id.am_location){
                    if(tmpresult.target_id?.am_location || typeof tmpresult.target_id?.am_location == 'number'){
                        (tmpresult.target_id.am_location as unknown as string )= (await this.getRename(tmpresult.target_id.am_location)).fullname
                    }
                }else{
                    (tmpresult.target_id.am_location as unknown as string) = '-'
                }
                return tmpresult
            }
        }catch(error){
            return error
        }
    }
}
