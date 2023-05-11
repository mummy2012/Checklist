import { Injectable, NotFoundException } from '@nestjs/common';
import { Information,scoreform,choices,inform } from './information.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { busService } from 'src/models/bus/bus.service';
import { expansionsService } from 'src/models/expansion_shop/expansion_shop.service'

@Injectable()
export class InformationService {
  constructor(
    @InjectModel('Information')
    private readonly informationModel: Model<Information>,
    private bu:busService,
    private expansion:expansionsService,
  ) {}

  async createInformation(
    docname: string,
    status: false,
    permission: string,
    bu: string[],
    inform: {
      title: string;
      scoreform_total_all: scoreform[];
      formlist: {
        question: string;
        types: string;
        timer: { time_start: number; time_end: number }[];
        choices: { choice: string[]; score: number }[];
        scorequestion_total: number;
      }[];
    }[],
  ) {
    let tmp_scoredoc = [];
    for (let i = 0; i < inform.length; i++) {
      let tmp_scoreform = []
      for (let j = 0; j < (inform[i]?.formlist||[]).length; j++) 
      {

        for (let k = 0; k < (inform[i].formlist[j]?.timer||[]).length; k++) 
        {
          if(tmp_scoreform.length == 0  ){
            tmp_scoreform.push({scoreform_timer:{time_start:inform[i].formlist[j].timer[k].time_start,time_end:inform[i].formlist[j].timer[k].time_end},scoreform_total:inform[i].formlist[j].scorequestion_total})
          }
          else if(tmp_scoreform.findIndex(val=> ((val.scoreform_timer.time_start == inform[i].formlist[j].timer[k].time_start) &&  (val.scoreform_timer.time_end  == inform[i].formlist[j].timer[k].time_end)))  == -1)
          {
            tmp_scoreform.push({scoreform_timer:{time_start:inform[i].formlist[j].timer[k].time_start,time_end:inform[i].formlist[j].timer[k].time_end},scoreform_total:inform[i].formlist[j].scorequestion_total})
          }else if(tmp_scoreform.findIndex(val=>((val.scoreform_timer.time_start == inform[i].formlist[j].timer[k].time_start) &&  (val.scoreform_timer.time_end  == inform[i].formlist[j].timer[k].time_end)))  != -1)
          {
            let pos = tmp_scoreform.findIndex(val=>((val.scoreform_timer.time_start == inform[i].formlist[j].timer[k].time_start) &&  (val.scoreform_timer.time_end  == inform[i].formlist[j].timer[k].time_end)))
            tmp_scoreform[pos].scoreform_total += inform[i].formlist[j].scorequestion_total;
          }

        }
        }
        tmp_scoreform.forEach(value=>{
          if(tmp_scoredoc.length == 0  ){
            tmp_scoredoc.push({scoredoc_timer:{time_start:value.scoreform_timer.time_start,time_end:value.scoreform_timer.time_end},scoredoc_total:value.scoreform_total})
          }
          else if(tmp_scoredoc.findIndex(val=> ((val.scoredoc_timer.time_start == value.scoreform_timer.time_start) &&  (val.scoredoc_timer.time_end == value.scoreform_timer.time_end)))  == -1)
          {
            tmp_scoredoc.push({scoredoc_timer:{time_start:value.scoreform_timer.time_start,time_end:value.scoreform_timer.time_end},scoredoc_total:value.scoreform_total})
          }else if(tmp_scoredoc.findIndex(val=> ((val.scoredoc_timer.time_start == value.scoreform_timer.time_start) &&  (val.scoredoc_timer.time_end == value.scoreform_timer.time_end)))  != -1)
          {
            let pos = tmp_scoredoc.findIndex(val=>((val.scoredoc_timer.time_start == value.scoreform_timer.time_start) &&  (val.scoredoc_timer.time_end  == value.scoreform_timer.time_end)))
            tmp_scoredoc[pos].scoredoc_total += value.scoreform_total
          }
        })
        inform[i].scoreform_total_all = tmp_scoreform;
      }
  
    try {
      const result = await this.informationModel.create({
        docname,
        status:false,
        scoredoc_total_all: tmp_scoredoc,
        permission,
        bu,
        inform: inform,
      });
      if(!result){
        throw new NotFoundException();
      }
      return result;
    } catch (error: any) {
      throw error;
    }
  }

