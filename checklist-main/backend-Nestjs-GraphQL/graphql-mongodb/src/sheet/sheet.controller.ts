import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
  Param,
  Query,
  Patch,
  Delete,
  UploadedFiles,
  UseInterceptors,
  HttpException,
  Put,
} from '@nestjs/common';
import {Response} from "express"
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Model } from 'mongoose';
import { SheetService } from './sheet.service';
import { JWTAuthGuard } from '../users/user.guard';
import { AuthRequest } from 'src/types/auth';
import { Sheet, listgroup } from './sheet.model';
import { expansions } from 'src/models/expansion_shop/expansion_shop.entity';
import { User } from 'src/models/npi_user/npi_user.entity';
import { S3Service } from 'src/aws/s3.service';
import stream, { Readable } from 'stream';
import { promisify } from 'util';

@Controller('sheet')
export class SheetController {
  constructor(private readonly sheetService: SheetService,private s3:S3Service) {}

  @Post("getFile")
  @UseGuards(JWTAuthGuard)
  async getFile(
    @Res() res: Response, 
    @Body() body: { path: string }
    ) {
      try {
          const {  path } = body
          if (!path) throw { message: "NULL" }
         
          let response = await this.s3.S3downloadFile(
            path
          );
          if (response instanceof Error) {
              throw response.message;
          }
          const file = await response.Body?.transformToByteArray()
          const pipeline = promisify(stream.pipeline);
          await pipeline(Readable.from(Buffer.from(file as Uint8Array)), res)
      } catch (error) {
          res.send({ statusCode: error.status || 502, message: error.message })
      }
  }

  @Post('/postform')
  @UseInterceptors(AnyFilesInterceptor())
  @UseGuards(JWTAuthGuard)
  async postSheet(
    @Req() req: AuthRequest,
    @Body('information') information: string | Sheet,
    @UploadedFiles() file: Express.Multer.File[],
  ) {
    information = JSON.parse(information as string);
    if (typeof information != 'string') {
      const {
        basedoc_id,
        target_id,
        scoredoc_total_all,
        docname,
        status,
        inform,
        permission,
      } = information;
      const userData = req.user;
      try{
      if (userData.role != 'Admin' && userData.role != permission) throw new HttpException('Permission Deiend.',403)
        const generatedId = await this.sheetService.postSheet(
          information.id,
          userData.username,
          target_id,
          scoredoc_total_all,
          docname,
          status,
          inform,
          file
          );    
          if(!generatedId.message && file.length !=0){
            let today = new Date()
            for(const img of file){

              if(img.fieldname.split("_").length >= 3){
                  this.s3.S3uploadFile(img,`checklist/private/example/${generatedId}/${img.fieldname + img.originalname}`)
              }else{
                  this.s3.S3uploadFile(img,`checklist/private/${target_id}/${today.getFullYear()}_${today.getMonth()}_${today.getDate()}/${generatedId}_${img.originalname}_${img.fieldname.split("_")[1]}`)
              }

          }
      
          }
          return {message:generatedId};
      }
      catch(error){
        return {message:error.message}  
      }
    }
  }

