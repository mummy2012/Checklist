import { Module } from '@nestjs/common';
import { SheetService } from './sheet.service';
import { SheetController } from './sheet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SheetSchema } from './sheet.model';
import {expansionsService} from "../models/expansion_shop/expansion_shop.service"
import {expansionsProviders} from "../models/expansion_shop/expansion_shop.providers"
import { busService } from 'src/models/bus/bus.service';
import { busProviders } from 'src/models/bus/bus.providers';
import { UsersService } from 'src/models/npi_user/npi_user.service';
import { usersProviders } from 'src/models/npi_user/npi_user.providers';
import { S3Service } from 'src/aws/s3.service';

@Module({
  imports: [MongooseModule.forFeature([{name:'Sheet',schema: SheetSchema }])],
  controllers:[SheetController],
  providers: [SheetService,expansionsService,...expansionsProviders,busService,...busProviders,UsersService,...usersProviders,S3Service]
})
export class SheetModule {}
