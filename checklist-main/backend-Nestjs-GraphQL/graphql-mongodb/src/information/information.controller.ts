import { Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Req,
    Param,
    Query,
    Patch,
    Delete,
    Put, } from '@nestjs/common';

import { InformationService } from './information.service';
import type { choices, inform, question,scoreform } from './information.model';
import { JWTAuthGuard } from '../users/user.guard'
import { AuthRequest } from 'src/types/auth';

@Controller('information')
export class InformationController {
  constructor(private readonly informationService: InformationService) {}

  @Post('/createform')
  @UseGuards(JWTAuthGuard)
  async addInformation(
    @Req() req: AuthRequest,
    @Body('docname') prodDocname: string,
    @Body('status') prodStatus: false,
    @Body('permission') prodPermission: string,
    @Body('bu') prodBu: Array<string>,
    @Body('inform')
    prodInform: Array<{
      title: string;
      scoreform_total_all: scoreform[];
      formlist: Array<{
        question: string;
        types: string;
        timer: { time_start: number; time_end: number }[];
        choices: Array<{ choice: Array<string>; score: number }>;
        scorequestion_total: number;
      }>;
    }>,
  ) {
    try{
      const userData = req.user;
      if (userData.role != 'Admin') throw { message: 'Permission Deiend.' };
      const generatedId = await this.informationService.createInformation(
        prodDocname,
        prodStatus,
        prodPermission,
        prodBu,
        prodInform,
      );
      return { message: generatedId ,statusCode:201};
    }catch(error){
      return { message : error.message,statusCode :502}
    }
  }

  @Get('/getFromByRole/:role/:id/:docid')
  @UseGuards(JWTAuthGuard)
  async getFormByRole(
    @Req() req: AuthRequest,
    @Query('role') role: string,
    @Query('id') id:string,
    @Query('docid') docid:string,
    ) {
    try{
      const userData = req.user;
      if (userData.role != 'Admin' && userData.role != role)
        throw { message: 'Permission Deiend.' };
  
      const information = await this.informationService.getFormByRole(role,id,docid);
      return { message: information };
    }catch(error){
      return { message : error.message}
    }
  }

  @Get('/getFormByID/:id')
  @UseGuards(JWTAuthGuard)
  async getformationByID(
    @Req() req: AuthRequest,
    @Query('id') _id: string | object,
  ) {
    const userData = req.user;
    if (userData.role != 'Admin') throw { message: 'Permission Deiend.' };
    const information = await this.informationService.getformationByID(_id);
    return { message: information };
  }

  @Get('/getFormByAdmin/:id')
  @UseGuards(JWTAuthGuard)
  async manageInformationByAdmin(
    @Req() req: AuthRequest,
    @Query('permission') permission: string,
  ) {
    try{
      const userData = req.user;
      if (userData.role != 'Admin') throw { message: 'Permission Deiend.' };
      const information = await this.informationService.manageInformationByAdmin(
        permission,
      );
      return { message: information };
    }catch(error){
      return { message : error.message}
    }
  }

  @Put('/updateForm/:id')
  @UseGuards(JWTAuthGuard)
  async updateFrom(
    @Req() req: AuthRequest,
    @Query('id') _id: string | object,
    @Body('docname') prodDocname: string,
    @Body('status') prodStatus: boolean,
    @Body('permission') prodPermission: string,
    @Body('bu') prodBu: string[],
    @Body('inform')
    prodInform: Array<{
      title: string;
      scoreform_total_all: scoreform[];
      formlist: Array<{
        question: string;
        types: string;
        timer: { time_start: number; time_end: number }[];
        scorequestion_total: number;
        choices: Array<{ choice: Array<string>; score: number }>;
      }>;
    }>,
  ) {
    try{

      const userData = req.user;
      if (userData.role != 'Admin') throw { message: 'Permission Deiend.' };
      const generatedId = this.informationService.updateInformationByID(
        _id,
        prodDocname,
        prodStatus,
        prodPermission,
        prodBu,
        prodInform,
      );
  
      return { message: generatedId };
    }catch(error){
      return { message : error.message}
    }
  }

  @Delete('deleteform/:id')
  @UseGuards(JWTAuthGuard)
  async updateForm(@Req() req: AuthRequest, @Query('id') _id: string | object) {
    const userData = req.user;
    if (userData.role != 'Admin') throw { message: 'Permission Deiend.' };
    const information = await this.informationService.deleteInformationByID(
      _id,
    );
    return console.log('delete success');
  }

  @Put('/changeStatus/:id')
  @UseGuards(JWTAuthGuard)
  async changestatus(
    @Req() req: AuthRequest,
    @Query('id') _id: string | object,
    @Body('status') statuschange: boolean,
    @Body('role') role: string,
    @Body('bu') bu: string[],
  ) {
    const userData = req.user;
    if (userData.role != 'Admin') throw { message: 'Permission Deiend.' };
    const status = await this.informationService.changeChooseform(
      _id,
      statuschange,
      role,
      bu,
    );
    return console.log('switch success');
  }

  @Get('/checkOpenBu/:id/:role')
  @UseGuards(JWTAuthGuard)
  async checkOpen(
    @Req() req: AuthRequest,
    @Query('role') role: string,
    @Query('id') id:number,
  ){
    const userData = req.user;
    const openchoice = await this.informationService.checkformopen(
      role,
      id,
    );
    return {message:openchoice}
  }
}