  @Post('/getSheet/:pageRole')
  @UseGuards(JWTAuthGuard)
  async getSheet(
    @Req() req: AuthRequest,
    @Query('pageRole') pageRole:string,
    @Body('fillter') fillter:{start_date:string,end_date:string,search:string,pagechoose:number}
    ){
    try {
      if (req.user.role == 'AM') {
        let all_shop = await this.sheetService.getExpansionByAM(
          req.user.username,
          fillter
          );
        all_shop.result = await all_shop.result.reduce(async (prev, curr) => {
          const findBu = await this.sheetService.getBu(Number(curr.BU));
          if (findBu) {
            curr.BU = findBu.bu_name;
          }
          (await prev).push(curr);
          return prev;
        }, Promise.resolve([]) as Promise<expansions[]>);
        all_shop.result  = await all_shop.result.reduce(async (prev, curr) => {
          const findAm = await this.sheetService.getRename(
            String(curr.am_location as unknown as string),
          );
          if (findAm) {
            (curr.am_location as unknown as string) = findAm.fullname;
          }
          const findRm = await this.sheetService.getRename(
            String(curr.rm_location as unknown as string),
          );
          if (findRm) {
            (curr.rm_location as unknown as string) = findRm.fullname;
          }
          (await prev).push(curr);
          return prev;
        }, Promise.resolve([]) as Promise<expansions[]>);
        all_shop.result  = await all_shop.result.reduce(async (prev, curr) => {
          const checkMonth = await this.sheetService.checkMonth(
            Number(curr.ID),
            Number(req.user.username),
            (pageRole),
            );
            if (checkMonth) {
              (curr.STATUS as unknown as string) = checkMonth;
          }
          (await prev).push(curr);
          return prev;
        }, Promise.resolve([]) as Promise<expansions[]>);
        return {
          message:{result: all_shop.result.map((prod) => ({
            id_expension: prod.id_expansion,
            ID: prod.ID,
            NAME: prod.NAME,
            BU: prod.BU,
            am_location: prod.am_location,
            rm_location: prod.rm_location,
            STATUS: prod.STATUS,
            bm_location: prod.bm_location,
          })),
          count : all_shop.count
        }};
      }
      if (req.user.role == 'BM') {
        let all_shop = await this.sheetService.getExpansionByBM(
          req.user.username,
          fillter
          );
        return {
          message:{result: all_shop.result.map((prod) => ({
            id_expension: prod.id_expansion,
            ID: prod.ID,
            NAME: prod.NAME,
            BU: prod.BU,
            am_location: prod.am_location,
            rm_location: prod.rm_location,
            STATUS: prod.STATUS,
            bm_location: prod.bm_location,
          })),
          count : all_shop.count
        }};
      
      }
      if (req.user.role == 'Admin') {
        let all_shop = await this.sheetService.getExpansionByAdmin(
          req.user.username,
          fillter
        );

        all_shop.result = await all_shop.result.reduce(async (prev, curr) => {
          const findBu = await this.sheetService.getBu(Number(curr.BU));
          if (findBu) {
            curr.BU = findBu.bu_name;
          }
          (await prev).push(curr);
          return prev;
        }, Promise.resolve([]) as Promise<expansions[]>);
        all_shop.result = await all_shop.result.reduce(async (prev, curr) => {
          const findAm = await this.sheetService.getRename(
            String(curr.am_location as unknown as string),
          );
          if (findAm) {
            (curr.am_location as unknown as string) = findAm.fullname;
          }
          const findRm = await this.sheetService.getRename(
            String(curr.rm_location as unknown as string),
          );
          if (findRm) {
            (curr.rm_location as unknown as string) = findRm.fullname;
          }
          (await prev).push(curr);
          return prev;
        }, Promise.resolve([]) as Promise<expansions[]>);
        all_shop.result = await all_shop.result.reduce(async (prev, curr) => {
          const checkMonth = await this.sheetService.checkMonth(
            Number(curr.ID),
            Number(req.user.username),
            (pageRole),
          );
          if (checkMonth) {
            (curr.STATUS as unknown as string) = checkMonth;
          }
          (await prev).push(curr);
          return prev;
        }, Promise.resolve([]) as Promise<expansions[]>);
        return {
          message:{result: all_shop.result.map((prod) => ({
            id_expension: prod.id_expansion,
            ID: prod.ID,
            NAME: prod.NAME,
            BU: prod.BU,
            am_location: prod.am_location,
            rm_location: prod.rm_location,
            STATUS: prod.STATUS,
            bm_location: prod.bm_location,
          })),
          count : all_shop.count
        }};
      }
          
  } catch (error) {
   return {message:error.message}   
  }
  }

  @Get('/getBu')
  async getBu() {
    const bu = await this.sheetService.getAllbu();
    return { message: bu };
  }


  
  @Post('/getHistory')
  @UseInterceptors(AnyFilesInterceptor())
  @UseGuards(JWTAuthGuard)
  async gethistory(@Req() req: AuthRequest, @Body('_id') id: number | string) {
    const userData = req.user;
    if (
      userData.role != 'Admin' &&
      userData.role != 'AM' &&
      userData.role != 'BM' &&
      userData.role != 'RM'
    )
      throw new Error('Permission Deiend.')
    const history = await this.sheetService.requesthistory(
      id as unknown as number,
    );
    const history_tmp = await history.reduce(async (prev, curr) => {
      const findUser = await this.sheetService.getRename(
        String(curr.creater_id),
      );
      if (findUser) {
        curr.creater_id = findUser.fullname;
      }
      (await prev).push(curr);
      return prev;
    }, Promise.resolve([]) as Promise<listgroup[]>);
    return {
      message: history_tmp.map((prod) => ({
        _id: prod._id,
        creater_id: prod.creater_id,
        status: prod.status,
        time_create: prod.time_create,
        detail: prod.detail,
      })),
    };
  }

  @Post('/getScore')
  @UseGuards(JWTAuthGuard)
  async getDetailscore(
    @Req() req: AuthRequest,
    @Body('_id') id: number | string,
  ){
    const userData = req.user;
    if (
        userData.role != 'Admin' &&
        userData.role != 'AM' &&
        userData.role != 'BM' &&
        userData.role != 'RM'
      )throw { message: 'Permission Deiend.' };
      try{
          const result = await this.sheetService.getDetailScore(id)    

           return { message : result }
      }catch(error){
        return {message:error.message}   
      }
  }

}