  async manageInformationByAdmin(permission: string) {

    const products = await this.informationModel.find({ permission }).exec();

    try {
      return products.map((prod) => ({
        id: prod.id,
        docname: prod.docname,
        status: prod.status,
        bu: prod.bu,
      }));
    } catch (error: any) {
      return error;
    }
  }

  async getformationByID(_id: object | string) {
    const result = await this.informationModel.findById(_id).exec();
    try {
      return {
        id: result.id,
        docname: result.docname,
        scoredoc_total_all: result.scoredoc_total_all,
        permission: result.permission,
        bu: result.bu,
        inform: result.inform,
      };
    } catch (error: any) {
      return error;
    }
  }

  async updateInformationByID(
    _id: object | string,
    docname: string,
    status: boolean,
    permission: string,
    bu:string[],
    inform: {
      title: string;
      scoreform_total_all: scoreform[];
      formlist: {
        question: string;
        types: string;
        timer: { time_start: number; time_end: number }[];
        choices: { choice: string[]; score: number }[];
        scorequestion_total: number;
      }[];
    }[],
  ) {
    let tmp_scoredoc = [];
    for (let i = 0; i < inform.length; i++) {
      let tmp_scoreform = []
      for (let j = 0; j < inform[i].formlist.length; j++) 
      {
        for (let k = 0; k < inform[i].formlist[j].timer.length; k++) 
        {
          if(tmp_scoreform.length == 0  ){
            tmp_scoreform.push({scoreform_timer:{time_start:inform[i].formlist[j].timer[k].time_start,time_end:inform[i].formlist[j].timer[k].time_end},scoreform_total:inform[i].formlist[j].scorequestion_total})
          }
          else if(tmp_scoreform.findIndex(val=> ((val.scoreform_timer.time_start == inform[i].formlist[j].timer[k].time_start) &&  (val.scoreform_timer.time_end  == inform[i].formlist[j].timer[k].time_end)))  == -1)
          {
            tmp_scoreform.push({scoreform_timer:{time_start:inform[i].formlist[j].timer[k].time_start,time_end:inform[i].formlist[j].timer[k].time_end},scoreform_total:inform[i].formlist[j].scorequestion_total})
          }else if(tmp_scoreform.findIndex(val=>((val.scoreform_timer.time_start == inform[i].formlist[j].timer[k].time_start) &&  (val.scoreform_timer.time_end  == inform[i].formlist[j].timer[k].time_end)))  != -1)
          {
            let pos = tmp_scoreform.findIndex(val=>((val.scoreform_timer.time_start == inform[i].formlist[j].timer[k].time_start) &&  (val.scoreform_timer.time_end  == inform[i].formlist[j].timer[k].time_end)))
            tmp_scoreform[pos].scoreform_total += inform[i].formlist[j].scorequestion_total;
          }

        }
        }
        tmp_scoreform.forEach(value=>{
          if(tmp_scoredoc.length == 0  ){
            tmp_scoredoc.push({scoredoc_timer:{time_start:value.scoreform_timer.time_start,time_end:value.scoreform_timer.time_end},scoredoc_total:value.scoreform_total})
          }
          else if(tmp_scoredoc.findIndex(val=> ((val.scoredoc_timer.time_start == value.scoreform_timer.time_start) &&  (val.scoredoc_timer.time_end == value.scoreform_timer.time_end)))  == -1)
          {
            tmp_scoredoc.push({scoredoc_timer:{time_start:value.scoreform_timer.time_start,time_end:value.scoreform_timer.time_end},scoredoc_total:value.scoreform_total})
          }else if(tmp_scoredoc.findIndex(val=> ((val.scoredoc_timer.time_start == value.scoreform_timer.time_start) &&  (val.scoredoc_timer.time_end == value.scoreform_timer.time_end)))  != -1)
          {
            let pos = tmp_scoredoc.findIndex(val=>((val.scoredoc_timer.time_start == value.scoreform_timer.time_start) &&  (val.scoredoc_timer.time_end  == value.scoreform_timer.time_end)))
            tmp_scoredoc[pos].scoredoc_total += value.scoreform_total
          }
        })
        inform[i].scoreform_total_all = tmp_scoreform;
      }
    

    const document = {
      docname: docname,
      status: false,
      scoredoc_total_all: tmp_scoredoc,
      permission: permission,
      bu: bu,
      inform: inform,
    };
    const result = await this.informationModel
      .findByIdAndUpdate(_id, document)
      .setOptions({ overwrite: true, new: true })
      .populate('docname')
      .populate('status')
      .populate('scoredoc_total_all')
      .populate('permission')
      .populate('bu')
      .populate('inform');
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  async deleteInformationByID(_id: object | string) {
    const result = await this.informationModel.findByIdAndDelete(_id).exec();
    return result;
  }

  async checkformopen(role:string ,id:number){
    let thisIDbu = await this.expansion.findOne({where:{ID:id}})
    if(thisIDbu){
      let thisISbu = await this.bu.findOne({where:{id_bu:String(thisIDbu.BU)}})
      let result = await this.informationModel.find({permission:role,status:true })
      result = result.filter(val=>(val.bu.includes(thisISbu.bu_name) ))
      return result.map(val=>({
        id : val._id,
        docname: val.docname,
        scoredoc_all_total: val.scoredoc_total_all
      }))
    }else{
      throw new Error('หาร้านไม่เจอ')
    }

  }

  async getFormByRole(role: string,id:string,docid:string) {
    try {
    let thisIDbu = await this.expansion.findOne({where:{ID:id}})
    if(thisIDbu){
      let currDate = new Date();
      let hoursMin = currDate.getHours() + ':' + currDate.getMinutes();
      const result = await this.informationModel.findOne({
        _id:docid,
        permission: role,
        status: true,
      });
      let it_time = (currDate.getHours()*60) + currDate.getMinutes();
          if(!result.inform) throw {message:"Error"}
            result.inform = result.inform.filter(
              (val) =>
                (val.scoreform_total_all = val.scoreform_total_all.filter(
                  (element) =>
                    element.scoreform_timer.time_start <= it_time &&
                    element.scoreform_timer.time_end > it_time,
                )).length != 0,
            );
          result.inform.forEach(
            (val) =>
              (val.formlist = val.formlist.filter(
                (value) =>
                  (value.timer = value.timer.filter(
                    (element) =>
                      element.time_start <= it_time && element.time_end > it_time,
                  ))
                  &&
                  value.timer.length != 0
              )),
          );
          return {
            id: result.id,
            docname: result.docname,
            scoredoc_total_all: result.scoredoc_total_all,
            inform: result.inform,
          };
      }else{
        throw new Error("หาร้านไม่เจอ")
      }
      
    } catch (error: any) {
      return error;
    }
  }

  async changeChooseform(
    _id1: object | string,
    statuschange: boolean,
    role: string,
    bu: string[],
  ) {
    await this.informationModel.findByIdAndUpdate(_id1, {
      $set: { status: statuschange },
    });
    return { message: 1 };
  }
  
  async getAllBu(id_bu:number){
          const findBu = await this.bu.findAll({where:{}})
          return findBu.map((bus)=>({
            id: bus.id_bu,
            name: bus.bu_name
          }))
      }
}
